"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { supabase } from "@/lib/supabase";
import type { Category, Product } from "@/lib/types";

type DbCategory = {
  id: number;
  name: string;
  slug: string;
};

type DbProduct = {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  stock: number;
  category_id: number | null;
  description?: string | null;
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const q = searchParams.get("q")?.toLowerCase().trim() || "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCatalog() {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data: categoriesData, error: categoriesError } = await supabase
      .from("categories")
      .select("id,name,slug")
      .order("id", { ascending: true });

    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("id,name,price,image_url,stock,category_id,description,is_active")
      .eq("is_active", true)
      .order("id", { ascending: false });

    if (categoriesError) console.error(categoriesError);
    if (productsError) console.error(productsError);

    const mappedCategories: Category[] = (categoriesData || []).map(
      (item: DbCategory) => ({
        id: String(item.id),
        name: item.name,
        slug: item.slug,
        icon: "box",
        description: item.name,
      })
    );

    const mappedProducts: Product[] = (productsData || []).map((item: any) => ({
      id: String(item.id),
      slug: `product-${item.id}`,
      categoryId: item.category_id ? String(item.category_id) : "",
      name: item.name,
      price: Number(item.price || 0),
      currency: "USD",
      image: item.image_url || "",
      shortDescription: item.description || "Dental mahsulot",
      description: item.description || "Dental mahsulot",
      stock: item.stock || 0,
      featured: false,
    }));

    setCategories(mappedCategories);
    setProducts(mappedProducts);
    setLoading(false);
  }

  useEffect(() => {
    loadCatalog();
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    if (category) {
      result = result.filter((product) => {
        const cat = categories.find((item) => item.id === product.categoryId);
        return cat?.slug === category;
      });
    }

    if (q) {
      result = result.filter((product) => {
        const name = product.name?.toLowerCase() || "";
        const description = product.description?.toLowerCase() || "";
        const shortDescription = product.shortDescription?.toLowerCase() || "";
        return (
          name.includes(q) ||
          description.includes(q) ||
          shortDescription.includes(q)
        );
      });
    }

    return result;
  }, [category, q, categories, products]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F7FAF9_0%,#EEF3F1_55%,#E8EFED_100%)] pb-28">
      <Header />

      <Container className="py-5">
        <div className="rounded-[32px] bg-white/95 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] ring-1 ring-black/5 backdrop-blur">
          <h2 className="text-2xl font-bold text-[#12332D]">Katalog</h2>
          <p className="mt-1 text-sm text-[#5D7E78]">
            Mahsulotlar, narxlar va kategoriyalar
          </p>

          {q ? (
            <p className="mt-2 text-sm text-[#004F45]">
              Qidiruv: <span className="font-semibold">{q}</span>
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog"}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                !category
                  ? "bg-[#004F45] text-white shadow-[0_10px_20px_rgba(0,79,69,0.18)]"
                  : "bg-[#F4F7F6] text-[#12332D] ring-1 ring-black/5"
              }`}
            >
              Barchasi
            </a>

            {categories.map((item) => (
              <a
                key={item.id}
                href={
                  q
                    ? `/catalog?category=${item.slug}&q=${encodeURIComponent(q)}`
                    : `/catalog?category=${item.slug}`
                }
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  category === item.slug
                    ? "bg-[#004F45] text-white shadow-[0_10px_20px_rgba(0,79,69,0.18)]"
                    : "bg-[#F4F7F6] text-[#12332D] ring-1 ring-black/5"
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mt-5 rounded-[28px] bg-white p-6 text-center shadow-soft">
            Yuklanmoqda...
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-5 rounded-[28px] bg-white p-6 text-center shadow-soft">
            Hech narsa topilmadi
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-4">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="rounded-[28px] bg-white/95 p-2 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-black/5"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </Container>

      <BottomNav />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F7FAF9]">
          <p className="text-[#5D7E78]">Yuklanmoqda...</p>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
