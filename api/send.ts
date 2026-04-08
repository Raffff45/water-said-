import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { name, phone } = req.body;

  const TOKEN = process.env.TG_TOKEN;
  const CHAT_ID = process.env.TG_CHAT_ID;

  const text = `
🔥 Новая заявка
👤 ФИО: ${name}
📞 Телефон: ${phone}
  `;

  try {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
      }),
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false });
  }
}