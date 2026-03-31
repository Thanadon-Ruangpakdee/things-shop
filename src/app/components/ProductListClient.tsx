"use client";

import { useState } from "react";
import { Search, PlusCircle, Pencil, MoreVertical, Package, Image as ImageIcon, Trash2, Copy, ExternalLink, Eye } from "lucide-react";
import Image from "next/image";
import ProductForm from "@/app/components/ProductForm";
import { deleteProduct, duplicateProduct } from "@/app/actions";
import { useRouter } from "next/navigation";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(amount);
};

export default function ProductListClient({ products }: { products: any[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // --- Handlers ---
  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const onDelete = async (id: string) => {
    if (confirm("เพื่อนแน่ใจนะว่าจะลบสินค้านี้? ข้อมูลจะหายถาวรเลยนะ!")) {
      await deleteProduct(id);
      setActiveMenuId(null);
      router.refresh();
    }
  };

  const onDuplicate = async (id: string) => {
    await duplicateProduct(id);
    setActiveMenuId(null);
    router.refresh();
  };

  // --- Logic ---
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean) as string[])];

  return (
    <div className="space-y-10">
      {/* 🟢 ส่วนหัวและแถบค้นหา */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">คลังสินค้าทั้งหมด</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="search" 
                placeholder="ค้นหาชื่อสินค้า..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" 
              />
            </div>
            <button 
              onClick={handleAddNew}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 active:scale-95 shrink-0"
            >
              <PlusCircle className="h-5 w-5" />
              <span>เพิ่มสินค้าใหม่</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 border-t border-slate-50 pt-5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((category, index) => (
            <button 
              key={category} 
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                index === 0 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 🟢 รายการสินค้า (Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500 flex flex-col relative">
            
            {/* 3-Dots Dropdown */}
            <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={() => setActiveMenuId(activeMenuId === product.id ? null : product.id)}
                className="p-2.5 bg-white/90 backdrop-blur-md rounded-2xl text-slate-500 hover:text-indigo-600 shadow-sm transition-all active:scale-90 border border-white"
              >
                <MoreVertical className="h-5 w-5" />
              </button>

              {activeMenuId === product.id && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-3xl shadow-2xl border border-slate-50 py-2 z-20 animate-in fade-in zoom-in duration-200">
                    <button onClick={() => handleEdit(product)} className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition">
                      <Pencil className="h-4 w-4" /> แก้ไขข้อมูล
                    </button>
                    <button onClick={() => onDuplicate(product.id)} className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
                      <Copy className="h-4 w-4" /> คัดลอกสินค้า
                    </button>
                    <div className="my-1 border-t border-slate-50"></div>
                    <button onClick={() => onDelete(product.id)} className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition">
                      <Trash2 className="h-4 w-4" /> ลบสินค้า
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* ส่วนรูปภาพ */}
            <div className="aspect-square w-full bg-slate-50 relative overflow-hidden flex items-center justify-center">
              {product.imageUrl ? (
                <Image 
                  src={product.imageUrl} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 text-slate-200">
                  <ImageIcon className="h-20 w-20" strokeWidth={1} />
                </div>
              )}
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/10 transition-colors duration-500" />
            </div>

            {/* ส่วนข้อมูล */}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition truncate flex-1 pr-2">
                  {product.name}
                </h3>
                {product.category && (
                  <span className="px-3 py-1 text-[10px] font-extrabold uppercase bg-slate-100 text-slate-500 rounded-full shrink-0 tracking-wider">
                    {product.category}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-slate-400 mb-6 line-clamp-2 leading-relaxed">
                {product.description || "ยังไม่มีรายละเอียดสินค้าในขณะนี้"}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-50">
                <div className="text-2xl font-black text-slate-900">
                  {formatCurrency(product.price)}
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold ${
                    (product.inventory?.[0]?.quantity || 0) > 0 
                    ? "bg-emerald-50 text-emerald-600" 
                    : "bg-rose-50 text-rose-600"
                  }`}>
                    <Package className="h-3.5 w-3.5" />
                    <span>{product.inventory?.[0]?.quantity || 0} ชิ้น</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-4">
            <Package className="h-16 w-16 opacity-20" />
            <p className="font-bold">ไม่พบสินค้าที่เพื่อนค้นหาเลย</p>
          </div>
        )}
      </div>

      {/* Modal ฟอร์ม */}
      {isModalOpen && (
        <ProductForm 
          onClose={() => setIsModalOpen(false)} 
          initialData={selectedProduct} 
        />
      )}
    </div>
  );
}