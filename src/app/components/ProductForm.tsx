"use client";

/**
 * ==========================================
 * 🧱 SECTION 1: IMPORTS & CONFIG
 * ==========================================
 */
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { X, Upload, Loader2, ImageIcon, Package, DollarSign, Layers, Save } from "lucide-react";
import { addProduct, updateProduct } from "@/app/actions";
import { toast } from "sonner"; // 🟢 เรียกใช้ Toast แจ้งเตือน

// ตั้งค่า Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * ==========================================
 * 🖥️ SECTION 2: MAIN COMPONENT
 * ==========================================
 */
export default function ProductForm({ onClose, initialData }: { onClose: () => void, initialData?: any }) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl || "");
  const router = useRouter();
  const isEdit = !!initialData;

  /**
   * 🟢 ฟังก์ชันจัดการการเปลี่ยนรูปภาพ (Preview)
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  /**
   * 🟢 ฟังก์ชันส่งข้อมูล (Submit Logic)
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      let imageUrl = initialData?.imageUrl || "";

      // 1. อัปโหลดรูปภาพใหม่ไปที่ Supabase (ถ้ามีการเลือกรูปใหม่)
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      // ฝังค่า imageUrl ลงใน formData ก่อนส่งเข้า Server Action
      formData.set("imageUrl", imageUrl);

      // 2. เรียกใช้ Server Action (Add หรือ Update)
      if (isEdit) {
        await updateProduct(initialData.id, formData);
        toast.success("อัปเดตข้อมูลสินค้าเรียบร้อยแล้วเพื่อน! ✨");
      } else {
        await addProduct(formData);
        toast.success("เพิ่มสินค้าใหม่เข้าคลังสำเร็จ! 🚀");
      }

      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("บันทึกข้อมูลไม่สำเร็จนะเพื่อน ลองใหม่อีกครั้ง!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in duration-300">
        
        {/* --- 📢 Header --- */}
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isEdit ? "Edit Product Details" : "Add New Inventory"}
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              จัดการข้อมูลสินค้าในระบบ ThingsHub
            </p>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* --- 📝 Form Content --- */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto no-scrollbar">
          
          {/* Section: Image Upload */}
          <div className="flex flex-col items-center justify-center py-4 bg-slate-50/50 rounded-[2rem] border border-slate-100 border-dashed">
             <div className="relative w-44 h-44 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 overflow-hidden group hover:border-indigo-400 transition-all shadow-sm">
                {previewUrl ? (
                  <img src={previewUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Preview" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-2">
                    <ImageIcon className="h-10 w-10 stroke-[1.5]" />
                    <span className="text-[10px] font-black uppercase tracking-wider">เลือกรูปสินค้า</span>
                  </div>
                )}
                <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" />
                <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
                  <Upload className="text-indigo-600 h-6 w-6" />
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">Recommended size: 1:1 (Square)</p>
          </div>

          {/* Section: Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-700 ml-1 mb-1">
                <Package size={16} className="text-indigo-500" />
                <label className="text-sm font-black">ชื่อสินค้า</label>
              </div>
              <input name="name" defaultValue={initialData?.name} required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold" placeholder="เช่น Toyota Supra MK4" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-700 ml-1 mb-1">
                <Layers size={16} className="text-amber-500" />
                <label className="text-sm font-black">หมวดหมู่</label>
              </div>
              <input name="category" defaultValue={initialData?.category} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold" placeholder="เช่น รถยนต์, อะไหล่" />
            </div>
          </div>

          {/* Section: Pricing & Inventory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-700 ml-1 mb-1">
                <DollarSign size={16} className="text-emerald-500" />
                <label className="text-sm font-black">ราคา (บาท)</label>
              </div>
              <input name="price" type="number" step="0.01" defaultValue={initialData?.price} required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-black text-lg" placeholder="0.00" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-700 ml-1 mb-1">
                <Layers size={16} className="text-rose-500" />
                <label className="text-sm font-black">จำนวนสต็อก (ชิ้น)</label>
              </div>
              <input name="quantity" type="number" defaultValue={initialData?.inventory?.[0]?.quantity || 0} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-black text-lg" placeholder="0" />
            </div>
          </div>

          {/* Section: Description */}
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 ml-1">รายละเอียดสินค้า</label>
            <textarea name="description" defaultValue={initialData?.description} rows={3} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none font-medium text-slate-600" placeholder="อธิบายจุดเด่นของสินค้าชิ้นนี้..." />
          </div>

          {/* --- 🚀 Footer Actions --- */}
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all active:scale-95">
              ยกเลิก
            </button>
            <button disabled={loading} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Save size={18} />}
              {isEdit ? "บันทึกการแก้ไข" : "เพิ่มสินค้าใหม่"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}