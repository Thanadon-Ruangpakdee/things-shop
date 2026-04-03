"use client";

import { useState, useEffect } from "react";
import { Globe, Palette, Check } from "lucide-react";
import { toast } from "sonner";
import { getDictionary } from "@/lib/get-dictionary";

export default function SettingsPage() {
  const [lang, setLang] = useState("TH");
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [dict, setDict] = useState<any>(null);

  // โหลดค่าภาษาและสีจากเครื่อง
  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "TH";
    const savedColor = localStorage.getItem("theme-color") || "#4f46e5";
    
    setLang(savedLang);
    setPrimaryColor(savedColor);
    setDict(getDictionary(savedLang));
  }, []);

  const colors = [
    { name: "Indigo", value: "#4f46e5" },
    { name: "Rose", value: "#e11d48" },
    { name: "Emerald", value: "#10b981" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Slate", value: "#0f172a" },
  ];

  const handleColorChange = (colorValue: string) => {
    setPrimaryColor(colorValue);
    document.documentElement.style.setProperty('--primary', colorValue);
    localStorage.setItem("theme-color", colorValue);
  };

  // 🟢 ฟังก์ชันเปลี่ยนภาษา
  const handleLangChange = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem("language", newLang);
    // รีโหลดหน้าเพื่อให้ Layout อัปเดตตามทันที
    window.location.reload();
  };

  const handleSave = () => {
    toast.success(dict?.settings.toast_success);
  };

  if (!dict) return null;

  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{dict.settings.title}</h1>
        <p className="text-slate-500 font-bold mt-2">{dict.settings.desc}</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl transition-colors">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900">{dict.settings.lang_title}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{dict.settings.lang_desc}</p>
            </div>
          </div>

          <div className="flex gap-4">
            {["TH", "EN"].map((l) => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
                className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all border-2 ${
                  lang === l 
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200"
                }`}
              >
                {l === "TH" ? "ภาษาไทย 🇹🇭" : "English 🇺🇸"}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl transition-colors">
              <Palette size={24} />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900">{dict.settings.appearance_title}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{dict.settings.appearance_desc}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {colors.map((c) => (
              <button
                key={c.name}
                onClick={() => handleColorChange(c.value)}
                className="flex flex-col items-center gap-3 p-4 rounded-3xl hover:bg-slate-50 transition-all group"
              >
                <div 
                  className="h-12 w-12 rounded-full shadow-inner flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: c.value }}
                >
                  {primaryColor === c.value && <Check className="text-white" size={20} />}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${primaryColor === c.value ? "text-primary" : "text-slate-400"}`}>
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-primary transition-all shadow-xl active:scale-95 flex items-center gap-2"
          >
            {dict.settings.save_btn}
          </button>
        </div>
      </div>
    </div>
  );
}