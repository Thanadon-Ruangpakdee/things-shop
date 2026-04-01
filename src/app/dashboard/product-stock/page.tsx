import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProductStockClient from "./ProductStockClient";

export default async function ProductStockPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const products = await db.product.findMany({
    where: {
      store: { ownerId: userId }
    },
    include: {
      inventory: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">
      <ProductStockClient products={products} />
    </div>
  );
}