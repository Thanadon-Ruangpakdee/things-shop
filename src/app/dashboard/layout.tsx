import Link from 'next/link'
import { LayoutDashboard, Package, Link as LinkIcon, Store, LogOut, Search, Bell } from 'lucide-react'
import { auth, currentUser } from '@clerk/nextjs/server'
import { SignOutButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import UserNav from '@/app/components/UserNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 1. ตรวจสอบสิทธิ์การเข้าถึง (Server-side)
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  
  // 2. ดึงข้อมูล User จริงจาก Clerk
  const user = await currentUser();
  const userName = user?.firstName || "Admin";
  const userImageUrl = user?.imageUrl;

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      
      {/* 🟢 SIDEBAR (Dark Theme - ชิดขอบซ้าย) */}
      <aside className="w-[260px] bg-[#1e293b] text-zinc-400 flex flex-col sticky top-0 h-screen shrink-0 border-r border-zinc-800">
        {/* Logo Section */}
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg italic">
            V
          </div>
          <span className="text-white font-bold text-xl tracking-tight leading-none">VapeHub</span>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 p-4 pt-8 space-y-1.5">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 text-white shadow-md font-medium transition-all">
            <LayoutDashboard className="w-5 h-5 text-indigo-100" /> หน้าหลัก
          </Link>
          
          <Link href="/dashboard/products" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800/50 hover:text-white transition-all text-sm font-medium">
            <Package className="w-5 h-5" /> สินค้าในคลัง
          </Link>
          
          <Link href="/dashboard/affiliates" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800/50 hover:text-white transition-all text-sm font-medium">
            <LinkIcon className="w-5 h-5" /> ตัวแทนแชร์
          </Link>
          
          <div className="pt-8 opacity-40 px-4 uppercase text-[10px] font-black tracking-[0.2em] text-zinc-500">
            Networking
          </div>
          
          <Link href="/market" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800/50 hover:text-white transition-all text-sm font-medium">
            <Store className="w-5 h-5" /> ตลาดกลาง
          </Link>
        </nav>

        {/* Sidebar Footer (Logout Button) */}
        <div className="p-6 border-t border-zinc-800/50">
          <SignOutButton>
            <button className="flex items-center gap-3 text-rose-400/80 text-sm hover:text-rose-400 transition-colors w-full px-4 group">
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">ออกจากระบบ</span>
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* 🟢 MAIN AREA */}
      <div className="flex-1 flex flex-col">
        
        {/* TOP HEADER (White Section) */}
        <header className="h-[70px] bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-50">
          
          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="ค้นหาข้อมูลออเดอร์ หรือสินค้า..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-100/50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition text-sm"
            />
          </div>
          
          {/* Right Section: Notifications & UserNav */}
          <div className="flex items-center gap-6">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            {/* 🚩 เรียกใช้ UserNav ที่มี Dropdown แทน SignOutButton ก้อนเดิม */}
            <UserNav userName={userName} userImageUrl={userImageUrl} />
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
        
      </div>
    </div>
  )
}