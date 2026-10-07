import Database from 'better-sqlite3';

import { createKysely, migrate, type SyncSqlite } from '@/db/sqlite';

/** A migrated in-memory database for unit tests (better-sqlite3 in Node). */
export function createTestDb() {
  const d = new Database(':memory:');
  const conn: SyncSqlite = {
    exec: (sql) => void d.exec(sql),
    all: (sql, params) => d.prepare(sql).all(...params),
    run: (sql, params) => d.prepare(sql).run(...params),
  };
  migrate(conn);
  return createKysely(conn);
}
