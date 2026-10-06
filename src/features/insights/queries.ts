import type { SelectQueryBuilder } from 'kysely';

import type { Db } from '@/db/sqlite';
import type { Database, Transaction, TxnStatus } from '@/db/types';
import { startOfDay, type Range } from '@/lib/dates';

/** Only successful payments inside [start, end) count toward spending. */
function spentIn<O>(q: SelectQueryBuilder<Database, 'transactions', O>, r: Range) {
  return q
    .where('status', '=', 'success')
    .where('createdAt', '>=', r.start.getTime())
    .where('createdAt', '<', r.end.getTime());
}

export async function totalsByCategory(db: Db, range: Range) {
  const rows = await db
    .selectFrom('transactions')
    .select((eb) => ['categoryId', eb.fn.sum<number>('amountPaise').as('totalPaise')])
    .$call((q) => spentIn(q, range))
    .groupBy('categoryId')
    .orderBy('totalPaise', 'desc')
    .execute();
  return rows.map((r) => ({ categoryId: r.categoryId, totalPaise: Number(r.totalPaise) }));
}

export async function periodTotal(db: Db, range: Range): Promise<number> {
  const row = await db
    .selectFrom('transactions')
    .select((eb) => eb.fn.coalesce(eb.fn.sum<number>('amountPaise'), eb.lit(0)).as('total'))
    .$call((q) => spentIn(q, range))
    .executeTakeFirst();
  return Number(row?.total ?? 0);
}

export type CategoryChange = {
  categoryId: string;
  current: number;
  previous: number;
  /** null when previous is 0 (show "New"). */
  pctChange: number | null;
};

/** Per-category current vs previous, largest current first. */
export async function compare(db: Db, current: Range, previous: Range): Promise<CategoryChange[]> {
  const [cur, prev] = await Promise.all([
    totalsByCategory(db, current).then((r) => new Map(r.map((x) => [x.categoryId, x.totalPaise]))),
    totalsByCategory(db, previous).then((r) => new Map(r.map((x) => [x.categoryId, x.totalPaise]))),
  ]);
  return [...new Set([...cur.keys(), ...prev.keys()])]
    .map((categoryId) => {
      const c = cur.get(categoryId) ?? 0;
      const p = prev.get(categoryId) ?? 0;
      return { categoryId, current: c, previous: p, pctChange: p ? ((c - p) / p) * 100 : null };
    })
    .sort((a, b) => b.current - a.current || b.previous - a.previous);
}

/** The category with the largest % increase, for the Home insight card. Null if nothing grew. */
export async function topIncrease(db: Db, current: Range, previous: Range) {
  const grew = (await compare(db, current, previous)).filter(
    (c): c is CategoryChange & { pctChange: number } => c.pctChange !== null && c.pctChange > 0,
  );
  return grew.sort((a, b) => b.pctChange - a.pctChange)[0] ?? null;
}

export type HistoryFilters = {
  search?: string; // payee name, note or VPA
  categoryId?: string;
  status?: TxnStatus;
};

export type DayGroup = { day: Date; totalPaise: number; txns: Transaction[] };

/** History sections, newest first. Every status is listed; only successes count toward the day total. */
export async function dailyGroups(db: Db, filters: HistoryFilters = {}): Promise<DayGroup[]> {
  const search = filters.search?.trim();
  const rows = await db
    .selectFrom('transactions')
    .selectAll()
    .$if(!!filters.categoryId, (q) => q.where('categoryId', '=', filters.categoryId!))
    .$if(!!filters.status, (q) => q.where('status', '=', filters.status!))
    .$if(!!search, (q) =>
      q.where((eb) =>
        eb.or(
          (['payeeName', 'note', 'payeeVpa'] as const).map((c) => eb(c, 'like', `%${search}%`)),
        ),
      ),
    )
    .orderBy('createdAt', 'desc')
    .execute();

  const groups: DayGroup[] = [];
  for (const txn of rows) {
    const day = startOfDay(new Date(txn.createdAt));
    let group = groups.at(-1);
    if (group?.day.getTime() !== day.getTime()) {
      group = { day, totalPaise: 0, txns: [] };
      groups.push(group);
    }
    group.txns.push(txn);
    if (txn.status === 'success') group.totalPaise += txn.amountPaise;
  }
  return groups;
}
