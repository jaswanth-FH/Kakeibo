import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Donut } from '@/components/Donut';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SAMPLE_PREV_MONTH_PAISE, sampleCategoryTotals } from '@/db/sample';
import { formatPaise, formatPaiseCompact } from '@/lib/money';
import { colors } from '@/lib/tokens';

// ponytail: static sample month; period switching and real queries arrive in M2.
const PERIODS = ['Week', 'Month', 'Quarter'] as const;
const byCategory = sampleCategoryTotals();
const total = byCategory.reduce((s, c) => s + c.paise, 0);
const change = Math.round(((total - SAMPLE_PREV_MONTH_PAISE) / SAMPLE_PREV_MONTH_PAISE) * 100);

export default function Insights() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('Month');

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView contentContainerClassName="gap-5 px-5 pt-4 pb-8">
        <View className="flex-row items-center justify-between">
          <Text className="font-extrabold text-[32px]">Statistics</Text>
          <View className="h-9 flex-row items-center gap-1 rounded-[18px] border-[1.5px] border-outline px-3">
            <Text className="text-sm">Expenses</Text>
            <ChevronDown size={16} strokeWidth={1.8} color={colors.text} />
          </View>
        </View>

        <View className="flex-row rounded-pill bg-surface p-1">
          {PERIODS.map((p) => (
            <Pressable
              key={p}
              onPress={() => setPeriod(p)}
              className={
                p === period
                  ? 'h-11 flex-1 items-center justify-center rounded-pill bg-surface-2'
                  : 'h-11 flex-1 items-center justify-center'
              }
            >
              <Text className={p === period ? 'font-semibold' : 'text-muted'}>{p}</Text>
            </Pressable>
          ))}
        </View>

        <View className="flex-row items-baseline justify-between px-2">
          <Text className="text-faint">September</Text>
          <Text className="font-bold text-lg">October</Text>
          <Text className="text-prev">November</Text>
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
          {byCategory.map((c) => (
            <View key={c.id} className="w-1/2 flex-row items-center gap-2 pr-3">
              <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
              <Text className="flex-1 text-muted">{c.name}</Text>
              <Text className="font-semibold">{formatPaise(c.paise)}</Text>
            </View>
          ))}
        </View>

        <Button variant="outline">
          <Text>Compare with September</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
