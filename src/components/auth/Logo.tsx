import { ScanLine } from 'lucide-react-native';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { SEED_CATEGORIES } from '@/db/seed';
import { useTokens } from '@/lib/use-tokens';

const SIZE = 200;
const R = 84;
const C = SIZE / 2;
// Start angle (degrees, 0 = top, clockwise) of each 44° arc, coloured by category.
const ARCS: [number, string][] = [
  [-12, 'food'],
  [65, 'tech'],
  [140, 'home'],
  [212, 'entertain'],
  [262, 'health'],
];

function point(deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return `${C + R * Math.cos(rad)} ${C + R * Math.sin(rad)}`;
}

/** Login hero: category-coloured arcs around a scan glyph. */
export function Logo() {
  const t = useTokens();
  return (
    <View className="items-center justify-center self-center" style={{ width: SIZE, height: SIZE }}>
      <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
        {ARCS.map(([start, id]) => (
          <Path
            key={id}
            d={`M ${point(start)} A ${R} ${R} 0 0 1 ${point(start + 44)}`}
            stroke={SEED_CATEGORIES.find((c) => c.id === id)?.color}
            strokeWidth={26}
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </Svg>
      <ScanLine size={44} strokeWidth={1.8} color={t.text} />
    </View>
  );
}
