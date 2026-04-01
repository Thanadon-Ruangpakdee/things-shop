"use client";

/**
 * ==========================================
 * 🧱 SECTION 1: IMPORTS
 * ==========================================
 */
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Package, 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Boxes 
} from 'lucide-react';
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { Toaster } from "sonner"; // 🟢 1. Import Toaster จาก sonner

/**
 * ==========================================
 * 🖥️ SECTION 2: MAIN LAYOUT COMPONENT
 * ==========================================
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/products", icon: Package, label: "Products" },
    { href: "/dashboard/orders", icon: ShoppingCart, label: "Order Lists" },
    { href: "/dashboard/product-stock", icon: Boxes, label: "Product Stock" },
    { href: "/dashboard/affiliates", icon: Users, label: "Affiliates" },
  ];

  return (
    <div className="flex h-screen bg-[#F5F6FA] font-sans">
      {/* 🟢 2. วาง Toaster ไว้ตรงนี้เพื่อให้ครอบคลุมทุกหน้า */}
      {/* richColors จะทำให้สี Success/Error สวยขึ้นครับ */}
      <Toaster position="top-center" richColors closeButton />

      {/* --- 🟢 SIDEBAR (Left) --- */}
      <aside className="w-64 bg-[#1e293b] text-white flex flex-col shadow-xl shrink-0">
        
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="bg-indigo-500 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
            <Package className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">ThingsHub</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <MenuLink 
                key={item.href}
                href={item.href} 
                icon={item.icon} 
                label={item.label} 
                active={isActive} 
              />
            );
          })}
        </nav>

        {/* Bottom Actions (Settings & Logout) */}
        <div className="p-4 border-t border-slate-700 space-y-1">
          <MenuLink 
            href="/dashboard/settings" 
            icon={Settings} 
            label="ตั้งค่า" 
            active={pathname === "/dashboard/settings"} 
          />
          
          <SignOutButton>
            <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 cursor-pointer transition-all group rounded-xl hover:bg-rose-400/10">
              <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-sm">Logout</span>
            </div>
          </SignOutButton>
        </div>
      </aside>

      {/* --- 🟢 MAIN AREA (Right) --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="ค้นหาข้อมูลใน Dashboard..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2.5 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 border-l pl-6 border-slate-100">
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-9 w-9 rounded-xl"
                  }
                }}
              />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#F5F6FA]">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

/**
 * ==========================================
 * 🧩 SUB-COMPONENT: MenuLink
 * ==========================================
 */
function MenuLink({ href, icon: Icon, label, active }: any) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}>
      <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400'}`} />
      <span className={`text-sm font-bold ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
        {label}
      </span>
    </Link>
  );
}