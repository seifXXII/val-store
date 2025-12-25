/**
 * Set Admin Role Script
 * Run with: npx tsx scripts/set-admin.ts <email>
 */
import { db } from "../src/db";
import { user, userProfiles } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function setAdmin() {
  const email = process.argv[2] || "seiffmuhammad199@gmail.com";

  console.log(`🔍 Looking for user: ${email}`);

  const [foundUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (!foundUser) {
    console.error(`❌ User not found: ${email}`);
    process.exit(1);
  }

  console.log(`✅ Found user: ${foundUser.name} (${foundUser.id})`);

  // Check if profile exists
  const [existingProfile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, foundUser.id))
    .limit(1);

  if (existingProfile) {
    await db
      .update(userProfiles)
      .set({ role: "super_admin" })
      .where(eq(userProfiles.userId, foundUser.id));
    console.log("✅ Updated profile to super_admin");
  } else {
    await db.insert(userProfiles).values({
      userId: foundUser.id,
      role: "super_admin",
    });
    console.log("✅ Created profile with super_admin role");
  }

  console.log(`\n🎉 ${email} is now a super_admin!\n`);
  process.exit(0);
}

setAdmin();
