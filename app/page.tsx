"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Syringe, Wrench, Layers, Smile } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/lib/supabase";

const categories = [
  {
    name: "Plombalar",
    slug: "plombalar",
    desc: "Kompozit va flow materiallar",
    icon: "tooth",
  },
  {
    name: "Ortopedia",
    slug: "ortopedia",
    desc: "Koronka va sarf materiallar",
    icon: "layers",
  },
  {
    name: "Instrumentlar",
    slug: "instrumentlar",
    desc: "Stomatologik asboblar",
    icon: "wrench",
  },
  {
    name: "Endodontiya",
    slug: "endodontiya",
    desc: "Kanal uchun materiallar",
    icon: "syringe",
  },
];

type HomeProduct = {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
};

function CategoryIcon({ name }: { name: string }) {
  if (name === "tooth") return <Smile size={22} strokeWidth={2.2} />;
  if (name === "layers") return <Layers size={22} strokeWidth={2.2} />;
  if (name === "wrench") return <Wrench size={22} strokeWidth={2.2} />;
  if (name === "syringe") return <Syringe size={22} strokeWidth={2.2} />;
  return <Smile size={22} strokeWidth={2.2} />;
}

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<HomeProduct[]>([]);

  const goSearch = () => {
    if (search.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(search)}`);
    } else {
      router.push("/catalog");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") goSearch();
  };

  async function loadProducts() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("products")
      .select("id,name,price,image_url,description")
      .eq("is_active", true)
      .order("id", { ascending: false })
      .limit(4);

    if (error) {
      console.error(error);
      return;
    }

    setProducts(data || []);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <>
      <main className="min-h-screen bg-[linear-gradient(180deg,#F7FAF9_0%,#EEF3F1_55%,#E8EFED_100%)] pb-28">
        <Header />

        <div className="mx-auto max-w-md px-4 pt-4">
          <section className="rounded-[32px] bg-white/95 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] ring-1 ring-black/5 backdrop-blur">
            <div className="mt-1 rounded-[28px] bg-[#004F45] p-5 text-white shadow-[0_20px_40px_rgba(0,79,69,0.24)]">
              <p className="text-sm text-white/80">Premium dental market</p>

              <h2 className="mt-1 text-2xl font-bold leading-tight">
                Klinikangiz uchun
                <br />
                kerakli jihozlar
              </h2>

              <div className="mt-4 flex gap-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Mahsulot qidiring..."
                  className="h-12 flex-1 rounded-full border border-white/20 bg-white px-4 text-[#12332D] outline-none"
                />

                <button
                  onClick={goSearch}
                  className="h-12 rounded-full bg-[#12332D] px-5 font-medium text-white shadow-[0_8px_20px_rgba(18,51,45,0.22)] ring-1 ring-white/10"
                >
                  Qidirish
                </button>
              </div>
            </div>
          </section>

          <section className="mt-5">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-bold text-[#12332D]">
                  Kategoriyalar
                </h3>
                <p className="text-sm text-[#5D7E78]">Asosiy bo'limlar</p>
              </div>

              <button
                onClick={() => router.push("/catalog")}
                className="text-sm font-semibold text-[#005B4F]"
              >
                Barchasi
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categories.map((item) => (
                <button
                  key={item.name}
                  onClick={() => router.push(`/catalog?category=${item.slug}`)}
                  className="rounded-[28px] bg-white/95 p-4 text-left shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-black/5"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4F7F6] text-[#0B5D52]">
                    <CategoryIcon name={item.icon} />
                  </div>

                  <h4 className="text-lg font-bold text-[#12332D]">
                    {item.name}
                  </h4>

                  <p className="mt-1 text-sm text-[#5D7E78]">{item.desc}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-3">
              <h3 className="text-2xl font-bold text-[#12332D]">
                Mashhur mahsulotlar
              </h3>
              <p className="text-sm text-[#5D7E78]">Ko'p ko'rilayotganlar</p>
            </div>

            <div className="space-y-3">
              {products.length === 0 ? (
                <div className="rounded-[28px] bg-white/95 p-4 text-sm text-[#5D7E78] shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-black/5">
                  Hozircha mahsulot yo'q
                </div>
              ) : (
                products.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => router.push(`/product/${item.id}`)}
                    className="flex w-full items-center justify-between rounded-[28px] bg-white/95 p-4 text-left shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-black/5"
                  >
                    <div className="flex items-center gap-3">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-16 w-16 rounded-[20px] object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#F4F7F6] text-[#0B5D52]">
                          <Layers size={24} strokeWidth={2.2} />
                        </div>
                      )}

                      <div>
                        <p className="text-sm text-[#5D7E78]">
                          {item.description || "Dental mahsulot"}
                        </p>
                        <h4 className="text-lg font-bold text-[#12332D]">
                          {item.name}
                        </h4>
                      </div>
                    </div>

                    <div className="rounded-full bg-[#004F45] px-4 py-2 text-sm font-semibold text-white">
                      ${item.price}
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
