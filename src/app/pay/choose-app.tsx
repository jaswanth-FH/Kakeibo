import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SAMPLE_DRAFT } from '@/db/sample';
import { SEED_CATEGORIES } from '@/db/seed';
import { formatPaise } from '@/lib/money';
import { useTokens } from '@/lib/use-tokens';
import { cn } from '@/lib/utils';

// ponytail: sample list until UpiIntent.getInstalledApps() exists (M3); letter tiles stand in for icons.
const APPS = ['Google Pay', 'PhonePe', 'Paytm', 'BHIM'];
const d = SAMPLE_DRAFT;
const category = SEED_CATEGORIES.find((c) => c.id === d.categoryId);

export default function ChooseApp() {
  const t = useTokens();
  const [app, setApp] = useState(d.upiApp);
  const [always, setAlways] = useState(true);

  return (
    <View className="flex-1 justify-end bg-scrim">
      <Pressable className="flex-1" accessibilityLabel="Close" onPress={() => router.back()} />
      <SafeAreaView edges={['bottom']} className="rounded-t-[32px] bg-surface px-5 pb-4">
        <View className="mb-5 mt-3 h-1 w-10 self-center rounded-pill bg-outline" />
        <Text className="font-bold text-[24px]">Pay {formatPaise(d.amountPaise)} with</Text>
        <Text className="mb-4 mt-1 text-muted">
          To {d.payeeName}. Tagged {category?.name}.
        </Text>

        {APPS.map((name) => {
          const on = name === app;
          return (
            <Pressable
              key={name}
              role="radio"
              aria-checked={on}
              onPress={() => setApp(name)}
              className={cn(
                'h-16 flex-row items-center gap-3 rounded-[20px] px-[14px]',
                on && 'bg-surface-2',
              )}
            >
              <View className="h-10 w-10 items-center justify-center rounded-[12px] bg-primary">
                <Text className="font-bold text-on-primary">{name[0]}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-base">{name}</Text>
                {name === d.upiApp && <Text className="text-[13px] text-muted">Last used</Text>}
              </View>
              <View
                className={cn(
                  'h-6 w-6 items-center justify-center rounded-full border-[1.5px]',
                  on ? 'border-primary bg-primary' : 'border-outline',
                )}
              >
                {on && <View className="h-2.5 w-2.5 rounded-full bg-on-primary" />}
              </View>
            </Pressable>
          );
        })}

        <Pressable
          role="checkbox"
          aria-checked={always}
          onPress={() => setAlways(!always)}
          className="mt-3 h-11 flex-row items-center gap-3"
        >
          <View
            className={cn(
              'h-5 w-5 items-center justify-center rounded-[4px] border-[1.5px]',
              always ? 'border-primary bg-primary' : 'border-outline',
            )}
          >
            {always && <Check size={14} strokeWidth={1.8} color={t['on-primary']} />}
          </View>
          <Text className="text-muted">Always use {app}</Text>
        </Pressable>

        <Button className="mt-2" onPress={() => router.push('/pay/waiting')}>
          <Text>Open {app}</Text>
        </Button>
      </SafeAreaView>
    </View>
  );
}
