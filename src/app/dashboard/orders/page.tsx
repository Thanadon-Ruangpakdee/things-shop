import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import OrderListClient from "./OrderListClient";

export default async function OrdersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // 🟢 ดึงข้อมูลออเดอร์ที่เกิดขึ้นในร้านของเรา
  const orders = await db.order.findMany({
    where: {
      store: { ownerId: userId }
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      <OrderListClient orders={orders} />
    </div>
  );
}