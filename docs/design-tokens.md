# Design tokens

Dark theme only for v1. Every value below came from the design canvas. Use the Tailwind names in components, never raw hex.

## Colors

| Token | Hex | Use |
|---|---|---|
| `bg` | `#1F1F1F` | Screen background |
| `surface` | `#2A2A2A` | Cards, inputs, icon buttons, bottom sheet |
| `surface-2` | `#343434` | Selected tile, nested chips |
| `line` | `#3D3D3D` | Dividers inside cards, input borders |
| `outline` | `#5A5A5A` | Secondary (outlined) buttons and chips |
| `text` | `#F2F2F2` | Primary text, primary button fill |
| `muted` | `#A6A6A6` | Secondary text |
| `faint` | `#8C8C8C` | Inactive tab icons, previous-period labels |
| `ink` | `#1F1F1F` | Text and icons on light fills (primary button, avatars) |
| `ok` | `#A8E39A` | Success, scan line, decreases in spending |
| `bad` | `#F08A80` | Failed states |
| `prev` | `#5C5C5C` | Previous-period bars in Compare |

## Category colors

| Category | Hex |
|---|---|
| Food | `#F2B183` |
| Tech | `#7FD6D0` |
| Travel | `#F5A3C7` |
| Home | `#9CCBEB` |
| Services | `#E6E3A1` |
| Health | `#A8E39A` |
| Entertain. | `#B48CF0` |
| Social | `#F7D774` |
| Education | `#7FB38A` |
| Clothes | `#E07A6F` |
| Charity | `#7C84E6` |
| Other | `#8C8C8C` |

Category colors are stored in the `categories` table and applied with inline `style={{ backgroundColor }}`, since they are data.

## Type

Font: **Figtree** (`@expo-google-fonts/figtree`), weights 400, 500, 600, 700, 800.

| Role | Size / weight | Notes |
|---|---|---|
| Hero amount | 60 / 800 | letter-spacing −2 (Details, Amount) |
| Display amount | 44–50 / 800 | letter-spacing −1.5 (Home card, Success, donut centre) |
| Screen heading | 26–32 / 800 | Confirm, History title |
| Top bar title | 18 / 600 | |
| Body strong | 16 / 600 | Row titles |
| Body | 15 / 400 | |
| Caption | 13–14 / 400 | Usually `muted` |

## Shape and spacing

- Screen padding 20 horizontal, 16 top. Vertical gap between blocks 16–20.
- Radii: primary button 28 (pill, height 56), secondary button 26 (height 52, 1.5 px `outline` border), cards 22–28, category tiles 20, icon buttons 22 (44×44 circle), chips 18 (height 36).
- Tab bar: height 88 including the bottom inset, 4 icons at 26 px, a 4 px dot under the active one, 1 px `surface` top border.
- Bars and donut: segments are pills with rounded caps and gaps. Never touching wedges.
- Icons: 1.8 px stroke, rounded caps and joins (lucide-react-native matches this style).

## tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './features/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#1F1F1F',
        surface: '#2A2A2A',
        'surface-2': '#343434',
        line: '#3D3D3D',
        outline: '#5A5A5A',
        text: '#F2F2F2',
        muted: '#A6A6A6',
        faint: '#8C8C8C',
        ink: '#1F1F1F',
        ok: '#A8E39A',
        bad: '#F08A80',
        prev: '#5C5C5C',
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
  plugins: [],
};
```

React Native Reusables uses CSS variables (`--background`, `--primary`, etc.) in `global.css`. Map them to the tokens above so its components match: `--background` → bg, `--card` and `--popover` → surface, `--primary` → text, `--primary-foreground` → ink, `--muted-foreground` → muted, `--border` and `--input` → line, `--destructive` → bad. The installer's exact variable names may differ by version, so check its generated `global.css`.

## Donut drawing (react-native-svg)

One `<Circle>` per category with `strokeLinecap="round"`, rotated −90° so it starts at 12 o'clock.

```
R = 118, strokeWidth = 30, C = 2πR
gap = strokeWidth + 12          // round caps eat half the stroke on each end
usable = C − gap × segmentCount
segment length = usable × (value / total)
strokeDasharray = [length, C − length]
strokeDashoffset = −(runningStart + strokeWidth / 2)
runningStart += length + gap
```

With a single category, draw one full ring without caps.
