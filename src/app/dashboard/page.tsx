import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { 
  DollarSign, 
  ShoppingBag, 
  Zap, 
  Package,
  ArrowRight
} from 'lucide-react';
import Link from "next/link";

/**
 * ==========================================
 * 🎨 HELPER: Format Currency
 * ==========================================
 */
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(amount);
};

export default async function OverviewPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  /**
   * ==========================================
   * 📊 DATA FETCHING (Parallel)
   * ==========================================
   */
  const [productCount, orderCount, revenueData, pendingOrders, recentOrders] = await Promise.all([
    db.product.count({ where: { store: { ownerId: userId } } }),
    db.order.count({ where: { store: { ownerId: userId } } }),
    db.order.aggregate({ 
      where: { store: { ownerId: userId }, status: "SUCCESS" }, 
      _sum: { totalAmount: true } 
    }),
    db.order.count({ where: { store: { ownerId: userId }, status: "PENDING" } }),
    db.order.findMany({
      where: { store: { ownerId: userId } },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } }
    })
  ]);

  const totalRevenue = revenueData._sum.totalAmount || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h2>
        <p className="text-sm text-slate-400 font-bold bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-50">
          ยินดีต้อนรับกลับมานะเพื่อน! 👋
        </p>
      </div>

      {/* 🟢 SECTION 1: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={productCount} icon={Package} color="bg-indigo-500" />
        <StatCard title="Total Orders" value={orderCount} icon={ShoppingBag} color="bg-orange-500" />
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={DollarSign} color="bg-emerald-500" />
        <StatCard title="Pending" value={pendingOrders} icon={Zap} color="bg-rose-500" />
      </div>

      {/* 🟢 SECTION 2: Recent Deals Detail */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-black text-xl text-slate-800">Recent Orders</h3>
          <Link href="/dashboard/orders" className="text-sm font-bold text-indigo-600 hover:gap-2 flex items-center gap-1 transition-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-8 py-4">Order ID</th>
                <th className="px-8 py-4">Product</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-400 text-sm">#{order.id.slice(-5).toUpperCase()}</td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800 text-sm">{order.items[0]?.product?.name || "Product"}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">฿{order.totalAmount.toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-5 text-slate-500 text-sm font-medium">
                    {new Date(order.createdAt).toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${
                      order.status === 'SUCCESS' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-orange-50 text-orange-600 border-orange-100'
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
    </div>
  );
}

/**
 * ==========================================
 * 🧩 COMPONENT: StatCard
 * ==========================================
 */
function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-2xl font-black text-slate-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl text-white shadow-lg ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}