import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { checkRateLimit } from "@/lib/server-validation";

const requestSchema = z.object({
  confirmed: z.literal(true),
  subject: z.string().trim().min(3).max(180),
  text: z.string().trim().min(20).max(12_000),
  replyTo: z.string().email().optional()
});

export async function POST(request: Request) {
  const key = request.headers.get("x-forwarded-for") ?? "local";
  if (!checkRateLimit(`dealer-email:${key}`, 4, 10 * 60_000).allowed) {
    return NextResponse.json({ error: "Too many email attempts. Please try again later." }, { status: 429 });
  }
  const input = requestSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "A confirmed, valid retailer email draft is required." }, { status: 400 });

  const smtpHost = process.env.EMAIL_HOST;
  const smtpPort = Number(process.env.EMAIL_PORT || 587);
  const smtpUser = process.env.EMAIL_USER;
  const smtpPassword = process.env.EMAIL_PASSWORD;
  const recipient = process.env.RETAILER_HANDOVER_TO || smtpUser;
  const sender = process.env.RETAILER_FROM_EMAIL || smtpUser;

  if (smtpHost && smtpUser && smtpPassword && recipient && sender) {
    try {
      const transport = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        requireTLS: smtpPort === 587,
        auth: { user: smtpUser, pass: smtpPassword }
      });
      const result = await transport.sendMail({
        from: sender,
        to: recipient,
        subject: input.data.subject,
        text: input.data.text,
        ...(input.data.replyTo ? { replyTo: input.data.replyTo } : {})
      });
      if (!result.messageId) throw new Error("SMTP returned no message id.");
      return NextResponse.json({ delivered: true, id: result.messageId, provider: "smtp" });
    } catch (error) {
      console.error("Retailer SMTP delivery failed", error instanceof Error ? error.message : "Unknown SMTP error");
      return NextResponse.json({ error: "SMTP could not deliver the retailer email. Check the Gmail App Password, sender and recipient configuration." }, { status: 502 });
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RETAILER_FROM_EMAIL;
  const to = process.env.RETAILER_HANDOVER_TO;
  if (!apiKey || !from || !to) return NextResponse.json({
    error: "Retailer email delivery is not configured. Configure EMAIL_HOST, EMAIL_PORT, EMAIL_USER and EMAIL_PASSWORD for SMTP, or configure the Resend variables."
  }, { status: 503 });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      subject: input.data.subject,
      text: input.data.text,
      ...(input.data.replyTo ? { reply_to: input.data.replyTo } : {})
    })
  }).catch(() => null);
  const payload = response ? await response.json().catch(() => null) : null;
  if (!response?.ok || !payload?.id) {
    return NextResponse.json({ error: payload?.message ?? "The retailer email could not be delivered." }, { status: response?.status || 502 });
  }
  return NextResponse.json({ delivered: true, id: payload.id, provider: "resend" });
}
