import { expect, test } from '@jest/globals';

import { createTestDb } from '@/db/test-db';
import { periodTotal } from '@/features/insights/queries';
import { periodRange, previousRange } from '@/lib/dates';

import { seedSampleMonths } from './dev-seed';

test('seeds two months that read back, and re-seeding inserts nothing', async () => {
  const db = createTestDb();
  const now = new Date(2026, 9, 6, 19, 45);
  const inserted = await seedSampleMonths(db, now);
  expect(inserted).toBeGreaterThan(20);

  const oct = periodRange('month', now);
  expect(await periodTotal(db, oct)).toBeGreaterThan(0);
  expect(await periodTotal(db, previousRange('month', oct))).toBeGreaterThan(0);
  expect(await seedSampleMonths(db, now)).toBe(0);
});
