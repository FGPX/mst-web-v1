import { z } from "zod";

const cleanText = (maximum: number, minimum = 0) => z.string().trim().min(minimum).max(maximum).transform((value) => value.replace(/[<>]/g, ""));

export const handoverRequestSchema = z.object({
  name: cleanText(120, 1),
  email: z.string().trim().email().max(254),
  phone: cleanText(40).optional().default(""),
  message: cleanText(2000).optional().default(""),
  requestType: z.enum([
    "Book a Consultation",
    "Request a Quote",
    "Check Showroom Availability",
    "Request a Material Sample",
    "Material Consultation",
    "Technical Fit Check",
    "Delivery Planning"
  ]),
  dealerId: cleanText(80, 1),
  consent: z.literal(true),
  aiSummary: cleanText(3000).optional().default(""),
  projectData: z.record(z.unknown()).optional().default({})
});

export const uploadMetadataSchema = z.object({
  name: cleanText(180).refine((value) => !/\.(exe|bat|cmd|ps1|js|msi|com)$/i.test(value), "Executable files are not accepted."),
  type: z.enum(["image/jpeg", "image/png", "image/webp"]),
  size: z.number().int().positive().max(10 * 1024 * 1024),
  consent: z.literal(true)
});

const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (current.count >= limit) return { allowed: false, remaining: 0 };
  current.count += 1;
  return { allowed: true, remaining: limit - current.count };
}
