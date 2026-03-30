"use client"; // 🟢 สำคัญมาก เพื่อให้กดเปิด-ปิดได้

import { useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";

export default function UserNav({ userName, userImageUrl }: { userName: string; userImageUrl?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* 🟢 ตัวปุ่ม Profile ที่คุณออกแบบไว้ */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-6 border-l border-slate-100 group cursor-pointer hover:opacity-80 transition-all"
      >
        <div className="flex flex-col items-end leading-none">
          <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{userName}</span>
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1 flex items-center gap-1">
            Admin <ChevronDown className={`w-2 h-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </span>
        </div>
        <div className="relative">
          {userImageUrl ? (
            <img src={userImageUrl} className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" alt="Avatar" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-indigo-400"><User className="w-5 h-5" /></div>
          )}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>
      </div>

      {/* 🟢 Dropdown Menu (จะโชว์เมื่อ isOpen เป็น true) */}
      {isOpen && (
        <>
          {/* แผ่นใสสำหรับกดปิดเมื่อคลิกข้างนอก */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in duration-200">
            <div className="px-4 py-2 border-b border-slate-50 mb-1">
               <p className="text-[10px] font-bold text-slate-400 uppercase">จัดการบัญชี</p>
            </div>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <Settings className="w-4 h-4" /> ตั้งค่าโปรไฟล์
            </button>
            
            {/* 🚩 ปุ่ม Logout อยู่ในนี้แล้ว! หุ้มด้วย SignOutButton ชิดๆ แบบเดิม */}
            <SignOutButton>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors border-t border-slate-50 mt-1">
                <LogOut className="w-4 h-4" /> ออกจากระบบ
              </button>
            </SignOutButton>
          </div>
        </>
      )}
    </div>
  );
}