import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useCategories, useLiveQuery } from '@/db/provider';
import { compare, periodTotal } from '@/features/insights/queries';
import { periodLabel, periodRange, previousRange, type PeriodKind } from '@/lib/dates';
import { formatPaise, pctChange } from '@/lib/money';
import { useTokens } from '@/lib/use-tokens';

function Bar({
  paise,
  max,
  color,
  className,
}: {
  paise: number;
  max: number;
  color?: string;
  className?: string;
}) {
  return (
    <View className="flex-row items-center gap-2">
      <View
        className={`h-3.5 rounded-pill ${className ?? ''}`}
        style={{ width: `${(max ? paise / max : 0) * 72}%`, minWidth: 8, backgroundColor: color }}
      />
      <Text className={color ? 'text-base' : 'text-base text-muted'}>{formatPaise(paise)}</Text>
    </View>
  );
}

function Tile({ label, paise, current }: { label: string; paise: number; current?: boolean }) {
  return (
    <View className="flex-1 gap-1 rounded-card bg-surface p-4">
      <View className="flex-row items-center gap-2">
        <View className={`h-2.5 w-4 rounded-pill ${current ? 'bg-text' : 'bg-prev'}`} />
        <Text className="text-muted">{label}</Text>
      </View>
      <Text
        className={`font-extrabold text-[26px] tracking-[-1px] ${current ? '' : 'text-text-2'}`}
      >
        {formatPaise(paise)}
      </Text>
    </View>
  );
}

export default function Compare() {
  const t = useTokens();
  const params = useLocalSearchParams<{ kind?: PeriodKind; start?: string }>();
  const kind = params.kind ?? 'month';
  const range = periodRange(kind, params.start ? new Date(Number(params.start)) : new Date());
  const prev = previousRange(kind, range);
  const categories = useCategories();
  const cat = (id: string) => categories.find((c) => c.id === id);
  const data = useLiveQuery(
    async (db) => {
      const [rows, total, prevTotal] = await Promise.all([
        compare(db, range, prev),
        periodTotal(db, range),
        periodTotal(db, prev),
      ]);
      return { rows, total, prevTotal };
    },
    [kind, range.start.getTime()],
  );
  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const prevTotal = data?.prevTotal ?? 0;
  const max = Math.max(0, ...rows.flatMap((c) => [c.current, c.previous]));
  const change = pctChange(total, prevTotal);
  // The category with the biggest move in the direction of the overall change.
  const driver = [...rows].sort((a, b) =>
    change >= 0
      ? b.current - b.previous - (a.current - a.previous)
      : a.current - a.previous - (b.current - b.previous),
  )[0];
  const label = periodLabel(kind, range);
  const prevLabel = periodLabel(kind, prev);
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 pb-2 pt-4">
        <Button variant="icon" accessibilityLabel="Back" onPress={() => router.back()}>
          <ArrowLeft size={22} strokeWidth={1.8} color={t.text} />
        </Button>
        <Text className="font-bold text-lg">Compare</Text>
        <View className="w-11" />
      </View>

      <ScrollView contentContainerClassName="gap-5 px-5 pb-10 pt-4">
        <View className="flex-row gap-2">
          <Tile label={label} paise={total} current />
          <Tile label={prevLabel} paise={prevTotal} />
        </View>

        {data && prevTotal === 0 ? (
          <Text className="text-base text-muted">
            Nothing recorded in {prevLabel} yet, so there&apos;s nothing to compare.
          </Text>
        ) : (
          <Text className="text-base text-muted">
            You spent{' '}
            <Text className="font-bold text-base">
              {Math.abs(change)}% {change >= 0 ? 'more' : 'less'}
            </Text>
            .
            {driver && cat(driver.categoryId)
              ? ` ${cat(driver.categoryId)?.name} drove most of it.`
              : ''}
          </Text>
        )}

        {rows.map((c) => {
          const pct = pctChange(c.current, c.previous);
          const category = cat(c.categoryId);
          return (
            <View key={c.categoryId} className="gap-1.5">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: category?.color }}
                  />
                  <Text className="font-semibold text-base">{category?.name}</Text>
                </View>
                <Text
                  className={`font-bold text-base ${pct > 0 ? 'text-up-text' : pct < 0 ? 'text-ok-text' : 'text-muted'}`}
                >
                  {pct > 0 ? '+' : ''}
                  {pct}%
                </Text>
              </View>
              <Bar paise={c.current} max={max} color={category?.color ?? t.muted} />
              <Bar paise={c.previous} max={max} className="bg-prev" />
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
