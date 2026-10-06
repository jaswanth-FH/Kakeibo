import { Stack } from 'expo-router';

import { colors } from '@/lib/tokens';

export default function PayLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
  );
}
