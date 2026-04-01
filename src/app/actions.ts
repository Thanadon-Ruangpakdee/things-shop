'use server'

import { auth } from '@clerk/nextjs/server'
import { db as prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

/**
 * ==========================================
 * 🏬 SECTION 1: STORE ACTIONS
 * ==========================================
 */

// สร้างร้านค้าใหม่ (ใช้ตอน Setup ครั้งแรก)
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

  revalidatePath('/dashboard')
  redirect('/dashboard') // ตรงนี้ยังต้องมีเพราะเป็นการเปลี่ยนหน้าจาก Setup ไป Dashboard
}

/**
 * ==========================================
 * 📦 SECTION 2: PRODUCT MANAGEMENT
 * ==========================================
 */

// เพิ่มสินค้าใหม่
export async function addProduct(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const store = await prisma.store.findFirst({
    where: { ownerId: userId }
  })
  if (!store) throw new Error("Store not found")

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const imageUrl = formData.get('imageUrl') as string
  const price = parseFloat(formData.get('price') as string)
  const quantity = parseInt(formData.get('quantity') as string) || 0
  const isShared = true 

  await prisma.product.create({
    data: {
      name,
      description,
      category,
      imageUrl,
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

  // 🟢 สั่ง Refresh ทุกหน้าที่มีข้อมูลสินค้า
  revalidatePath('/dashboard/products')
  revalidatePath('/dashboard/product-stock')
  revalidatePath('/dashboard') 

  // ❌ ลบ redirect('/dashboard/products') ออกแล้วเพื่อน! 
  // เพื่อให้ try...catch ใน Form ทำงานสำเร็จและขึ้น Toast สีเขียว
}

// แก้ไขสินค้า
export async function updateProduct(productId: string, formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const imageUrl = formData.get('imageUrl') as string
  const price = parseFloat(formData.get('price') as string)
  const quantity = parseInt(formData.get('quantity') as string) || 0
  const isShared = formData.get('isShared') === 'on'

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: productId },
      data: { name, description, category, imageUrl, price, isShared }
    })

    const inventory = await tx.inventory.findFirst({
      where: { productId: productId }
    })

    if (inventory) {
      await tx.inventory.update({
        where: { id: inventory.id },
        data: { quantity: quantity }
      })
    }
  })

  revalidatePath('/dashboard/products')
  revalidatePath('/dashboard/product-stock')
  revalidatePath('/dashboard')
}

// ลบสินค้า
export async function deleteProduct(productId: string) {
  try {
    await prisma.$transaction([
      prisma.inventory.deleteMany({ where: { productId } }),
      prisma.affiliate.deleteMany({ where: { productId } }),
      prisma.orderItem.deleteMany({ where: { productId } }),
      prisma.product.delete({ where: { id: productId } })
    ])
    
    revalidatePath('/dashboard/products')
    revalidatePath('/dashboard/product-stock')
    revalidatePath('/dashboard')
  } catch (error) {
    console.error("Delete failed:", error)
    throw new Error("Failed to delete product")
  }
}

// คัดลอกสินค้า
export async function duplicateProduct(productId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const original = await prisma.product.findUnique({
    where: { id: productId },
    include: { inventory: true }
  });

  if (!original) throw new Error("Product not found");

  await prisma.$transaction(async (tx) => {
    await tx.product.create({
      data: {
        name: `${original.name} (Copy)`,
        description: original.description,
        price: original.price,
        category: original.category,
        imageUrl: original.imageUrl,
        isShared: original.isShared,
        storeId: original.storeId,
        inventory: {
          create: {
            storeId: original.storeId,
            quantity: original.inventory[0]?.quantity || 0
          }
        }
      }
    });
  });

  revalidatePath('/dashboard/products');
  revalidatePath('/dashboard/product-stock');
}

/**
 * ==========================================
 * 🛒 SECTION 3: ORDER & SALES MANAGEMENT
 * ==========================================
 */

// อัปเดตสถานะออเดอร์
export async function updateOrderStatus(orderId: string, newStatus: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus }
  })

  revalidatePath('/dashboard/orders')
  revalidatePath('/dashboard') 
}

// สร้างออเดอร์ใหม่ (ฝั่งลูกค้าสั่งซื้อ)
export async function createOrder(formData: FormData) {
  const productId = formData.get('productId') as string
  const refCode = formData.get('refCode') as string

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { inventory: true }
  })
  
  if (!product) throw new Error("Product not found")

  if (product.inventory[0]?.quantity <= 0) {
    throw new Error("Out of stock")
  }

  let affiliateId = null
  if (refCode) {
    const affiliate = await prisma.affiliate.findUnique({ where: { refCode } })
    if (affiliate) affiliateId = affiliate.id
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.create({
      data: {
        storeId: product.storeId,
        totalAmount: product.price,
        status: "PENDING", 
        affiliateId: affiliateId,
        items: {
          create: { productId: product.id, quantity: 1, price: product.price }
        }
      }
    })

    const currentInventory = product.inventory[0]
    if (currentInventory) {
      await tx.inventory.update({
        where: { id: currentInventory.id },
        data: { quantity: currentInventory.quantity - 1 }
      })
    }
  })

  revalidatePath('/dashboard/orders')
  revalidatePath('/dashboard/product-stock')
  revalidatePath('/dashboard')
  
  // ตรงนี้ยังต้อง redirect เพราะลูกค้าต้องไปหน้า Success หลังสั่งซื้อ
  redirect(`/p/${productId}/success`)
}

/**
 * ==========================================
 * 🤝 SECTION 4: AFFILIATE SYSTEM
 * ==========================================
 */

export async function createAffiliate(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const myStore = await prisma.store.findFirst({ where: { ownerId: userId } })
  if (!myStore) throw new Error("Store not found")

  const productId = formData.get('productId') as string
  const refCode = `${myStore.slug}-${Math.random().toString(36).substring(2, 7)}`

  await prisma.affiliate.create({
    data: { storeId: myStore.id, productId, refCode }
  })

  revalidatePath('/dashboard/affiliates') 
  redirect('/dashboard/affiliates')
}

export async function deleteAffiliateLink(formData: FormData) {
  const affiliateId = formData.get('affiliateId') as string;
  await prisma.affiliate.delete({ where: { id: affiliateId } });
  revalidatePath('/dashboard/affiliates');
}