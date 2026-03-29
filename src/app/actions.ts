'use server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache' // <-- 1. เพิ่มตัวนี้เข้ามา

// ==========================================
// ฟังก์ชัน 1: สร้างร้านค้า (ของเดิมที่คุณมี แก้แค่ตอนท้าย)
// ==========================================
export async function createStore(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const slug = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  await prisma.store.create({
    data: {
      name,
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      ownerId: userId,
    },
  })

  // <-- 2. แก้ให้พาสร้างเสร็จแล้วเด้งไปหน้า /dashboard
  revalidatePath('/dashboard')
  redirect('/dashboard') 
}

// ==========================================
// ฟังก์ชัน 2: เพิ่มสินค้าใหม่ (เพิ่งเพิ่มเข้ามาใหม่)
// ==========================================
export async function addProduct(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // หาร้านค้าของ User คนนี้
  const store = await prisma.store.findFirst({
    where: { ownerId: userId }
  })
  if (!store) throw new Error("Store not found")

  // ดึงข้อมูลจากฟอร์ม
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const quantity = parseInt(formData.get('quantity') as string)
  const isShared = formData.get('isShared') === 'on' 

  // บันทึกสินค้าลง Product และเพิ่มสต็อกลง Inventory
  await prisma.product.create({
    data: {
      name,
      price,
      isShared,
      storeId: store.id,
      inventory: {
        create: {
          storeId: store.id,
          quantity: quantity
        }
      }
    }
  })

  // สั่งให้ Next.js อัปเดตหน้า Dashboard และพากลับไป
  revalidatePath('/dashboard')
  redirect('/dashboard')
}