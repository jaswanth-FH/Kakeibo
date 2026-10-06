import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SAMPLE_PROFILE } from '@/db/sample';
import { cn } from '@/lib/utils';
import { useTokens } from '@/lib/use-tokens';

const LENGTH = 6;

export default function Otp() {
  const t = useTokens();
  const input = useRef<TextInput>(null);
  const [code, setCode] = useState('4829');

  return (
    <SafeAreaView className="flex-1 bg-bg px-5 pb-4">
      <View className="flex-1 gap-3 pt-4">
        <Button variant="icon" accessibilityLabel="Back" onPress={() => router.back()}>
          <ArrowLeft size={22} strokeWidth={1.8} color={t.text} />
        </Button>
        <Text className="mt-6 font-extrabold text-[34px]">Enter the code</Text>
        <Text className="text-muted">
          Sent by SMS to <Text className="font-bold">{SAMPLE_PROFILE.phone}</Text>.{' '}
          <Text className="underline" onPress={() => router.back()}>
            Change
          </Text>
        </Text>

        {/* One hidden input drives the six boxes. */}
        <Pressable
          accessibilityLabel="One-time code"
          className="mt-4 flex-row justify-between"
          onPress={() => input.current?.focus()}
        >
          {Array.from({ length: LENGTH }, (_, i) => (
            <View
              key={i}
              className={cn(
                'h-[60px] w-12 items-center justify-center rounded-2xl border-[1.5px] bg-surface',
                i === Math.min(code.length, LENGTH - 1) ? 'border-text' : 'border-line',
              )}
            >
              <Text className="font-extrabold text-[26px]">{code[i] ?? ''}</Text>
            </View>
          ))}
        </Pressable>
        <TextInput
          ref={input}
          value={code}
          onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, LENGTH))}
          keyboardType="number-pad"
          autoComplete="sms-otp"
          textContentType="oneTimeCode"
          autoFocus
          className="absolute h-px w-px opacity-0"
        />

        <View className="mt-2 flex-row items-center gap-3">
          <View className="h-2 w-2 rounded-full bg-ok-text" />
          <Text className="text-muted">Reading the SMS automatically</Text>
        </View>
        <Text className="mt-4 text-muted">
          <Text className="text-text-2">Didn&apos;t get it?</Text> Resend in 0:24
        </Text>
      </View>

      <Button onPress={() => router.push('/auth/profile')}>
        <Text>Verify</Text>
      </Button>
    </SafeAreaView>
  );
}
