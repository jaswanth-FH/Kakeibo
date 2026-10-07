import { getRandomBytes } from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { openDatabaseSync, type SQLiteBindValue } from 'expo-sqlite';

import { createKysely, migrate, type Db, type SyncSqlite } from '@/db/sqlite';

const KEY_NAME = 'db-key';

/** 256-bit SQLCipher key, generated on first launch and kept in the device keystore. */
function databaseKey(): string {
  let key = SecureStore.getItem(KEY_NAME);
  if (!key) {
    key = Array.from(getRandomBytes(32), (b) => b.toString(16).padStart(2, '0')).join('');
    SecureStore.setItem(KEY_NAME, key);
  }
  return key;
}

/** Opens the encrypted database and runs pending migrations. Throws if either fails. */
export function openDatabase(): Db {
  const sqlite = openDatabaseSync('kakeibo.db', { enableChangeListener: true });
  // Must be the first statement. Expo Go has no SQLCipher and ignores it (database unencrypted).
  sqlite.execSync(`PRAGMA key = "x'${databaseKey()}'"`);
  sqlite.execSync('PRAGMA foreign_keys = ON');

  const conn: SyncSqlite = {
    exec: (sql) => sqlite.execSync(sql),
    all: (sql, params) => sqlite.getAllSync(sql, params as SQLiteBindValue[]),
    run: (sql, params) => {
      const r = sqlite.runSync(sql, params as SQLiteBindValue[]);
      return { changes: r.changes, lastInsertRowid: r.lastInsertRowId };
    },
  };
  migrate(conn);
  return createKysely(conn);
}

export async function getSetting(db: Db, key: string) {
  const row = await db
    .selectFrom('settings')
    .select('value')
    .where('key', '=', key)
    .executeTakeFirst();
  return row?.value;
}

export function setSetting(db: Db, key: string, value: string) {
  return db
    .insertInto('settings')
    .values({ key, value })
    .onConflict((oc) => oc.column('key').doUpdateSet({ value }))
    .execute();
}
