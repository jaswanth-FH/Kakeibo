import { beforeEach, expect, test } from '@jest/globals';

import type { Db } from '@/db/sqlite';
import { createTestDb } from '@/db/test-db';
import type { TxnStatus } from '@/db/types';

import { markByUser } from './status';

let db: Db;
beforeEach(() => {
  db = createTestDb();
});

const insert = (id: string, status: TxnStatus) =>
  db
    .insertInto('transactions')
    .values({
      id,
      payeeVpa: 'shop@ybl',
      amountPaise: 100,
      categoryId: 'food',
      rawUri: 'upi://pay',
      status,
      createdAt: 1,
      updatedAt: 1,
    })
    .execute();

const row = (id: string) =>
  db.selectFrom('transactions').selectAll().where('id', '=', id).executeTakeFirstOrThrow();

test('"Yes, it\'s paid" marks a pending payment successful, by the user', async () => {
  await insert('a', 'pending');
  expect(await markByUser(db, 'a', true, 50)).toBe(true);
  expect(await row('a')).toMatchObject({
    status: 'success',
    statusSource: 'user',
    failReason: null,
    updatedAt: 50,
  });
});

test('"No, it failed" marks it failed with reason user_marked', async () => {
  await insert('a', 'pending');
  await markByUser(db, 'a', false);
  expect(await row('a')).toMatchObject({ status: 'failed', failReason: 'user_marked' });
});

test('never overwrites a payment that already has a result', async () => {
  await insert('a', 'success');
  expect(await markByUser(db, 'a', false)).toBe(false);
  expect((await row('a')).status).toBe('success');
  expect(await markByUser(db, 'missing', true)).toBe(false);
});
