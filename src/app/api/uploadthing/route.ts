/**
 * UploadThing API Route Handler
 *
 * Handles file upload requests from the client.
 * Mounts at /api/uploadthing
 */

import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "@/lib/uploadthing";

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
  config: {
    // Optional: Add custom config here
    // logLevel: "debug",
  },
});
