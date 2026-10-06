import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const R = 118;
const STROKE = 30;
const SIZE = 2 * R + STROKE;
const C = 2 * Math.PI * R;
const GAP = STROKE + 12; // round caps eat half the stroke on each end

type Segment = { id: string; value: number; color: string };

// Drawing rules from docs/design-tokens.md: rounded-cap segments with gaps, starting at 12 o'clock.
export function Donut({ segments, children }: { segments: Segment[]; children?: ReactNode }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const usable = C - GAP * segments.length;
  let start = 0;

  return (
    <View className="items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      <Svg
        width={SIZE}
        height={SIZE}
        style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}
      >
        {segments.length === 1 ? (
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke={segments[0].color}
            strokeWidth={STROKE}
            fill="none"
          />
        ) : (
          segments.map((s) => {
            const length = usable * (s.value / total);
            const offset = -(start + STROKE / 2);
            start += length + GAP;
            return (
              <Circle
                key={s.id}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                stroke={s.color}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={[length, C - length]}
                strokeDashoffset={offset}
                fill="none"
              />
            );
          })
        )}
      </Svg>
      {children}
    </View>
  );
}
