import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';

export default function Details() {
  return (
    <SafeAreaView className="flex-1 bg-bg px-5 pt-4">
      <Text className="font-semibold text-lg">Details</Text>
    </SafeAreaView>
  );
}
