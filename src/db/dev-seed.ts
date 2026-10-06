import type { Db } from '@/db/sqlite';
import type { NewTransaction } from '@/db/types';

// Dev-only: realistic spending for last month and this month (up to `now`).
const PAYEES: [
  name: string,
  vpa: string,
  categoryId: string,
  minRupees: number,
  maxRupees: number,
][] = [
  ['Swiggy', 'swiggy@icici', 'food', 180, 650],
  ['Zomato', 'zomato@hdfcbank', 'food', 200, 800],
  ['Blue Tokai', 'bluetokai@hdfcbank', 'food', 250, 450],
  ['BigBasket', 'bigbasket@ybl', 'food', 600, 2400],
  ['Croma', 'croma@axisbank', 'tech', 900, 4500],
  ['Uber', 'uber@axisbank', 'travel', 150, 600],
  ['Namma Metro', 'bmrcl@sbi', 'travel', 30, 90],
  ['BESCOM', 'bescom@sbi', 'home', 1200, 2600],
  ['Apollo Pharmacy', 'apollo@ybl', 'health', 150, 900],
  ['PVR Cinemas', 'pvr@icici', 'entertain', 350, 900],
  ['Aarav', 'aarav@okaxis', 'social', 200, 1500],
  ['Urban Company', 'urbanclap@icici', 'services', 400, 1200],
];

/** Inserts sample payments; deterministic ids, so running it again adds nothing. Returns rows inserted. */
export async function seedSampleMonths(db: Db, now = new Date()): Promise<number> {
  let seed = 42;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  const rows: NewTransaction[] = [];
  for (const offset of [-1, 0]) {
    const first = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    for (let day = 1; day <= days; day++) {
      for (let i = 0; i < Math.floor(rand() * 3); i++) {
        const [payeeName, payeeVpa, categoryId, min, max] =
          PAYEES[Math.floor(rand() * PAYEES.length)];
        const at = new Date(
          first.getFullYear(),
          first.getMonth(),
          day,
          8 + Math.floor(rand() * 14),
          Math.floor(rand() * 60),
        );
        const r = rand();
        if (at > now) continue;
        rows.push({
          id: `seed-${first.getFullYear()}-${first.getMonth() + 1}-${day}-${i}`,
          payeeVpa,
          payeeName,
          amountPaise: Math.round(min + rand() * (max - min)) * 100,
          categoryId,
          rawUri: `upi://pay?pa=${payeeVpa}&pn=${encodeURIComponent(payeeName)}&cu=INR`,
          status: r < 0.05 ? 'failed' : r < 0.08 ? 'pending' : 'success',
          statusSource: r < 0.08 ? null : 'app',
          failReason: r < 0.05 ? 'app_failure' : null,
          createdAt: at.getTime(),
          updatedAt: at.getTime(),
        });
      }
    }
  }
  if (!rows.length) return 0;
  const result = await db
    .insertInto('transactions')
    .values(rows)
    .onConflict((oc) => oc.doNothing())
    .executeTakeFirst();
  return Number(result.numInsertedOrUpdatedRows ?? 0);
}
