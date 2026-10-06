import { Flashlight, Image as ImageIcon, Keyboard } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { colors } from '@/lib/tokens';

// ponytail: static mock of the scanner; expo-camera, gallery import and parsing arrive in M3.
const corner = 'absolute h-10 w-10 border-text';

export default function Scan() {
  const [torch, setTorch] = useState(false);

  return (
    <SafeAreaView className="flex-1 gap-5 bg-bg px-5 pt-4" edges={['top']}>
      <View className="flex-row items-center justify-between">
        <Text className="font-extrabold text-[32px]">Scan QR</Text>
        <Button
          variant="icon"
          className={torch ? 'bg-text' : undefined}
          accessibilityLabel={torch ? 'Turn flashlight off' : 'Turn flashlight on'}
          onPress={() => setTorch(!torch)}
        >
          <Flashlight size={20} strokeWidth={1.8} color={torch ? colors.ink : colors.text} />
        </Button>
      </View>

      <View className="flex-1 items-center justify-center rounded-card bg-surface">
        <View className="aspect-square w-3/4">
          <View className={`${corner} left-0 top-0 rounded-tl-[20px] border-l-4 border-t-4`} />
          <View className={`${corner} right-0 top-0 rounded-tr-[20px] border-r-4 border-t-4`} />
          <View className={`${corner} bottom-0 left-0 rounded-bl-[20px] border-b-4 border-l-4`} />
          <View className={`${corner} bottom-0 right-0 rounded-br-[20px] border-b-4 border-r-4`} />
          <View className="absolute left-4 right-4 top-1/2 h-0.5 rounded-pill bg-ok" />
        </View>
        <View className="absolute bottom-5 h-9 justify-center rounded-[18px] bg-surface-2 px-4">
          <Text className="text-sm">Looking for a QR code</Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <Button variant="outline" className="flex-1">
          <ImageIcon size={18} strokeWidth={1.8} color={colors.text} />
          <Text>From gallery</Text>
        </Button>
        <Button variant="outline" className="flex-1">
          <Keyboard size={18} strokeWidth={1.8} color={colors.text} />
          <Text>Enter UPI ID</Text>
        </Button>
      </View>
      <Button className="mb-4">
        <Text>Scan to pay</Text>
      </Button>
    </SafeAreaView>
  );
}
