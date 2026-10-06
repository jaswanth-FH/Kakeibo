import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { SEED_CATEGORIES } from '@/db/seed';
import type { SampleTxn } from '@/db/sample';
import { formatPaise } from '@/lib/money';

export function TxnRow({ txn }: { txn: SampleTxn }) {
  const category = SEED_CATEGORIES.find((c) => c.id === txn.categoryId);
  return (
    <View className="min-h-14 flex-row items-center gap-3 py-2">
      <View className="h-3 w-3 rounded-full" style={{ backgroundColor: category?.color }} />
      <View className="flex-1">
        <Text className="font-semibold text-base">{txn.payeeName}</Text>
        <Text className="text-[13px] text-muted">
          {category?.name} ·{' '}
          {txn.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </Text>
      </View>
      <View className="items-end">
        <Text className="font-semibold text-base">{formatPaise(txn.amountPaise)}</Text>
        {txn.status !== 'success' && (
          <Text
            className={txn.status === 'failed' ? 'text-[13px] text-bad' : 'text-[13px] text-faint'}
          >
            {txn.status}
          </Text>
        )}
      </View>
    </View>
  );
}
