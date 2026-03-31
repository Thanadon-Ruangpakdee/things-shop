"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Package, 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell, 
  Search 
} from 'lucide-react';
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 🟢 แก้ไขตรงนี้ครับเพื่อน เพิ่ม Order Lists เข้าไป
  const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/products", icon: Package, label: "Products" }, // เปลี่ยนเป็น Package จะดูเข้ากว่า
    { href: "/dashboard/orders", icon: ShoppingCart, label: "Order Lists" }, // 👈 เพิ่มปุ่มนี้เข้าไป!
    { href: "/dashboard/affiliates", icon: Users, label: "Affiliates" },
    { href: "/dashboard/market", icon: BarChart3, label: "Market" },
  ];

  return (
    <div className="flex h-screen bg-[#F5F6FA] font-sans">
      {/* 🟢 Sidebar */}
      <aside className="w-64 bg-[#1e293b] text-white flex flex-col shadow-xl shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">ThingsHub</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            // เช็คว่าหน้าปัจจุบันตรงกับเมนูไหม (รองรับ sub-path)
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
          
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Networking</div>
          <MenuLink 
            href="/dashboard/global-stats" 
            icon={BarChart3} 
            label="สถิติรวม" 
            active={pathname.startsWith("/dashboard/global-stats")} 
          />
        </nav>

        <div className="p-4 border-t border-slate-700">
          <MenuLink 
            href="/dashboard/settings" 
            icon={Settings} 
            label="ตั้งค่า" 
            active={pathname === "/dashboard/settings"} 
          />
          <div className="flex items-center gap-3 px-4 py-3 mt-2 text-slate-400 hover:text-red-400 cursor-pointer transition-colors group">
            <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">Logout</span>
          </div>
        </div>
      </aside>

      {/* 🟢 Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="ค้นหาข้อมูลออเดอร์ หรือสินค้า..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l pl-5 border-slate-200">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function MenuLink({ href, icon: Icon, label, active }: any) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}>
      <Icon className={`h-5 w-5 ${active ? 'text-white' : 'text-slate-400'}`} />
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}