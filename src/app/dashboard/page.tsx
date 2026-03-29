import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  // 1. ดึงข้อมูลร้านค้าของเรา
  const store = await prisma.store.findFirst({ where: { ownerId: userId } })
  if (!store) redirect('/setup')

  // 2. ดึงข้อมูลสินค้าของร้านเรา (ของเดิม)
  const products = await prisma.product.findMany({
    where: { storeId: store.id },
    include: { inventory: true }
  })

  // 3. ดึงข้อมูลลิงก์ Affiliate ที่เราไปกดรับมา (ส่วนที่เพิ่มใหม่ ✨)
  const myAffiliates = await prisma.affiliate.findMany({
    where: { storeId: store.id },
    include: {
      product: {
        include: { store: true } // ดึงชื่อร้านเจ้าของสินค้าตัวจริงมาด้วย
      }
    }
  })

  // คำนวณสถิติ
  const totalProducts = products.length
  const sharedProducts = products.filter(p => p.isShared).length

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">ร้าน: {store.name}</h1>
          <p className="text-zinc-500">จัดการสต็อกสินค้าและระบบแชร์ของคุณที่นี่</p>
        </div>
        <div className="flex gap-3">
          <Link href="/market" className="bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg font-medium hover:bg-zinc-50 transition-colors shadow-sm">
            🌐 เข้าตลาดกลาง
          </Link>
          <Link href="/products/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 shadow-sm">
            + เพิ่มสินค้าใหม่
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <p className="text-zinc-500 text-sm">สินค้าของฉันทั้งหมด</p>
          <p className="text-2xl font-bold">{totalProducts} ชิ้น</p>
        </div>
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <p className="text-zinc-500 text-sm">สินค้าที่เปิดแชร์</p>
          <p className="text-2xl font-bold text-green-600">{sharedProducts} รายการ</p>
        </div>
        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-xl shadow-sm">
          <p className="text-indigo-600 text-sm font-medium">ลิงก์ Affiliate ของฉัน</p>
          <p className="text-2xl font-bold text-indigo-700">{myAffiliates.length} ลิงก์</p>
        </div>
      </div>
      
      {/* ตารางที่ 1: สินค้าของร้านตัวเอง */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b bg-zinc-50">
          <h2 className="font-bold text-zinc-900">📦 สินค้าในคลังของคุณ</h2>
        </div>
        
        {products.length === 0 ? (
          <div className="p-12 text-center text-zinc-400">
            ยังไม่มีสินค้าในคลัง เริ่มต้นโดยการกดปุ่ม "เพิ่มสินค้าใหม่"
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-sm text-zinc-500">
                <th className="p-4 font-medium">ชื่อสินค้า</th>
                <th className="p-4 font-medium">ราคา</th>
                <th className="p-4 font-medium">สต็อก (ชิ้น)</th>
                <th className="p-4 font-medium">สถานะแชร์</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-zinc-50">
                  <td className="p-4 font-medium text-zinc-900">{product.name}</td>
                  <td className="p-4 text-zinc-600">฿{product.price.toLocaleString()}</td>
                  <td className="p-4 text-zinc-600">
                    {product.inventory[0]?.quantity || 0}
                  </td>
                  <td className="p-4">
                    {product.isShared ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">เปิดแชร์</span>
                    ) : (
                      <span className="bg-zinc-100 text-zinc-500 px-2 py-1 rounded-full text-xs font-bold">ส่วนตัว</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ตารางที่ 2: ลิงก์ Affiliate ที่ไปเอาของคนอื่นมาขาย ✨ */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden border-indigo-100">
        <div className="p-6 border-b bg-indigo-50">
          <h2 className="font-bold text-indigo-900">🔗 สินค้าที่นำมาโปรโมท (Affiliate)</h2>
        </div>
        
        {myAffiliates.length === 0 ? (
          <div className="p-12 text-center text-zinc-400">
            ยังไม่มีลิงก์โปรโมท ไปที่ "ตลาดกลาง" เพื่อหาสินค้ามาขายสิ!
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-sm text-zinc-500 bg-zinc-50">
                <th className="p-4 font-medium">ชื่อสินค้า</th>
                <th className="p-4 font-medium">ร้านเจ้าของสต็อก</th>
                <th className="p-4 font-medium">ส่วนแบ่ง (Commission)</th>
                <th className="p-4 font-medium">รหัสลิงก์ของคุณ</th>
              </tr>
            </thead>
            <tbody>
              {myAffiliates.map((aff) => (
                <tr key={aff.id} className="border-b hover:bg-zinc-50">
                  <td className="p-4 font-medium text-zinc-900">{aff.product.name}</td>
                  <td className="p-4 text-zinc-500">{aff.product.store.name}</td>
                  <td className="p-4 text-green-600 font-bold">{(aff.commission * 100)}%</td>
                  <td className="p-4">
                    <code className="bg-zinc-100 text-pink-600 px-2 py-1 rounded text-sm font-mono border">
                      {aff.refCode}
                    </code>
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