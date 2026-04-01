// src/app/sign-in/[[...sign-in]]/page.tsx

import { SignIn } from "@clerk/nextjs";
import { Package } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      
      {/* 🟢 ฝั่งซ้าย: Branding & Visual */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-2xl italic shadow-lg shadow-indigo-500/20">
              V
            </div>
            <span className="text-2xl font-black tracking-tighter">VapeHub</span>
          </div>
          
          <h1 className="text-6xl font-black leading-tight mb-6 tracking-tighter">
            จัดการสต็อกและ <br />
            <span className="text-indigo-500 underline decoration-indigo-500/30 underline-offset-8">ตัวแทนแชร์</span> <br />
            แบบมืออาชีพ
          </h1>
          <p className="text-zinc-400 text-lg max-w-md font-medium leading-relaxed">
            แพลตฟอร์มที่ช่วยให้การขายสินค้าและการจัดการ Affiliate ของคุณกลายเป็นเรื่องง่าย จบในที่เดียว
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-zinc-600 font-bold uppercase tracking-[0.2em]">
           <Package className="w-5 h-5 text-indigo-500" />
           © 2026 VapeHub Technology.
        </div>
      </div>

      {/* 🟢 ฝั่งขวา: Clerk Login Form */}
      <div className="flex items-center justify-center p-8 bg-slate-50/50">
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
            <div className="lg:hidden flex flex-col items-center mb-8">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-3xl italic mb-4 shadow-xl">
                    V
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">ยินดีต้อนรับสู่ VapeHub</h2>
                <p className="text-slate-500 font-bold text-sm">เข้าสู่ระบบเพื่อจัดการร้านของคุณ</p>
            </div>

            <SignIn 
                appearance={{
                    elements: {
                        formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm font-black py-3 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 normal-case',
                        card: 'shadow-2xl shadow-slate-200/50 border border-white rounded-[2rem] p-4',
                        headerTitle: 'text-slate-900 font-black text-2xl tracking-tight',
                        headerSubtitle: 'text-slate-400 font-bold',
                        socialButtonsBlockButton: 'border-slate-100 hover:bg-slate-50 text-slate-600 font-black rounded-2xl py-3 transition-all',
                        formFieldInput: 'rounded-2xl bg-slate-50 border-slate-100 py-3 font-bold focus:ring-2 focus:ring-indigo-500 transition-all',
                        formFieldLabel: 'text-slate-500 font-black uppercase text-[10px] tracking-widest ml-1',
                        footerActionLink: 'text-indigo-600 font-black hover:text-indigo-700'
                    }
                }}
            />
        </div>
      </div>
    </div>
  );
}