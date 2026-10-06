import { CamelCasePlugin, Kysely, SqliteDialect, type SqliteDatabase } from 'kysely';

import { MIGRATIONS } from '@/db/migrations';
import type { Database } from '@/db/types';

/** The few synchronous calls we need, satisfied by both expo-sqlite and better-sqlite3 (tests). */
export type SyncSqlite = {
  exec(sql: string): void;
  all(sql: string, params: readonly unknown[]): unknown[];
  run(
    sql: string,
    params: readonly unknown[],
  ): { changes: number; lastInsertRowid: number | bigint };
};

/** Brings the schema up to date. Each migration runs in a transaction with its version bump. */
export function migrate(db: SyncSqlite) {
  const [{ user_version: version }] = db.all('PRAGMA user_version', []) as {
    user_version: number;
  }[];
  MIGRATIONS.slice(version).forEach((sql, i) => {
    try {
      db.exec(`BEGIN;\n${sql}\nPRAGMA user_version = ${version + i + 1};\nCOMMIT;`);
    } catch (e) {
      db.exec('ROLLBACK;');
      throw e;
    }
  });
}

// Statements that return rows go through all(); everything else through run().
const READS = /^\s*(select|with|pragma)\b|\breturning\b/i;

/** Kysely on top of a SyncSqlite connection, with snake_case ↔ camelCase mapping. */
export function createKysely(db: SyncSqlite) {
  const adapter: SqliteDatabase = {
    close() {},
    prepare(sql) {
      return {
        reader: READS.test(sql),
        all: (params) => db.all(sql, params),
        run: (params) => db.run(sql, params),
        iterate: (params) => db.all(sql, params)[Symbol.iterator](),
      };
    },
  };
  return new Kysely<Database>({
    dialect: new SqliteDialect({ database: adapter }),
    plugins: [new CamelCasePlugin()],
  });
}

export type Db = ReturnType<typeof createKysely>;
