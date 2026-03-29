import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  // เช็คว่าถ้ายังไม่มีร้าน ให้เด้งไปหน้า Setup บังคับให้สร้างก่อน
  const store = await prisma.store.findFirst({ where: { ownerId: userId } })
  if (!store) redirect('/setup')

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">ร้าน: {store.name}</h1>
          <p className="text-zinc-500">จัดการสต็อกสินค้าและระบบแชร์ของคุณที่นี่</p>
        </div>
        <Link href="/products/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">
          + เพิ่มสินค้าใหม่
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <p className="text-zinc-500 text-sm">สินค้าทั้งหมด</p>
          <p className="text-2xl font-bold">0 ชิ้น</p>
        </div>
        <div className="p-6 bg-white border rounded-xl shadow-sm">
          <p className="text-zinc-500 text-sm">รายการที่แชร์</p>
          <p className="text-2xl font-bold text-green-600">0 รายการ</p>
        </div>
      </div>
      
      <div className="mt-10 p-20 border-2 border-dashed rounded-2xl text-center text-zinc-400">
        ยังไม่มีสินค้าในคลัง เริ่มต้นโดยการกดปุ่ม "เพิ่มสินค้าใหม่"
      </div>
    </div>
  )
}