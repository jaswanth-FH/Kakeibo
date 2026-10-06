import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categoryOf, Receipt } from '@/components/receipt/Receipt';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SAMPLE_DRAFT } from '@/db/sample';
import { SEED_CATEGORIES } from '@/db/seed';

export default function Success() {
  const d = SAMPLE_DRAFT;
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView contentContainerClassName="px-5 pt-2 pb-6">
        <Receipt
          status="success"
          amountPaise={d.amountPaise}
          payeeName={d.payeeName}
          category={categoryOf(d.categoryId, SEED_CATEGORIES)}
          note="Charger for MacBook"
          upiRef={d.upiApprovalRef.replace(/(\d{4})(?=\d)/g, '$1 ')}
          app={d.upiApp}
          when={new Date()}
        />
      </ScrollView>
      <View className="px-5 pb-4">
        <Button onPress={() => router.dismissTo('/')}>
          <Text>Done</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
