import { Pressable, View } from 'react-native';

import { cn } from '@/lib/utils';

type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
};

// 50×30 track, 24 px knob, 3 px inset (docs/design-tokens.md). hitSlop brings the target to 44 px.
export function Switch({ value, onValueChange, accessibilityLabel }: SwitchProps) {
  return (
    <Pressable
      role="switch"
      aria-checked={value}
      accessibilityLabel={accessibilityLabel}
      hitSlop={7}
      onPress={() => onValueChange(!value)}
      className={cn(
        'h-[30px] w-[50px] justify-center rounded-pill px-[3px]',
        value ? 'items-end bg-toggle-on' : 'items-start bg-toggle-off',
      )}
    >
      <View
        className={cn('h-6 w-6 rounded-full', value ? 'bg-toggle-knob-on' : 'bg-toggle-knob-off')}
      />
    </Pressable>
  );
}
