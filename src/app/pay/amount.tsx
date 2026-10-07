import { router } from 'expo-router';
import { Delete } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PayeeLetter, PayHeader } from '@/components/pay/PayParts';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { usePayDraft } from '@/features/pay/draft';
import { parseUpiUri, VPA } from '@/features/pay/upiUri';
import { formatPaise } from '@/lib/money';
import { useTokens } from '@/lib/use-tokens';

const CAP_PAISE = 1_00_000_00;
const QUICK_ADD = [100_00, 500_00, 1_000_00];
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

/** Typed string → paise. "12.5" → 1250. */
const toPaise = (s: string) => {
  const [r = '', p = ''] = s.split('.');
  return Number(r || 0) * 100 + Number((p + '00').slice(0, 2));
};

export default function Amount() {
  const t = useTokens();
  const draft = usePayDraft((s) => s.draft);
  const start = usePayDraft((s) => s.start);
  const update = usePayDraft((s) => s.update);
  // No draft = arrived from "Enter UPI ID": ask for the VPA first.
  const manual = !draft;
  const [vpa, setVpa] = useState('');
  const vpaOk = VPA.test(vpa.trim());
  const [input, setInput] = useState('');
  const [capHit, setCapHit] = useState(false);
  const paise = toPaise(input);

  const setIfAllowed = (next: string) => {
    const over = toPaise(next) > CAP_PAISE;
    setCapHit(over);
    if (!over) setInput(next);
  };

  const press = (k: string) => {
    if (k === 'del') return setIfAllowed(input.slice(0, -1));
    if (k === '.' && input.includes('.')) return;
    if (input.includes('.') && input.split('.')[1].length >= 2) return;
    if (k !== '.' && input === '0') return setIfAllowed(k);
    setIfAllowed(input === '' && k === '.' ? '0.' : input + k);
  };

  const add = (p: number) => {
    const next = paise + p;
    setIfAllowed(next % 100 ? (next / 100).toFixed(2) : String(next / 100));
  };

  const proceed = () => {
    if (manual) start(parseUpiUri(`upi://pay?pa=${encodeURIComponent(vpa.trim())}`)!);
    update({ amountPaise: paise });
    router.push('/pay/tag');
  };

  // Show what was typed, with Indian grouping on the rupee part (keeps a trailing "." while typing).
  const [rupees, decimals] = input.split('.');
  const shown =
    formatPaise(Number(rupees || 0) * 100) + (decimals !== undefined ? `.${decimals}` : '');

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <PayHeader title="Pay" />
      <View className="px-5 pt-2">
        {manual ? (
          <View className="gap-1.5">
            <View className="h-14 justify-center rounded-card bg-surface px-[14px]">
              <TextInput
                value={vpa}
                onChangeText={setVpa}
                placeholder="name@bank"
                placeholderTextColor={t.faint}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                accessibilityLabel="UPI ID"
                className="font-sans text-base text-text"
              />
            </View>
            {vpa.trim() !== '' && !vpaOk && (
              <Text className="text-[13px] text-bad-text">Enter a UPI ID like name@bank</Text>
            )}
          </View>
        ) : (
          <View className="flex-row items-center gap-3 rounded-card bg-surface p-[14px]">
            <PayeeLetter
              name={draft.payeeName ?? draft.payeeVpa}
              color={t['surface-2']}
              size={44}
            />
            <View className="flex-1">
              <Text className="font-semibold text-base">{draft.payeeName ?? draft.payeeVpa}</Text>
              <Text className="text-[14px] text-muted">{draft.payeeVpa}</Text>
            </View>
            <View className="rounded-pill border border-chip-border px-2.5 py-1">
              <Text className="text-[12px] text-muted">Personal QR</Text>
            </View>
          </View>
        )}

        <View className="mt-10 flex-row items-center justify-center">
          <Text
            className={`font-extrabold text-[56px] leading-[64px] ${paise ? '' : 'text-faint'}`}
          >
            {shown}
          </Text>
          <View className="ml-1 h-12 w-0.5 rounded-pill bg-ok" />
        </View>
        <Text className={`text-center text-[14px] ${capHit ? 'text-bad-text' : 'text-muted'}`}>
          {capHit
            ? `UPI payments are capped at ${formatPaise(CAP_PAISE)}.`
            : manual
              ? 'Enter how much to send.'
              : 'This QR has no amount. Enter how much to send.'}
        </Text>

        <View className="mt-5 flex-row justify-center gap-2">
          {QUICK_ADD.map((p) => (
            <Pressable
              key={p}
              role="button"
              onPress={() => add(p)}
              className="h-11 justify-center rounded-pill border-[1.5px] border-chip-border px-4 active:opacity-70"
            >
              <Text className="font-semibold">+{formatPaise(p)}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="flex-1" />
      <View className="flex-row flex-wrap px-5">
        {KEYS.map((k) => (
          <Pressable
            key={k}
            role="button"
            accessibilityLabel={k === 'del' ? 'Delete digit' : k === '.' ? 'Decimal point' : k}
            onPress={() => press(k)}
            onLongPress={k === 'del' ? () => setIfAllowed('') : undefined}
            className="h-[60px] w-1/3 items-center justify-center active:opacity-60"
          >
            {k === 'del' ? (
              <Delete size={24} strokeWidth={1.8} color={t.text} />
            ) : (
              <Text className="font-semibold text-[26px]">{k}</Text>
            )}
          </Pressable>
        ))}
      </View>
      <View className="px-5 pb-4 pt-2">
        <Button disabled={paise === 0 || (manual && !vpaOk)} onPress={proceed}>
          <Text>Continue</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
