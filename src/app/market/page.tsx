// ใส่คำสั่งนี้ไว้บนสุด เพื่อห้าม Next.js จำ Cache
export const dynamic = 'force-dynamic' 

import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createAffiliate } from '../actions'

export default async function MarketPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  // หาว่าเราคือร้านไหน
  const myStore = await prisma.store.findFirst({ where: { ownerId: userId } })
  if (!myStore) redirect('/setup')

  // ดึงสินค้าที่ "เปิดแชร์" ทั้งหมด (เอาของตัวเองมาโชว์ด้วยชั่วคราว เพื่อทดสอบ)
  const sharedProducts = await prisma.product.findMany({
    where: { 
      isShared: true,
      // storeId: { not: myStore.id } <-- คอมเมนต์ปิดไว้เพื่อทดสอบ
    },
    include: {
      inventory: true,
      store: true 
    }
  })

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">🌐 ตลาดกลาง (Shared Market)</h1>
          <p className="text-zinc-500">เลือกหาสินค้าจากร้านค้าพันธมิตรเพื่อนำไปโปรโมท</p>
        </div>
        <Link href="/dashboard" className="bg-zinc-100 text-zinc-700 px-4 py-2 rounded-lg font-medium hover:bg-zinc-200">
          กลับ Dashboard
        </Link>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {sharedProducts.length === 0 ? (
          <div className="p-12 text-center text-zinc-400">
            ยังไม่มีสินค้าจากร้านอื่นที่เปิดแชร์ในขณะนี้
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-sm text-zinc-500 bg-zinc-50">
                <th className="p-4 font-medium">ชื่อสินค้า</th>
                <th className="p-4 font-medium">ราคา</th>
                <th className="p-4 font-medium">สต็อกคงเหลือ</th>
                <th className="p-4 font-medium">ร้านเจ้าของ</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {sharedProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-zinc-50">
                  <td className="p-4 font-medium text-zinc-900">{product.name}</td>
                  <td className="p-4 text-zinc-600">฿{product.price.toLocaleString()}</td>
                  <td className="p-4 text-zinc-600">{product.inventory[0]?.quantity || 0} ชิ้น</td>
                  <td className="p-4 text-zinc-500 flex items-center gap-2">
                    <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">
                      {product.store.name.charAt(0)}
                    </span>
                    {product.store.name}
                  </td>
                  <td className="p-4 text-right">
    <form action={createAffiliate}>
      {/* ซ่อน ID สินค้าไว้ เพื่อส่งไปให้ Backend รู้ว่าเรากดสินค้าชิ้นไหน */}
      <input type="hidden" name="productId" value={product.id} />
      <button type="submit" className="text-indigo-600 text-sm font-bold hover:underline">
        นำไปขาย (Affiliate)
      </button>
    </form>
  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}