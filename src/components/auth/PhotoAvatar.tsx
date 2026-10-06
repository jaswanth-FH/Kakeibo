import { Camera } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { useTokens } from '@/lib/use-tokens';

/** Profile avatar with a camera badge (photo picking is not wired in the mockup). */
export function PhotoAvatar({ name, size = 96 }: { name: string; size?: number }) {
  const t = useTokens();
  return (
    <View className="self-center" style={{ width: size, height: size }}>
      <Avatar name={name} size={size} />
      <Pressable
        role="button"
        accessibilityLabel="Change photo"
        className="absolute -bottom-1 -right-1 h-11 w-11 items-center justify-center rounded-full border-[3px] border-bg bg-primary"
      >
        <Camera size={18} strokeWidth={1.8} color={t['on-primary']} />
      </Pressable>
    </View>
  );
}
