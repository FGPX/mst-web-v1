import { createHash } from "node:crypto";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("content-import");
const raw = path.join(root, "raw");
const manifestDirectory = path.join(root, "manifests");
const logsDirectory = path.join(root, "logs");
const dryRun = process.argv.includes("--dry-run");
const resume = process.argv.includes("--resume");
const rateFlag = process.argv.find((value) => value.startsWith("--rate-limit-ms="));
const rateLimitMs = Number(rateFlag?.split("=")[1] ?? 50);
const existingPath = path.join(manifestDirectory, "latest.json");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else if (entry.name !== ".gitkeep" && entry.name !== "README.md") files.push(target);
  }
  return files;
}

function mimeType(filename) {
  return ({
    ".html": "text/html", ".json": "application/json", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".png": "image/png", ".webp": "image/webp", ".pdf": "application/pdf", ".mp4": "video/mp4", ".webm": "video/webm"
  })[path.extname(filename).toLowerCase()] ?? "application/octet-stream";
}

await mkdir(manifestDirectory, { recursive: true });
await mkdir(logsDirectory, { recursive: true });
let previous = { assets: [] };
if (resume) previous = JSON.parse(await readFile(existingPath, "utf8").catch(() => "{\"assets\":[]}"));
const completed = new Set(previous.assets.map((asset) => asset.localPath));
const hashes = new Map(previous.assets.filter((asset) => asset.sha256).map((asset) => [asset.sha256, asset.localPath]));
const records = resume ? [...previous.assets] : [];
const failures = [];

for (const filename of await walk(raw)) {
  const localPath = path.relative(root, filename).replaceAll("\\", "/");
  if (completed.has(localPath)) continue;
  try {
    const bytes = await readFile(filename);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    const duplicateOf = hashes.get(sha256);
    records.push({ sourceUrl: null, localPath, mimeType: mimeType(filename), sha256, size: bytes.length, status: duplicateOf ? "duplicate" : "imported", duplicateOf: duplicateOf ?? null });
    if (!duplicateOf) hashes.set(sha256, localPath);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    records.push({ sourceUrl: null, localPath, mimeType: mimeType(filename), sha256: "", size: 0, status: "failed", error: message });
    failures.push({ localPath, error: message });
  }
  if (rateLimitMs > 0) await new Promise((resolve) => setTimeout(resolve, rateLimitMs));
}

const manifest = { jobId: `content-${Date.now()}`, createdAt: new Date().toISOString(), dryRun, resume, rateLimitMs, assets: records };
if (!dryRun) {
  await writeFile(existingPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  await writeFile(path.join(logsDirectory, `${manifest.jobId}.json`), `${JSON.stringify({ jobId: manifest.jobId, imported: records.filter((record) => record.status === "imported").length, duplicates: records.filter((record) => record.status === "duplicate").length, failures }, null, 2)}\n`, "utf8");
}
console.log(`Scanned ${records.length} raw assets; ${failures.length} failures; dryRun=${dryRun}; resume=${resume}.`);
