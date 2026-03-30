import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deleteAffiliateLink } from '@/app/actions'

export default async function AffiliatesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  const store = await prisma.store.findFirst({ where: { ownerId: userId } })
  if (!store) redirect('/setup')

  // ดึงแค่ลิงก์ Affiliate
  const myAffiliates = await prisma.affiliate.findMany({
    where: { storeId: store.id },
    include: {
      product: { include: { store: true } }
    },
  })

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">🔗 ลิงก์โปรโมทของคุณ</h1>
          <p className="text-zinc-500">จัดการลิงก์ Affiliate ที่คุณนำมาแชร์เพื่อรับคอมมิชชัน</p>
        </div>
        <Link href="/market" className="bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg font-medium hover:bg-zinc-50 transition-colors shadow-sm">
          🌐 เข้าตลาดกลางเพื่อหาของขายเพิ่ม
        </Link>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden border-pink-100">
        {myAffiliates.length === 0 ? (
          <div className="p-12 text-center text-zinc-400">ยังไม่มีลิงก์โปรโมท ไปหาของมาขายในตลาดกลางกันเถอะ!</div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b text-zinc-500 bg-pink-50">
                <th className="p-4 font-medium text-pink-900">ชื่อสินค้า</th>
                <th className="p-4 font-medium text-pink-900">ร้านเจ้าของ</th>
                <th className="p-4 font-medium text-pink-900">ส่วนแบ่ง</th>
                <th className="p-4 font-medium text-pink-900">ลิงก์ของคุณ (คลิกเพื่อดูหน้าเว็บ)</th>
                <th className="p-4 font-medium text-pink-900">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {myAffiliates.map((aff) => (
                <tr key={aff.id} className="border-b hover:bg-zinc-50">
                  <td className="p-4 font-medium text-zinc-900">{aff.product.name}</td>
                  <td className="p-4 text-zinc-500">{aff.product.store.name}</td>
                  <td className="p-4 text-green-600 font-bold">{(aff.commission * 100)}%</td>
                  <td className="p-4">
                    <Link href={`/p/${aff.productId}?ref=${aff.refCode}`} target="_blank">
                      <code className="bg-pink-50 text-pink-600 px-3 py-1.5 rounded-lg font-mono border border-pink-200 hover:bg-pink-100 transition cursor-pointer">
                        {aff.refCode} ↗
                      </code>
                    </Link>
                  </td>
                  <td className="p-4">
                    <form action={deleteAffiliateLink}>
                      <input type="hidden" name="affiliateId" value={aff.id} />
                      <button type="submit" className="text-red-500 hover:bg-red-50 px-3 py-1 rounded transition text-xs font-medium">เลิกโปรโมท</button>
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