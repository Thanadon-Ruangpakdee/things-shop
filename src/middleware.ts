import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // ป้องกันทุกหน้ายกเว้นไฟล์ระบบของ Next.js และไฟล์ Static
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // รัน Middleware เสมอสำหรับ API routes
    '/(api|trpc)(.*)',
  ],
};