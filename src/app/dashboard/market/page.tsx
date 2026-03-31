import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { createAffiliate } from "@/app/actions"; // มั่นใจว่ามีตัวนี้ใน actions.ts นะครับ

export default async function MarketPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // ดึงสินค้าของร้านอื่นที่เปิดให้แชร์ (isShared: true)
  const products = await db.product.findMany({
    where: {
      isShared: true,
      store: {
        ownerId: { not: userId } // ไม่เอาสินค้าตัวเอง
      }
    },
    include: { store: true }
  });

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-1000">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Marketplace</h1>
        <p className="text-slate-500 mt-2 font-medium">เลือกสินค้าคุณภาพไปวางขายในร้านของคุณและรับค่าคอมมิชชัน</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500">
            <div className="aspect-square relative bg-slate-50 overflow-hidden">
              {product.imageUrl && (
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              )}
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{product.name}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{product.store.name}</p>
                </div>
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  {product.category}
                </span>
              </div>
              
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                <span className="text-2xl font-black text-slate-900">฿{product.price.toLocaleString()}</span>
                
                <form action={createAffiliate}>
                  <input type="hidden" name="productId" value={product.id} />
                  <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
                    รับไปขาย
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400">
          <p className="text-lg font-bold">โอ๊ะ! ยังไม่มีสินค้าในตลาดตอนนี้</p>
          <p className="text-sm">รอเพื่อนร้านอื่นมาลงของก่อนนะ</p>
        </div>
      )}
    </div>
  );
}