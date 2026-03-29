import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignInButton, UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Things Shop Platform",
  description: "Prototype for Shared Inventory System",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ดึงข้อมูลสถานะการล็อกอิน (userId) จากฝั่ง Server
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col font-sans">
          {/* Header Section */}
          <header className="flex justify-between items-center p-4 border-b bg-white">
            <h1 className="font-bold text-xl text-indigo-600">Things Shop</h1>
            
            <div className="flex items-center gap-4">
              {/* ถ้ามี userId แปลว่าล็อกอินแล้ว ให้โชว์ชื่อและรูปโปรไฟล์ */}
              {userId ? (
                <UserButton showName />
              ) : (
                /* ถ้าไม่มี userId ให้โชว์ปุ่ม SignIn (นำ mode="modal" ออกแล้ว) */
                <SignInButton>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition font-medium">
                    เข้าสู่ระบบ
                  </button>
                </SignInButton>
              )}
            </div>
          </header>

          <main className="flex-grow p-4 bg-zinc-50/50">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}