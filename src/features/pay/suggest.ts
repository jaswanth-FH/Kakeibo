import type { Db } from '@/db/sqlite';
import { MCC_TO_CATEGORY } from '@/features/pay/mcc';

/** Category to preselect on Tag: payee rule → most-used for this VPA → QR's mcc → none. */
export async function suggestCategory(
  db: Db,
  payeeVpa: string,
  merchantCode?: string,
): Promise<string | undefined> {
  const rule = await db
    .selectFrom('payeeRules')
    .select('categoryId')
    .where('payeeVpa', '=', payeeVpa)
    .executeTakeFirst();
  if (rule) return rule.categoryId;

  const used = await db
    .selectFrom('transactions')
    .select('categoryId')
    .where('payeeVpa', '=', payeeVpa)
    .where('status', '=', 'success')
    .groupBy('categoryId')
    .orderBy((eb) => eb.fn.countAll(), 'desc')
    .orderBy((eb) => eb.fn.max('createdAt'), 'desc')
    .executeTakeFirst();
  if (used) return used.categoryId;

  return merchantCode ? MCC_TO_CATEGORY[merchantCode] : undefined;
}

/** "Always tag {payee} as {category}". */
export function savePayeeRule(db: Db, payeeVpa: string, categoryId: string, now = Date.now()) {
  return db
    .insertInto('payeeRules')
    .values({ payeeVpa, categoryId, createdAt: now, updatedAt: now })
    .onConflict((oc) => oc.column('payeeVpa').doUpdateSet({ categoryId, updatedAt: now }))
    .execute();
}
