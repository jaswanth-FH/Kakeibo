import type { Generated, Insertable, Selectable } from 'kysely';

// Kysely table types. Columns are snake_case in SQL; CamelCasePlugin maps them to these names.
export type Database = {
  categories: CategoriesTable;
  transactions: TransactionsTable;
  payeeRules: PayeeRulesTable;
  settings: SettingsTable;
};

export type CategoriesTable = {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
  archived: Generated<number>; // 0 | 1
};

export type TxnStatus = 'pending' | 'success' | 'failed';

export type TransactionsTable = {
  id: string;
  payeeVpa: string;
  payeeName: string | null;
  amountPaise: number;
  categoryId: string;
  note: string | null;
  merchantCode: string | null;
  qrTxnRef: string | null;
  rawUri: string;
  upiApp: string | null;
  upiTxnId: string | null;
  upiApprovalRef: string | null;
  upiResponseRaw: string | null;
  status: TxnStatus;
  statusSource: 'app' | 'user' | null;
  failReason: 'app_failure' | 'user_cancelled' | 'user_marked' | 'no_upi_app' | null;
  createdAt: number; // epoch ms
  updatedAt: number;
};

export type PayeeRulesTable = {
  payeeVpa: string;
  categoryId: string;
  createdAt: number;
  updatedAt: number;
};

export type SettingsTable = { key: string; value: string };

export type Transaction = Selectable<TransactionsTable>;
export type NewTransaction = Insertable<TransactionsTable>;
