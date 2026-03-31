"use client";

import { useState } from "react";
import { Search, Filter, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

// 🟢 ฟังก์ชันช่วยแสดงสีของสถานะ (Status Badge)
const getStatusStyles = (status: string) => {
  switch (status) {
    case "COMPLETED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "PROCESSING": return "bg-indigo-50 text-indigo-600 border-indigo-100";
    case "REJECTED": return "bg-rose-50 text-rose-600 border-rose-100";
    case "ON HOLD": return "bg-amber-50 text-amber-600 border-amber-100";
    default: return "bg-slate-50 text-slate-600 border-slate-100";
  }
};

export default function OrderListClient({ orders }: { orders: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  // กรองข้อมูลตาม ID หรือชื่อสินค้า (ถ้าต้องการ)
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items[0]?.product?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Lists</h1>

      {/* --- Filter Bar (ตามรูปเรฟ) --- */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-bold text-slate-600">Filter By</span>
        </div>
        
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by ID or Product Name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        <button 
          onClick={() => setSearchTerm("")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition"
        >
          <RotateCcw className="h-4 w-4" /> Reset Filter
        </button>
      </div>

      {/* --- Order Table --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Product Name</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Total Amount</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-5 text-sm font-bold text-slate-600">#{order.id.slice(-5).toUpperCase()}</td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      {order.items[0]?.product?.name || "Deleted Product"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Qty: {order.items[0]?.quantity || 1}</p>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString('th-TH', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-slate-900">
                    ฿{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-5 py-2 rounded-full text-[10px] font-black border ${getStatusStyles(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Pagination (Footer) --- */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <span className="text-sm text-slate-400 font-bold">
            Showing {filteredOrders.length} of {orders.length} orders
          </span>
          <div className="flex gap-2">
            <button className="p-2 border border-slate-200 rounded-xl hover:bg-white disabled:opacity-30 transition shadow-sm"><ChevronLeft className="h-4 w-4" /></button>
            <button className="p-2 border border-slate-200 rounded-xl hover:bg-white disabled:opacity-30 transition shadow-sm"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}