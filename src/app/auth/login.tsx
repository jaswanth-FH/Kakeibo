import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logo } from '@/components/auth/Logo';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SAMPLE_PROFILE } from '@/db/sample';
import { cn } from '@/lib/utils';
import { useTokens } from '@/lib/use-tokens';

export default function Login() {
  const t = useTokens();
  const [phone, setPhone] = useState(SAMPLE_PROFILE.phone.replace('+91 ', ''));
  const [focused, setFocused] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-bg px-5 pb-4">
      <View className="flex-1 justify-center gap-4">
        <Logo />
        <Text className="mt-6 font-extrabold text-[34px] leading-[40px]">
          Every UPI payment, tracked as you pay
        </Text>
        <Text className="text-[17px] leading-6 text-muted">
          Sign in with your mobile number to keep your history safe across phones.
        </Text>
        <Text className="mt-2 font-semibold">Mobile number</Text>
        <View className="flex-row gap-2">
          <View className="h-14 w-14 items-center justify-center rounded-2xl border-[1.5px] border-line bg-surface">
            <Text className="font-semibold text-[17px]">+91</Text>
          </View>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="number-pad"
            maxLength={11}
            placeholder="98765 43210"
            placeholderTextColor={t.faint}
            autoFocus
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={cn(
              'h-14 flex-1 rounded-2xl border-[1.5px] bg-surface px-4 font-semibold text-[19px] text-text',
              focused ? 'border-text' : 'border-line',
            )}
          />
        </View>
      </View>

      <View className="gap-3">
        <Button onPress={() => router.push('/auth/otp')}>
          <Text>Send OTP</Text>
        </Button>
        <Button variant="outline">
          <Text>Continue with Google</Text>
        </Button>
        <Text className="text-center text-[13px] text-muted">
          By continuing you agree to the <Text className="text-[13px] underline">Terms</Text> and{' '}
          <Text className="text-[13px] underline">Privacy policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
