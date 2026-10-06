import { router } from 'expo-router';
import { Mail, User } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Field } from '@/components/auth/Field';
import { PhotoAvatar } from '@/components/auth/PhotoAvatar';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SAMPLE_PROFILE } from '@/db/sample';
import { cn } from '@/lib/utils';

const APPS = ['Google Pay', 'PhonePe', 'Paytm', 'Ask each time'];

export default function ProfileSetup() {
  const [name, setName] = useState(SAMPLE_PROFILE.name);
  const [email, setEmail] = useState('');
  const [app, setApp] = useState(APPS[0]);

  return (
    <SafeAreaView className="flex-1 bg-bg pb-4">
      <ScrollView contentContainerClassName="gap-6 px-5 pb-6 pt-4">
        <View className="flex-row gap-2">
          {[true, true, false].map((done, i) => (
            <View
              key={i}
              className={cn('h-1 flex-1 rounded-full', done ? 'bg-text' : 'bg-surface')}
            />
          ))}
        </View>
        <View className="mt-6 gap-2">
          <Text className="font-extrabold text-[34px]">About you</Text>
          <Text className="text-[17px] text-muted">
            Two quick things and you&apos;re ready to scan.
          </Text>
        </View>
        <PhotoAvatar name={name || '?'} />
        <Field label="Your name" icon={User} value={name} onChangeText={setName} />
        <Field
          label="Email (optional)"
          icon={Mail}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          hint="For monthly summaries and account recovery"
        />
        <View className="gap-3">
          <Text className="font-semibold">Usual UPI app</Text>
          <View className="flex-row flex-wrap gap-2">
            {APPS.map((a) => (
              <Pressable
                key={a}
                role="radio"
                aria-checked={a === app}
                onPress={() => setApp(a)}
                className={cn(
                  'h-11 justify-center rounded-pill border-[1.5px] px-4',
                  a === app ? 'border-text bg-surface' : 'border-chip-border',
                )}
              >
                <Text className="font-semibold">{a}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      <View className="px-5">
        <Button onPress={() => router.replace('/')}>
          <Text>Get started</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
