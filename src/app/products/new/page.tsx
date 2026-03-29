import { addProduct } from '@/app/actions'
import Link from 'next/link'

export default function AddProductPage() {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-900">
          ← กลับไป Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-zinc-900">เพิ่มสินค้าใหม่</h1>
      </div>

      <form action={addProduct} className="space-y-6 bg-white p-8 border rounded-xl shadow-sm">
        
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">ชื่อสินค้า</label>
          <input type="text" name="name" required placeholder="เช่น พอตใช้แล้วทิ้ง รุ่น..." className="w-full p-3 border rounded-lg" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">ราคา (บาท)</label>
            <input type="number" name="price" required min="0" step="0.01" placeholder="0.00" className="w-full p-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">จำนวนสต็อกเริ่มต้น</label>
            <input type="number" name="quantity" required min="0" placeholder="10" className="w-full p-3 border rounded-lg" />
          </div>
        </div>

        <div className="p-4 bg-zinc-50 rounded-lg border flex items-center justify-between">
          <div>
            <h3 className="font-medium text-zinc-900">แชร์สต็อก (Shared Inventory)</h3>
            <p className="text-sm text-zinc-500">อนุญาตให้ร้านค้าอื่นในระบบเห็นและขายสินค้านี้ได้</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="isShared" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700">
          บันทึกสินค้า
        </button>
      </form>
    </div>
  )
}