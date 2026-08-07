import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const catalog = JSON.parse(await readFile(path.join(root, "lib/generated/musterring-catalog.json"), "utf8"));
const manifest = JSON.parse(await readFile(path.join(root, "public/musterring-catalog/manifest.json"), "utf8"));
const output = {};
const normalize = (value) => String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");
const hashFile = async (publicPath) => {
  try {
    const bytes = await readFile(path.join(root, "public", publicPath.replace(/^\//, "")));
    return createHash("sha256").update(bytes).digest("hex");
  } catch {
    return null;
  }
};

for (const product of catalog.products) {
  for (const image of product.images) {
    const hash = await hashFile(image);
    if (hash) output[hash] = product.appProductId;
  }
}

const aliases = catalog.products.flatMap((product) => [
  normalize(product.slug),
  normalize(product.modelCode),
  normalize(product.name)
].filter((alias) => alias.length >= 5).map((alias) => ({ alias, productId: product.appProductId })))
  .sort((left, right) => right.alias.length - left.alias.length);

for (const page of manifest.pages) {
  const pageProduct = catalog.products.find((product) => product.sourceUrl === page.page);
  for (const asset of page.assets) {
    const source = normalize(asset.sourceUrl);
    const inferred = pageProduct?.appProductId ?? aliases.find(({ alias }) => source.includes(alias))?.productId;
    if (!inferred) continue;
    const hash = await hashFile(asset.file);
    if (hash && !output[hash]) output[hash] = inferred;
  }
}

await writeFile(
  path.join(root, "lib/generated/visual-image-hashes.json"),
  `${JSON.stringify(output, null, 2)}\n`,
  "utf8"
);
console.log(`Generated ${Object.keys(output).length} catalogue image fingerprints.`);
