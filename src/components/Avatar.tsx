import { View } from 'react-native';

import { Text } from '@/components/ui/text';

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

/** Initials in a ringed circle (profile). */
export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  return (
    <View
      className="items-center justify-center rounded-full border-2 border-text bg-surface-2"
      style={{ width: size, height: size }}
    >
      <Text className="font-extrabold text-text" style={{ fontSize: size * 0.36 }}>
        {initials(name)}
      </Text>
    </View>
  );
}
