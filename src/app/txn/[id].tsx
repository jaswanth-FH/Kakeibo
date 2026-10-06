import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categoryOf, Receipt } from '@/components/receipt/Receipt';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SAMPLE_TXNS } from '@/db/sample';
import { SEED_CATEGORIES } from '@/db/seed';
import { useTokens } from '@/lib/use-tokens';

export default function TxnDetail() {
  const t = useTokens();
  const { id } = useLocalSearchParams<{ id: string }>();
  const txn = SAMPLE_TXNS.find((x) => x.id === id);

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="px-5 pt-2">
        <Button variant="icon" accessibilityLabel="Back" onPress={() => router.back()}>
          <ArrowLeft size={22} strokeWidth={1.8} color={t.text} />
        </Button>
      </View>
      {txn ? (
        <ScrollView contentContainerClassName="px-5 pb-6">
          <Receipt
            status={txn.status}
            amountPaise={txn.amountPaise}
            payeeName={txn.payeeName}
            category={categoryOf(txn.categoryId, SEED_CATEGORIES)}
            app="Google Pay"
            when={txn.createdAt}
          />
        </ScrollView>
      ) : (
        <Text className="p-5 text-muted">Transaction not found.</Text>
      )}
      {txn?.status === 'pending' ? (
        <View className="px-5 pb-4">
          <Button onPress={() => router.push('/pay/confirm')}>
            <Text>Did it go through?</Text>
          </Button>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
