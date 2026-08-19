import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outputRoot = path.resolve("public/musterring-catalog");
const catalogOutput = path.resolve("lib/generated/musterring-catalog.json");
const dryRun = process.argv.includes("--dry-run");
const maxImagesPerPage = Number(process.env.MUSTERRING_MAX_IMAGES ?? 8);
const verifiedVariantImages = {
  "mr-260": [
    "https://www.musterring.com/fileadmin/_processed_/f/9/csm_sofa_mr260_echtleder_rot_musterring_35259552c0.jpg"
  ]
};

const seedPages = [
  {
    slug: "furniture",
    url: "https://www.musterring.com/en/furniture",
    title: "Musterring furniture overview",
    kind: "editorial"
  },
  {
    slug: "sofas-armchairs",
    url: "https://www.musterring.com/en/furniture/living-room/sofas-armchairs",
    title: "Sofas and armchairs",
    kind: "editorial"
  },
  {
    slug: "homepage",
    url: "https://www.musterring.com/en/",
    title: "Musterring homepage",
    kind: "editorial"
  },
  {
    slug: "justb-pm100",
    url: "https://www.musterring.com/en/furniture/living-room/sofas-armchairs/justb-pm100",
    title: "JUSTB! PM100",
    kind: "product",
    appProductId: "musterring-justb-pm100",
    category: "sofa"
  },
  {
    slug: "justb-pm200",
    url: "https://www.musterring.com/en/furniture/living-room/sofas-armchairs/justb-pm200",
    title: "JUSTB! PM200",
    kind: "product",
    appProductId: "musterring-justb-pm200",
    category: "sofa"
  },
  {
    slug: "mr-kleo",
    url: "https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-kleo",
    title: "MR KLEO",
    kind: "product",
    appProductId: "musterring-mr-kleo",
    category: "armchair"
  },
  {
    slug: "mr-alena",
    url: "https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-alena",
    title: "MR ALENA",
    kind: "product",
    appProductId: "musterring-mr-alena",
    category: "sofa"
  },
  {
    slug: "mr-lia",
    url: "https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-lia",
    title: "MR LIA",
    kind: "product",
    appProductId: "musterring-mr-lia",
    category: "sofa"
  },
  {
    slug: "mr-lucia",
    url: "https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-lucia",
    title: "MR LUCIA",
    kind: "product",
    appProductId: "musterring-mr-lucia",
    category: "sofa"
  },
  {
    slug: "mr-nils",
    url: "https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-nils",
    title: "MR NILS",
    kind: "product",
    appProductId: "musterring-mr-nils",
    category: "armchair"
  },
  {
    slug: "mr-pamela",
    url: "https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-pamela",
    title: "MR PAMELA",
    kind: "product",
    appProductId: "musterring-mr-pamela",
    category: "armchair"
  },
  {
    slug: "mr-260",
    url: "https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-260",
    title: "MR 260",
    kind: "product",
    appProductId: "musterring-mr-260",
    category: "sofa"
  },
  {
    slug: "mr-261",
    url: "https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-261",
    title: "MR 261",
    kind: "product",
    appProductId: "musterring-mr-261",
    category: "armchair"
  },
  {
    slug: "mr-270",
    url: "https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-270",
    title: "MR 270",
    kind: "product",
    appProductId: "p6",
    category: "sofa"
  },
  {
    slug: "mr-1370",
    url: "https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-1370",
    title: "MR 1370",
    kind: "product",
    appProductId: "p2",
    category: "sofa"
  },
  {
    slug: "mr-2490",
    url: "https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-2490",
    title: "MR 2490",
    kind: "product",
    appProductId: "p4",
    category: "sofa"
  },
  {
    slug: "mr-2875",
    url: "https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-2875",
    title: "MR 2875",
    kind: "product",
    appProductId: "p1",
    category: "sofa"
  },
  {
    slug: "mr-9420",
    url: "https://www.musterring.com/en/furniture/living-room/sofas-armchairs/mr-9420",
    title: "MR 9420",
    kind: "product",
    appProductId: "p3",
    category: "sofa"
  }
];

const catalogCollections = [
  {
    url: "https://www.musterring.com/en/furniture/living-room/sofas-armchairs",
    category: "auto"
  },
  {
    url: "https://www.musterring.com/en/furniture/living-room/living-walls-sideboards-co",
    category: "storage"
  },
  {
    url: "https://www.musterring.com/en/furniture/living-room/coffee-tables-side-tables",
    category: "coffee-table"
  },
  {
    url: "https://www.musterring.com/en/furniture/bedroom/bedroom-series",
    category: "bedroom-series"
  },
  {
    url: "https://www.musterring.com/en/furniture/bedroom/beds",
    category: "bed"
  },
  {
    url: "https://www.musterring.com/en/furniture/bedroom/wardrobes",
    category: "wardrobe"
  },
  {
    url: "https://www.musterring.com/en/furniture/dining-room/chairs-tables",
    category: "auto-dining"
  },
  {
    url: "https://www.musterring.com/en/furniture/bathroom/bathroom-series",
    category: "bathroom"
  },
  {
    url: "https://www.musterring.com/en/furniture/kitchen",
    category: "kitchen"
  },
  {
    url: "https://www.musterring.com/en/furniture/outdoor/outdoor-furniture",
    category: "outdoor"
  },
  {
    url: "https://www.musterring.com/en/furniture/home-accessories/small-furniture",
    category: "small-furniture"
  },
  {
    url: "https://www.musterring.com/en/furniture/home-accessories/carpets",
    category: "carpet"
  },
  {
    url: "https://www.musterring.com/en/furniture/home-accessories/lamp-collection",
    category: "lamp"
  },
  {
    url: "https://www.musterring.com/en/furniture/home-accessories/home-textiles",
    category: "home-textile"
  }
];

function titleFromSlug(slug) {
  if (slug.startsWith("justb-")) return slug.replace("justb-", "JUSTB! ").toUpperCase();
  if (slug.startsWith("mr-")) return `MR ${slug.slice(3).replaceAll("-", " ").toUpperCase()}`;
  return slug.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function discoverProductPages() {
  const seededProducts = new Map(
    seedPages.filter((page) => page.kind === "product").map((page) => [page.slug, page])
  );
  const discoveredProducts = [];

  for (const collection of catalogCollections) {
    const html = decodeHtml(await fetchText(collection.url));
    const pathname = new URL(collection.url).pathname.replace(/\/$/, "");
    const prefix = `${pathname}/`;
    const discoveredSlugs = new Set();

    for (const match of html.matchAll(/href=["']([^"'#?]+)["']/gi)) {
      try {
        const url = new URL(match[1], collection.url);
        if (!url.pathname.startsWith(prefix)) continue;
        const slug = url.pathname.slice(prefix.length).replace(/\/$/, "");
        if (slug && !slug.includes("/")) discoveredSlugs.add(slug);
      } catch {
        // Ignore malformed navigation URLs.
      }
    }

    for (const slug of discoveredSlugs) {
      discoveredProducts.push(seededProducts.get(slug) ?? {
        slug,
        url: `${collection.url}/${slug}`,
        title: titleFromSlug(slug),
        kind: "product",
        appProductId: `musterring-${slug}`,
        category: collection.category
      });
    }
  }

  return [
    ...seedPages.filter((page) => page.kind !== "product"),
    ...discoveredProducts
  ];
}

const allowedPageHosts = new Set(["www.musterring.com", "musterring.com"]);
const allowedAssetHosts = [
  "www.musterring.com",
  "musterring.com",
  "cms.musterring.com",
  "media.musterring.com",
  "images.ctfassets.net",
  "assets.ctfassets.net"
];

function isAllowedAssetUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && allowedAssetHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
  } catch {
    return false;
  }
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("\\u002F", "/")
    .replaceAll("\\/", "/")
    .replaceAll("\\u003A", ":")
    .replaceAll("\\u0026", "&")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#039;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&nbsp;", " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function stripHtml(value) {
  return decodeHtml(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function metaContent(html, key, value) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = Object.fromEntries(
      [...match[0].matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)]
        .map((attribute) => [attribute[1].toLowerCase(), decodeHtml(attribute[2])])
    );
    if (attributes[key] === value && attributes.content) return attributes.content.trim();
  }
  return "";
}

function extractProductContent(html, page) {
  const h1 = stripHtml(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
  const description =
    metaContent(html, "name", "description") ||
    metaContent(html, "property", "og:description");
  const detectedModel =
    h1.match(/^(JUSTB!?\s*PM\s?\d+|MATCH IT!|MR\s+\d+)/i)?.[1] ||
    (page.category !== "auto" && h1.toLowerCase().startsWith(page.title.toLowerCase()) ? page.title : "") ||
    h1.match(/^(MR\s+[A-Z][A-Z-]*)/)?.[1];
  const modelCode = detectedModel?.replace(/\s+/g, " ").toUpperCase() ?? page.title;
  const tagline = h1.toLowerCase().startsWith(modelCode.toLowerCase())
    ? h1.slice(modelCode.length).replace(/^[\s–—:|-]+/, "").trim()
    : h1.toLowerCase().startsWith(page.title.toLowerCase())
      ? h1.slice(page.title.length).replace(/^[\s–—:|-]+/, "").trim()
      : h1;
  const categoryCopy = `${h1} ${description}`.toLowerCase();
  const category = page.category === "auto"
    ? (/armchair|recliner|reclining chair|easy chair|beanbag/.test(categoryCopy) ? "armchair" : "sofa")
    : page.category === "auto-dining"
      ? (/chair|armchair|stool|bench/.test(categoryCopy) ? "dining-chair" : "dining-table")
      : page.category;

  return {
    appProductId: page.appProductId,
    slug: page.slug,
    modelCode,
    name: modelCode,
    tagline,
    description: decodeHtml(description),
    category,
    sourceUrl: page.url
  };
}

function extractImageUrls(html, pageUrl) {
  const rankedUrls = new Map();
  const decoded = decodeHtml(html);
  const directPattern = /(?:src|href|content)=["']([^"']+\.(?:avif|webp|jpe?g|png)(?:\?[^"']*)?)["']/gi;
  const srcsetPattern = /(data-)?srcset=["']([^"']+)["']/gi;
  const inlinePattern = /https:\\?\/\\?\/[^"' <>)]+\.(?:avif|webp|jpe?g|png)(?:\?[^"' <>)\\]*)?/gi;

  const addRankedUrl = (value, score = 0) => {
    if (!value || value.startsWith("data:")) return;
    try {
      const url = new URL(value, pageUrl).toString();
      const currentScore = rankedUrls.get(url) ?? Number.NEGATIVE_INFINITY;
      if (score > currentScore) rankedUrls.set(url, score);
    } catch {
      // Ignore malformed candidates from inline scripts.
    }
  };

  for (const match of decoded.matchAll(directPattern)) {
    addRankedUrl(match[1]);
  }

  for (const match of decoded.matchAll(srcsetPattern)) {
    const galleryBonus = match[1] ? 1_000_000 : 0;
    for (const candidate of match[2].split(",")) {
      const parts = candidate.trim().split(/\s+/);
      const width = Number(parts.find((part) => /^\d+w$/i.test(part))?.slice(0, -1) ?? 0);
      addRankedUrl(parts[0], galleryBonus + width);
    }
  }

  for (const match of decoded.matchAll(inlinePattern)) {
    addRankedUrl(match[0].replaceAll("\\/", "/"));
  }

  return [...rankedUrls.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([url]) => url)
    .filter(isAllowedAssetUrl)
    .filter((url) => !/logo|icon|favicon|sprite/i.test(url));
}

function selectImageUrls(html, page) {
  const candidates = extractImageUrls(html, page.url);
  if (page.kind !== "product") return deduplicateImageVariants(candidates).slice(0, maxImagesPerPage);

  const compactSlug = page.slug.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const underscoredSlug = page.slug.replaceAll("-", "_").toLowerCase();
  const modelNumber = page.slug.match(/\d+/)?.[0] ?? "";
  const modelName = compactSlug.replace(/^(?:mr|justb)/, "");
  const productMatches = candidates.filter((candidate) => {
    const pathname = decodeURIComponent(new URL(candidate).pathname).toLowerCase();
    const compactPathname = pathname.replace(/[^a-z0-9]/g, "");
    return compactPathname.includes(compactSlug) ||
      (modelName.length >= 4 && compactPathname.includes(modelName)) ||
      pathname.includes(underscoredSlug) ||
      (modelNumber.length >= 3 && /(?:mr|sofa|sessel)/.test(pathname) && pathname.includes(modelNumber));
  });

  const selected = deduplicateImageVariants(productMatches.length > 0 ? productMatches : candidates);
  const verified = verifiedVariantImages[page.slug] ?? [];
  return [
    ...selected.slice(0, Math.max(0, maxImagesPerPage - verified.length)),
    ...verified
  ];
}

function deduplicateImageVariants(urls) {
  const unique = new Map();
  for (const url of urls) {
    const parsed = new URL(url);
    const fileName = decodeURIComponent(parsed.pathname.split("/").at(-1) ?? "")
      .replace(/_[a-f0-9]{10}(?=\.(?:avif|webp|jpe?g|png)$)/i, "")
      .toLowerCase();
    if (!unique.has(fileName)) unique.set(fileName, url);
  }
  return [...unique.values()];
}

function extensionFrom(contentType, url) {
  if (/png/i.test(contentType)) return ".png";
  if (/webp/i.test(contentType)) return ".webp";
  if (/avif/i.test(contentType)) return ".avif";
  if (/jpe?g/i.test(contentType)) return ".jpg";
  const pathname = new URL(url).pathname.toLowerCase();
  const match = pathname.match(/\.(avif|webp|jpe?g|png)$/);
  return match ? `.${match[1].replace("jpeg", "jpg")}` : ".jpg";
}

async function fetchText(url) {
  const parsed = new URL(url);
  if (!allowedPageHosts.has(parsed.hostname)) throw new Error(`Refusing non-allowlisted page host: ${parsed.hostname}`);
  const response = await fetch(url, { headers: { "user-agent": "MST_WEB demo asset importer" } });
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  return response.text();
}

async function downloadImage(url, filePath) {
  const response = await fetch(url, { headers: { "user-agent": "MST_WEB demo asset importer" } });
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.status}`);
  const contentType = response.headers.get("content-type") ?? "";
  if (!/^image\//i.test(contentType)) throw new Error(`Refusing non-image response from ${url}: ${contentType}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(filePath, bytes);
  return { bytes: bytes.length, contentType };
}

async function importPage(page) {
  console.log(`\n${page.title}: ${page.url}`);
  const html = await fetchText(page.url);
  const imageUrls = selectImageUrls(html, page);
  console.log(`  found ${imageUrls.length} candidate images`);

  const pageDir = path.join(outputRoot, page.slug);
  if (!dryRun) await mkdir(pageDir, { recursive: true });

  const assets = [];
  for (const [index, url] of imageUrls.entries()) {
    const extension = extensionFrom("", url);
    const fileName = `image-${String(index + 1).padStart(2, "0")}${extension}`;
    const relativePath = `/musterring-catalog/${page.slug}/${fileName}`;
    console.log(`  ${dryRun ? "would save" : "saving"} ${relativePath}`);
    let info = { bytes: 0, contentType: "" };
    if (!dryRun) {
      const filePath = path.join(pageDir, fileName);
      info = await downloadImage(url, filePath);
    }
    assets.push({ file: relativePath, sourceUrl: url, ...info });
  }

  const metadata = {
    page: page.url,
    title: page.title,
    importedAt: new Date().toISOString(),
    authorizedForProduction: true,
    permissionBasis: "Client-confirmed Musterring rebranding authorization",
    usageNote: "Authorized Musterring rebrand content. Preserve source URLs and refresh through this importer.",
    assets
  };

  if (!dryRun) {
    await writeFile(path.join(pageDir, "metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`);
  }
  return {
    metadata,
    product: page.kind === "product"
      ? { ...extractProductContent(html, page), images: assets.map((asset) => asset.file) }
      : null
  };
}

async function main() {
  if (!dryRun) await mkdir(outputRoot, { recursive: true });
  const pages = await discoverProductPages();
  console.log(`Discovered ${pages.filter((page) => page.kind === "product").length} authorized product pages.`);
  const imported = [];
  const catalog = [];
  for (const page of pages) {
    try {
      const result = await importPage(page);
      imported.push(result.metadata);
      if (result.product) catalog.push(result.product);
    } catch (error) {
      console.error(`  failed: ${error instanceof Error ? error.message : String(error)}`);
      imported.push({ page: page.url, title: page.title, error: String(error), assets: [] });
    }
  }

  const manifest = {
    importedAt: new Date().toISOString(),
    authorizedForProduction: true,
    permissionBasis: "Client-confirmed Musterring rebranding authorization",
    source: "https://www.musterring.com/",
    pages: imported
  };

  if (!dryRun) {
    await writeFile(path.join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
    await mkdir(path.dirname(catalogOutput), { recursive: true });
    await writeFile(catalogOutput, `${JSON.stringify({
      importedAt: manifest.importedAt,
      authorizedForProduction: true,
      permissionBasis: manifest.permissionBasis,
      products: catalog
    }, null, 2)}\n`);
  }

  const total = imported.reduce((sum, page) => sum + (page.assets?.length ?? 0), 0);
  console.log(`\n${dryRun ? "Dry run complete" : "Import complete"}: ${total} image assets`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
