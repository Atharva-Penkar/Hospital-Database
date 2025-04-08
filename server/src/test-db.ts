import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to DB successfully");
  } catch (err) {
    console.error("❌ Failed to connect to DB", err);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
