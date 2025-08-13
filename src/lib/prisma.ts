// import "server-only"

import { PrismaClient } from "@prisma/client";
export * from "@prisma/client";

declare global {
  // This line tells TypeScript that `globalThis.prisma` can be a PrismaClient or undefined
  var prisma: PrismaClient | undefined;
}

// Use a single PrismaClient instance during development
const prisma =
  process.env.NODE_ENV === "production"
    ? new PrismaClient()
    : global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// ✅ DB connection test
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
})();

export default prisma;
