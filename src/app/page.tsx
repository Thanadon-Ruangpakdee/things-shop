import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

export default async function LandingPage() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <nav className="border-b border-slate-100 h-16 flex items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white italic">V</div>
          <span className="font-bold text-xl tracking-tight">VapeHub</span>
        </div>
        <Link href={userId ? "/dashboard" : "/sign-in"} className="text-sm font-bold text-indigo-600">
          {userId ? "ไปที่ Dashboard" : "เข้าสู่ระบบ"}
        </Link>
      </nav>

      <main className="pt-32 text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-black tracking-tighter mb-8 leading-tight">
            จัดการสต็อกสินค้า <br /> 
            <span className="text-indigo-600">และตัวแทนแชร์</span> ในที่เดียว
          </h1>
          <Link 
            href={userId ? "/dashboard" : "/sign-in"} 
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl"
          >
            {userId ? "เข้าสู่ Dashboard" : "เริ่มต้นใช้งานฟรี"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}