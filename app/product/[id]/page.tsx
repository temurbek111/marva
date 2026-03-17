import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Container } from "@/components/ui/Container";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck, BadgeDollarSign } from "lucide-react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { supabase } from "@/lib/supabase";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!supabase) return notFound();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !product) return notFound();

  const mappedProduct = {
    id: String(product.id),
    slug: `product-${product.id}`,
    categoryId: product.category_id ? String(product.category_id) : "",
    name: product.name,
    price: Number(product.price || 0),
    currency: "USD",
    image: product.image_url || "",
    shortDescription: product.description || "Dental mahsulot",
    description: product.description || "Dental mahsulot",
    stock: product.stock || 0,
    featured: false,
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F7FAF9_0%,#EEF3F1_55%,#E8EFED_100%)] pb-28">
      <Header />

      <Container className="py-5">
        <div className="overflow-hidden rounded-[32px] bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
          <div className="flex aspect-square items-center justify-center bg-[linear-gradient(180deg,#F8FBFA_0%,#EEF3F1_100%)]">
            {mappedProduct.image ? (
              <img
                src={mappedProduct.image}
                alt={mappedProduct.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-white text-[#004F45] shadow-[0_12px_24px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
                <span className="text-base font-bold">MARVA</span>
              </div>
            )}
          </div>

          <div className="p-5">
            <p className="text-sm text-[#5D7E78]">Dental mahsulot</p>

            <h1 className="mt-1 text-[28px] font-bold leading-9 text-[#12332D]">
              {mappedProduct.name}
            </h1>

            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[30px] font-bold text-[#004F45]">
                  ${mappedProduct.price}
                </p>
              </div>

              <div className="rounded-full bg-[#EAF3F1] px-4 py-2 text-sm font-semibold text-[#004F45]">
                {mappedProduct.stock > 0 ? "Mavjud" : "Tugagan"}
              </div>
            </div>

            <div className="mt-5 rounded-[24px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
              <h2 className="text-base font-semibold text-[#12332D]">Tavsif</h2>
              <p className="mt-2 text-sm leading-6 text-[#5D7E78]">
                {mappedProduct.description}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 rounded-[22px] bg-white p-4 ring-1 ring-black/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3F1] text-[#004F45]">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="font-semibold text-[#12332D]">Yetkazib berish</p>
                  <p className="text-sm text-[#5D7E78]">
                    Tez va qulay buyurtma topshirish
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-[22px] bg-white p-4 ring-1 ring-black/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3F1] text-[#004F45]">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="font-semibold text-[#12332D]">Sifat kafolati</p>
                  <p className="text-sm text-[#5D7E78]">
                    Ishonchli dental mahsulotlar
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-[22px] bg-white p-4 ring-1 ring-black/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3F1] text-[#004F45]">
                  <BadgeDollarSign size={20} />
                </div>
                <div>
                  <p className="font-semibold text-[#12332D]">Qulay narx</p>
                  <p className="text-sm text-[#5D7E78]">
                    Doimiy yangilanib turadigan price list
                  </p>
                </div>
              </div>
            </div>

            <AddToCartButton product={mappedProduct} />
          </div>
        </div>
      </Container>

      <BottomNav />
    </div>
  );
}
