/**
 * UploadThing Core Configuration
 *
 * Defines file routers for different upload contexts:
 * - Product images
 * - Category images
 * - User avatars
 */

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const f = createUploadthing();

/**
 * Helper to get current user from session
 */
async function getUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user ?? null;
  } catch {
    return null;
  }
}

/**
 * File router configuration
 */
export const uploadRouter = {
  /**
   * Product image uploader
   * - Max 10 images per upload
   * - Max 4MB per image
   * - Only admin/super_admin can upload
   */
  productImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      const user = session?.user;
      if (!user) throw new UploadThingError("Unauthorized");

      // Admin role check
      const role = (session?.session as { role?: string })?.role;
      if (role !== "admin" && role !== "super_admin") {
        throw new UploadThingError("Admin access required");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Product image uploaded by:", metadata.userId);
      console.log("File URL:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),

  /**
   * Category image uploader
   * - Single image per upload
   * - Max 2MB
   */
  categoryImage: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      const user = session?.user;
      if (!user) throw new UploadThingError("Unauthorized");

      // Admin role check
      const role = (session?.session as { role?: string })?.role;
      if (role !== "admin" && role !== "super_admin") {
        throw new UploadThingError("Admin access required");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Category image uploaded by:", metadata.userId);
      return { url: file.ufsUrl };
    }),

  /**
   * User avatar uploader
   * - Single image
   * - Max 1MB
   * - Any authenticated user can upload
   */
  userAvatar: f({
    image: { maxFileSize: "1MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const user = await getUser();
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar uploaded by:", metadata.userId);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
