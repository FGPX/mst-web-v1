import { dealers, materials, products } from "./data";
import { productImages } from "./musterring-assets";

/**
 * Builds the handover email the retailer receives when a customer finishes the
 * assistant journey.
 *
 * The point of this email is that the retailer does not start from zero. By the
 * time it lands, the customer has already stated their requirements, been shown
 * verified options, picked the ones they liked, seen them in their own room and
 * chosen a consultation slot. All of that has to arrive in one readable page —
 * with the pictures the customer actually chose, in their own words, and with
 * an honest note about which facts are catalogue-verified and which still need
 * the retailer to confirm.
 */

export type RetailerEmailInput = {
  reference: string;
  customer: { firstName: string; lastName: string; email: string; phone: string; notes: string };
  dealerId: string;
  /** Chips such as "sofa", "max 200 cm wide", "beige", "pets in the home". */
  briefSummary: string[];
  /** The customer's own sentences, unedited. */
  quotes: string[];
  /** Products the customer explicitly selected, most relevant first. */
  productIds: string[];
  materialIds: string[];
  /** Data URL or absolute URL of the generated room visualization. */
  roomImage?: string;
  appointment: { mode: string; date: string; time: string };
  /** Prepared consultation summary from the retailer-summary service. */
  aiSummary: string;
  /** Origin used to turn catalogue image paths into absolute URLs. */
  origin: string;
};

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const absolute = (origin: string, path: string) =>
  /^(?:https?:|data:)/i.test(path) ? path : `${origin.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;

const mmToCm = (value: number) => Math.round(value / 10);

/** Only facts the catalogue actually verifies are stated as facts. */
function verifiedSpecs(product: (typeof products)[number]) {
  const specs: Array<[string, string]> = [];
  if (product.verifiedFacts.dimensions) specs.push(["Footprint", `${mmToCm(product.widthMm)} × ${mmToCm(product.depthMm)} × ${mmToCm(product.heightMm)} cm`]);
  if (product.verifiedFacts.seatHeight) specs.push(["Seat height", `${mmToCm(product.seatHeightMm)} cm`]);
  if (product.numberOfSeatsVerified) specs.push(["Seats", String(product.numberOfSeats)]);
  if (product.verifiedFacts.colors.length) specs.push(["Verified colours", product.verifiedFacts.colors.join(", ")]);
  if (product.verifiedFacts.materialTypes.length) specs.push(["Material", product.verifiedFacts.materialTypes.join(", ")]);
  if (product.verifiedFacts.modular && product.modular) specs.push(["Modular", "yes"]);
  return specs;
}

/** Requirements the customer stated that the catalogue cannot confirm. */
function openPoints(input: RetailerEmailInput) {
  const chosen = input.productIds.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const points: string[] = [];
  if (chosen.some((product) => product && !product.verifiedFacts.dimensions)) points.push("Exact dimensions for at least one selected product are not published in the connected catalogue.");
  if (chosen.some((product) => product && !product.verifiedFacts.colors.length)) points.push("The verified colour range is missing for at least one selected product.");
  if (chosen.some((product) => product && !product.verifiedFacts.easyCare)) points.push("No easy-care rating is published, although the customer asked about cleaning.");
  points.push("Price, availability, delivery and the final appointment time still require your confirmation.");
  return points;
}

export function buildRetailerEmail(input: RetailerEmailInput) {
  const dealer = dealers.find((candidate) => candidate.id === input.dealerId) ?? dealers[0];
  const chosen = input.productIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is (typeof products)[number] => Boolean(product));
  const chosenMaterials = input.materialIds
    .map((id) => materials.find((material) => material.id === id))
    .filter((material): material is (typeof materials)[number] => Boolean(material));
  const fullName = `${input.customer.firstName} ${input.customer.lastName}`.trim();
  const appointment = `${input.appointment.mode} · ${input.appointment.date || "date to confirm"} · ${input.appointment.time}`;
  const points = openPoints(input);

  const subject = `Musterring consultation ${input.reference} — ${fullName || "new customer"}${chosen.length ? `, ${chosen.length} product${chosen.length > 1 ? "s" : ""} selected` : ""}`;

  /* ---------------------------------------------------------------- text -- */
  const text = [
    `MUSTERRING CONSULTATION REQUEST — ${input.reference}`,
    ``,
    `CUSTOMER`,
    `  ${fullName || "(name not given)"}`,
    `  ${input.customer.email}${input.customer.phone ? ` · ${input.customer.phone}` : ""}`,
    `  Retailer: ${dealer.name}, ${dealer.city}`,
    `  Preferred appointment: ${appointment}`,
    ``,
    `WHAT THEY ARE LOOKING FOR`,
    input.briefSummary.length ? `  ${input.briefSummary.join(" · ")}` : `  (no structured brief captured)`,
    ``,
    ...(input.quotes.length ? [`IN THEIR OWN WORDS`, ...input.quotes.map((quote) => `  "${quote}"`), ``] : []),
    `SELECTED PRODUCTS (${chosen.length})`,
    ...(chosen.length
      ? chosen.flatMap((product) => [
        `  ${product.modelCode} — ${product.name}`,
        ...verifiedSpecs(product).map(([label, value]) => `      ${label}: ${value}`),
        `      ${absolute(input.origin, `/furniture/${product.slug}`)}`
      ])
      : [`  (none selected)`]),
    ``,
    ...(chosenMaterials.length ? [`MATERIALS OF INTEREST`, ...chosenMaterials.map((material) => `  ${material.name} (${material.type})`), ``] : []),
    ...(input.customer.notes ? [`MESSAGE FROM THE CUSTOMER`, `  ${input.customer.notes}`, ``] : []),
    `PREPARED SUMMARY`,
    `  ${input.aiSummary}`,
    ``,
    `STILL TO CONFIRM`,
    ...points.map((point) => `  - ${point}`),
    ``,
    `Reply directly to this email to reach the customer.`
  ].join("\n");

  /* ---------------------------------------------------------------- html -- */
  const productCards = chosen.map((product) => {
    const image = absolute(input.origin, productImages(product.id)[0] ?? "");
    const specs = verifiedSpecs(product);
    return `
      <tr>
        <td style="padding:0 0 14px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2ddd4;border-radius:10px;overflow:hidden;background:#ffffff">
            <tr>
              <td width="180" valign="top" style="padding:0">
                <img src="${escape(image)}" alt="" width="180" style="display:block;width:180px;height:auto;object-fit:cover" />
              </td>
              <td valign="top" style="padding:16px 18px;font-family:Helvetica,Arial,sans-serif">
                <div style="font:700 15px/1.2 Helvetica,Arial,sans-serif;color:#191815;letter-spacing:.04em">${escape(product.modelCode)}</div>
                <div style="font:400 13px/1.45 Helvetica,Arial,sans-serif;color:#6d675f;margin:3px 0 10px">${escape(product.name)}</div>
                ${specs.length ? `<table role="presentation" cellpadding="0" cellspacing="0" style="font:400 12px/1.6 Helvetica,Arial,sans-serif;color:#35332f">
                  ${specs.map(([label, value]) => `<tr><td style="padding-right:12px;color:#8a847b;white-space:nowrap">${escape(label)}</td><td><strong style="font-weight:600">${escape(value)}</strong></td></tr>`).join("")}
                </table>` : `<div style="font:400 12px/1.5 Helvetica,Arial,sans-serif;color:#a08b74">No verified specification published — confirm with the customer.</div>`}
                <a href="${escape(absolute(input.origin, `/furniture/${product.slug}`))}" style="display:inline-block;margin-top:12px;font:600 12px/1 Helvetica,Arial,sans-serif;color:#845238;text-decoration:none">Open product page &rarr;</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
  }).join("");

  const section = (title: string, body: string) => `
    <tr><td style="padding:26px 28px 0">
      <div style="font:700 10px/1 Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#a29a90;padding-bottom:12px">${escape(title)}</div>
      ${body}
    </td></tr>`;

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escape(subject)}</title></head>
<body style="margin:0;padding:24px 12px;background:#f2efe9;font-family:Helvetica,Arial,sans-serif;color:#191815">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:640px;max-width:100%;background:#fbf9f4;border:1px solid #e2ddd4;border-radius:14px;overflow:hidden">

  <tr><td style="padding:26px 28px;background:#20211f;color:#f7f4ee">
    <div style="font:700 10px/1 Helvetica,Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#c48261">Musterring · consultation request</div>
    <div style="font:400 26px/1.2 Georgia,serif;margin:10px 0 4px">${escape(fullName || "New customer")}</div>
    <div style="font:400 13px/1.5 Helvetica,Arial,sans-serif;color:#b4afa7">Reference ${escape(input.reference)} · ${escape(dealer.name)}, ${escape(dealer.city)}</div>
  </td></tr>

  <tr><td style="padding:18px 28px;background:#ece7de;font:400 13px/1.6 Helvetica,Arial,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding-right:16px"><span style="color:#8a847b">Email</span><br /><a href="mailto:${escape(input.customer.email)}" style="color:#191815;font-weight:600;text-decoration:none">${escape(input.customer.email)}</a></td>
        ${input.customer.phone ? `<td style="padding-right:16px"><span style="color:#8a847b">Phone</span><br /><strong>${escape(input.customer.phone)}</strong></td>` : ""}
        <td><span style="color:#8a847b">Preferred appointment</span><br /><strong>${escape(appointment)}</strong></td>
      </tr>
    </table>
  </td></tr>

  ${section("What they are looking for", input.briefSummary.length
    ? `<div>${input.briefSummary.map((chip) => `<span style="display:inline-block;margin:0 6px 6px 0;padding:6px 11px;border:1px solid #d8d2c8;border-radius:999px;background:#ffffff;font:600 12px/1 Helvetica,Arial,sans-serif;color:#35332f">${escape(chip)}</span>`).join("")}</div>`
    : `<div style="font:400 13px/1.6 Helvetica,Arial,sans-serif;color:#6d675f">No structured brief was captured.</div>`)}

  ${input.quotes.length ? section("In their own words",
    input.quotes.map((quote) => `<blockquote style="margin:0 0 10px;padding:12px 16px;border-left:3px solid #c48261;background:#ffffff;border-radius:0 8px 8px 0;font:400 13px/1.6 Georgia,serif;color:#35332f">&ldquo;${escape(quote)}&rdquo;</blockquote>`).join("")) : ""}

  ${chosen.length ? section(`Products the customer selected (${chosen.length})`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${productCards}</table>`) : ""}

  ${input.roomImage ? section("Their room, visualised with these products",
    `<img src="${escape(input.roomImage)}" alt="Room visualisation generated for the customer" width="584" style="display:block;width:100%;max-width:584px;height:auto;border-radius:10px;border:1px solid #e2ddd4" />
     <div style="font:400 11px/1.5 Helvetica,Arial,sans-serif;color:#8a847b;padding-top:8px">Inspirational visualisation generated from the customer's own photo. Not a fit confirmation.</div>`) : ""}

  ${chosenMaterials.length ? section("Materials of interest",
    `<div>${chosenMaterials.map((material) => `<span style="display:inline-block;margin:0 6px 6px 0;padding:6px 11px;border:1px solid #d8d2c8;border-radius:6px;background:#ffffff;font:600 12px/1 Helvetica,Arial,sans-serif">${escape(material.name)} <span style="color:#8a847b;font-weight:400">${escape(material.type)}</span></span>`).join("")}</div>`) : ""}

  ${input.customer.notes ? section("Message from the customer",
    `<div style="padding:14px 16px;background:#ffffff;border:1px solid #e2ddd4;border-radius:8px;font:400 13px/1.65 Helvetica,Arial,sans-serif">${escape(input.customer.notes)}</div>`) : ""}

  ${section("Prepared summary",
    `<div style="font:400 13px/1.7 Helvetica,Arial,sans-serif;color:#35332f">${escape(input.aiSummary)}</div>`)}

  ${section("Still to confirm with the customer",
    `<ul style="margin:0;padding-left:18px;font:400 13px/1.7 Helvetica,Arial,sans-serif;color:#6d675f">${points.map((point) => `<li>${escape(point)}</li>`).join("")}</ul>`)}

  <tr><td style="padding:26px 28px 30px">
    <a href="mailto:${escape(input.customer.email)}?subject=${encodeURIComponent(`Re: your Musterring consultation ${input.reference}`)}" style="display:inline-block;padding:13px 22px;background:#845238;color:#ffffff;border-radius:8px;font:600 13px/1 Helvetica,Arial,sans-serif;text-decoration:none">Reply to ${escape(input.customer.firstName || "the customer")}</a>
  </td></tr>

  <tr><td style="padding:16px 28px 22px;border-top:1px solid #e2ddd4;font:400 11px/1.6 Helvetica,Arial,sans-serif;color:#a29a90">
    Prepared by the Musterring Assistant from the customer's own conversation. Every product fact shown is catalogue-verified; anything unpublished is listed under &ldquo;still to confirm&rdquo;.
  </td></tr>

</table></td></tr></table>
</body></html>`;

  return { subject, text, html, replyTo: input.customer.email };
}
