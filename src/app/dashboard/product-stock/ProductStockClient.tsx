"use client";

import { useState, useTransition } from "react";
import { Search, Pencil, Trash2, Loader2, Package, ImageIcon } from "lucide-react";
import Image from "next/image";
import ProductForm from "@/app/components/ProductForm";
import { deleteProduct } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function ProductStockClient({ products }: { products: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("ลบสินค้านี้ออกจากคลังใช่ไหมเพื่อน?")) return;
    startTransition(async () => {
      await deleteProduct(id);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Stock</h1>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search product name..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Image</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Product Name</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Piece</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/30 transition-colors group">
                  {/* Image */}
                  <td className="px-6 py-4">
                    <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={20}/></div>
                      )}
                    </div>
                  </td>
                  
                  {/* Name */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">{product.name}</p>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase">
                      {product.category || "General"}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 text-sm font-black text-slate-900">
                    ฿{product.price.toLocaleString()}
                  </td>

                  {/* Quantity (Piece) */}
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">
                    {product.inventory?.[0]?.quantity || 0}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {isPending && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" />
          </div>
        )}
      </div>

      {isModalOpen && (
        <ProductForm 
          onClose={() => setIsModalOpen(false)} 
          initialData={selectedProduct} 
        />
      )}
    </div>
  );
}