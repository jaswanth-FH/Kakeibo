-- Local schema (docs/data-model.md). Timestamps are epoch milliseconds; money is integer paise.
CREATE TABLE categories (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  archived INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE transactions (
  id TEXT PRIMARY KEY NOT NULL,
  payee_vpa TEXT NOT NULL,
  payee_name TEXT,
  amount_paise INTEGER NOT NULL CHECK (amount_paise > 0),
  category_id TEXT NOT NULL REFERENCES categories(id),
  note TEXT,
  merchant_code TEXT,
  qr_txn_ref TEXT,
  raw_uri TEXT NOT NULL,
  upi_app TEXT,
  upi_txn_id TEXT,
  upi_approval_ref TEXT,
  upi_response_raw TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed')),
  status_source TEXT CHECK (status_source IN ('app', 'user')),
  fail_reason TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX txn_created_idx ON transactions (created_at);
CREATE INDEX txn_status_idx ON transactions (status);
CREATE INDEX txn_category_idx ON transactions (category_id);
CREATE INDEX txn_updated_idx ON transactions (updated_at); -- sync: "changed since"

CREATE TABLE payee_rules (
  payee_vpa TEXT PRIMARY KEY NOT NULL,
  category_id TEXT NOT NULL REFERENCES categories(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
