import { beforeEach, expect, test } from '@jest/globals';

import type { Db } from '@/db/sqlite';
import { createTestDb } from '@/db/test-db';
import type { TxnStatus } from '@/db/types';

import { savePayeeRule, suggestCategory } from './suggest';

let db: Db;
let n = 0;
beforeEach(() => {
  db = createTestDb();
});

const pay = (payeeVpa: string, categoryId: string, status: TxnStatus = 'success') =>
  db
    .insertInto('transactions')
    .values({
      id: String(++n),
      payeeVpa,
      amountPaise: 100,
      categoryId,
      rawUri: 'upi://pay',
      status,
      createdAt: n,
      updatedAt: n,
    })
    .execute();

test('falls back to the mcc, then to nothing', async () => {
  expect(await suggestCategory(db, 'shop@ybl', '5732')).toBe('tech');
  expect(await suggestCategory(db, 'shop@ybl', '0000')).toBeUndefined();
  expect(await suggestCategory(db, 'shop@ybl')).toBeUndefined();
});

test('past successful payments beat the mcc; failed ones are ignored', async () => {
  await pay('shop@ybl', 'food');
  await pay('shop@ybl', 'home');
  await pay('shop@ybl', 'home');
  await pay('shop@ybl', 'clothes', 'failed');
  await pay('shop@ybl', 'clothes', 'failed');
  await pay('shop@ybl', 'clothes', 'failed');
  expect(await suggestCategory(db, 'shop@ybl', '5732')).toBe('home');
});

test('a payee rule beats history, and saving again replaces it', async () => {
  await pay('shop@ybl', 'home');
  await savePayeeRule(db, 'shop@ybl', 'tech');
  expect(await suggestCategory(db, 'shop@ybl')).toBe('tech');
  await savePayeeRule(db, 'shop@ybl', 'food');
  expect(await suggestCategory(db, 'shop@ybl')).toBe('food');
});
