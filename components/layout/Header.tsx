"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[20px] bg-white shadow-[0_10px_25px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
            <Image src="/logo-mark.png" alt="MARVA logo" width={56} height={56} className="h-14 w-14 object-cover" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#4C7A73]">Dental market</p>
            <h1 className="text-[18px] font-bold text-[#12332D]">MARVA Dental shop</h1>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/catalog")} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F7F6] text-[#12332D] shadow-sm">
            <Search size={20} strokeWidth={2.2} />
          </button>
          <button onClick={() => alert("Bildirishnomalar keyin ulanadi")} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F7F6] text-[#12332D] shadow-sm">
            <Bell size={20} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}
