export type Range = { start: Date; end: Date }; // [start, end), local time
export type PeriodKind = 'week' | 'month' | 'quarter';

/** The week (Monday start), month or calendar quarter containing `d`. */
export function periodRange(kind: PeriodKind, d: Date): Range {
  const y = d.getFullYear();
  const m = d.getMonth();
  if (kind === 'week') {
    const start = new Date(y, m, d.getDate() - ((d.getDay() + 6) % 7));
    return { start, end: new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7) };
  }
  const months = kind === 'month' ? 1 : 3;
  const first = m - (m % months);
  return { start: new Date(y, first, 1), end: new Date(y, first + months, 1) };
}

/** The period of the same kind just before `range`. */
export function previousRange(kind: PeriodKind, range: Range): Range {
  return periodRange(kind, new Date(range.start.getTime() - 1));
}

/** Local midnight, for grouping by day. */
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** The period of the same kind just after `range`. */
export function nextRange(kind: PeriodKind, range: Range): Range {
  return periodRange(kind, range.end);
}

/** "October", "Q4" or "6 Oct" (week start). */
export function periodLabel(kind: PeriodKind, range: Range): string {
  const d = range.start;
  if (kind === 'month') return d.toLocaleDateString('en-IN', { month: 'long' });
  if (kind === 'quarter') return `Q${Math.floor(d.getMonth() / 3) + 1}`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
