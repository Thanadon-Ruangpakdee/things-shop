"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { X, Upload, Loader2, ImageIcon } from "lucide-react";
// 🟢 Import Actions ที่เราเขียนไว้ใน actions.ts
import { addProduct, updateProduct } from "@/app/actions";

// ตั้งค่า Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProductForm({ onClose, initialData }: { onClose: () => void, initialData?: any }) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl || "");
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      let imageUrl = initialData?.imageUrl || "";

      // 1. อัปโหลดรูปภาพใหม่ (ถ้ามีการเลือก)
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);

        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      // ใส่ค่า imageUrl ลงใน formData ก่อนส่งไป Action
      formData.set("imageUrl", imageUrl);

      // 2. เรียกใช้ Server Action (ตัดสินใจว่าจะเป็น Add หรือ Update)
      if (initialData?.id) {
        // แก้ไขสินค้าเดิม
        await updateProduct(initialData.id, formData);
      } else {
        // เพิ่มสินค้าใหม่
        // มั่นใจว่าในฟอร์มมี input ชื่อ 'quantity' ด้วยถ้าใน action มีการใช้
        await addProduct(formData);
      }

      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {initialData ? "แก้ไขข้อมูลสินค้า" : "เพิ่มสินค้าใหม่"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">จัดการคลังสินค้า VapeHub ของคุณ</p>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-white hover:shadow-sm rounded-2xl text-slate-400 hover:text-slate-900 transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* อัปโหลดรูปภาพ */}
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 overflow-hidden group hover:border-indigo-300 transition-all">
              {previewUrl ? (
                <img src={previewUrl} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-2">
                  <ImageIcon className="h-10 w-10 stroke-[1.5]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">เลือกรูปสินค้า</span>
                </div>
              )}
              <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="text-white h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">ชื่อสินค้า</label>
              <input name="name" defaultValue={initialData?.name} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="เช่น Relx Infinity" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">ราคา (บาท)</label>
              <input name="price" type="number" step="0.01" defaultValue={initialData?.price} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="0.00" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">หมวดหมู่</label>
              <input name="category" defaultValue={initialData?.category} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="เช่น ตัวเครื่อง, น้ำยา" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">สต็อกเริ่มต้น</label>
              <input name="quantity" type="number" defaultValue={initialData?.inventory?.[0]?.quantity || 0} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" placeholder="0" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">รายละเอียด</label>
            <textarea name="description" defaultValue={initialData?.description} rows={3} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none" placeholder="รายละเอียดสินค้า..." />
          </div>

          <button disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-[1.5rem] font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98] disabled:bg-slate-300">
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : null}
            {initialData ? "ยืนยันการแก้ไข" : "เพิ่มสินค้าเข้าคลัง"}
          </button>
        </form>
      </div>
    </div>
  );
}