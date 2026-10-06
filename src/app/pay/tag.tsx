import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PayeeLetter, PayHeader } from '@/components/pay/PayParts';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { SAMPLE_DRAFT } from '@/db/sample';
import { SEED_CATEGORIES } from '@/db/seed';
import { formatPaise } from '@/lib/money';
import { useTokens } from '@/lib/use-tokens';
import { cn } from '@/lib/utils';

const d = SAMPLE_DRAFT;
const suggested = SEED_CATEGORIES.find((c) => c.id === d.categoryId);
const shortPayee = d.payeeName.split(',')[0];

export default function Tag() {
  const t = useTokens();
  const [categoryId, setCategoryId] = useState<string | undefined>(suggested?.id);
  const [note, setNote] = useState('Charger for MacBook');
  const [always, setAlways] = useState(true);
  const selected = SEED_CATEGORIES.find((c) => c.id === categoryId);

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <PayHeader title="Tag this payment" />
      <ScrollView contentContainerClassName="px-5 pb-6 pt-2" keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center gap-3">
          <PayeeLetter name={d.payeeName} color={suggested?.color ?? t['surface-2']} size={44} />
          <View className="flex-1">
            <Text className="font-semibold text-lg" numberOfLines={1}>
              {d.payeeName}
            </Text>
            <Text className="text-[14px] text-muted" numberOfLines={1}>
              {d.payeeVpa}
            </Text>
          </View>
          <Text className="font-extrabold text-[22px]">{formatPaise(d.amountPaise)}</Text>
        </View>

        <View className="mb-3 mt-6 flex-row items-baseline justify-between">
          <Text className="font-bold text-lg">Category</Text>
          {suggested && <Text className="text-[14px] text-muted">Suggested: {suggested.name}</Text>}
        </View>
        <View className="-m-1 flex-row flex-wrap">
          {SEED_CATEGORIES.map((c) => {
            const on = c.id === categoryId;
            return (
              <View key={c.id} className="w-1/4 p-1">
                <Pressable
                  role="radio"
                  aria-checked={on}
                  accessibilityLabel={c.name}
                  onPress={() => setCategoryId(c.id)}
                  className={cn(
                    'h-[76px] items-center justify-center gap-1.5 rounded-tile border-[1.5px] bg-surface',
                    on ? 'border-text' : 'border-transparent',
                  )}
                >
                  <View className="h-5 w-5 rounded-full" style={{ backgroundColor: c.color }} />
                  <Text className={cn('text-[14px]', on && 'font-bold')} numberOfLines={1}>
                    {c.name}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        <Text className="mb-2 mt-6 font-bold text-lg">
          Note <Text className="font-sans text-lg text-muted">(optional)</Text>
        </Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          maxLength={60}
          placeholder="What was this for?"
          placeholderTextColor={t.faint}
          accessibilityLabel="Note"
          className="h-[52px] rounded-[26px] border-[1.5px] border-line bg-surface px-4 font-sans text-base text-text"
        />

        {selected && (
          <View className="mt-4 flex-row items-center gap-4">
            <View className="flex-1">
              <Text className="font-semibold">
                Always tag {shortPayee} as {selected.name}
              </Text>
              <Text className="text-[14px] text-muted">Skips this step next time</Text>
            </View>
            <Switch
              value={always}
              onValueChange={setAlways}
              accessibilityLabel={`Always tag ${shortPayee} as ${selected.name}`}
            />
          </View>
        )}
      </ScrollView>
      <View className="gap-2 px-5 pb-4">
        <Button disabled={!selected} onPress={() => router.push('/pay/choose-app')}>
          <Text>Pay {formatPaise(d.amountPaise)}</Text>
        </Button>
        <Text className="text-center text-[13px] text-muted">
          Opens your UPI app to enter your PIN
        </Text>
      </View>
    </SafeAreaView>
  );
}
