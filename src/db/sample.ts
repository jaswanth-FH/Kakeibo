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

export const SAMPLE_PROFILE = {
  name: 'Aarav Rao',
  phone: '+91 98765 43210',
  email: 'aarav.rao@gmail.com',
};

/** An in-progress payment (shape of the PayDraft in docs/spec.md) for the /pay/* mockups. */
export const SAMPLE_DRAFT = {
  rawUri:
    'upi://pay?pa=applestore@hdfcbank&pn=Apple%20Store%2C%20BKC&am=5900.00&cu=INR&mc=5732&tr=AS-2041-8831',
  payeeVpa: 'applestore@hdfcbank',
  payeeName: 'Apple Store, BKC',
  amountPaise: 590000,
  amountLocked: true,
  merchantCode: '5732',
  txnRef: 'AS-2041-8831',
  categoryId: 'tech',
  upiApp: 'Google Pay',
  upiApprovalRef: '428913377210',
};

// More October rows so History has a couple of weeks' worth of days; with the rows above,
// successful spend matches the designs (₹28,460: Food 7,820 · Tech 7,140 · Home 4,900 …).
const t = (
  id: string,
  payeeName: string,
  payeeVpa: string,
  rupees: number,
  categoryId: string,
  createdAt: Date,
  status: SampleTxn['status'] = 'success',
): SampleTxn => ({
  id,
  payeeName,
  payeeVpa,
  amountPaise: Math.round(rupees * 100),
  categoryId,
  status,
  createdAt,
});

SAMPLE_TXNS.push(
  t(
    '9',
    'Apple Store, BKC',
    'applestore@hdfcbank',
    5900,
    'tech',
    new Date(2026, 9, 6, 13, 6),
    'failed',
  ),
  t(
    '10',
    'Ramesh Kirana',
    'ramesh.kirana@ybl',
    350,
    'food',
    new Date(2026, 9, 6, 9, 40),
    'pending',
  ),
  t('11', 'Chai Point', 'chaipoint@icici', 124, 'food', new Date(2026, 9, 5, 16, 20)),
  t('12', 'Uber', 'uber@axisbank', 236, 'travel', new Date(2026, 9, 5, 21, 15)),
  t('13', 'Apollo Pharmacy', 'apollo@ybl', 612, 'health', new Date(2026, 9, 5, 18, 2)),
  t('14', 'Rohan Mehta', 'rohan.mehta@okhdfcbank', 1200, 'home', new Date(2026, 9, 5, 11, 30)),
  t('15', 'Zomato', 'zomato@hdfcbank', 1250, 'food', new Date(2026, 9, 4, 20, 10)),
  t('16', 'Ola', 'ola@ybl', 419.5, 'travel', new Date(2026, 9, 4, 8, 50)),
  t('17', 'BookMyShow', 'bookmyshow@icici', 860, 'entertain', new Date(2026, 9, 4, 15, 0)),
  t('18', 'BigBasket', 'bigbasket@hdfcbank', 3420, 'food', new Date(2026, 9, 3, 11, 5)),
  t('19', 'Cult.fit', 'cultfit@axisbank', 1368, 'health', new Date(2026, 9, 3, 7, 30)),
  t('20', 'Croma', 'croma@icici', 1240, 'tech', new Date(2026, 9, 2, 17, 45)),
  t('21', 'IRCTC', 'irctc@sbi', 2280, 'travel', new Date(2026, 9, 2, 10, 15)),
  t('22', 'Amazon Pay', 'amazon@apl', 1720, 'other', new Date(2026, 9, 2, 22, 5)),
  t('23', 'DMart', 'dmart@ybl', 2200, 'food', new Date(2026, 9, 1, 18, 30)),
  t('24', 'Society maintenance', 'greenvalley@sbi', 1550, 'home', new Date(2026, 9, 1, 9, 0)),
  t('25', 'Myntra', 'myntra@icici', 1499, 'clothes', new Date(2026, 9, 1, 14, 0), 'failed'),
);

/** "Today" for the sample data, so day groups read Today / Yesterday. */
export const SAMPLE_TODAY = new Date(2026, 9, 6, 19, 45);

/** September successful spend per category (paise); sums to ₹25,340 as in the Compare design. */
export const SAMPLE_PREV_CATEGORY_PAISE: Record<string, number> = {
  food: 661000,
  tech: 230000,
  home: 490000,
  travel: 418000,
  health: 245000,
  other: 292000,
  entertain: 198000,
};

/** Current vs previous month per category, sorted by current spend. */
export function sampleMonthComparison() {
  const current = sampleCategoryTotals();
  const rows = SEED_CATEGORIES.map((c) => ({
    ...c,
    paise: current.find((x) => x.id === c.id)?.paise ?? 0,
    prevPaise: SAMPLE_PREV_CATEGORY_PAISE[c.id] ?? 0,
  }))
    .filter((c) => c.paise > 0 || c.prevPaise > 0)
    .sort((a, b) => b.paise - a.paise);
  const total = rows.reduce((s, c) => s + c.paise, 0);
  const prevTotal = rows.reduce((s, c) => s + c.prevPaise, 0);
  return { rows, total, prevTotal };
}

/** Whole-percent change; 0 when there's nothing to compare against. */
export function pctChange(now: number, prev: number) {
  return prev ? Math.round(((now - prev) / prev) * 100) : 0;
}
