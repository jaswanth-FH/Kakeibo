import { createContext, useContext } from 'react';
import { Text as RNText, type TextProps } from 'react-native';

import { cn } from '@/lib/utils';

// Lets a parent (e.g. Button) set the class for Text children, as in React Native Reusables.
export const TextClassContext = createContext<string | undefined>(undefined);

export function Text({ className, ...props }: TextProps & { className?: string }) {
  const contextClass = useContext(TextClassContext);
  return (
    <RNText className={cn('font-sans text-[15px] text-text', contextClass, className)} {...props} />
  );
}
