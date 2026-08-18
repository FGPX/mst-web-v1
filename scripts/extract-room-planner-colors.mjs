import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import catalog from "../lib/generated/musterring-catalog.json" with { type: "json" };

const physicalCutouts = {
  jana: "physical-front.png",
  "justb-ct100": "physical-natural-oak.png",
  "justb-pm100": "physical-front.png",
  "justb-pm200": "physical-front.png",
  kanto: "physical-front.png",
  "mr-281": "physical-front.png",
  "mr-9445": "physical-front.png",
  "mr-kleo": "physical-front.png",
  "mr-nils": "physical-front.png",
  "mr-pamela": "physical-front.png",
  nara: "physical-natural-oak.png"
};

const cutoutSlugs = new Set(["jana", "justb-ct100", "justb-pm100", "justb-pm200", "kanto", "mr-230", "mr-231", "mr-260", "mr-2665", "mr-270", "mr-280", "mr-281", "mr-285", "mr-4100", "mr-5100", "mr-5111", "mr-720", "mr-9445", "mr-alena", "mr-kleo", "mr-lia", "mr-lucia", "mr-nils", "mr-pamela", "nara"]);

const toHex = (value) => value.toString(16).padStart(2, "0");
const saturation = (red, green, blue) => {
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  return max === 0 ? 0 : (max - min) / max;
};

async function dominantColor(filePath, transparentSource) {
  const { data, info } = await sharp(filePath).resize(80, 80, { fit: "cover" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const bins = new Map();
  for (let offset = 0; offset < data.length; offset += info.channels) {
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    const alpha = data[offset + 3];
    if (alpha < 96 || (red > 236 && green > 236 && blue > 236)) continue;
    const brightness = (red + green + blue) / 3;
    if (brightness < 20) continue;
    const binRed = Math.round(red / 24) * 24;
    const binGreen = Math.round(green / 24) * 24;
    const binBlue = Math.round(blue / 24) * 24;
    const key = `${binRed},${binGreen},${binBlue}`;
    const centrality = transparentSource ? 2 : 1;
    const colorWeight = saturation(red, green, blue) > .08 ? 1.35 : 1;
    const current = bins.get(key) ?? { weight: 0, red: 0, green: 0, blue: 0, count: 0 };
    current.weight += centrality * colorWeight;
    current.red += red;
    current.green += green;
    current.blue += blue;
    current.count += 1;
    bins.set(key, current);
  }
  const winner = [...bins.values()].sort((left, right) => right.weight - left.weight)[0] ?? { red: 139, green: 119, blue: 105, count: 1 };
  const red = Math.round(winner.red / winner.count);
  const green = Math.round(winner.green / winner.count);
  const blue = Math.round(winner.blue / winner.count);
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

const colors = {};
for (const product of catalog.products) {
  const cutoutFile = physicalCutouts[product.slug] ?? "official-front.png";
  const cutoutPath = path.resolve("public/generated-product-views", product.slug, cutoutFile);
  const catalogPath = path.resolve("public", product.images[0].replace(/^\//, ""));
  let source = catalogPath;
  let sourceType = "catalog-image";
  if (cutoutSlugs.has(product.slug)) {
    try {
      await readFile(cutoutPath);
      source = cutoutPath;
      sourceType = "transparent-cutout";
    } catch {}
  }
  try {
    colors[product.slug] = { hex: await dominantColor(source, sourceType === "transparent-cutout"), sourceType };
  } catch {
    colors[product.slug] = { hex: "#8b7769", sourceType: "fallback" };
  }
}

const output = path.resolve("lib/generated/room-planner-colors.json");
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(colors, null, 2)}\n`);
console.log(`Extracted ${Object.keys(colors).length} product color profiles to ${output}`);
