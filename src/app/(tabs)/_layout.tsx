import { Tabs } from 'expo-router';
import { ChartPie, History, House, ScanLine, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { colors } from '@/lib/tokens';

function tabIcon(Icon: LucideIcon) {
  function TabIcon({ focused }: { focused: boolean }) {
    return (
      <View className="items-center gap-1.5">
        <Icon size={26} strokeWidth={1.8} color={focused ? colors.text : colors.faint} />
        <View className={focused ? 'h-1 w-1 rounded-full bg-text' : 'h-1 w-1'} />
      </View>
    );
  }
  return TabIcon;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.surface,
          borderTopWidth: 1,
          height: 88,
          paddingTop: 12,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon(House) }} />
      <Tabs.Screen name="scan" options={{ title: 'Scan', tabBarIcon: tabIcon(ScanLine) }} />
      <Tabs.Screen name="insights" options={{ title: 'Insights', tabBarIcon: tabIcon(ChartPie) }} />
      <Tabs.Screen name="history" options={{ title: 'History', tabBarIcon: tabIcon(History) }} />
    </Tabs>
  );
}
