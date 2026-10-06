import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import type { Category } from '@/db/seed';
import type { Transaction } from '@/db/types';
import { formatPaise } from '@/lib/money';

const time = (ms: number) =>
  new Date(ms).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

/** Letter avatar in the category colour, payee + category, signed amount + time. Tap opens the txn (pending → confirm). */
export function TxnRow({ txn, category }: { txn: Transaction; category?: Category }) {
  const payee = txn.payeeName ?? txn.payeeVpa;
  const failed = txn.status === 'failed';
  return (
    <Pressable
      role="button"
      className="min-h-[60px] flex-row items-center gap-3 py-2 active:opacity-70"
      onPress={() =>
        txn.status === 'pending'
          ? router.push('/pay/confirm')
          : router.push({ pathname: '/txn/[id]', params: { id: txn.id } })
      }
    >
      <View
        className="h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: category?.color }}
      >
        <Text className="font-bold text-lg text-ink">{payee[0]?.toUpperCase()}</Text>
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="font-semibold text-base" numberOfLines={1}>
          {payee}
        </Text>
        <View className="flex-row items-center gap-1.5">
          <View className="h-2 w-2 rounded-full" style={{ backgroundColor: category?.color }} />
          <Text className="text-[13px] text-muted">{category?.name}</Text>
          {txn.status !== 'success' && (
            <View
              className={`ml-1 rounded-pill border px-2 ${failed ? 'border-bad-text' : 'border-outline'}`}
            >
              <Text className={`font-semibold text-xs ${failed ? 'text-bad-text' : 'text-muted'}`}>
                {failed ? 'Failed' : 'Pending'}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View className="items-end gap-0.5">
        <Text
          className={failed ? 'font-bold text-base text-faint line-through' : 'font-bold text-base'}
        >
          -{formatPaise(txn.amountPaise)}
        </Text>
        <Text className="text-[13px] text-muted">{time(txn.createdAt)}</Text>
      </View>
    </Pressable>
  );
}
