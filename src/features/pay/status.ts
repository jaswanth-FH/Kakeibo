import type { Db } from '@/db/sqlite';

/** The user's answer on Confirm. Only touches a payment that is still pending. */
export function markByUser(db: Db, id: string, paid: boolean, now = Date.now()) {
  return db
    .updateTable('transactions')
    .set({
      status: paid ? 'success' : 'failed',
      statusSource: 'user',
      failReason: paid ? null : 'user_marked',
      updatedAt: now,
    })
    .where('id', '=', id)
    .where('status', '=', 'pending')
    .executeTakeFirst()
    .then((r) => Number(r.numUpdatedRows) === 1);
}
