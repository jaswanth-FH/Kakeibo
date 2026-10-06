import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { pctChange, sampleMonthComparison } from '@/db/sample';
import { formatPaise } from '@/lib/money';
import { useTokens } from '@/lib/use-tokens';

// ponytail: sample October vs September; the real month-pair query lands in M2.
const { rows, total, prevTotal } = sampleMonthComparison();
const max = Math.max(...rows.flatMap((c) => [c.paise, c.prevPaise]));
const change = pctChange(total, prevTotal);
// The category with the biggest move in the direction of the overall change.
const driver = [...rows].sort((a, b) =>
  change >= 0
    ? b.paise - b.prevPaise - (a.paise - a.prevPaise)
    : a.paise - a.prevPaise - (b.paise - b.prevPaise),
)[0];

function Bar({ paise, color, className }: { paise: number; color?: string; className?: string }) {
  return (
    <View className="flex-row items-center gap-2">
      <View
        className={`h-3.5 rounded-pill ${className ?? ''}`}
        style={{ width: `${(paise / max) * 72}%`, minWidth: 8, backgroundColor: color }}
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
          <Tile label="October" paise={total} current />
          <Tile label="September" paise={prevTotal} />
        </View>

        <Text className="text-base text-muted">
          You spent{' '}
          <Text className="font-bold text-base">
            {Math.abs(change)}% {change >= 0 ? 'more' : 'less'}
          </Text>
          .{driver ? ` ${driver.name} drove most of it.` : ''}
        </Text>

        {rows.map((c) => {
          const pct = pctChange(c.paise, c.prevPaise);
          return (
            <View key={c.id} className="gap-1.5">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                  <Text className="font-semibold text-base">{c.name}</Text>
                </View>
                <Text
                  className={`font-bold text-base ${pct > 0 ? 'text-up-text' : pct < 0 ? 'text-ok-text' : 'text-muted'}`}
                >
                  {pct > 0 ? '+' : ''}
                  {pct}%
                </Text>
              </View>
              <Bar paise={c.paise} color={c.color} />
              <Bar paise={c.prevPaise} className="bg-prev" />
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
