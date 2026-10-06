import { useColorScheme } from 'nativewind';

import { fixed, themes } from '@/lib/theme';

export type ThemeName = keyof typeof themes;

export function useThemeName(): ThemeName {
  return useColorScheme().colorScheme === 'light' ? 'light' : 'dark';
}

/** Token hex values for props that can't take a className (SVG, icons, navigation, StatusBar). */
export function useTokens() {
  return { ...themes[useThemeName()], ...fixed };
}
