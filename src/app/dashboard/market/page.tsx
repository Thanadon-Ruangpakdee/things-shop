import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { createAffiliate } from "@/app/actions";
import { ShoppingBag, Store, Tag, Sparkles } from "lucide-react";

/**
 * ==========================================
 * 🛒 SECTION 1: MARKETPLACE PAGE (Server Component)
 * ==========================================
 */
export default async function MarketPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  /**
   * 🔍 SECTION 2: DATA FETCHING LOGIC (The Marketplace Logic)
   * --------------------------------------------------------
   * 1. isShared: true -> เฉพาะสินค้าที่เจ้าของอนุญาตให้แชร์
   * 2. store.ownerId: { not: userId } -> ไม่ดึงของตัวเองมาโชว์
   * 3. inventory.some.quantity: { gt: 0 } -> 🟢 ดึงเฉพาะสินค้าที่ 'มีของ' เท่านั้น
   */
  const products = await db.product.findMany({
    where: {
      isShared: true,
      store: {
        ownerId: { not: userId } 
      },
      inventory: {
        some: {
          quantity: { gt: 0 } // 🟢 ซ่อนสินค้าที่หมดสต็อกทันที (Logic ที่นายต้องการ)
        }
      }
    },
    include: { 
      store: true,
      inventory: true 
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-4 md:p-8 space-y-10 animate-in fade-in zoom-in duration-700">
      
      {/* --- 📢 Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-600">
            <Sparkles size={20} className="animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Global Discovery</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">Marketplace</h1>
          <p className="text-slate-500 font-bold flex items-center gap-2">
            <ShoppingBag size={18} className="text-indigo-500" />
            ร่วมธุรกิจกับพาร์ทเนอร์ และรับค่าคอมมิชชันจากการขาย
          </p>
        </div>
        
        {/* Count Badge */}
        <div className="bg-white px-8 py-4 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
             <Store className="text-indigo-600" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Items</p>
            <p className="text-2xl font-black text-slate-900 leading-none">{products.length}</p>
          </div>
        </div>
      </div>

      {/* --- 🛍️ Product Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-indigo-200/30 transition-all duration-500 relative"
          >
            {/* Image Wrapper */}
            <div className="aspect-square relative bg-slate-50 overflow-hidden">
              {product.imageUrl ? (
                <Image 
                  src={product.imageUrl} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-200 font-black text-[10px] uppercase italic">No Product Image</div>
              )}
              
              {/* Floating Category Badge */}
              <div className="absolute top-5 left-5">
                <span className="bg-white/80 backdrop-blur-xl text-slate-900 px-4 py-2 rounded-2xl text-[10px] font-black uppercase shadow-sm flex items-center gap-2 border border-white/50">
                  <Tag size={12} className="text-indigo-500" />
                  {product.category || "General"}
                </span>
              </div>
            </div>
            
            {/* Product Info */}
            <div className="p-7 flex flex-col flex-1">
              <div className="mb-6">
                <h3 className="font-black text-slate-900 text-xl group-hover:text-indigo-600 transition duration-300 truncate">
                  {product.name}
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mt-2 flex items-center gap-1.5">
                  <Store size={12} /> {product.store.name}
                </p>
              </div>
              
              {/* Price & Action */}
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Market Price</span>
                  <span className="text-2xl font-black text-slate-900">
                    ฿{product.price.toLocaleString()}
                  </span>
                </div>
                
                <form action={createAffiliate}>
                  <input type="hidden" name="productId" value={product.id} />
                  <button className="bg-indigo-600 text-white px-6 py-3.5 rounded-[1.25rem] text-sm font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-90 flex items-center gap-2">
                    รับไปขาย
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* --- 📭 Empty State --- */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-44 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 text-slate-300">
          <div className="bg-slate-50 p-8 rounded-full mb-6">
            <ShoppingBag size={64} className="opacity-20 text-slate-900" />
          </div>
          <h3 className="text-2xl font-black text-slate-400 tracking-tight">ตลาดเงียบเหงาจังเลยเพื่อน...</h3>
          <p className="text-sm font-bold opacity-60 mt-2">ยังไม่มีสินค้าจากร้านอื่นที่พร้อมให้คุณแชร์ในตอนนี้</p>
        </div>
      )}
    </div>
  );
}