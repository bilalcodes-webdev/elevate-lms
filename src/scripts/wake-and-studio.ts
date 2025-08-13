/* eslint-disable @typescript-eslint/no-unused-vars */
import { execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("❌ DATABASE_URL not found in .env");
  process.exit(1);
}

console.log("🔄 Waking up Neon database...");
try {
  execSync(`psql "${dbUrl}" -c "SELECT 1;"`, { stdio: "inherit" });
  console.log("✅ Neon is awake!");
} catch (err) {
  console.error("⚠️ Failed to wake Neon. Check your connection string.");
  process.exit(1);
}

console.log("🚀 Starting Prisma Studio...");
execSync(`npx prisma studio`, { stdio: "inherit" });
