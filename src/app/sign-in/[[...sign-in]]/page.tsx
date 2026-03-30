import { SignIn } from "@clerk/nextjs";
import { Package } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      
      {/* 🟢 ฝั่งซ้าย: Branding & Visual (โชว์ความเท่) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-950 text-white relative overflow-hidden">
        {/* ลาย Background กราฟิกจางๆ */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-2xl italic shadow-lg">
              V
            </div>
            <span className="text-2xl font-bold tracking-tight">VapeHub</span>
          </div>
          
          <h1 className="text-5xl font-black leading-tight mb-6">
            จัดการสต็อกและ <br />
            <span className="text-indigo-500">ตัวแทนแชร์</span> แบบมืออาชีพ
          </h1>
          <p className="text-zinc-400 text-lg max-w-md">
            แพลตฟอร์มที่ช่วยให้การขายสินค้าและการจัดการ Affiliate ของคุณกลายเป็นเรื่องง่าย จบในที่เดียว
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-zinc-500 font-medium italic">
           <Package className="w-5 h-5 text-indigo-500" />
           © 2026 VapeHub Technology. All rights reserved.
        </div>
      </div>

      {/* 🟢 ฝั่งขวา: Clerk Login Form (หัวใจหลัก) */}
      <div className="flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
            {/* หัวข้อสำหรับมือถือ (จะโชว์เฉพาะจอเล็ก) */}
            <div className="lg:hidden flex flex-col items-center mb-8">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-bold text-white text-3xl italic mb-4 shadow-xl">
                    V
                </div>
                <h2 className="text-2xl font-bold text-slate-900">ยินดีต้อนรับสู่ VapeHub</h2>
                <p className="text-slate-500 text-sm">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
            </div>

            {/* Clerk Component */}
            <SignIn 
                appearance={{
                    elements: {
                        formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case shadow-none',
                        card: 'shadow-xl border border-slate-200 rounded-2xl',
                        headerTitle: 'text-slate-900 font-bold',
                        headerSubtitle: 'text-slate-500',
                        socialButtonsBlockButton: 'border-slate-200 hover:bg-slate-50 text-slate-600 font-medium',
                    }
                }}
            />
        </div>
      </div>
      
    </div>
  );
}