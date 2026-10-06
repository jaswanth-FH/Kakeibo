import { Ellipsis, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, SectionList, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TxnRow } from '@/components/TxnRow';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SAMPLE_TODAY, SAMPLE_TXNS, sampleCategoryTotals } from '@/db/sample';
import { formatPaise } from '@/lib/money';
import { useTokens } from '@/lib/use-tokens';

// ponytail: filters in memory over sample rows; becomes a drizzle query with LIKE + status/category filters in M2.
const FILTERS = [
  { id: 'all', label: 'All' },
  ...sampleCategoryTotals()
    .slice(0, 3)
    .map((c) => ({ id: c.id, label: c.name })),
  { id: 'failed', label: 'Failed' },
  { id: 'pending', label: 'Pending' },
];

const DAY = 86_400_000;
function dayLabel(d: Date) {
  const start = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const ago = Math.round((start(SAMPLE_TODAY) - start(d)) / DAY);
  if (ago === 0) return 'Today';
  if (ago === 1) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function History() {
  const t = useTokens();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = SAMPLE_TXNS.filter(
      (x) =>
        (filter === 'all' || x.status === filter || x.categoryId === filter) &&
        (!q || x.payeeName.toLowerCase().includes(q) || x.payeeVpa.toLowerCase().includes(q)),
    ).sort((a, b) => +b.createdAt - +a.createdAt);
    const groups = new Map<string, typeof rows>();
    for (const x of rows) {
      const key = dayLabel(x.createdAt);
      groups.set(key, [...(groups.get(key) ?? []), x]);
    }
    return [...groups].map(([title, data]) => ({
      title,
      data,
      // Failed payments never count toward spend.
      total: data.filter((x) => x.status !== 'failed').reduce((s, x) => s + x.amountPaise, 0),
    }));
  }, [query, filter]);

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
          {FILTERS.map((f) => (
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
        renderItem={({ item }) => <TxnRow txn={item} />}
        ListEmptyComponent={<Text className="pt-10 text-center text-muted">No payments found</Text>}
      />
    </SafeAreaView>
  );
}
