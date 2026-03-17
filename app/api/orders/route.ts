import { NextResponse } from "next/server";

export const runtime = "nodejs";

type OrderItem = {
  product_name?: string;
  quantity?: number;
  price?: number | string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { orderId, fullName, phone, address, note, totalAmount, items } = body ?? {};

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "orderId topilmadi" },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (!botToken || !adminChatId) {
      return NextResponse.json(
        {
          success: false,
          message: "Telegram env topilmadi",
          debug: {
            hasBotToken: !!botToken,
            hasAdminChatId: !!adminChatId,
          },
        },
        { status: 500 }
      );
    }

    const safeItems: OrderItem[] = Array.isArray(items) ? items : [];
    const itemsText =
      safeItems.length > 0
        ? safeItems
            .map((item, index) => {
              const name = item.product_name || "Nomsiz mahsulot";
              const quantity = item.quantity ?? 0;
              const price = item.price ?? 0;
              return `${index + 1}. ${name} — ${quantity} dona — ${price}`;
            })
            .join("\n")
        : "Mahsulotlar yo‘q";

    const text = [
      "🦷 Yangi buyurtma (Admin)",
      "",
      `Order ID: #${orderId}`,
      `Mijoz: ${fullName || "-"}`,
      `Telefon: ${phone || "-"}`,
      `Manzil: ${address || "-"}`,
      `Izoh: ${note || "-"}`,
      `Jami: ${totalAmount || "-"}`,
      "",
      "Mahsulotlar:",
      itemsText,
    ].join("\n");

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: adminChatId,
          text,
        }),
        cache: "no-store",
      }
    );

    const telegramData = await telegramRes.json();

    if (!telegramRes.ok || !telegramData?.ok) {
      return NextResponse.json(
        {
          success: false,
          message: telegramData?.description || "Telegramga yuborilmadi",
          error: telegramData,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("orders route error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Server xatosi" },
      { status: 500 }
    );
  }
}