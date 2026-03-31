// app/dashboard/products/page.tsx
import { db } from "@/lib/db";
import ProductListClient from "./ProductListClient"; // เราจะสร้างไฟล์นี้ในข้อถัดไป

// app/dashboard/products/page.tsx
export default async function ProductsPage() {
  const products = await db.product.findMany({
    include: {
      inventory: true, // 🟢 ห้ามลืมบรรทัดนี้! เพื่อให้สต็อกโชว์
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="animate-in fade-in duration-500">
      <ProductListClient products={products} />
    </div>
  );
}