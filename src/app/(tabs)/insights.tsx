import { router } from 'expo-router';
import { ArrowLeft, ChevronDown, Ellipsis } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Donut } from '@/components/Donut';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { pctChange, sampleMonthComparison } from '@/db/sample';
import { formatPaise, formatPaiseCompact } from '@/lib/money';
import { useTokens } from '@/lib/use-tokens';

// ponytail: static sample month; period switching and real queries arrive in M2.
const PERIODS = ['Week', 'Month', 'Quarter'] as const;
const { rows, total, prevTotal } = sampleMonthComparison();
const byCategory = rows.filter((c) => c.paise > 0);
const change = pctChange(total, prevTotal);

export default function Insights() {
  const t = useTokens();
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('Month');

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
            {PERIODS.map((p) => (
              <Pressable
                key={p}
                role="tab"
                aria-selected={p === period}
                onPress={() => setPeriod(p)}
                className={
                  p === period
                    ? 'h-9 flex-1 items-center justify-center rounded-pill bg-primary'
                    : 'h-9 flex-1 items-center justify-center'
                }
              >
                <Text className={p === period ? 'font-semibold text-on-primary' : 'text-muted'}>
                  {p}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="flex-row items-baseline justify-between px-2">
          <Text className="text-lg text-muted">September</Text>
          <Text className="font-extrabold text-[22px]">October</Text>
          <Text className="text-lg text-future">November</Text>
        </View>

        <View className="items-center">
          <Donut segments={byCategory.map((c) => ({ id: c.id, value: c.paise, color: c.color }))}>
            <Text className="font-extrabold text-[44px] tracking-[-1.5px]">
              {formatPaiseCompact(total)}
            </Text>
            <Text className="text-[13px] text-muted">
              {change >= 0 ? '+' : ''}
              {change}% vs September
            </Text>
          </Donut>
        </View>

        <View className="flex-row flex-wrap gap-y-3">
          {byCategory.map((c, i) => (
            <View
              key={c.id}
              className={`w-1/2 flex-row items-center gap-3 ${i % 2 ? 'pl-3' : 'pr-3'}`}
            >
              <View className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
              <Text className="flex-1 text-base text-text-2">{c.name}</Text>
              <Text className="font-bold text-base">{formatPaise(c.paise)}</Text>
            </View>
          ))}
        </View>

        <Button
          variant="outline"
          className="self-center"
          onPress={() => router.push('/insights/compare')}
        >
          <Text>Compare with September</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
