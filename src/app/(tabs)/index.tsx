import { router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TxnRow } from '@/components/TxnRow';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SAMPLE_TXNS, sampleCategoryTotals } from '@/db/sample';
import { formatPaise } from '@/lib/money';

const byCategory = sampleCategoryTotals();
const total = byCategory.reduce((sum, c) => sum + c.paise, 0);

export default function Home() {
  return (
    <SafeAreaView className="flex-1 gap-5 bg-bg px-5 pt-4">
      <Text className="font-extrabold text-[32px]">Hi</Text>

      <View className="gap-4 rounded-card bg-surface p-5">
        <Text className="text-muted">Spent in October</Text>
        <Text className="font-extrabold text-[44px] tracking-[-1.5px]">{formatPaise(total)}</Text>
        <View className="h-3 flex-row gap-1">
          {byCategory.map((c) => (
            <View
              key={c.id}
              className="rounded-pill"
              style={{ flex: c.paise, backgroundColor: c.color }}
            />
          ))}
        </View>
        <View className="flex-row flex-wrap gap-x-4 gap-y-1">
          {byCategory.slice(0, 4).map((c) => (
            <View key={c.id} className="flex-row items-center gap-1.5">
              <View className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
              <Text className="text-[13px] text-muted">{c.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <Button onPress={() => router.push('/scan')}>
        <Text>Scan & pay</Text>
      </Button>
      <Button variant="outline" onPress={() => router.push('/history')}>
        <Text>See all</Text>
      </Button>

      <View>
        <Text className="font-semibold text-lg">Recent</Text>
        {SAMPLE_TXNS.slice(0, 3).map((t) => (
          <TxnRow key={t.id} txn={t} />
        ))}
      </View>
    </SafeAreaView>
  );
}
