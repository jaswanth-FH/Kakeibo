import { router } from 'expo-router';
import { Clock } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InfoCard, InfoRow, StatusCircle } from '@/components/receipt/Receipt';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SAMPLE_DRAFT } from '@/db/sample';
import { formatPaise } from '@/lib/money';
import { useTokens } from '@/lib/use-tokens';

export default function Failed() {
  const t = useTokens();
  const d = SAMPLE_DRAFT;
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView contentContainerClassName="gap-5 px-5 pt-20 pb-6">
        <View className="items-center gap-3">
          <StatusCircle ok={false} />
          <Text className="mt-3 text-center font-extrabold text-[34px] leading-[40px]">
            Payment didn&apos;t go through
          </Text>
          <Text className="text-center text-base leading-6 text-muted">
            {d.upiApp} reported this {formatPaise(d.amountPaise)} payment to{' '}
            {d.payeeName.split(',')[0]} as failed. If your account shows a debit, use the reference
            below with your bank.
          </Text>
        </View>
        <InfoCard>
          <InfoRow label={`Status from ${d.upiApp}`}>FAILURE</InfoRow>
          <InfoRow label="UPI reference">4281 0093 1755</InfoRow>
          <InfoRow label="Saved in history as" last>
            <Text className="font-semibold text-bad-text">Failed</Text>
          </InfoRow>
        </InfoCard>
        <View className="flex-row gap-3 px-1">
          <Clock size={14} strokeWidth={1.8} color={t.muted} style={{ marginTop: 3 }} />
          <Text className="flex-1 text-muted">
            No reply from the UPI app? The payment is kept as pending and rechecked when you reopen
            it.
          </Text>
        </View>
      </ScrollView>
      <View className="gap-3 px-5 pb-4">
        <Button onPress={() => router.push('/pay/choose-app')}>
          <Text>Try again</Text>
        </Button>
        <Button variant="outline" onPress={() => router.push('/pay/choose-app')}>
          <Text>Pay with another app</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
