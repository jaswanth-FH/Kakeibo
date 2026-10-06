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
