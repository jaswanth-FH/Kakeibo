import type { LucideIcon } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { useTokens } from '@/lib/use-tokens';

type FieldProps = TextInputProps & { label: string; icon?: LucideIcon; hint?: ReactNode };

/** Labelled text input: surface fill, 1.5px line border, text-coloured border while focused. */
export function Field({ label, icon: Icon, hint, onFocus, onBlur, ...props }: FieldProps) {
  const t = useTokens();
  const [focused, setFocused] = useState(false);
  return (
    <View className="gap-2">
      <Text className="font-semibold">{label}</Text>
      <View
        className={cn(
          'h-14 flex-row items-center gap-3 rounded-2xl border-[1.5px] bg-surface px-5',
          focused ? 'border-text' : 'border-line',
        )}
      >
        {Icon && <Icon size={20} strokeWidth={1.8} color={t.muted} />}
        <TextInput
          className="flex-1 font-sans text-[17px] text-text"
          placeholderTextColor={t.faint}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
      </View>
      {hint && <Text className="text-[13px] text-muted">{hint}</Text>}
    </View>
  );
}
