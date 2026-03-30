import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deleteProduct } from '@/app/actions'

export default async function ProductsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  const store = await prisma.store.findFirst({ where: { ownerId: userId } })
  if (!store) redirect('/setup')

  // ดึงแค่ข้อมูลสินค้า
  const products = await prisma.product.findMany({
    where: { storeId: store.id },
    include: { inventory: true },
  })

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">📦 สินค้าในคลัง</h1>
          <p className="text-zinc-500">จัดการรายการสินค้า สต็อก และสถานะการแชร์ของคุณ</p>
        </div>
        <Link href="/products/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 shadow-sm">
          + เพิ่มสินค้าใหม่
        </Link>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center text-zinc-400">ยังไม่มีสินค้าในคลัง เริ่มต้นโดยการกดปุ่ม "เพิ่มสินค้าใหม่"</div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b text-zinc-500 bg-zinc-50">
                <th className="p-4 font-medium">ชื่อสินค้า</th>
                <th className="p-4 font-medium">ราคา</th>
                <th className="p-4 font-medium">สต็อก (ชิ้น)</th>
                <th className="p-4 font-medium">สถานะ</th>
                <th className="p-4 font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-zinc-50">
                  <td className="p-4 font-medium text-zinc-900">{product.name}</td>
                  <td className="p-4 text-zinc-600">฿{product.price.toLocaleString()}</td>
                  <td className="p-4 text-zinc-600 font-bold">{product.inventory[0]?.quantity || 0}</td>
                  <td className="p-4">
                    {product.isShared ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">เปิดแชร์</span>
                    ) : (
                      <span className="bg-zinc-100 text-zinc-500 px-2 py-1 rounded text-xs font-bold">ส่วนตัว</span>
                    )}
                  </td>
                  <td className="p-4">
                    <form action={deleteProduct}>
                      <input type="hidden" name="productId" value={product.id} />
                      <button type="submit" className="text-red-500 hover:bg-red-50 px-3 py-1 rounded transition text-xs font-medium">ลบทิ้ง</button>
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