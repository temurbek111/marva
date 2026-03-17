"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Container } from "@/components/ui/Container";
import { Package, ClipboardList, Users } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F7FAF9_0%,#EEF3F1_55%,#E8EFED_100%)] pb-28">
      <Header />

      <Container className="py-5 space-y-5">
        <div className="rounded-[32px] bg-white p-5 shadow-soft">
          <p className="text-sm text-marva-700/70">Admin panel</p>
          <h1 className="mt-1 text-2xl font-bold text-marva-900">
            Boshqaruv bo'limi
          </h1>
          <p className="mt-2 text-sm text-marva-700/75">
            Mahsulotlar, buyurtmalar va mijozlar bazasi
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="block rounded-[28px] bg-white p-5 shadow-soft"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-marva-50 text-marva-700">
            <ClipboardList size={22} />
          </div>
          <h2 className="mt-4 text-xl font-bold text-marva-900">Buyurtmalar</h2>
          <p className="mt-2 text-sm text-marva-700/75">
            Tushgan zakazlar, status va dostavka
          </p>
        </Link>

        <Link
          href="/admin/products"
          className="block rounded-[28px] bg-white p-5 shadow-soft"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-marva-50 text-marva-700">
            <Package size={22} />
          </div>
          <h2 className="mt-4 text-xl font-bold text-marva-900">Mahsulotlar</h2>
          <p className="mt-2 text-sm text-marva-700/75">
            Mahsulot qo'shish, edit va o'chirish
          </p>
        </Link>

        <Link
          href="/admin/customers"
          className="block rounded-[28px] bg-white p-5 shadow-soft"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-marva-50 text-marva-700">
            <Users size={22} />
          </div>
          <h2 className="mt-4 text-xl font-bold text-marva-900">Mijozlar</h2>
          <p className="mt-2 text-sm text-marva-700/75">
            Ro'yxatdan o'tgan foydalanuvchilar bazasi
          </p>
        </Link>
      </Container>

      <BottomNav />
    </div>
  );
}
