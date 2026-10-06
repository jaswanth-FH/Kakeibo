import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TxnRow } from '@/components/TxnRow';
import { Text } from '@/components/ui/text';
import { SAMPLE_TXNS } from '@/db/sample';

export default function History() {
  return (
    <SafeAreaView className="flex-1 bg-bg px-5 pt-4">
      <Text className="mb-2 font-extrabold text-[32px]">History</Text>
      <FlatList
        data={SAMPLE_TXNS}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => <TxnRow txn={item} />}
      />
    </SafeAreaView>
  );
}
