import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const { userId } = await auth()

  // ถ้าล็อกอินแล้ว ให้ระบบตัดสินใจว่าจะพาไปหน้าไหน
  if (userId) {
    const store = await prisma.store.findFirst({ where: { ownerId: userId } })
    if (store) {
      redirect('/dashboard') // มีร้านแล้ว ไป Dashboard
    } else {
      redirect('/setup') // ยังไม่มีร้าน ไปหน้าสร้างร้าน
    }
  }

  // ถ้ายังไม่ล็อกอิน ให้โชว์หน้าต้อนรับปกติ
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-3xl font-bold text-zinc-900 mb-4">ยินดีต้อนรับสู่ Things Shop</h2>
      <p className="text-zinc-600 mb-8">กรุณา Sign In เพื่อเริ่มต้น</p>
    </div>
  )
}