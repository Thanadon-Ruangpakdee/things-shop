// src/lib/db.ts
import { PrismaClient } from "@prisma/client";

// สร้าง Singleton เพื่อป้องกันการสร้าง Prisma Instance ซ้ำซ้อนเวลาเราแก้โค้ด (Hot Reload)
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: PrismaClient | undefined;
}

// 🟢 เปลี่ยนชื่อจาก prisma เป็น db และใช้ 'export const' เพื่อให้หน้าอื่นเรียก import { db } ได้
export const db = globalThis.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;