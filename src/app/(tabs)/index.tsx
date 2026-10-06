import { router } from 'expo-router';
import { Bell, ChevronRight, ScanLine, TrendingUp } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { TxnRow } from '@/components/TxnRow';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  pctChange,
  SAMPLE_PROFILE,
  SAMPLE_TODAY,
  SAMPLE_TXNS,
  sampleMonthComparison,
} from '@/db/sample';
import { formatPaise } from '@/lib/money';
import { useTokens } from '@/lib/use-tokens';

const { rows, total, prevTotal } = sampleMonthComparison();
const spent = rows.filter((c) => c.paise > 0);
const diff = total - prevTotal;
// Headline insight: the biggest category that went up.
const riser = spent.find((c) => c.paise > c.prevPaise);
const recent = [...SAMPLE_TXNS]
  .filter(
    (x) => x.createdAt.toDateString() === SAMPLE_TODAY.toDateString() && x.status === 'success',
  )
  .sort((a, b) => +b.createdAt - +a.createdAt);
const hour = SAMPLE_TODAY.getHours();
const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

export default function Home() {
  const t = useTokens();
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView contentContainerClassName="gap-4 px-5 pb-8 pt-4">
        <View className="flex-row items-center justify-between">
          <Pressable
            role="button"
            accessibilityLabel="Settings"
            className="flex-row items-center gap-3"
            onPress={() => router.push('/settings')}
          >
            <Avatar name={SAMPLE_PROFILE.name} />
            <View>
              <Text className="text-muted">{greeting}</Text>
              <Text className="font-extrabold text-[17px]">
                {SAMPLE_PROFILE.name.split(' ')[0]}
              </Text>
            </View>
          </Pressable>
          <Button variant="icon" accessibilityLabel="Notifications">
            <Bell size={20} strokeWidth={1.8} color={t.text} />
          </Button>
        </View>

        <Pressable
          role="button"
          className="gap-3 rounded-card bg-surface p-5 active:opacity-80"
          onPress={() => router.push('/insights')}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-muted">Spent in October</Text>
            <ChevronRight size={18} strokeWidth={1.8} color={t.muted} />
          </View>
          <Text className="font-extrabold text-[40px] tracking-[-1.5px]">{formatPaise(total)}</Text>
          <Text className="text-muted">
            {formatPaise(Math.abs(diff))} {diff >= 0 ? 'more' : 'less'} than September
          </Text>
          <View className="mt-1 h-3 flex-row gap-1">
            {spent.map((c) => (
              <View
                key={c.id}
                className="rounded-pill"
                style={{ flex: c.paise, backgroundColor: c.color }}
              />
            ))}
          </View>
          <View className="flex-row flex-wrap gap-x-4 gap-y-1">
            {spent.slice(0, 4).map((c) => (
              <View key={c.id} className="flex-row items-center gap-1.5">
                <View className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                <Text className="text-[13px] text-muted">{c.name}</Text>
              </View>
            ))}
          </View>
        </Pressable>

        <Button onPress={() => router.push('/scan')}>
          <ScanLine size={20} strokeWidth={1.8} color={t['on-primary']} />
          <Text>Scan & pay</Text>
        </Button>

        {riser && (
          <Pressable
            role="button"
            className="flex-row items-center gap-4 rounded-card border-[1.5px] border-line p-4 active:opacity-80"
            onPress={() => router.push('/insights/compare')}
          >
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: riser.color }}
            >
              <TrendingUp size={18} strokeWidth={1.8} color={t.ink} />
            </View>
            <View className="flex-1">
              <Text className="font-semibold">
                {riser.name} is up {pctChange(riser.paise, riser.prevPaise)}% this month
              </Text>
              <Text className="text-muted">Compare with September</Text>
            </View>
            <ChevronRight size={18} strokeWidth={1.8} color={t.muted} />
          </Pressable>
        )}

        <View className="mt-2 flex-row items-center justify-between">
          <Text className="font-bold text-lg">Recent</Text>
          <Pressable
            role="button"
            className="h-11 justify-center"
            onPress={() => router.push('/history')}
          >
            <Text className="text-muted">See all</Text>
          </Pressable>
        </View>
        <View>
          {recent.slice(0, 3).map((x) => (
            <TxnRow key={x.id} txn={x} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
