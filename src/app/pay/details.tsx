import { router } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PayeeLetter, PayHeader } from '@/components/pay/PayParts';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SAMPLE_DRAFT } from '@/db/sample';
import { SEED_CATEGORIES } from '@/db/seed';
import { formatPaise } from '@/lib/money';
import { useTokens } from '@/lib/use-tokens';

const d = SAMPLE_DRAFT;
const category = SEED_CATEGORIES.find((c) => c.id === d.categoryId);
// ponytail: hard-coded label for the sample mc; the real map lives in features/pay/mcc.ts (M2).
const MERCHANT_TYPES: Record<string, string> = { '5732': 'Electronics' };

const rows = [
  ['UPI ID', d.payeeVpa],
  ['Payee name', d.payeeName],
  ['Order reference', d.txnRef],
  ['Merchant type', MERCHANT_TYPES[d.merchantCode]],
].filter((r): r is [string, string] => Boolean(r[1]));

export default function Details() {
  const t = useTokens();
  const isMerchant = Boolean(d.merchantCode) && d.merchantCode !== '0000';
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <PayHeader title="Pay" />
      <View className="flex-1 px-5">
        <View className="items-center pt-6">
          <PayeeLetter name={d.payeeName} color={category?.color ?? t['surface-2']} size={72} />
          <Text className="mt-3 font-bold text-[22px]">{d.payeeName}</Text>
          <Text className="mt-1 text-muted">{d.payeeVpa}</Text>
          {isMerchant && (
            <View className="mt-2 flex-row items-center gap-1.5">
              <ShieldCheck size={14} strokeWidth={1.8} color={t['ok-text']} />
              <Text className="font-semibold text-[14px] text-ok-text">Merchant QR</Text>
            </View>
          )}
          <Text className="mt-6 font-extrabold text-[56px] leading-[64px]">
            {formatPaise(d.amountPaise)}
          </Text>
          <Text className="text-[14px] text-muted">Amount set by the merchant&apos;s QR</Text>
        </View>

        <View className="mt-6 rounded-card bg-surface px-[18px] pb-1 pt-4">
          <Text className="text-[13px] text-muted">Read from QR code</Text>
          {rows.map(([label, value], i) => (
            <View
              key={label}
              className={`flex-row items-center justify-between gap-4 py-3 ${i ? 'border-t border-line' : ''}`}
            >
              <Text className="text-muted">{label}</Text>
              <Text className="shrink font-semibold" numberOfLines={1}>
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View className="px-5 pb-4">
        <Button onPress={() => router.push('/pay/tag')}>
          <Text>Continue</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
