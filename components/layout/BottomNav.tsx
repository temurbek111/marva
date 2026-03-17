"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid2X2, ShoppingCart, User } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/catalog", label: "Katalog", icon: Grid2X2 },
  { href: "/cart", label: "Savat", icon: ShoppingCart },
  { href: "/profile", label: "Profil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-around px-3 py-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[78px] flex-col items-center justify-center rounded-[20px] px-3 py-2.5 transition-all duration-200 ${
                active
                  ? "bg-[#004F45] text-white shadow-[0_14px_28px_rgba(0,79,69,0.22)] ring-1 ring-white/10"
                  : "text-[#4F6F69]"
              }`}
            >
              <Icon size={20} strokeWidth={2.2} />
              <span className="mt-1 text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
