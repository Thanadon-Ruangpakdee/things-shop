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

// ==========================================
// ฟังก์ชัน 3: สร้างลิงก์ Affiliate (นำไปขาย)
// ==========================================
export async function createAffiliate(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // 1. หาร้านของเรา (คนที่จะเอาไปโปรโมท)
  const myStore = await prisma.store.findFirst({
    where: { ownerId: userId }
  })
  if (!myStore) throw new Error("Store not found")

  // 2. รับ ID สินค้าจากปุ่มที่กด
  const productId = formData.get('productId') as string

  // 3. สร้างรหัสอ้างอิง (Ref Code) แบบไม่ซ้ำใคร (เอาชื่อร้านเรา + ตัวเลขสุ่ม)
  const randomStr = Math.random().toString(36).substring(2, 7)
  const refCode = `${myStore.slug}-${randomStr}`

  // 4. บันทึกลงตาราง Affiliate
  await prisma.affiliate.create({
    data: {
      storeId: myStore.id,     // ร้านที่นำไปโปรโมท
      productId: productId,    // สินค้าที่จะโปรโมท
      refCode: refCode         // รหัสเฉพาะตัว
    }
  })

  // 5. สร้างเสร็จให้เด้งกลับไปหน้า Dashboard เพื่อดูลิงก์
  revalidatePath('/dashboard')
  redirect('/dashboard')
}
// ==========================================
// ฟังก์ชัน 4: สร้างคำสั่งซื้อ (เมื่อลูกค้ากดสั่งซื้อหน้าเว็บ)
// ==========================================
export async function createOrder(formData: FormData) {
  const productId = formData.get('productId') as string
  const refCode = formData.get('refCode') as string

  // 1. ดึงข้อมูลสินค้า
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { inventory: true }
  })
  if (!product) throw new Error("Product not found")

  // 2. หาว่าลิงก์นี้เป็นของใคร (ถ้ามีการแนบ refCode มา)
  let affiliateId = null
  if (refCode) {
    const affiliate = await prisma.affiliate.findUnique({
      where: { refCode: refCode }
    })
    if (affiliate) {
      affiliateId = affiliate.id
    }
  }

  // 3. สร้างคำสั่งซื้อและตัดสต็อกพร้อมกัน
  await prisma.$transaction(async (tx) => {
    // 3.1 สร้างออเดอร์
    await tx.order.create({
      data: {
        storeId: product.storeId,
        totalAmount: product.price,
        status: "COMPLETED", // สมมติว่าจ่ายเงินเรียบร้อยแล้ว
        affiliateId: affiliateId, // ผูกรหัสคนแนะนำไว้ตรงนี้! ✨
        items: {
          create: {
            productId: product.id,
            quantity: 1,
            price: product.price
          }
        }
      }
    })

    // 3.2 ลดสต็อกลง 1 ชิ้น
    const currentInventory = product.inventory[0]
    if (currentInventory && currentInventory.quantity > 0) {
      await tx.inventory.update({
        where: { id: currentInventory.id },
        data: { quantity: currentInventory.quantity - 1 }
      })
    }
  })

  // 4. อัปเดตข้อมูลหน้าเว็บใหม่ แล้วพาลูกค้าไปหน้าขอบคุณ
  revalidatePath('/dashboard')
  redirect(`/p/${productId}/success`)
}
// ==========================================
// ฟังก์ชัน 5: ลบสินค้าของตัวเอง
// ==========================================
export async function deleteProduct(formData: FormData) {
  const productId = formData.get('productId') as string
  
  // ลบข้อมูลที่ผูกกับสินค้านี้ก่อน (ป้องกัน Error จาก Database Relation)
  await prisma.inventory.deleteMany({ where: { productId: productId } })
  await prisma.affiliate.deleteMany({ where: { productId: productId } })
  
  // ลบตัวสินค้า
  await prisma.product.delete({ where: { id: productId } })
  revalidatePath('/dashboard')
}

// ==========================================
// ฟังก์ชัน 6: ลบลิงก์ Affiliate (เลิกโปรโมท)
// ==========================================
export async function deleteAffiliateLink(formData: FormData) {
  const affiliateId = formData.get('affiliateId') as string
  
  await prisma.affiliate.delete({ where: { id: affiliateId } })
  revalidatePath('/dashboard')
}