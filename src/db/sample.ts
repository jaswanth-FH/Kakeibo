// ponytail: in-memory sample data so M0 screens show something; replaced by SQLite + "Seed sample month" in M1.
import { SEED_CATEGORIES } from '@/db/seed';

export type SampleTxn = {
  id: string;
  payeeName: string;
  payeeVpa: string;
  amountPaise: number;
  categoryId: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: Date;
};

const day = (d: number, h = 12) => new Date(2026, 9, d, h);

export const SAMPLE_TXNS: SampleTxn[] = [
  {
    id: '1',
    payeeName: 'Apple Store',
    payeeVpa: 'applestore@hdfcbank',
    amountPaise: 590000,
    categoryId: 'tech',
    status: 'success',
    createdAt: day(6, 18),
  },
  {
    id: '2',
    payeeName: 'Swiggy',
    payeeVpa: 'swiggy@icici',
    amountPaise: 48600,
    categoryId: 'food',
    status: 'success',
    createdAt: day(6, 13),
  },
  {
    id: '3',
    payeeName: 'Aarav',
    payeeVpa: 'aarav@okaxis',
    amountPaise: 120000,
    categoryId: 'social',
    status: 'pending',
    createdAt: day(5, 21),
  },
  {
    id: '4',
    payeeName: 'Uber',
    payeeVpa: 'uber@axisbank',
    amountPaise: 32450,
    categoryId: 'travel',
    status: 'success',
    createdAt: day(5, 9),
  },
  {
    id: '5',
    payeeName: 'Apollo Pharmacy',
    payeeVpa: 'apollo@ybl',
    amountPaise: 86000,
    categoryId: 'health',
    status: 'failed',
    createdAt: day(4, 17),
  },
  {
    id: '6',
    payeeName: 'BESCOM',
    payeeVpa: 'bescom@sbi',
    amountPaise: 215000,
    categoryId: 'home',
    status: 'success',
    createdAt: day(3, 10),
  },
  {
    id: '7',
    payeeName: 'Blue Tokai',
    payeeVpa: 'bluetokai@hdfcbank',
    amountPaise: 34000,
    categoryId: 'food',
    status: 'success',
    createdAt: day(2, 8),
  },
  {
    id: '8',
    payeeName: 'PVR Cinemas',
    payeeVpa: 'pvr@icici',
    amountPaise: 78000,
    categoryId: 'entertain',
    status: 'success',
    createdAt: day(1, 20),
  },
];

export const SAMPLE_PREV_MONTH_PAISE = 891000;

/** Successful spend per category, largest first; only categories with spend. */
export function sampleCategoryTotals() {
  const spent = SAMPLE_TXNS.filter((t) => t.status === 'success');
  return SEED_CATEGORIES.map((c) => ({
    ...c,
    paise: spent.filter((t) => t.categoryId === c.id).reduce((s, t) => s + t.amountPaise, 0),
  }))
    .filter((c) => c.paise > 0)
    .sort((a, b) => b.paise - a.paise);
}
