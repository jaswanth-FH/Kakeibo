import '@/global.css';

import {
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
  Figtree_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/figtree';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { cssInterop, vars } from 'nativewind';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { DatabaseProvider } from '@/db/provider';
import { themes } from '@/lib/theme';
import { useThemeName } from '@/lib/use-tokens';

SplashScreen.preventAutoHideAsync();
// NativeWind only styles core RN components; register SafeAreaView so className works on it.
cssInterop(SafeAreaView, { className: 'style' });

const themeVars = { dark: vars(themes.dark), light: vars(themes.light) };

export default function RootLayout() {
  const theme = useThemeName();
  const [loaded, error] = useFonts({
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
    Figtree_800ExtraBold,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <View style={[{ flex: 1 }, themeVars[theme]]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <DatabaseProvider
        fallback={(e) => (
          <View className="flex-1 justify-center gap-2 bg-bg px-5">
            <Text className="font-bold text-lg">Couldn&apos;t open your data</Text>
            <Text className="text-muted">{e.message}</Text>
          </View>
        )}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: themes[theme].bg },
          }}
        />
      </DatabaseProvider>
    </View>
  );
}
