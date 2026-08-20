import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const outputRoot = path.resolve("public/musterring-catalog");
const catalogOutput = path.resolve("lib/generated/musterring-catalog.json");
const reportOutput = path.resolve("content-import/normalized/musterring-catalog-report.json");
const englishSitemapUrl = "https://www.musterring.com/en/s/pages/sitemap.xml";
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

function canonicalProductSlug(value) {
  if (value === "mr4010-/-t4010-1") return "hannis";
  return value
    .replace(/^translate-to-en-/, "")
    .replace(/^translate-to-english-/, "")
    .replace(/-\/-/g, "-")
    .replace(/[^a-z0-9-]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function sitemapCategory(pathname) {
  if (/\/living-room\/sofas-armchairs\//.test(pathname)) return "auto";
  if (/\/living-room\/living-walls-sideboards-co\//.test(pathname)) return "storage";
  if (/\/living-room\/coffee-tables-side-tables\//.test(pathname)) return "coffee-table";
  if (/\/bedroom\/bedroom-series\//.test(pathname)) return "bedroom-series";
  if (/\/bedroom\/beds\//.test(pathname)) return "bed";
  if (/\/bedroom\/wardrobes\//.test(pathname)) return "wardrobe";
  if (/\/hallway\/wardrobes\//.test(pathname)) return "storage";
  if (/\/dining-room\/chairs-tables\//.test(pathname)) return "auto-dining";
  if (/\/bathroom\//.test(pathname)) return "bathroom";
  if (pathname === "/en/furniture/kitchen") return "kitchen";
  if (/\/outdoor\/outdoor-furniture\//.test(pathname)) return "outdoor";
  if (/\/home-accessories\/small-furniture\//.test(pathname)) return "small-furniture";
  if (/\/home-accessories\/carpets\//.test(pathname)) return "carpet";
  if (/\/home-accessories\/lamp-collection\//.test(pathname)) return "lamp";
  if (/\/home-accessories\/home-textiles(?:-1)?(?:\/|$)/.test(pathname)) return "home-textile";
  return null;
}

function sitemapProductTitle(slug) {
  if (slug === "kitchen") return "Musterring Kitchens";
  if (slug === "home-textiles") return "Musterring Home Textiles";
  if (slug === "kanto-dielen") return "KANTO-DIELEN";
  return titleFromSlug(slug);
}

async function discoverProductPages() {
  const seededProducts = new Map(
    seedPages.filter((page) => page.kind === "product").map((page) => [page.slug, page])
  );
  const discoveredProducts = new Map();

  for (const collection of catalogCollections) {
    const html = decodeHtml(await fetchText(collection.url));
    const pathname = new URL(collection.url).pathname.replace(/\/$/, "");
    const prefix = `${pathname}/`;
    const discoveredSlugs = new Map();

    for (const match of html.matchAll(/<a\b[^>]*href=["']([^"'#?]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
      try {
        const url = new URL(match[1], collection.url);
        if (!url.pathname.startsWith(prefix)) continue;
        const rawSlug = url.pathname.slice(prefix.length).replace(/\/$/, "");
        if (!rawSlug || rawSlug.split("/").length > 3) continue;
        const cardTitle = stripHtml(match[2].match(/<span\b[^>]*class=["'][^"']*text-link["'][^>]*>([\s\S]*?)<\/span>/i)?.[1] ?? "")
          .replace(/\s*\|\s*NEW\s*$/i, "")
          .trim();
        discoveredSlugs.set(rawSlug, cardTitle);
      } catch {
        // Ignore malformed navigation URLs.
      }
    }

    for (const [rawSlug, cardTitle] of discoveredSlugs) {
      const slug = canonicalProductSlug(rawSlug);
      const seeded = seededProducts.get(slug) ?? seededProducts.get(rawSlug);
      const page = seeded ?? {
        slug,
        url: `${collection.url}/${rawSlug}`,
        title: cardTitle || titleFromSlug(slug),
        kind: "product",
        appProductId: `musterring-${slug}`,
        category: collection.category
      };
      const existing = discoveredProducts.get(slug);
      if (!existing || (existing.url.includes("translate-to-en-") && !page.url.includes("translate-to-en-"))) {
        discoveredProducts.set(slug, page);
      }
    }
  }

  const sitemapXml = await fetchText(englishSitemapUrl);
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
    .map((match) => decodeHtml(match[1]).trim().replace(/\/$/, ""))
    .filter((value) => {
      try {
        return new URL(value).pathname.startsWith("/en/furniture/");
      } catch {
        return false;
      }
    });
  const sitemapLeaves = sitemapUrls.filter((url) => !sitemapUrls.some((candidate) => candidate !== url && candidate.startsWith(`${url}/`)));

  for (const url of sitemapLeaves) {
    const parsed = new URL(url);
    if (parsed.pathname === "/en/furniture/extras") continue;
    if ([...discoveredProducts.values()].some((page) => page.url.replace(/\/$/, "") === url)) continue;
    const category = sitemapCategory(parsed.pathname);
    if (!category) continue;
    const rawSlug = parsed.pathname.split("/").filter(Boolean).at(-1) ?? "";
    const slug = canonicalProductSlug(rawSlug);
    if (!slug || discoveredProducts.has(slug)) continue;
    discoveredProducts.set(slug, {
      slug,
      url,
      title: sitemapProductTitle(slug),
      kind: "product",
      appProductId: `musterring-${slug}`,
      category
    });
  }

  return [
    ...seedPages.filter((page) => page.kind !== "product"),
    ...discoveredProducts.values()
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

function extractProductOverview(html) {
  const marker = html.search(/data-name=["']Product overview["']/i);
  if (marker < 0) return [];
  const section = html.slice(marker, marker + 8_000);
  const list = section.match(/<ul\b[^>]*>([\s\S]*?)<\/ul>/i)?.[1] ?? "";
  return [...list.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => stripHtml(match[1]))
    .filter(Boolean);
}

function categoriesFromOverview(overview, fallbackCategory, categoryCopy) {
  const copy = overview.join(" ").toLowerCase();
  const categories = [];
  const add = (category) => { if (!categories.includes(category)) categories.push(category); };

  if (fallbackCategory === "auto") {
    add(/armchair|recliner|reclining chair|easy chair|beanbag/.test(categoryCopy) ? "armchair" : "sofa");
  } else if (fallbackCategory === "auto-dining") {
    if (/dining tables?|tables?|standing tables?|high tables?/.test(copy)) add("dining-table");
    if (/chairs?|armchairs?|cantilever chairs?|benches?|stools?|bar\/counter stools?/.test(copy)) add("dining-chair");
    if (categories.length === 0) {
      add(/chair|armchair|stool|bench/.test(categoryCopy) ? "dining-chair" : "dining-table");
    }
  } else if (fallbackCategory === "bedroom-series") {
    // Keep complete bedroom programmes out of the dedicated bed and wardrobe
    // listings. A wardrobe-only programme such as MONTINO belongs in Wardrobes.
    add(!/\bbeds?\b/.test(copy) && /\bwardrobes?\b/.test(copy) ? "wardrobe" : "bedroom-series");
  } else {
    add(fallbackCategory);
  }

  return categories;
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
    h1.match(/^(MR\s+[A-Z][A-Z-]*)/)?.[1] ||
    h1.match(/^([A-ZÄÖÜ0-9][A-ZÄÖÜ0-9! .&/-]*[A-ZÄÖÜ0-9!])(?=\s+[A-ZÄÖÜ][a-zäöüß])/)?.[1];
  const modelCode = detectedModel?.replace(/\s+/g, " ").toUpperCase() ?? page.title;
  const tagline = h1.toLowerCase().startsWith(modelCode.toLowerCase())
    ? h1.slice(modelCode.length).replace(/^[\s–—:|-]+/, "").trim()
    : h1.toLowerCase().startsWith(page.title.toLowerCase())
      ? h1.slice(page.title.length).replace(/^[\s–—:|-]+/, "").trim()
      : h1;
  const categoryCopy = `${h1} ${description}`.toLowerCase();
  const productOverview = extractProductOverview(html);
  const categories = categoriesFromOverview(productOverview, page.category, categoryCopy);
  const category = categories[0];

  return {
    appProductId: page.appProductId,
    slug: page.slug,
    modelCode,
    name: modelCode,
    tagline,
    description: decodeHtml(description),
    category,
    categories,
    productOverview,
    sourceUrl: page.url
  };
}

function contentHash(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

async function readJsonIfPresent(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
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

  const previousMetadata = await readJsonIfPresent(path.join(pageDir, "metadata.json"), { assets: [] });
  const previousAssetsBySource = new Map((previousMetadata.assets ?? []).map((asset) => [asset.sourceUrl, asset]));
  const usedFiles = new Set((previousMetadata.assets ?? []).map((asset) => asset.file));

  const assets = [];
  for (const [index, url] of imageUrls.entries()) {
    const extension = extensionFrom("", url);
    const previous = previousAssetsBySource.get(url);
    let fileName = previous?.file?.split("/").at(-1) ?? `image-${String(index + 1).padStart(2, "0")}${extension}`;
    let relativePath = `/musterring-catalog/${page.slug}/${fileName}`;
    let suffix = index + 1;
    while (!previous && usedFiles.has(relativePath)) {
      suffix += 1;
      fileName = `image-${String(suffix).padStart(2, "0")}${extension}`;
      relativePath = `/musterring-catalog/${page.slug}/${fileName}`;
    }
    usedFiles.add(relativePath);
    console.log(`  ${dryRun ? "would save" : "saving"} ${relativePath}`);
    let info = previous ? { bytes: previous.bytes ?? 0, contentType: previous.contentType ?? "" } : { bytes: 0, contentType: "" };
    if (!dryRun) {
      const filePath = path.join(pageDir, fileName);
      if (!previous || !(await pathExists(filePath))) info = await downloadImage(url, filePath);
    }
    assets.push({ file: relativePath, sourceUrl: url, ...info, sha256: previous?.sha256 ?? null });
  }

  if (!dryRun) {
    for (const asset of assets) {
      const filePath = path.join(process.cwd(), asset.file.replace(/^\//, "public/"));
      if (await pathExists(filePath)) asset.sha256 = createHash("sha256").update(await readFile(filePath)).digest("hex");
    }
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
      ? (() => {
          const product = { ...extractProductContent(html, page), images: assets.map((asset) => asset.file), stale: false };
          return { ...product, contentHash: contentHash(product) };
        })()
      : null
  };
}

function buildCatalogReport(previousProducts, currentProducts) {
  const previous = new Map(previousProducts.map((product) => [product.slug, product]));
  const current = new Map(currentProducts.map((product) => [product.slug, product]));
  const renamed = [...previous.keys()].flatMap((slug) => {
    const canonical = canonicalProductSlug(slug);
    return slug !== canonical && !current.has(slug) && current.has(canonical) ? [{ from: slug, to: canonical }] : [];
  });
  const renamedTargets = new Set(renamed.map((item) => item.to));
  const renamedSources = new Set(renamed.map((item) => item.from));
  const previousByCanonicalSlug = new Map(previousProducts.map((product) => [canonicalProductSlug(product.slug), product]));
  const added = [...current.keys()].filter((slug) => !previous.has(slug) && !renamedTargets.has(slug)).sort();
  const missing = [...previous.keys()].filter((slug) => !current.has(slug) && !renamedSources.has(slug)).sort();
  const categoryChanges = [...current.values()].flatMap((product) => {
    const old = previous.get(product.slug) ?? previousByCanonicalSlug.get(product.slug);
    if (!old) return [];
    const before = old.categories ?? [old.category];
    const after = product.categories ?? [product.category];
    return JSON.stringify(before) === JSON.stringify(after) ? [] : [{ slug: product.slug, before, after }];
  });
  return { generatedAt: new Date().toISOString(), previousCount: previousProducts.length, discoveredCount: currentProducts.length, added, renamed, missing, categoryChanges };
}

function validateCatalog(products) {
  const allowedCategories = new Set([
    "sofa", "armchair", "sectional", "storage", "coffee-table", "bedroom-series", "bed", "wardrobe",
    "dining-chair", "dining-table", "bathroom", "kitchen", "outdoor", "small-furniture", "carpet", "lamp", "home-textile"
  ]);
  const ids = new Set();
  const slugs = new Set();
  const errors = [];
  for (const product of products) {
    if (!product.appProductId || ids.has(product.appProductId)) errors.push(`duplicate or empty product id: ${product.appProductId}`);
    if (!product.slug || slugs.has(product.slug)) errors.push(`duplicate or empty product slug: ${product.slug}`);
    ids.add(product.appProductId);
    slugs.add(product.slug);
    if (!product.name?.trim()) errors.push(`${product.slug}: missing product name`);
    if (!product.sourceUrl?.startsWith("https://www.musterring.com/")) errors.push(`${product.slug}: invalid official source URL`);
    if (!product.images?.length) errors.push(`${product.slug}: no product image was imported`);
    for (const category of product.categories ?? [product.category]) {
      if (!allowedCategories.has(category)) errors.push(`${product.slug}: unsupported category ${category}`);
    }
  }
  if (errors.length) throw new Error(`Catalogue validation failed:\n- ${errors.join("\n- ")}`);
}

async function main() {
  if (!dryRun) await mkdir(outputRoot, { recursive: true });
  const previousCatalog = await readJsonIfPresent(catalogOutput, { products: [] });
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

  const report = buildCatalogReport(previousCatalog.products ?? [], catalog);
  if (!dryRun) validateCatalog(catalog);
  const discoveredSlugs = new Set(catalog.map((product) => product.slug));
  const staleProducts = (previousCatalog.products ?? [])
    .filter((product) => !discoveredSlugs.has(canonicalProductSlug(product.slug)))
    .map((product) => ({ ...product, stale: true }));
  console.log(`\nCatalogue diff: +${report.added.length} added, ${report.missing.length} missing from the live site, ${report.categoryChanges.length} category changes.`);
  if (report.added.length) console.log(`  added: ${report.added.join(", ")}`);
  if (report.missing.length) console.log(`  retained as stale: ${report.missing.join(", ")}`);

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
      products: [...catalog, ...staleProducts]
    }, null, 2)}\n`);
    await mkdir(path.dirname(reportOutput), { recursive: true });
    await writeFile(reportOutput, `${JSON.stringify(report, null, 2)}\n`);
  }

  const total = imported.reduce((sum, page) => sum + (page.assets?.length ?? 0), 0);
  console.log(`\n${dryRun ? "Dry run complete" : "Import complete"}: ${total} image assets`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
