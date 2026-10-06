import { cva, type VariantProps } from 'class-variance-authority';
import { Pressable, type PressableProps } from 'react-native';

import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

// React Native Reusables Button, restyled to docs/design-tokens.md (pill 56 / outline 52 / icon 44).
const buttonVariants = cva('flex-row items-center justify-center gap-2 active:opacity-80', {
  variants: {
    variant: {
      default: 'h-14 rounded-[28px] bg-primary px-6',
      outline: 'h-[52px] rounded-[26px] border-[1.5px] border-outline px-6',
      ghost: 'h-11 rounded-[22px] px-4',
      icon: 'h-11 w-11 rounded-[22px] bg-surface',
    },
  },
  defaultVariants: { variant: 'default' },
});

const buttonTextVariants = cva('font-semibold text-base', {
  variants: {
    variant: {
      default: 'font-bold text-on-primary',
      outline: 'text-text',
      ghost: 'text-text',
      icon: 'text-text',
    },
  },
  defaultVariants: { variant: 'default' },
});

type ButtonProps = PressableProps & VariantProps<typeof buttonVariants> & { className?: string };

export function Button({ className, variant, disabled, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant })}>
      <Pressable
        role="button"
        disabled={disabled}
        className={cn(buttonVariants({ variant }), disabled && 'opacity-50', className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}
