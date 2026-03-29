import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { Show, SignInButton, UserButton } from '@clerk/nextjs'
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
              <Show when="signed-out">
                <SignInButton mode="modal">
                   <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                      Sign In
                   </button>
                </SignInButton>
              </Show>

              <Show when="signed-in">
                <UserButton showName />
              </Show>
            </div>
          </header>

          <main className="flex-grow p-4">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}