# Data model

Local-first. All data lives in an encrypted SQLite database on the device (expo-sqlite with SQLCipher, key generated on first launch and kept in expo-secure-store). There is no backend in v1.

## Drizzle schema (`src/db/schema.ts`)

```ts
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),              // 'food', 'tech', …
  name: text('name').notNull(),             // 'Food'
  color: text('color').notNull(),           // '#F2B183'
  sortOrder: integer('sort_order').notNull(),
  archived: integer('archived', { mode: 'boolean' }).notNull().default(false),
});

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),              // uuid
  payeeVpa: text('payee_vpa').notNull(),
  payeeName: text('payee_name'),
  amountPaise: integer('amount_paise').notNull(),
  categoryId: text('category_id').notNull().references(() => categories.id),
  note: text('note'),
  merchantCode: text('merchant_code'),      // mc from QR
  qrTxnRef: text('qr_txn_ref'),             // tr from QR
  rawUri: text('raw_uri').notNull(),        // the exact URI sent to the UPI app
  upiApp: text('upi_app'),                  // package name, e.g. com.google.android.apps.nbu.paisa.user
  upiTxnId: text('upi_txn_id'),             // from the app's response
  upiApprovalRef: text('upi_approval_ref'), // ApprovalRefNo, shown as "UPI reference"
  upiResponseRaw: text('upi_response_raw'), // full response string for debugging
  status: text('status', { enum: ['pending', 'success', 'failed'] }).notNull(),
  statusSource: text('status_source', { enum: ['app', 'user'] }),
  failReason: text('fail_reason'),          // 'app_failure' | 'user_cancelled' | 'user_marked' | 'no_upi_app'
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
}, (t) => [
  index('txn_created_idx').on(t.createdAt),
  index('txn_status_idx').on(t.status),
  index('txn_category_idx').on(t.categoryId),
]);

export const payeeRules = sqliteTable('payee_rules', {
  payeeVpa: text('payee_vpa').primaryKey(), // "Always tag Apple Store as Tech"
  categoryId: text('category_id').notNull().references(() => categories.id),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),            // 'preferredUpiApp', 'firstName', 'appLock'
  value: text('value').notNull(),
});
```

## Status lifecycle

```
(Choose app → Open)      insert status = pending
UPI app returns SUCCESS  → success, statusSource = app
User taps "Yes, paid"    → success, statusSource = user
User taps "No, failed"   → failed,  failReason = user_marked
App returns FAILURE      → still go to Confirm; failed only after the user agrees
User taps Cancel         → failed,  failReason = user_cancelled
"Ask me later"           → stays pending
```

**Only `status = 'success'` counts toward spending totals.** Pending and failed rows appear in History only.

## Seed categories (`src/db/seed.ts`)

```ts
export const SEED_CATEGORIES = [
  { id: 'food',      name: 'Food',       color: '#F2B183' },
  { id: 'tech',      name: 'Tech',       color: '#7FD6D0' },
  { id: 'travel',    name: 'Travel',     color: '#F5A3C7' },
  { id: 'home',      name: 'Home',       color: '#9CCBEB' },
  { id: 'services',  name: 'Services',   color: '#E6E3A1' },
  { id: 'health',    name: 'Health',     color: '#A8E39A' },
  { id: 'entertain', name: 'Entertain.', color: '#B48CF0' },
  { id: 'social',    name: 'Social',     color: '#F7D774' },
  { id: 'education', name: 'Education',  color: '#7FB38A' },
  { id: 'clothes',   name: 'Clothes',    color: '#E07A6F' },
  { id: 'charity',   name: 'Charity',    color: '#7C84E6' },
  { id: 'other',     name: 'Other',      color: '#8C8C8C' },
].map((c, i) => ({ ...c, sortOrder: i }));
```

## Category suggestion (in order)

1. A `payeeRules` row for this VPA.
2. The category used most often for this VPA in past successful transactions.
3. The QR's merchant category code (`mc`) via the starter map below.
4. No suggestion: nothing preselected.

Starter MCC map (`src/features/pay/mcc.ts`). Extend it as you see real codes; `0000` means a personal (P2P) QR.

```ts
export const MCC_TO_CATEGORY: Record<string, string> = {
  '5411': 'food', '5499': 'food', '5812': 'food', '5813': 'food', '5814': 'food',
  '5045': 'tech', '5732': 'tech', '5734': 'tech', '5815': 'entertain', '5816': 'entertain',
  '4111': 'travel', '4121': 'travel', '4131': 'travel', '4511': 'travel', '5541': 'travel', '5542': 'travel', '7011': 'travel',
  '5912': 'health', '8011': 'health', '8021': 'health', '8062': 'health', '8099': 'health',
  '5611': 'clothes', '5621': 'clothes', '5651': 'clothes', '5661': 'clothes', '5691': 'clothes', '5699': 'clothes',
  '4814': 'services', '4899': 'services', '4900': 'services', '7230': 'services', '7299': 'services',
  '7832': 'entertain', '7922': 'entertain', '7996': 'entertain',
  '8211': 'education', '8220': 'education', '8299': 'education',
  '8398': 'charity',
  '5200': 'home', '5251': 'home', '5712': 'home', '5722': 'home',
};
```

## Insight queries (`src/features/insights/queries.ts`)

All filter `status = 'success'` and a `[start, end)` period in local time (Asia/Kolkata unless the device says otherwise).

- `totalsByCategory(start, end)` → `{ categoryId, totalPaise }[]`, sorted desc
- `periodTotal(start, end)` → number
- `compare(currentRange, previousRange)` → per-category `{ current, previous, pctChange }`, where `pctChange` is `null` when previous = 0 (show "New" instead of a %)
- `topIncrease(currentRange, previousRange)` → the category for the Home insight card, only if previous > 0
- `dailyGroups(filters)` → History sections with day totals (success only in the total, but all statuses listed)

Week starts Monday. Quarter = calendar quarter. Write unit tests with fixed fixtures for month boundaries and the 0-previous case.
