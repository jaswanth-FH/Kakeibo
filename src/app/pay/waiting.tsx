import { router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { CategoryLabel, categoryOf, InfoCard, InfoRow } from '@/components/receipt/Receipt';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SAMPLE_DRAFT } from '@/db/sample';
import { SEED_CATEGORIES } from '@/db/seed';
import { formatPaise } from '@/lib/money';
import { useTokens } from '@/lib/use-tokens';

const R = 50;
const C = 2 * Math.PI * R;

export default function Waiting() {
  const t = useTokens();
  const d = SAMPLE_DRAFT;
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 justify-center gap-6 px-5">
        <View className="items-center">
          <Svg width={112} height={112} viewBox="0 0 112 112">
            <Circle cx={56} cy={56} r={R} stroke={t.surface} strokeWidth={10} fill="none" />
            {/* static quarter arc starting at 12 o'clock */}
            <Circle
              cx={56}
              cy={56}
              r={R}
              stroke={t.text}
              strokeWidth={10}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${C * 0.25} ${C}`}
              transform="rotate(-90 56 56)"
            />
          </Svg>
        </View>
        <View className="items-center gap-3">
          <Text className="font-extrabold text-[28px]">Finish in {d.upiApp}</Text>
          <Text className="text-center text-base leading-6 text-muted">
            Enter your UPI PIN there. When you come back, one tap confirms how it went.
          </Text>
        </View>
        <InfoCard>
          <InfoRow label="Paying">{d.payeeName}</InfoRow>
          <InfoRow label="Amount">{formatPaise(d.amountPaise)}</InfoRow>
          <InfoRow label="Saved as" last>
            <CategoryLabel
              category={categoryOf(d.categoryId, SEED_CATEGORIES)}
              suffix=", pending"
            />
          </InfoRow>
        </InfoCard>
      </View>
      <View className="gap-3 px-5 pb-4">
        <Button onPress={() => router.push('/pay/confirm')}>
          <Text>I&apos;m back from {d.upiApp}</Text>
        </Button>
        <Button variant="outline" onPress={() => router.replace('/pay/failed')}>
          <Text>Cancel payment</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
