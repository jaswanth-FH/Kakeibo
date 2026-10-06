const whole = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const exact = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 590000 → "₹5,900", 10000050 → "₹1,00,000.50" (Indian grouping, paise only when non-zero). */
export function formatPaise(paise: number): string {
  return `₹${(paise % 100 ? exact : whole).format(paise / 100)}`;
}

/** Short form for tight spaces: 2850000 → "₹28.5K", 1250000000 → "₹1.25Cr". */
export function formatPaiseCompact(paise: number): string {
  const rupees = paise / 100;
  const [div, unit] =
    rupees >= 1e7 ? [1e7, 'Cr'] : rupees >= 1e5 ? [1e5, 'L'] : rupees >= 1e3 ? [1e3, 'K'] : [1, ''];
  return `₹${Number((rupees / div).toFixed(2))}${unit}`;
}

/** Whole-percent change; 0 when there's nothing to compare against. */
export function pctChange(now: number, prev: number) {
  return prev ? Math.round(((now - prev) / prev) * 100) : 0;
}
