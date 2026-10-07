import { router } from 'expo-router';
import { ArrowLeft, ChevronDown, Ellipsis } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Donut } from '@/components/Donut';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useCategories, useLiveQuery } from '@/db/provider';
import { periodTotal, totalsByCategory } from '@/features/insights/queries';
import {
  nextRange,
  periodLabel,
  periodRange,
  previousRange,
  type PeriodKind,
  type Range,
} from '@/lib/dates';
import { formatPaise, formatPaiseCompact, pctChange } from '@/lib/money';
import { useTokens } from '@/lib/use-tokens';

const PERIODS: { kind: PeriodKind; label: string }[] = [
  { kind: 'week', label: 'Week' },
  { kind: 'month', label: 'Month' },
  { kind: 'quarter', label: 'Quarter' },
];

export default function Insights() {
  const t = useTokens();
  const [kind, setKind] = useState<PeriodKind>('month');
  const [range, setRange] = useState<Range>(() => periodRange('month', new Date()));
  const prev = previousRange(kind, range);
  const next = nextRange(kind, range);
  const nextIsFuture = next.start > new Date();
  const { cat } = useCategories();
  const data = useLiveQuery(
    async (db) => {
      const [byCategory, total, prevTotal] = await Promise.all([
        totalsByCategory(db, range),
        periodTotal(db, range),
        periodTotal(db, prev),
      ]);
      return { byCategory, total, prevTotal };
    },
    [range.start.getTime(), kind],
  );
  const total = data?.total ?? 0;
  const prevTotal = data?.prevTotal ?? 0;
  const byCategory = data?.byCategory ?? [];
  const change = pctChange(total, prevTotal);
  const prevLabel = periodLabel(kind, prev);
  const switchKind = (k: PeriodKind) => {
    setKind(k);
    setRange(periodRange(k, new Date()));
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView contentContainerClassName="gap-6 px-5 pb-8 pt-4">
        <View className="flex-row items-center justify-between">
          <Button
            variant="icon"
            accessibilityLabel="Back"
            onPress={() => (router.canGoBack() ? router.back() : router.navigate('/'))}
          >
            <ArrowLeft size={22} strokeWidth={1.8} color={t.text} />
          </Button>
          <Text className="font-bold text-lg">Statistics</Text>
          <Button variant="icon" accessibilityLabel="More options">
            <Ellipsis size={20} strokeWidth={1.8} color={t.text} />
          </Button>
        </View>

        <View className="flex-row gap-2">
          <Pressable
            role="button"
            className="h-11 flex-row items-center gap-1 rounded-pill bg-surface px-4"
          >
            <Text className="font-semibold">Expenses</Text>
            <ChevronDown size={16} strokeWidth={1.8} color={t.text} />
          </Pressable>
          <View className="flex-1 flex-row rounded-pill bg-surface p-1">
            {PERIODS.map(({ kind: k, label }) => (
              <Pressable
                key={k}
                role="tab"
                aria-selected={k === kind}
                onPress={() => switchKind(k)}
                className={
                  k === kind
                    ? 'h-9 flex-1 items-center justify-center rounded-pill bg-primary'
                    : 'h-9 flex-1 items-center justify-center'
                }
              >
                <Text className={k === kind ? 'font-semibold text-on-primary' : 'text-muted'}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="flex-row items-baseline justify-between px-2">
          <Pressable
            role="button"
            accessibilityLabel={`Show ${prevLabel}`}
            className="h-11 min-w-[44px] justify-center"
            onPress={() => setRange(prev)}
          >
            <Text className="text-lg text-muted">{prevLabel}</Text>
          </Pressable>
          <Text className="font-extrabold text-[22px]">{periodLabel(kind, range)}</Text>
          <Pressable
            role="button"
            accessibilityLabel={`Show ${periodLabel(kind, next)}`}
            disabled={nextIsFuture}
            className="h-11 min-w-[44px] items-end justify-center"
            onPress={() => setRange(next)}
          >
            <Text className={`text-lg ${nextIsFuture ? 'text-future' : 'text-muted'}`}>
              {periodLabel(kind, next)}
            </Text>
          </Pressable>
        </View>

        <View className="items-center">
          <Donut
            segments={byCategory.map((c) => ({
              id: c.categoryId,
              value: c.totalPaise,
              color: cat(c.categoryId)?.color ?? t.muted,
            }))}
          >
            <Text className="font-extrabold text-[44px] tracking-[-1.5px]">
              {formatPaiseCompact(total)}
            </Text>
            {prevTotal > 0 && (
              <Text className="text-[13px] text-muted">
                {change >= 0 ? '+' : ''}
                {change}% vs {prevLabel}
              </Text>
            )}
          </Donut>
        </View>

        <View className="flex-row flex-wrap gap-y-3">
          {byCategory.length === 0 && (
            <Text className="w-full text-center text-muted">No spending in this period</Text>
          )}
          {byCategory.map((c, i) => (
            <View
              key={c.categoryId}
              className={`w-1/2 flex-row items-center gap-3 ${i % 2 ? 'pl-3' : 'pr-3'}`}
            >
              <View
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: cat(c.categoryId)?.color }}
              />
              <Text className="flex-1 text-base text-text-2">{cat(c.categoryId)?.name}</Text>
              <Text className="font-bold text-base">{formatPaise(c.totalPaise)}</Text>
            </View>
          ))}
        </View>

        <Button
          variant="outline"
          className="self-center"
          onPress={() =>
            router.push({
              pathname: '/insights/compare',
              params: { kind, start: String(range.start.getTime()) },
            })
          }
        >
          <Text>Compare with {prevLabel}</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
