import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db' 
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deleteAffiliateLink } from "@/app/actions";
// 🟢 แก้ Path ตรงนี้ให้ตรงกับโฟลเดอร์ src/app/components
import CopyButton from "@/app/components/CopyButton"; 

export default async function AffiliatesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  const store = await db.store.findFirst({ where: { ownerId: userId } })
  if (!store) redirect('/setup')

  const myAffiliates = await db.affiliate.findMany({
    where: { storeId: store.id },
    include: {
      product: { include: { store: true } }
    },
    orderBy: { id: 'desc' }
  })

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">🔗 ลิงก์โปรโมทของคุณ</h1>
          <p className="text-slate-500">จัดการลิงก์ Affiliate เพื่อรับคอมมิชชัน</p>
        </div>
        <Link href="/dashboard/market" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
          🌐 หาของขายเพิ่ม
        </Link>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        {myAffiliates.length === 0 ? (
          <div className="p-20 text-center text-slate-400 font-medium">ยังไม่มีลิงก์โปรโมทในขณะนี้</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase font-bold border-b border-slate-100">
                  <th className="p-5">สินค้า</th>
                  <th className="p-5">ร้านเจ้าของ</th>
                  <th className="p-5">คอมมิชชัน</th>
                  <th className="p-5">ลิงก์ของคุณ</th>
                  <th className="p-5 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {myAffiliates.map((aff) => {
                  // สร้างลิงก์เต็มสำหรับก๊อปปี้
                  const promoUrl = `http://localhost:3000/p/${aff.productId}?ref=${aff.refCode}`;
                  
                  return (
                    <tr key={aff.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 font-bold text-slate-800">{aff.product.name}</td>
                      <td className="p-5 text-slate-500">{aff.product.store.name}</td>
                      <td className="p-5 text-emerald-600 font-bold">{(aff.commission * 100)}%</td>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <Link href={promoUrl} target="_blank" className="hover:opacity-80 transition">
                            <code className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-xl font-mono text-xs border border-indigo-100">
                              {aff.refCode} ↗
                            </code>
                          </Link>
                          {/* 🟢 เรียกใช้ปุ่มก๊อปปี้ */}
                          <CopyButton textToCopy={promoUrl} />
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <form action={deleteAffiliateLink}>
                          <input type="hidden" name="affiliateId" value={aff.id} />
                          <button type="submit" className="text-red-400 hover:text-red-600 font-bold text-xs p-2 hover:bg-red-50 rounded-lg transition">
                            เลิกโปรโมท
                          </button>
                        </form>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}