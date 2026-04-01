"use client";

import { useState } from "react";
import { Settings, Globe, Palette, Bell, Shield, Check } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [lang, setLang] = useState("TH");
  const [primaryColor, setPrimaryColor] = useState("#4f46e5"); // Indigo-600

  const colors = [
    { name: "Indigo", value: "#4f46e5" },
    { name: "Rose", value: "#e11d48" },
    { name: "Emerald", value: "#10b981" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Slate", value: "#0f172a" },
  ];

  const handleSave = () => {
    toast.success("บันทึกการตั้งค่าเรียบร้อยแล้วเพื่อน! ✨");
  };

  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Settings</h1>
        <p className="text-slate-500 font-bold mt-2">จัดการการตั้งค่าระบบและรูปลักษณ์ของ Dashboard</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* 🟢 ส่วนที่ 1: Globalization (Language) */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900">Language & Region</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">เลือกภาษาที่คุณถนัด</p>
            </div>
          </div>

          <div className="flex gap-4">
            {["TH", "EN"].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all border-2 ${
                  lang === l 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
                    : "bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200"
                }`}
              >
                {l === "TH" ? "ภาษาไทย 🇹🇭" : "English 🇺🇸"}
              </button>
            ))}
          </div>
        </section>

        {/* 🟢 ส่วนที่ 2: Appearance (Theme Color) */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Palette size={24} />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900">Appearance</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">ปรับแต่งสีสันของ Dashboard</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setPrimaryColor(c.value)}
                className="flex flex-col items-center gap-3 p-4 rounded-3xl hover:bg-slate-50 transition-all group"
              >
                <div 
                  className="h-12 w-12 rounded-full shadow-inner flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: c.value }}
                >
                  {primaryColor === c.value && <Check className="text-white" size={20} />}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${primaryColor === c.value ? "text-slate-900" : "text-slate-400"}`}>
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 🟢 ปุ่ม Save All */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all shadow-xl active:scale-95 flex items-center gap-2"
          >
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>

      </div>
    </div>
  );
}