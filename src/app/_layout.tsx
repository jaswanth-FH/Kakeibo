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
      <Stack
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: themes[theme].bg } }}
      />
    </View>
  );
}
