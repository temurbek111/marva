"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Container } from "@/components/ui/Container";
import { getTelegramUser } from "@/lib/telegram";
import { supabase } from "@/lib/supabase";
import {
  Phone,
  Send,
  User,
  MapPin,
  ShieldCheck,
  Building2,
  Calendar,
} from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const tgUser = useMemo(() => getTelegramUser(), []);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("marva-user");
    if (saved) {
      router.push("/profile");
      return;
    }
    if (tgUser) {
      const name = `${tgUser.first_name ?? ""} ${tgUser.last_name ?? ""}`.trim();
      setFullName(name || "Telegram foydalanuvchi");
      setTelegramUsername(tgUser.username ? `@${tgUser.username}` : "");
    }
  }, [router, tgUser]);

  const saveUser = async () => {
    if (!fullName.trim()) { alert("Ismni kiriting"); return; }
    if (!phone.trim()) { alert("Telefon raqamni kiriting"); return; }
    if (!address.trim()) { alert("Manzilni kiriting"); return; }
    if (!supabase) { alert("Supabase ulanmagan"); return; }

    setLoading(true);

    try {
      const telegramId = tgUser?.id ? Number(tgUser.id) : null;

      const payload = {
        full_name: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        age: age ? Number(age) : null,
        gender: gender || null,
        customer_type: customerType || null,
        clinic_name: clinicName.trim() || null,
        telegram_username: telegramUsername.trim() || null,
        telegram_id: telegramId,
      };

      let data: any = null;
      let error: any = null;

      if (telegramId) {
        // Telegram orqali kirgan — upsert (qayta kirishda duplicate xato bo'lmaydi)
        const result = await supabase
          .from("users")
          .upsert(payload, { onConflict: "telegram_id" })
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else {
        // Brauzerda test — oddiy insert
        const result = await supabase
          .from("users")
          .insert(payload)
          .select()
          .single();
        data = result.data;
        error = result.error;
      }

      if (error) {
        alert(error.message);
        return;
      }

      localStorage.setItem(
        "marva-user",
        JSON.stringify({
          id: data.id,
          fullName: data.full_name,
          phone: data.phone,
          address: data.address,
          age: data.age,
          gender: data.gender,
          customerType: data.customer_type,
          clinicName: data.clinic_name,
          telegramUsername: data.telegram_username,
          telegramId: data.telegram_id,
        })
      );

      router.push("/profile");
    } catch (err: any) {
      alert(err?.message || "Xato yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F7FAF9_0%,#EEF3F1_55%,#E8EFED_100%)] pb-28">
      <Header />

      <Container className="py-5 space-y-5">
        <div className="overflow-hidden rounded-[32px] bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
          <div className="bg-[#004F45] px-5 pb-6 pt-5 text-white">
            <p className="text-sm text-white/75">Kirish / Ro'yxatdan o'tish</p>
            <h1 className="mt-1 text-[28px] font-bold leading-9">
              Ma'lumotlaringizni kiriting
            </h1>
            <p className="mt-2 text-sm text-white/80">
              {tgUser?.id
                ? `✅ Telegram ulandi: ${tgUser.first_name}`
                : "ℹ️ Brauzerda ochilgan — Telegram ichida ochsangiz avtomatik ulanadi"}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
              <ShieldCheck size={16} />
              Xavfsiz kirish
            </div>
          </div>

          <div className="space-y-4 p-5">
            <div className="space-y-3">
              {/* ISM */}
              <div className="rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
                <label className="mb-2 flex items-center gap-2 text-xs text-[#5D7E78]">
                  <User size={14} /> Ism Familiya
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ismingizni kiriting"
                  className="h-12 w-full rounded-2xl border border-black/5 bg-white px-4 outline-none"
                />
              </div>

              {/* TELEFON */}
              <div className="rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
                <label className="mb-2 flex items-center gap-2 text-xs text-[#5D7E78]">
                  <Phone size={14} /> Telefon
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="h-12 w-full rounded-2xl border border-black/5 bg-white px-4 outline-none"
                />
              </div>

              {/* MANZIL */}
              <div className="rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
                <label className="mb-2 flex items-center gap-2 text-xs text-[#5D7E78]">
                  <MapPin size={14} /> Manzil
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Toshkent, O'zbekiston"
                  className="h-12 w-full rounded-2xl border border-black/5 bg-white px-4 outline-none"
                />
              </div>

              {/* YOSH + JINS */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
                  <label className="mb-2 flex items-center gap-2 text-xs text-[#5D7E78]">
                    <Calendar size={14} /> Yosh
                  </label>
                  <input
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="28"
                    type="number"
                    className="h-12 w-full rounded-2xl border border-black/5 bg-white px-4 outline-none"
                  />
                </div>
                <div className="rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
                  <label className="mb-2 flex items-center gap-2 text-xs text-[#5D7E78]">
                    <User size={14} /> Jins
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-black/5 bg-white px-4 outline-none"
                  >
                    <option value="">Tanlang</option>
                    <option value="Erkak">Erkak</option>
                    <option value="Ayol">Ayol</option>
                  </select>
                </div>
              </div>

              {/* KIMLIGI */}
              <div className="rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
                <label className="mb-2 flex items-center gap-2 text-xs text-[#5D7E78]">
                  <Building2 size={14} /> Kimligi
                </label>
                <select
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-black/5 bg-white px-4 outline-none"
                >
                  <option value="">Tanlang</option>
                  <option value="Stomatolog">Stomatolog</option>
                  <option value="Klinika xodimi">Klinika xodimi</option>
                  <option value="Klinika egasi">Klinika egasi</option>
                  <option value="Kompaniya vakili">Kompaniya vakili</option>
                  <option value="Oddiy mijoz">Oddiy mijoz</option>
                </select>
              </div>

              {/* KLINIKA */}
              <div className="rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
                <label className="mb-2 flex items-center gap-2 text-xs text-[#5D7E78]">
                  <Building2 size={14} /> Klinika / kompaniya nomi
                </label>
                <input
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  placeholder="Dental Clinic"
                  className="h-12 w-full rounded-2xl border border-black/5 bg-white px-4 outline-none"
                />
              </div>

              {/* TELEGRAM USERNAME */}
              <div className="rounded-[22px] bg-[#F8FBFA] p-4 ring-1 ring-black/5">
                <label className="mb-2 flex items-center gap-2 text-xs text-[#5D7E78]">
                  <Send size={14} /> Telegram username
                </label>
                <input
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="@username"
                  className="h-12 w-full rounded-2xl border border-black/5 bg-white px-4 outline-none"
                />
              </div>
            </div>

            <button
              onClick={saveUser}
              disabled={loading}
              className="flex h-14 w-full items-center justify-center rounded-full bg-[#004F45] text-base font-semibold text-white shadow-[0_14px_28px_rgba(0,79,69,0.22)] disabled:opacity-60"
            >
              {loading ? "Saqlanmoqda..." : "Davom etish"}
            </button>
          </div>
        </div>
      </Container>

      <BottomNav />
    </div>
  );
}
