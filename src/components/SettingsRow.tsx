import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { Children, Fragment, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { useTokens } from '@/lib/use-tokens';

export function SettingsGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="gap-3">
      <Text className="ml-1 font-bold text-[13px] uppercase tracking-[0.6px] text-muted">
        {label}
      </Text>
      <View className="rounded-card bg-surface">
        {Children.toArray(children).map((child, i) => (
          <Fragment key={i}>
            {i > 0 && <View className="mx-5 h-px bg-line" />}
            {child}
          </Fragment>
        ))}
      </View>
    </View>
  );
}

type RowProps = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  /** Text shown before the chevron, e.g. "Google Pay". */
  value?: string;
  onPress?: () => void;
  toggle?: { value: boolean; onChange: (value: boolean) => void };
};

export function SettingsRow({ icon: Icon, title, subtitle, value, onPress, toggle }: RowProps) {
  const t = useTokens();
  const body = (
    <View className="min-h-[60px] flex-row items-center gap-4 px-5 py-3">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-surface-2">
        <Icon size={18} strokeWidth={1.8} color={t.text} />
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-base">{title}</Text>
        {subtitle && <Text className="text-[13px] text-muted">{subtitle}</Text>}
      </View>
      {toggle ? (
        <Switch value={toggle.value} onValueChange={toggle.onChange} accessibilityLabel={title} />
      ) : (
        <View className="flex-row items-center gap-2">
          {value && <Text className="text-muted">{value}</Text>}
          <ChevronRight size={18} strokeWidth={1.8} color={t.faint} />
        </View>
      )}
    </View>
  );

  return toggle ? (
    body
  ) : (
    <Pressable role="button" onPress={onPress} className="active:opacity-70">
      {body}
    </Pressable>
  );
}
