"use client";

import { useEffect } from "react";
import { initTelegramApp } from "@/lib/telegram";

export function TelegramInit() {
  useEffect(() => {
    initTelegramApp();
  }, []);

  return null;
}
