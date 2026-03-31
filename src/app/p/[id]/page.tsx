import { db as prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { createOrder } from '@/app/actions'

export default async function PublicProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ ref?: string }> // รับค่า ref จากลิงก์ Affiliate
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  
  const productId = resolvedParams.id
  const refCode = resolvedSearchParams.ref

  // ดึงข้อมูลสินค้าจาก Database
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      store: true, // ดึงข้อมูลร้านที่เป็นเจ้าของมาด้วย
      inventory: true
    }
  })

  // ถ้าหาสินค้าไม่เจอ ให้แสดงหน้า 404
  if (!product) notFound()

  // เช็คสต็อก
  const stock = product.inventory[0]?.quantity || 0
  const isOutOfStock = stock <= 0

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      {/* แถบแจ้งเตือนถ้ามาจากการกดลิงก์ Affiliate */}
      {refCode && (
        <div className="bg-pink-50 text-pink-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2 border border-pink-100">
          <span>✨</span>
          <p>คุณได้รับการแนะนำผ่านลิงก์ Affiliate รหัส: <strong>{refCode}</strong></p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col md:flex-row">
        {/* รูปสินค้าจำลอง (ฝั่งซ้าย) */}
        <div className="md:w-1/2 bg-zinc-100 flex items-center justify-center p-12 min-h-[300px]">
          <span className="text-6xl">📦</span>
        </div>

        {/* ข้อมูลสินค้า (ฝั่งขวา) */}
        <div className="p-8 md:w-1/2 flex flex-col justify-center">
          <p className="text-zinc-500 text-sm mb-2">จัดจำหน่ายโดย: {product.store.name}</p>
          <h1 className="text-3xl font-bold text-zinc-900 mb-4">{product.name}</h1>
          
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-indigo-600">
              ฿{product.price.toLocaleString()}
            </span>
          </div>

          <div className="mb-8">
            <p className="text-zinc-600 mb-2">
              สถานะ: {isOutOfStock 
                ? <span className="text-red-500 font-bold">สินค้าหมด</span> 
                : <span className="text-green-600 font-bold">มีสินค้าพร้อมส่ง ({stock} ชิ้น)</span>}
            </p>
            {product.description && (
              <p className="text-zinc-500 text-sm mt-4 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* 👇 ส่วนที่แก้ไข: นำ <form> มาครอบปุ่มสั่งซื้อและซ่อนข้อมูล 👇 */}
          <form action={createOrder} className="w-full">
            {/* ซ่อนข้อมูล productId และ refCode ไว้ส่งไปให้ Database ตอนกดปุ่ม */}
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="refCode" value={refCode || ''} />
            
            <button 
              type="submit"
              disabled={isOutOfStock}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                isOutOfStock 
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              {isOutOfStock ? 'สินค้าหมดชั่วคราว' : '🛒 สั่งซื้อสินค้านี้'}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}