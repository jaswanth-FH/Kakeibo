import { router } from 'expo-router';
import { ArrowLeft, Check, Mail, Smartphone, User } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Field } from '@/components/auth/Field';
import { PhotoAvatar } from '@/components/auth/PhotoAvatar';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SAMPLE_PROFILE } from '@/db/sample';
import { useTokens } from '@/lib/use-tokens';

export default function EditProfile() {
  const t = useTokens();
  const [name, setName] = useState(SAMPLE_PROFILE.name);
  const [email, setEmail] = useState(SAMPLE_PROFILE.email);

  return (
    <SafeAreaView className="flex-1 bg-bg pb-4">
      <View className="flex-row items-center justify-between px-5 pb-2 pt-4">
        <Button variant="icon" accessibilityLabel="Back" onPress={() => router.back()}>
          <ArrowLeft size={22} strokeWidth={1.8} color={t.text} />
        </Button>
        <Text className="font-semibold text-lg">Edit profile</Text>
        <View className="w-11" />
      </View>

      <ScrollView contentContainerClassName="gap-6 px-5 pb-6 pt-2">
        <View className="gap-3">
          <PhotoAvatar name={name || '?'} size={104} />
          <Text className="text-center text-muted">Member since August 2026</Text>
        </View>
        <Field label="Name" icon={User} value={name} onChangeText={setName} />
        <Field
          label="Email"
          icon={Mail}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View className="gap-2">
          <Text className="font-semibold">Mobile number</Text>
          <View className="h-[54px] flex-row items-center gap-3 rounded-2xl bg-surface px-5">
            <Smartphone size={20} strokeWidth={1.8} color={t.muted} />
            <Text className="flex-1 text-[17px]">{SAMPLE_PROFILE.phone}</Text>
            <Check size={16} strokeWidth={1.8} color={t['ok-text']} />
            <Text className="font-semibold text-ok-text">Verified</Text>
          </View>
          <Text className="text-muted">
            Changing it needs a new OTP.{' '}
            <Text className="text-text underline" onPress={() => router.push('/auth/login')}>
              Change number
            </Text>
          </Text>
        </View>
      </ScrollView>
      <View className="px-5">
        <Button onPress={() => router.back()}>
          <Text>Save changes</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
