"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store";

type ProductItem = {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  shortDescription: string;
  description: string;
  stock: number;
  featured: boolean;
};

type AddToCartButtonProps = {
  product: ProductItem;
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (product.stock <= 0) return;

    addItem(product);
    setAdded(true);
  };

  useEffect(() => {
    if (!added) return;

    const timer = setTimeout(() => {
      setAdded(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, [added]);

  return (
    <button
      onClick={handleAddToCart}
      disabled={product.stock <= 0}
      className={`mt-6 w-full rounded-full px-5 py-4 text-base font-semibold text-white transition ${
        product.stock <= 0
          ? "bg-slate-400"
          : added
          ? "bg-green-600"
          : "bg-[#004F45]"
      }`}
    >
      {product.stock <= 0
        ? "Tugagan"
        : added
        ? "Qo‘shildi ✅"
        : "Savatga qo‘shish"}
    </button>
  );
}