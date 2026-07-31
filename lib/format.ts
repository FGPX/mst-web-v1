export function formatEuro(cents: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function dimensions(widthMm: number, depthMm: number, heightMm?: number) {
  const base = `${Math.round(widthMm / 10)} x ${Math.round(depthMm / 10)} cm`;
  return heightMm ? `${base} x ${Math.round(heightMm / 10)} cm` : base;
}
