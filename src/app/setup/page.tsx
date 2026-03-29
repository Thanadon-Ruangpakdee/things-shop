import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import { createStore } from '@/app/actions'

export default async function SetupPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  // เช็คว่าถ้ามีร้านอยู่แล้ว ไม่ต้องมาหน้านี้ ให้เด้งไป Dashboard เลย
  const store = await prisma.store.findFirst({ where: { ownerId: userId } })
  if (store) redirect('/dashboard')

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border border-zinc-200 rounded-2xl shadow-xl bg-white">
      <h2 className="text-2xl font-bold text-zinc-900 mb-6">เริ่มต้นสร้างร้านค้า</h2>
      <form action={createStore} className="space-y-6">
        <input name="name" required placeholder="ชื่อร้านค้าของคุณ" className="w-full p-3 border rounded-xl" />
        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl">
          สร้างร้านค้าเลย 🚀
        </button>
      </form>
    </div>
  )
}