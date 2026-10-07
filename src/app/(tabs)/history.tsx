import { Ellipsis, Search } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, SectionList, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TxnRow } from '@/components/TxnRow';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useCategories, useLiveQuery } from '@/db/provider';
import type { TxnStatus } from '@/db/types';
import { dailyGroups, totalsByCategory } from '@/features/insights/queries';
import { startOfDay } from '@/lib/dates';
import { formatPaise } from '@/lib/money';
import { useTokens } from '@/lib/use-tokens';

const ALL_TIME = { start: new Date(0), end: new Date(8.64e15) };
const STATUSES: { id: TxnStatus; label: string }[] = [
  { id: 'failed', label: 'Failed' },
  { id: 'pending', label: 'Pending' },
];

const DAY = 86_400_000;
function dayLabel(d: Date) {
  const ago = Math.round((+startOfDay(new Date()) - +startOfDay(d)) / DAY);
  if (ago === 0) return 'Today';
  if (ago === 1) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function History() {
  const t = useTokens();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const { cat } = useCategories();
  const status = STATUSES.find((x) => x.id === filter)?.id;
  const categoryId = filter === 'all' || status ? undefined : filter;

  const topCategories =
    useLiveQuery((db) => totalsByCategory(db, ALL_TIME), [])
      ?.slice(0, 3)
      .map((c) => ({ id: c.categoryId, label: cat(c.categoryId)?.name ?? c.categoryId })) ?? [];
  const filters = [{ id: 'all', label: 'All' }, ...topCategories, ...STATUSES];

  const groups = useLiveQuery(
    (db) => dailyGroups(db, { search: query, categoryId, status }),
    [query, categoryId, status],
  );
  const sections = (groups ?? []).map((g) => ({
    title: dayLabel(g.day),
    data: g.txns,
    total: g.totalPaise,
  }));

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="gap-4 px-5 pb-2 pt-4">
        <View className="flex-row items-center justify-between">
          <Text className="font-extrabold text-[32px]">History</Text>
          <Button variant="icon" accessibilityLabel="More options">
            <Ellipsis size={20} strokeWidth={1.8} color={t.text} />
          </Button>
        </View>
        <View className="h-12 flex-row items-center gap-3 rounded-pill bg-surface px-4">
          <Search size={20} strokeWidth={1.8} color={t.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search merchant, note or UPI ID"
            placeholderTextColor={t.faint}
            accessibilityLabel="Search payments"
            className="flex-1 font-sans text-base text-text"
          />
        </View>
      </View>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 px-5 py-2"
        >
          {filters.map((f) => (
            <Pressable
              key={f.id}
              role="button"
              aria-selected={f.id === filter}
              onPress={() => setFilter(f.id)}
              className={
                f.id === filter
                  ? 'h-11 justify-center rounded-pill bg-primary px-4'
                  : 'h-11 justify-center rounded-pill border-[1.5px] border-chip-border px-4'
              }
            >
              <Text className={f.id === filter ? 'font-semibold text-on-primary' : 'font-semibold'}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(x) => x.id}
        contentContainerClassName="px-5 pb-8"
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <View className="flex-row justify-between pb-1 pt-4">
            <Text className="text-muted">{section.title}</Text>
            <Text className="text-muted">-{formatPaise(section.total)}</Text>
          </View>
        )}
        renderItem={({ item }) => <TxnRow txn={item} category={cat(item.categoryId)} />}
        ListEmptyComponent={
          groups && (
            <Text className="pt-10 text-center text-muted">
              {query || filter !== 'all' ? 'No payments found' : 'No payments yet'}
            </Text>
          )
        }
      />
    </SafeAreaView>
  );
}
