const { colors } = require('./src/lib/tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ...colors,
        // React Native Reusables class names, mapped straight to our tokens (dark only, no CSS vars needed)
        background: colors.bg,
        foreground: colors.text,
        card: colors.surface,
        popover: colors.surface,
        primary: { DEFAULT: colors.text, foreground: colors.ink },
        secondary: { DEFAULT: colors.surface, foreground: colors.text },
        accent: { DEFAULT: colors['surface-2'], foreground: colors.text },
        'muted-foreground': colors.muted,
        border: colors.line,
        input: colors.line,
        destructive: colors.bad,
      },
      fontFamily: {
        sans: ['Figtree_400Regular'],
        medium: ['Figtree_500Medium'],
        semibold: ['Figtree_600SemiBold'],
        bold: ['Figtree_700Bold'],
        extrabold: ['Figtree_800ExtraBold'],
      },
      borderRadius: { pill: '9999px', card: '22px', tile: '20px' },
    },
  },
  // Weight comes from the Figtree family name (font-bold → Figtree_700Bold). Tailwind's fontWeight
  // utilities share those class names, and Android falls back to Roboto when a custom font gets fontWeight.
  corePlugins: { fontWeight: false },
  plugins: [],
};
