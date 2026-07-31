export type ImportAssetRecord = {
  url: string;
  localPath: string;
  mimeType: string;
  sha256: string;
  size: number;
  status: "downloaded" | "duplicate" | "failed" | "skipped";
  error?: string;
};

export function normalizeImportUrl(value: string, allowedHosts: string[]) {
  const url = new URL(value);
  if (!["https:", "http:"].includes(url.protocol)) throw new Error("Only HTTP(S) content sources are supported.");
  if (!allowedHosts.includes(url.hostname)) throw new Error(`Host ${url.hostname} is outside the authorized import scope.`);
  url.hash = "";
  return url.toString();
}

export function deduplicateImportRecords(records: ImportAssetRecord[]) {
  const hashes = new Set<string>();
  return records.map((record) => {
    if (record.status !== "downloaded" || !hashes.has(record.sha256)) {
      if (record.status === "downloaded") hashes.add(record.sha256);
      return record;
    }
    return { ...record, status: "duplicate" as const };
  });
}

export function pendingImportUrls(urls: string[], records: ImportAssetRecord[], resume: boolean) {
  if (!resume) return urls;
  const complete = new Set(records.filter((record) => ["downloaded", "duplicate"].includes(record.status)).map((record) => record.url));
  return urls.filter((url) => !complete.has(url));
}

export async function sha256Hex(bytes: Uint8Array) {
  const digest = await crypto.subtle.digest("SHA-256", bytes.slice().buffer as ArrayBuffer);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function inferMimeType(pathname: string, contentType = "") {
  if (contentType) return contentType.split(";")[0].trim().toLowerCase();
  const extension = pathname.toLowerCase().split(".").pop();
  return ({
    html: "text/html",
    json: "application/json",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    pdf: "application/pdf",
    mp4: "video/mp4",
    webm: "video/webm"
  } as Record<string, string>)[extension ?? ""] ?? "application/octet-stream";
}

export function createImportRateLimiter(delayMs: number) {
  let nextAllowed = 0;
  return async () => {
    const delay = Math.max(0, nextAllowed - Date.now());
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    nextAllowed = Date.now() + Math.max(0, delayMs);
  };
}
