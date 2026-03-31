"use client";

import { useState, useTransition } from "react"; // 🟢 เพิ่ม useTransition
import { Search, PlusCircle, Pencil, MoreVertical, Package, Image as ImageIcon, Trash2, Copy, Loader2 } from "lucide-react";
import Image from "next/image";
import ProductForm from "@/app/components/ProductForm";
import { deleteProduct, duplicateProduct } from "@/app/actions";
import { useRouter } from "next/navigation";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(amount);
};

export default function ProductListClient({ products }: { products: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition(); // 🟢 ใช้จัดการสถานะตอน Server ทำงาน
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All"); // 🟢 เพิ่ม State กรองหมวดหมู่
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // --- 🟢 ฟังก์ชันแก้ไข ---
  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  // --- 🟢 ฟังก์ชันคัดลอก (เพิ่มความชัวร์) ---
  const onDuplicate = (id: string) => {
    setActiveMenuId(null);
    startTransition(async () => {
      try {
        await duplicateProduct(id);
        router.refresh(); // บังคับให้หน้าจอไปดึงข้อมูลใหม่
      } catch (error) {
        alert("คัดลอกไม่สำเร็จเพื่อน!");
      }
    });
  };

  // --- 🟢 ฟังก์ชันลบ ---
  const onDelete = (id: string) => {
    if (!confirm("ลบแน่นะเพื่อน? ข้อมูลหายถาวรเลยนะ!")) return;
    setActiveMenuId(null);
    startTransition(async () => {
      await deleteProduct(id);
      router.refresh();
    });
  };

  // --- 🟢 Logic การกรองข้อมูล ---
  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean) as string[])];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10 relative">
      {/* 🟢 Loading Overlay เมื่อกำลังทำงาน (เช่น คัดลอก/ลบ) */}
      {isPending && (
        <div className="fixed inset-0 z-[100] bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        </div>
      )}

      {/* 🔵 Header & Search */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">All Product</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="search" 
                placeholder="ค้นหาชื่อสินค้า..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none transition" 
              />
            </div>
            <button onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }} className="flex items-center gap-2.5 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg active:scale-95 shrink-0">
              <PlusCircle className="h-5 w-5" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* 🟢 หมวดหมู่ที่กดได้จริง */}
        <div className="flex items-center gap-1.5 border-t border-slate-100 pt-5 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 🔵 Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col relative">
            
            {/* 🟢 Action Menu (3 จุด) */}
            <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={() => setActiveMenuId(activeMenuId === product.id ? null : product.id)}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-500 hover:text-indigo-600 shadow-sm border border-white transition-all"
              >
                <MoreVertical className="h-5 w-5" />
              </button>

              {activeMenuId === product.id && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-50 py-2 z-20 animate-in fade-in zoom-in duration-200">
                    <button onClick={() => handleEdit(product)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition"><Pencil className="h-4 w-4" /> แก้ไขข้อมูล</button>
                    <button onClick={() => onDuplicate(product.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"><Copy className="h-4 w-4" /> คัดลอกสินค้า</button>
                    <div className="my-1 border-t border-slate-50"></div>
                    <button onClick={() => onDelete(product.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 transition"><Trash2 className="h-4 w-4" /> ลบสินค้า</button>
                  </div>
                </>
              )}
            </div>

            {/* Image */}
            <div className="aspect-square w-full bg-slate-50 relative overflow-hidden flex items-center justify-center">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <ImageIcon className="h-20 w-20 text-slate-200" />
              )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition truncate flex-1 pr-2">{product.name}</h3>
                {product.category && <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-slate-100 text-slate-600 rounded-full shrink-0">{product.category}</span>}
              </div>
              
              <p className="text-sm text-slate-500 mb-5 line-clamp-2 flex-1">
                {product.description || "ยังไม่มีรายละเอียดสินค้า"}
              </p>
              
              <div className="flex items-center justify-between mt-auto border-t border-slate-100 pt-4">
                <div className="text-xl font-extrabold text-slate-950">{formatCurrency(product.price)}</div>
                <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-lg">
                  <Package className="h-4 w-4" />
                  <span>{product.inventory?.[0]?.quantity || 0} Items</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p className="font-bold text-lg">ไม่พบสินค้าที่คุณต้องการ</p>
        </div>
      )}

      {isModalOpen && <ProductForm onClose={() => setIsModalOpen(false)} initialData={selectedProduct} />}
    </div>
  );
}