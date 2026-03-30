import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, ShoppingCart, DollarSign, Users, Link as LinkIcon, Clock } from 'lucide-react'

export default async function DashboardOverview() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  const user = await currentUser();
  const userName = user?.firstName || "คุณ";

  // ดึงข้อมูลร้านและรวม Affiliate มาคำนวณ
  const store = await prisma.store.findFirst({
    where: { ownerId: userId },
    include: {
      products: { include: { inventory: true } },
      affiliates: true
    }
  })
  if (!store) redirect('/setup')

  const allOrders = await prisma.order.findMany({
    where: { storeId: store.id },
    include: { affiliate: true },
    orderBy: { id: 'desc' },
    take: 8
  })

  // คำนวณยอดเงินจริง
  const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const affiliateOrders = allOrders.filter(order => order.affiliateId !== null);
  const totalAffiliateSales = affiliateOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  // คำนวณคอมมิชชันตาม Rate ที่ตั้งไว้ในระบบ
  const totalCommission = affiliateOrders.reduce((sum, order) => {
    const rate = order.affiliate?.commission || 0;
    return sum + (order.totalAmount * rate);
  }, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-1">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Dashboard Overview</p>
        <h2 className="text-3xl font-black text-slate-800 leading-tight">สวัสดี {userName}, 👋 ยินดีต้อนรับกลับมา</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <p className="text-[10px] text-slate-400 font-black uppercase mb-2 text-indigo-600">รายได้รวม</p>
          <h3 className="text-2xl font-black text-slate-900">฿{totalRevenue.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm border-l-4 border-l-indigo-500">
          <p className="text-[10px] text-indigo-400 font-black uppercase mb-2">ยอดจากตัวแทน</p>
          <h3 className="text-2xl font-black text-slate-900">฿{totalAffiliateSales.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm border-l-4 border-l-rose-500">
          <p className="text-[10px] text-rose-400 font-black uppercase mb-2">ค่าคอมฯ ค้างจ่าย</p>
          <h3 className="text-2xl font-black text-rose-600">฿{totalCommission.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] text-slate-400 font-black uppercase mb-2">ตัวแทนแชร์</p>
          <h3 className="text-2xl font-black text-slate-900">{store.affiliates.length} ท่าน</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h4 className="font-bold text-slate-800 text-lg mb-8 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" /> ออเดอร์ล่าสุด
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ORDER ID</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">SOURCE</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ยอดเงิน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-mono text-xs text-slate-400">#{order.id.slice(-6)}</td>
                    <td className="py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border ${order.affiliateId ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                        {order.affiliateId ? 'AFFILIATE' : 'DIRECT'}
                      </span>
                    </td>
                    <td className="py-4 text-right font-black text-slate-900">฿{order.totalAmount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-fit">
          <h4 className="font-bold text-slate-800 text-lg mb-8">ตัวจัดการสินค้า</h4>
          <div className="space-y-6">
            {store.products.slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">📦</div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-slate-800 truncate">{product.name}</h5>
                  <p className="text-[10px] text-emerald-500 font-bold">สต็อก {product.inventory[0]?.quantity || 0}</p>
                </div>
                <p className="text-sm font-black text-slate-900">฿{product.price}</p>
              </div>
            ))}
          </div>
          <Link href="/dashboard/products" className="mt-8 block text-center py-4 text-[10px] font-black uppercase text-slate-400 bg-slate-50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all border border-dashed border-slate-200">
            ดูสินค้าทั้งหมด
          </Link>
        </div>
      </div>
    </div>
  )
}