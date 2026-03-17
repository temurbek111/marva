"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, changeQuantity } = useCartStore();

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    const savedUser = localStorage.getItem("marva-user");

    if (!savedUser) {
      router.push("/auth");
      return;
    }

    try {
      const parsed = JSON.parse(savedUser);

      if (!parsed?.fullName || !parsed?.phone) {
        router.push("/auth");
        return;
      }

      router.push("/checkout");
    } catch {
      router.push("/auth");
    }
  };

  return (
    <Container className="py-5">
      <div className="rounded-[28px] bg-white p-5 shadow-soft">
        <h1 className="text-2xl font-bold text-marva-900">Savatcha</h1>
        <p className="mt-1 text-sm text-marva-700/70">Tanlangan mahsulotlar</p>
      </div>

      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-[28px] bg-white p-6 text-center shadow-soft">
            <p className="text-lg font-semibold text-marva-900">Savatcha bo‘sh</p>
            <p className="mt-2 text-sm text-marva-700/70">
              Katalogdan mahsulot qo‘shing.
            </p>
            <Link
              href="/catalog"
              className="mt-4 inline-block rounded-2xl bg-marva-700 px-5 py-3 font-semibold text-white"
            >
              Katalogga o‘tish
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.product.id}
              className="rounded-[24px] bg-white p-4 shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-marva-900">
                    {item.product.name}
                  </h3>
                  <p className="mt-1 text-sm text-marva-700/70">
                    {formatPrice(item.product.price)} x {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-sm text-red-500"
                >
                  O‘chirish
                </button>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() =>
                    changeQuantity(item.product.id, item.quantity - 1)
                  }
                  className="h-10 w-10 rounded-2xl bg-marva-50"
                >
                  -
                </button>
                <div className="rounded-2xl bg-marva-50 px-4 py-2">
                  {item.quantity}
                </div>
                <button
                  onClick={() =>
                    changeQuantity(item.product.id, item.quantity + 1)
                  }
                  className="h-10 w-10 rounded-2xl bg-marva-50"
                >
                  +
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 ? (
        <div className="mt-5 rounded-[28px] bg-marva-800 p-5 text-white shadow-soft">
          <div className="flex items-center justify-between">
            <span>Jami</span>
            <span className="text-2xl font-bold">{formatPrice(total)}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="mt-4 block w-full rounded-[20px] bg-white px-4 py-4 text-center font-semibold text-marva-800"
          >
            Rasmiylashtirish
          </button>
        </div>
      ) : null}

      <BottomNav />
    </Container>
  );
}