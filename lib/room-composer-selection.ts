export const MAX_ROOM_COMPOSER_PRODUCTS = 6;

export function normalizeRoomComposerProductIds(
  value: string | string[] | undefined,
  allowedProductIds: Iterable<string>,
  limit = MAX_ROOM_COMPOSER_PRODUCTS
) {
  const allowed = new Set(allowedProductIds);
  const values = Array.isArray(value) ? value : value ? [value] : [];

  return [...new Set(values.map((id) => id.trim()).filter((id) => id && allowed.has(id)))].slice(0, limit);
}

export function roomComposerUploadHref(productIds: string[]) {
  const query = new URLSearchParams();
  [...new Set(productIds.map((id) => id.trim()).filter(Boolean))]
    .slice(0, MAX_ROOM_COMPOSER_PRODUCTS)
    .forEach((id) => query.append("product", id));
  const suffix = query.toString();
  return suffix ? `/room-composer/upload?${suffix}` : "/room-composer/upload";
}
