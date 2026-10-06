import { useColorScheme } from 'nativewind';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { getSetting, openDatabase } from '@/db/client';
import type { Db } from '@/db/sqlite';

const DbContext = createContext<Db | null>(null);

type Opened = { db: Db; error?: undefined } | { db?: undefined; error: Error };

function open(): Opened {
  try {
    return { db: openDatabase() };
  } catch (e) {
    return { error: e instanceof Error ? e : new Error(String(e)) };
  }
}

/** Opens and migrates the database once; renders `fallback(error)` if that fails. */
export function DatabaseProvider({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: (error: Error) => ReactNode;
}) {
  const [opened] = useState(open);
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    if (!opened.db) return;
    getSetting(opened.db, 'theme').then((theme) => {
      if (theme === 'dark' || theme === 'light') setColorScheme(theme);
    });
  }, [opened, setColorScheme]);

  if (opened.error) return fallback(opened.error);
  return <DbContext.Provider value={opened.db}>{children}</DbContext.Provider>;
}

export function useDb(): Db {
  const db = useContext(DbContext);
  if (!db) throw new Error('useDb must be used inside <DatabaseProvider>');
  return db;
}
