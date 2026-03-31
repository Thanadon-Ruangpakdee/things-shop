// app/dashboard/page.tsx
import { db } from "@/lib/db"; // ตอนนี้จะหา { db } เจอแล้ว!
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Package
} from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(amount);
};

export default async function OverviewPage() {
  // ดึงข้อมูลแบบขนานเพื่อความเร็ว
  const [productCount, orderCount, revenueData, pendingOrders, recentOrders] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.order.aggregate({ _sum: { totalAmount: true } }),
    db.order.count({ where: { status: "PENDING" } }),
    db.order.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      // include: { product: true } // ถ้ามี relation ให้เปิดอันนี้
    })
  ]);

  const totalRevenue = revenueData._sum.totalAmount || 0;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={productCount.toLocaleString()} isUp icon={Package} color="bg-indigo-100 text-indigo-600" />
        <StatCard title="Total Orders" value={orderCount.toLocaleString()} isUp icon={ShoppingBag} color="bg-orange-100 text-orange-600" />
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} isUp icon={DollarSign} color="bg-emerald-100 text-emerald-600" />
        <StatCard title="Pending Payments" value={pendingOrders.toLocaleString()} isUp icon={Zap} color="bg-rose-100 text-rose-600" />
      </div>

      {/* ตารางออเดอร์ล่าสุด */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-bold text-lg text-slate-800">Deals Details</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-bold">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">วันที่</th>
              <th className="px-6 py-4">ยอดเงิน</th>
              <th className="px-6 py-4">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-700">#{order.id.slice(-4)}</td>
                <td className="px-6 py-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString('th-TH')}</td>
                <td className="px-6 py-4 font-bold text-slate-800">{formatCurrency(order.totalAmount)}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white ${
                    order.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-orange-400'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// วาง StatCard component ไว้ด้านล่าง (เหมือนเดิม)
function StatCard({ title, value, isUp, icon: Icon, color }: any) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          </div>
          <div className={`p-3 rounded-2xl ${color}`}><Icon className="h-6 w-6" /></div>
        </div>
      </div>
    );
}