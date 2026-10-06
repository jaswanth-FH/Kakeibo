import { beforeEach, describe, expect, test } from '@jest/globals';

import { SEED_CATEGORIES } from '@/db/seed';
import type { Db } from '@/db/sqlite';
import { createTestDb } from '@/db/test-db';
import type { NewTransaction } from '@/db/types';
import { periodRange, previousRange } from '@/lib/dates';

import { compare, dailyGroups, periodTotal, topIncrease, totalsByCategory } from './queries';

// Runs with TZ=Asia/Kolkata (see package.json), so the dates below are local IST.
let db: Db;
let n = 0;

function txn(
  createdAt: Date,
  categoryId: string,
  amountPaise: number,
  extra: Partial<NewTransaction> = {},
) {
  n++;
  return db
    .insertInto('transactions')
    .values({
      id: String(n),
      payeeVpa: `payee${n}@upi`,
      payeeName: `Payee ${n}`,
      amountPaise,
      categoryId,
      rawUri: 'upi://pay',
      status: 'success',
      createdAt: createdAt.getTime(),
      updatedAt: createdAt.getTime(),
      ...extra,
    })
    .execute();
}

const oct = periodRange('month', new Date(2026, 9, 15));
const sep = previousRange('month', oct);

beforeEach(() => {
  db = createTestDb();
  n = 0;
});

test('migrations seed exactly SEED_CATEGORIES', async () => {
  const rows = await db.selectFrom('categories').selectAll().orderBy('sortOrder').execute();
  expect(rows).toEqual(SEED_CATEGORIES.map((c) => ({ ...c, archived: 0 })));
});

describe('periods', () => {
  test('months start at local midnight', () => {
    expect(oct).toEqual({ start: new Date(2026, 9, 1), end: new Date(2026, 10, 1) });
    expect(sep).toEqual({ start: new Date(2026, 8, 1), end: new Date(2026, 9, 1) });
  });

  test('weeks start on Monday; quarters are calendar quarters', () => {
    expect(periodRange('week', new Date(2026, 9, 6)).start).toEqual(new Date(2026, 9, 5)); // Tue → Mon
    expect(periodRange('week', new Date(2026, 9, 11)).start).toEqual(new Date(2026, 9, 5)); // Sun → Mon
    const q4 = periodRange('quarter', new Date(2026, 10, 20));
    expect(q4).toEqual({ start: new Date(2026, 9, 1), end: new Date(2027, 0, 1) });
    expect(previousRange('quarter', q4).start).toEqual(new Date(2026, 6, 1));
  });
});

describe('totals', () => {
  test('only successful payments inside [start, end) count', async () => {
    await txn(new Date(2026, 9, 1, 0, 0), 'food', 10000); // first instant of Oct
    await txn(new Date(2026, 8, 30, 23, 59), 'food', 20000); // Sep
    await txn(new Date(2026, 10, 1, 0, 0), 'food', 40000); // Nov
    await txn(new Date(2026, 9, 5), 'tech', 50000);
    await txn(new Date(2026, 9, 6), 'tech', 70000, { status: 'failed' });
    await txn(new Date(2026, 9, 6), 'tech', 80000, { status: 'pending' });

    expect(await periodTotal(db, oct)).toBe(60000);
    expect(await periodTotal(db, sep)).toBe(20000);
    expect(await totalsByCategory(db, oct)).toEqual([
      { categoryId: 'tech', totalPaise: 50000 },
      { categoryId: 'food', totalPaise: 10000 },
    ]);
  });

  test('an empty period totals 0', async () => {
    expect(await periodTotal(db, oct)).toBe(0);
    expect(await totalsByCategory(db, oct)).toEqual([]);
  });
});

describe('compare', () => {
  test('pctChange is null when previous is 0; topIncrease skips those', async () => {
    await txn(new Date(2026, 8, 10), 'food', 100000);
    await txn(new Date(2026, 9, 10), 'food', 118000); // +18%
    await txn(new Date(2026, 8, 10), 'tech', 50000);
    await txn(new Date(2026, 9, 10), 'tech', 40000); // −20%
    await txn(new Date(2026, 9, 10), 'travel', 900000); // new this month

    expect(await compare(db, oct, sep)).toEqual([
      { categoryId: 'travel', current: 900000, previous: 0, pctChange: null },
      { categoryId: 'food', current: 118000, previous: 100000, pctChange: 18 },
      { categoryId: 'tech', current: 40000, previous: 50000, pctChange: -20 },
    ]);
    expect((await topIncrease(db, oct, sep))?.categoryId).toBe('food');
  });

  test('topIncrease is null without a previous month', async () => {
    await txn(new Date(2026, 9, 10), 'food', 1000);
    expect(await topIncrease(db, oct, sep)).toBeNull();
  });
});

describe('dailyGroups', () => {
  test('groups by local day, newest first; day total counts successes only', async () => {
    await txn(new Date(2026, 9, 6, 9), 'food', 10000);
    await txn(new Date(2026, 9, 6, 20), 'tech', 20000, { status: 'failed' });
    await txn(new Date(2026, 9, 5, 23, 59), 'food', 30000, { status: 'pending' });
    await txn(new Date(2026, 9, 5, 0, 1), 'travel', 40000);

    const groups = await dailyGroups(db);
    expect(groups.map((g) => [g.day, g.totalPaise, g.txns.length])).toEqual([
      [new Date(2026, 9, 6), 10000, 2],
      [new Date(2026, 9, 5), 40000, 2],
    ]);
    expect(groups[0].txns[0].status).toBe('failed'); // 20:00 before 09:00
  });

  test('filters by search (name, note, VPA), category and status', async () => {
    await txn(new Date(2026, 9, 6), 'food', 10000, { payeeName: 'Swiggy' });
    await txn(new Date(2026, 9, 6), 'travel', 20000, { note: 'Airport cab' });
    await txn(new Date(2026, 9, 6), 'tech', 30000, { status: 'failed', payeeVpa: 'apple@hdfc' });

    const ids = async (f: Parameters<typeof dailyGroups>[1]) =>
      (await dailyGroups(db, f)).flatMap((g) => g.txns.map((x) => x.id));
    expect(await ids({ search: 'swig' })).toEqual(['1']);
    expect(await ids({ search: 'airport' })).toEqual(['2']);
    expect(await ids({ search: 'apple@' })).toEqual(['3']);
    expect(await ids({ categoryId: 'travel' })).toEqual(['2']);
    expect(await ids({ status: 'failed' })).toEqual(['3']);
  });
});
