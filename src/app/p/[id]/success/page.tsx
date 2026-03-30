import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      <div className="text-8xl mb-6">🎉</div>
      <h1 className="text-4xl font-bold text-green-600 mb-4">สั่งซื้อสำเร็จ!</h1>
      <p className="text-zinc-600 text-lg mb-8 max-w-md">
        ขอบคุณที่อุดหนุนสินค้าของเรา ระบบได้ดำเนินการตัดสต็อกและบันทึกประวัติการสั่งซื้อเรียบร้อยแล้ว
      </p>
      <Link href="/dashboard" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
        กลับสู่หน้า Dashboard
      </Link>
    </div>
  )
}