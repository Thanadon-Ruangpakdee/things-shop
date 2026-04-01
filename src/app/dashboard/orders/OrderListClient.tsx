"use client";

/**
 * ==========================================
 * 🧱 SECTION 1: IMPORTS & CONFIG
 * ==========================================
 */
import { useState, useTransition } from "react";
import { Search, Filter, RotateCcw, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { updateOrderStatus } from "@/app/actions";
import { useRouter } from "next/navigation";

/**
 * ==========================================
 * 🎨 SECTION 2: HELPER FUNCTIONS
 * ==========================================
 */
const getStatusStyles = (status: string) => {
  switch (status) {
    case "SUCCESS": return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "PROCESSING": return "bg-indigo-50 text-indigo-600 border-indigo-200";
    case "REJECTED": return "bg-rose-50 text-rose-600 border-rose-200";
    case "PENDING": return "bg-amber-50 text-amber-600 border-amber-200";
    default: return "bg-slate-50 text-slate-600 border-slate-100";
  }
};

/**
 * ==========================================
 * 🖥️ SECTION 3: MAIN COMPONENT
 * ==========================================
 */
export default function OrderListClient({ orders }: { orders: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition(); 
  const [searchTerm, setSearchTerm] = useState("");

  // 🟢 ฟังก์ชันเปลี่ยนสถานะ Order
  const handleStatusUpdate = (orderId: string, nextStatus: string) => {
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, nextStatus);
        router.refresh();
      } catch (error) {
        alert("แก้สถานะไม่สำเร็จนะเพื่อน!");
      }
    });
  };

  // 🟢 ฟังก์ชัน Refresh (ล้าง Filter + ดึงข้อมูลใหม่)
  const handleRefresh = () => {
    setSearchTerm(""); // ล้างช่องค้นหา
    startTransition(() => {
      router.refresh(); // สั่งให้ Server ดึงข้อมูลล่าสุด
    });
  };

  // 🟢 ระบบกรองข้อมูล (Search Logic)
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items[0]?.product?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      {/* 🟢 Loading Overlay ทับทั้งหน้าเวลาทำงาน */}
      {isPending && (
        <div className="fixed inset-0 z-50 bg-white/20 backdrop-blur-[1px] flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        </div>
      )}

      <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Lists</h1>

      {/* --- 🔍 Filter Bar --- */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-bold text-slate-600">Filter By</span>
        </div>
        
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="ค้นหาด้วย ID หรือชื่อสินค้า..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        {/* 🟢 ปุ่ม Refresh (ที่นายอยากได้) */}
        <button 
          onClick={handleRefresh}
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-black text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-95 disabled:opacity-50"
        >
          <RotateCcw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} /> 
          {isPending ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* --- 📊 Order Table --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Product Details</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase text-center tracking-widest">Status Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-5 text-sm font-bold text-slate-400">#{order.id.slice(-5).toUpperCase()}</td>
                  
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      {order.items[0]?.product?.name || "Deleted Product"}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">
                        Qty: {order.items[0]?.quantity || 1}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm font-medium text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString('th-TH', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>

                  <td className="px-6 py-5 text-sm font-black text-slate-900">
                    ฿{order.totalAmount.toLocaleString()}
                  </td>

                  <td className="px-6 py-5 text-center">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black border cursor-pointer outline-none transition-all
                        ${getStatusStyles(order.status)}
                      `}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SUCCESS">SUCCESS</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- 📄 Pagination Footer --- */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <span className="text-sm text-slate-400 font-bold">
            Showing {filteredOrders.length} of {orders.length} orders
          </span>
          <div className="flex gap-2">
            <button className="p-2 border border-slate-200 rounded-xl hover:bg-white transition shadow-sm"><ChevronLeft className="h-4 w-4" /></button>
            <button className="p-2 border border-slate-200 rounded-xl hover:bg-white transition shadow-sm"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}