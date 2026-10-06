import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useTokens } from '@/lib/use-tokens';

/** Back button + centred title used across /pay/*. */
export function PayHeader({ title }: { title: string }) {
  const t = useTokens();
  return (
    <View className="flex-row items-center justify-between px-5 pb-2 pt-4">
      <Button variant="icon" accessibilityLabel="Back" onPress={() => router.back()}>
        <ArrowLeft size={22} strokeWidth={1.8} color={t.text} />
      </Button>
      <Text className="font-semibold text-lg">{title}</Text>
      <View className="w-11" />
    </View>
  );
}

/** First letter of the payee on a category-coloured circle. */
export function PayeeLetter({ name, color, size }: { name: string; color: string; size: number }) {
  return (
    <View
      className="items-center justify-center rounded-full"
      style={{ width: size, height: size, backgroundColor: color }}
    >
      <Text className="font-bold text-ink" style={{ fontSize: size * 0.32 }}>
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}
