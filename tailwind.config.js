const { fixed, themes } = require('./src/lib/theme');

const themed = Object.fromEntries(Object.keys(themes.dark).map((k) => [k, `var(--${k})`]));

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: { ...themed, ...fixed },
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
