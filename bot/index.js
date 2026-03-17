require("dotenv").config({ path: ".env.local" });

const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = process.env.NEXT_PUBLIC_WEBAPP_URL;
const appBaseUrl = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_WEBAPP_URL;

if (!token) {
  throw new Error("BOT_TOKEN yoki TELEGRAM_BOT_TOKEN kerak");
}

const bot = new TelegramBot(token, { polling: true });

// ─── Helper: fetch with timeout ────────────────────────────────────────────
async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

// ─── /start ────────────────────────────────────────────────────────────────
bot.onText(/\/start/, async (msg) => {
  if (webAppUrl && webAppUrl.startsWith("https://")) {
    await bot.sendMessage(
      msg.chat.id,
      "🦷 MARVA Dental shop mini appga xush kelibsiz!",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🛍️ Mini App ni ochish", web_app: { url: webAppUrl } }],
          ],
        },
      }
    );
    return;
  }
  await bot.sendMessage(
    msg.chat.id,
    "🦷 MARVA Dental shop mini appga xush kelibsiz!"
  );
});

// ─── Web App data ───────────────────────────────────────────────────────────
bot.on("message", async (msg) => {
  if (msg.web_app_data) {
    await bot.sendMessage(msg.chat.id, `✅ Buyurtma olindi: ${msg.web_app_data.data}`);
  }
});

// ─── Callback query (kuryer tugmalari) ─────────────────────────────────────
bot.on("callback_query", async (query) => {
  const chatId = query.message?.chat?.id;
  const messageId = query.message?.message_id;
  const data = query.data || "";

  // BIRINCHI: darhol javob ber (30 soniya limitidan oldin)
  try {
    await bot.answerCallbackQuery(query.id, { text: "⏳ Bajarilmoqda..." });
  } catch (e) {
    console.error("answerCallbackQuery error:", e.message);
  }

  if (!chatId || !messageId) return;

  // action va orderId ni ajrat
  const colonIdx = data.indexOf(":");
  if (colonIdx === -1) {
    return editMessage(chatId, messageId, query.message?.text || "", data, null, "❌ Noto'g'ri format");
  }

  const action = data.slice(0, colonIdx);
  const orderId = Number(data.slice(colonIdx + 1));

  if (!orderId || !["accept", "ontheway", "delivered"].includes(action)) {
    console.log("Invalid action/orderId:", action, orderId);
    return;
  }

  // Status payload
  let statusPayload = {};
  let statusLabel = "";
  let newKeyboard = [];

  if (action === "accept") {
    statusPayload = { delivery_status: "Dastavkaga berildi" };
    statusLabel = "✅ Kuryer qabul qildi";
    newKeyboard = [
      [{ text: "✅ Qabul qilindi", callback_data: `accept:${orderId}` }],
      [{ text: "🚚 Yo'ldaman", callback_data: `ontheway:${orderId}` }],
      [{ text: "📦 Yetkazdim", callback_data: `delivered:${orderId}` }],
    ];
  } else if (action === "ontheway") {
    statusPayload = { delivery_status: "Yo'lda" };
    statusLabel = "🚚 Kuryer yo'lda";
    newKeyboard = [
      [{ text: "✅ Qabul qilindi", callback_data: `accept:${orderId}` }],
      [{ text: "✅ Yo'lda", callback_data: `ontheway:${orderId}` }],
      [{ text: "📦 Yetkazdim", callback_data: `delivered:${orderId}` }],
    ];
  } else if (action === "delivered") {
    statusPayload = { order_status: "Yetkazildi", delivery_status: "Yetkazib berdi" };
    statusLabel = "📦 Yetkazib berildi!";
    newKeyboard = [
      [{ text: "✅ Qabul qilindi", callback_data: `accept:${orderId}` }],
      [{ text: "✅ Yo'lda", callback_data: `ontheway:${orderId}` }],
      [{ text: "✅ Yetkazildi", callback_data: `delivered:${orderId}` }],
    ];
  }

  // API ga status yuborish
  if (appBaseUrl) {
    try {
      const apiUrl = `${appBaseUrl.replace(/\/$/, "")}/api/orders/status`;
      console.log(`[BOT] Calling API: ${apiUrl}`, { orderId, ...statusPayload });

      const res = await fetchWithTimeout(
        apiUrl,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, ...statusPayload }),
        },
        10000 // 10 soniya timeout
      );

      const result = await res.json();
      console.log("[BOT] API result:", result);

      if (!res.ok || !result.success) {
        console.error("[BOT] API error:", result.message);
      }
    } catch (err) {
      console.error("[BOT] API fetch error:", err.message);
    }
  } else {
    console.warn("[BOT] APP_BASE_URL topilmadi — status DB ga yozilmadi");
  }

  // Xabarni yangilash
  try {
    const currentText = query.message?.text || "";
    const updatedText = currentText.includes(statusLabel)
      ? currentText
      : `${currentText}\n\n${statusLabel}`;

    await bot.editMessageText(updatedText, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: { inline_keyboard: newKeyboard },
    });
  } catch (editErr) {
    console.error("[BOT] editMessageText error:", editErr.message);
  }
});

console.log("🤖 Marva bot started!");
