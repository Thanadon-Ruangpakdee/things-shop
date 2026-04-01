"use client";

/**
 * ==========================================
 * 🧱 SECTION 1: IMPORTS & CONFIG
 * ==========================================
 */
import { useState, useTransition } from "react";
import { Search, Pencil, Trash2, Loader2, Package, ImageIcon, AlertCircle } from "lucide-react";
import Image from "next/image";
import ProductForm from "@/app/components/ProductForm";
import { deleteProduct } from "@/app/actions";
import { useRouter } from "next/navigation";

/**
 * ==========================================
 * 🖥️ SECTION 2: MAIN COMPONENT
 * ==========================================
 */
export default function ProductStockClient({ products }: { products: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 🟢 ฟังก์ชันแก้ไขสินค้า
  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // 🟢 ฟังก์ชันลบสินค้า
  const handleDelete = (id: string) => {
    if (!confirm("ลบสินค้านี้ออกจากคลังใช่ไหมเพื่อน? ข้อมูลจะหายถาวรนะ!")) return;
    startTransition(async () => {
      try {
        await deleteProduct(id);
        router.refresh();
      } catch (error) {
        alert("ลบไม่สำเร็จนะเพื่อน ลองใหม่อีกที!");
      }
    });
  };

  // 🟢 กรองข้อมูลตาม Search และจัดลำดับ
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      {/* 🟢 Loading Overlay ตอนกำลังลบ */}
      {isPending && (
        <div className="fixed inset-0 z-50 bg-white/20 backdrop-blur-[1px] flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        </div>
      )}

      {/* --- 🔍 Header & Search Bar --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Stock</h1>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อสินค้าในสต็อก..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* --- 📊 Stock Table --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Preview</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Product Name</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Category</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Price</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Stock (Piece)</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product) => {
                const stock = product.inventory?.[0]?.quantity || 0;
                const isOutOfStock = stock <= 0;

                return (
                  <tr key={product.id} className={`hover:bg-slate-50/30 transition-colors group ${isOutOfStock ? 'bg-rose-50/30' : ''}`}>
                    {/* Image Preview */}
                    <td className="px-6 py-4">
                      <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={20}/></div>
                        )}
                      </div>
                    </td>
                    
                    {/* Product Name */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">{product.name}</p>
                      {isOutOfStock && <span className="text-[10px] text-rose-500 font-black flex items-center gap-1 mt-1"><AlertCircle size={10}/> OUT OF STOCK</span>}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tight">
                        {product.category || "General"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-black text-slate-900">฿{product.price.toLocaleString()}</span>
                    </td>

                    {/* Quantity (Stock) */}
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-bold ${isOutOfStock ? 'text-rose-500' : 'text-slate-600'}`}>
                        {stock}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* --- 📄 Empty State --- */}
        {filteredProducts.length === 0 && (
          <div className="p-20 text-center text-slate-400 flex flex-col items-center">
            <Package size={48} className="mb-4 opacity-20" />
            <p className="font-bold">ไม่พบสินค้าในสต็อกนะเพื่อน</p>
          </div>
        )}
      </div>

      {/* --- 📝 Edit Modal --- */}
      {isModalOpen && (
        <ProductForm 
          onClose={() => setIsModalOpen(false)} 
          initialData={selectedProduct} 
        />
      )}
    </div>
  );
}