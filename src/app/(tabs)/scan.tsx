import { router } from 'expo-router';
import { ArrowLeft, AtSign, Flashlight, Image as ImageIcon, ScanLine } from 'lucide-react-native';
import { vars } from 'nativewind';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { themes } from '@/lib/theme';

// ponytail: static mock of the scanner; expo-camera, gallery import and parsing arrive in M3.
// Until then "Scan to pay" opens the sample merchant QR and "Enter UPI ID" the personal-QR amount screen.
// The scanner is always dark (camera UI), whatever the app theme.
const dark = themes.dark;
const darkVars = vars(dark);
const corner = 'absolute h-14 w-14 border-text';

export default function Scan() {
  const [torch, setTorch] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-camera px-5 pt-4" style={darkVars} edges={['top']}>
      <View className="flex-row items-center justify-between">
        <Button
          variant="icon"
          accessibilityLabel="Back"
          onPress={() => (router.canGoBack() ? router.back() : router.navigate('/'))}
        >
          <ArrowLeft size={22} strokeWidth={1.8} color={dark.text} />
        </Button>
        <Text className="font-bold text-lg">Scan any UPI QR</Text>
        <Button
          variant="icon"
          className={torch ? 'bg-text' : undefined}
          accessibilityLabel={torch ? 'Turn flashlight off' : 'Turn flashlight on'}
          onPress={() => setTorch(!torch)}
        >
          <Flashlight size={20} strokeWidth={1.8} color={torch ? dark['on-primary'] : dark.text} />
        </Button>
      </View>

      <View className="flex-1 items-center justify-center gap-4">
        <View className="aspect-square w-2/3 items-center justify-center">
          <View
            className={`${corner} left-0 top-0 rounded-tl-[22px] border-l-[3px] border-t-[3px]`}
          />
          <View
            className={`${corner} right-0 top-0 rounded-tr-[22px] border-r-[3px] border-t-[3px]`}
          />
          <View
            className={`${corner} bottom-0 left-0 rounded-bl-[22px] border-b-[3px] border-l-[3px]`}
          />
          <View
            className={`${corner} bottom-0 right-0 rounded-br-[22px] border-b-[3px] border-r-[3px]`}
          />
          <Text className="text-sm text-muted">Camera view</Text>
          <View className="mt-4 h-[3px] w-5/6 rounded-pill bg-ok" />
        </View>
        <View className="mt-6 h-9 flex-row items-center gap-2 rounded-pill bg-surface px-4">
          <View className="h-2 w-2 rounded-full bg-ok" />
          <Text className="font-semibold text-sm">Looking for a QR code</Text>
        </View>
        <Text className="px-8 text-center text-muted">
          Shop counters, personal QRs and bills all work. Details fill in as soon as the code is
          read.
        </Text>
      </View>

      <View className="flex-row gap-3">
        <Button variant="outline" className="flex-1 px-3">
          <ImageIcon size={18} strokeWidth={1.8} color={dark.text} />
          <Text>From gallery</Text>
        </Button>
        <Button
          variant="outline"
          className="flex-1 px-3"
          onPress={() => router.push('/pay/amount')}
        >
          <AtSign size={18} strokeWidth={1.8} color={dark.text} />
          <Text>Enter UPI ID</Text>
        </Button>
      </View>
      <Button className="mb-4 mt-3" onPress={() => router.push('/pay/details')}>
        <ScanLine size={20} strokeWidth={1.8} color={dark['on-primary']} />
        <Text>Scan to pay</Text>
      </Button>
    </SafeAreaView>
  );
}
