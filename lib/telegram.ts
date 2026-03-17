"use client";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        colorScheme?: "light" | "dark";
        initDataUnsafe?: {
          user?: {
            id?: number;
            first_name?: string;
            last_name?: string;
            username?: string;
          };
        };
      };
    };
  }
}

export function getTelegramUser() {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp?.initDataUnsafe?.user ?? null;
}

export function initTelegramApp() {
  if (typeof window === "undefined") return;
  const app = window.Telegram?.WebApp;
  if (!app) return;
  app.ready();
  app.expand();
}
