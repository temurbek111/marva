"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Container } from "@/components/ui/Container";
import {
  User,
  Phone,
  MapPin,
  Send,
  ShieldCheck,
  LogOut,
  Calendar,
  Users,
  Building2,
  Hash,
} from "lucide-react";

type SavedUser = {
  fullName: string;
  phone: string;
  address: string;
  telegramUsername: string;
  telegramId?: number | null;
  age?: number | string | null;
  gender?: string | null;
  customerType?: string | null;
  clinicName?: string | null;
};

function getGenderLabel(value?: string | null) {
  if (!value) return "Kiritilmagan";
  if (value === "male") return "Erkak";
  if (value === "female") return "Ayol";
  // Eski ma'lumotlar uchun fallback
  if (value === "Erkak") return "Erkak";
  if (value === "Ayol") return "Ayol";
  return value;
}

function getCustomerTypeLabel(value?: string | null) {
  if (!value) return "Kiritilmagan";

  const map: Record<string, string> = {
    // Yangi inglizcha kalitlar
    dentist: "Stomatolog",
    clinic_staff: "Klinika xodimi",
    clinic_owner: "Klinika egasi",
    company_representative: "Kompaniya vakili",
    regular_customer: "Oddiy mijoz",
    // Eski o'zbekcha qiymatlar uchun fallback
    Stomatolog: "Stomatolog",
    "Klinika xodimi": "Klinika xodimi",
    "Klinika egasi": "Klinika egasi",
    "Kompaniya vakili": "Kompaniya vakili",
    "Oddiy mijoz": "Oddiy mijoz",
  };

  return map[value] || value;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<SavedUser | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("marva-user");

    if (!saved) {
      router.push("/auth");
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      setUser(parsed);
    } catch {
      router.push("/auth");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("marva-user");
    router.push("/auth");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#F7FAF9_0%,#EEF3F1_55%,#E8EFED_100%)]">
        <Header />
        <Container className="py-10">
          <div className="rounded-[32px] bg-white/95 p-6 text-center shadow-[0_20px_50px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
            <p className="text-sm text-[#5D7E78]">Yuklanmoqda...</p>
          </div>
        </Container>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F7FAF9_0%,#EEF3F1_55%,#E8EFED_100%)] pb-28">
      <Header />

      <Container className="py-5 space-y-5">
        <div className="overflow-hidden rounded-[32px] bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
          <div className="bg-[#004F45] px-5 pb-6 pt-5 text-white">
            <p className="text-sm text-white/75">Profil</p>
            <h1 className="mt-1 text-[28px] font-bold leading-9">
              {user.fullName || "Foydalanuvchi"}
            </h1>
            <p className="mt-2 text-sm text-white/80">
              {user.telegramUsername || "@username_mavjud_emas"}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
              <ShieldCheck size={16} />
              Ro'yxatdan o'tgan foydalanuvchi
            </div>
          </div>

          <div className="space-y-3 p-5">
            <div className="flex items-center gap-3 rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3F1] text-[#004F45]">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs text-[#5D7E78]">Ism</p>
                <p className="font-semibold text-[#12332D]">{user.fullName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3F1] text-[#004F45]">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs text-[#5D7E78]">Telefon</p>
                <p className="font-semibold text-[#12332D]">{user.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3F1] text-[#004F45]">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-[#5D7E78]">Manzil</p>
                <p className="font-semibold text-[#12332D]">
                  {user.address || "Manzil kiritilmagan"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3F1] text-[#004F45]">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs text-[#5D7E78]">Yosh</p>
                <p className="font-semibold text-[#12332D]">
                  {user.age || "Kiritilmagan"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3F1] text-[#004F45]">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs text-[#5D7E78]">Jins</p>
                <p className="font-semibold text-[#12332D]">
                  {getGenderLabel(user.gender)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3F1] text-[#004F45]">
                <Hash size={20} />
              </div>
              <div>
                <p className="text-xs text-[#5D7E78]">Kimligi</p>
                <p className="font-semibold text-[#12332D]">
                  {getCustomerTypeLabel(user.customerType)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3F1] text-[#004F45]">
                <Building2 size={20} />
              </div>
              <div>
                <p className="text-xs text-[#5D7E78]">Klinika / kompaniya</p>
                <p className="font-semibold text-[#12332D]">
                  {user.clinicName || "Kiritilmagan"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3F1] text-[#004F45]">
                <Send size={20} />
              </div>
              <div>
                <p className="text-xs text-[#5D7E78]">Telegram</p>
                <p className="font-semibold text-[#12332D]">
                  {user.telegramUsername || "@username_mavjud_emas"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3F1] text-[#004F45]">
                <Hash size={20} />
              </div>
              <div>
                <p className="text-xs text-[#5D7E78]">Telegram ID</p>
                <p className="font-semibold text-[#12332D]">
                  {user.telegramId || "Mavjud emas"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] bg-white/95 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
          <h2 className="text-xl font-bold text-[#12332D]">Kontaktlar</h2>

          <div className="mt-4 space-y-3">
            <div className="rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
              <p className="text-xs text-[#5D7E78]">Telefon 1</p>
              <p className="mt-1 font-semibold text-[#12332D]">+998 99 411 30 20</p>
            </div>

            <div className="rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
              <p className="text-xs text-[#5D7E78]">Telefon 2</p>
              <p className="mt-1 font-semibold text-[#12332D]">+998 55 514 80 80</p>
            </div>

            <div className="rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
              <p className="text-xs text-[#5D7E78]">Telegram</p>
              <p className="mt-1 font-semibold text-[#12332D]">@marva_dental_shop</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#004F45] text-base font-semibold text-white shadow-[0_14px_28px_rgba(0,79,69,0.22)] ring-1 ring-white/10"
          >
            <LogOut size={20} />
            Chiqish
          </button>
        </div>
      </Container>

      <BottomNav />
    </div>
  );
}
