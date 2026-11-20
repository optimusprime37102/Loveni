import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { LoveNotesBg } from '@/src/components/illustrations/LoveNotesBg';
import { MoodDoubleHearts } from '@/src/components/illustrations/MoodDoubleHearts';
import { MoodHistoryEntryCard } from '@/src/components/moods/MoodHistoryEntryCard';
import {
  MoodsSummaryCard,
  RANGE_LABELS,
  type MoodRangeKey,
} from '@/src/components/moods/MoodsSummaryCard';
import { BackButton } from '@/src/components/ui/BackButton';
import { Screen } from '@/src/components/ui/Screen';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { Text } from '@/src/components/ui/Text';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCouple } from '@/src/contexts/CoupleContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { deleteMoodEntry, subscribeMoodHistory } from '@/src/services/moodService';
import { MoodEmoji, MoodEntry } from '@/src/types/models';
import { fonts } from '@/src/theme/typography';
import { spacing } from '@/src/theme/spacing';
import { formatMoodDayHeading, moodDayKey } from '@/src/utils/dates';
import { startOfDay, startOfMonth, startOfWeek } from 'date-fns';

type ListRow =
  | { type: 'day'; key: string; label: string; count: number }
  | { type: 'entry'; key: string; entry: MoodEntry };

function inRange(createdAt: number, range: MoodRangeKey) {
  if (range === 'all') return true;
  const date = startOfDay(new Date(createdAt));
  const now = new Date();
  if (range === 'week') {
    return date >= startOfWeek(now, { weekStartsOn: 1 });
  }
  return date >= startOfMonth(now);
}

export default function MoodHistoryScreen() {
  const { profile } = useAuth();
  const { couple, partner } = useCouple();
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<MoodRangeKey>('month');
  const [bgSize, setBgSize] = useState({ width: 0, height: 0 });

  const onBgLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width !== bgSize.width || height !== bgSize.height) {
      setBgSize({ width, height });
    }
  };

  useEffect(() => {
    if (!couple?.id) {
      setEntries([]);
      setLoading(false);
      return;
    }

    const unsub = subscribeMoodHistory(
      couple.id,
      (next) => {
        setEntries(next);
        setLoading(false);
      },
      () => setLoading(false),
      120
    );
    return unsub;
  }, [couple?.id]);

  const filtered = useMemo(
    () => entries.filter((entry) => inRange(entry.createdAt, range)),
    [entries, range]
  );

  const counts = useMemo(() => {
    const map: Partial<Record<MoodEmoji, number>> = {};
    for (const entry of filtered) {
      map[entry.mood] = (map[entry.mood] ?? 0) + 1;
    }
    return map;
  }, [filtered]);

  const rows = useMemo(() => {
    const groups = new Map<string, MoodEntry[]>();
    for (const entry of filtered) {
      const key = moodDayKey(entry.createdAt);
      const list = groups.get(key) ?? [];
      list.push(entry);
      groups.set(key, list);
    }

    const sortedKeys = [...groups.keys()].sort((a, b) => b.localeCompare(a));
    const next: ListRow[] = [];
    for (const key of sortedKeys) {
      const list = groups.get(key) ?? [];
      next.push({
        type: 'day',
        key: `day-${key}`,
        label: formatMoodDayHeading(list[0]?.createdAt ?? Date.now()),
        count: list.length,
      });
      for (const entry of list) {
        next.push({ type: 'entry', key: entry.id, entry });
      }
    }
    return next;
  }, [filtered]);

  const pickRange = () => {
    Alert.alert('Show moods from', undefined, [
      { text: RANGE_LABELS.week, onPress: () => setRange('week') },
      { text: RANGE_LABELS.month, onPress: () => setRange('month') },
      { text: RANGE_LABELS.all, onPress: () => setRange('all') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const onDelete = (entry: MoodEntry) => {
    if (entry.uid !== profile?.uid) return;
    Alert.alert('Delete mood?', 'This removes it from your shared history.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMoodEntry(entry.id);
            haptics.medium();
          } catch (e: unknown) {
            Alert.alert('Could not delete', (e as Error).message);
          }
        },
      },
    ]);
  };

  const onEdit = (entry: MoodEntry) => {
    if (entry.uid !== profile?.uid) return;
    router.push({
      pathname: '/(tabs)/mood',
      params: {
        moodId: entry.id,
        mood: entry.mood,
        message: entry.message ?? '',
      },
    });
  };

  const emptyCopy =
    range === 'all'
      ? 'No moods shared yet. Start with how you feel today.'
      : `No moods in ${RANGE_LABELS[range].toLowerCase()} yet.`;

  return (
    <Screen padded={false} edges={['top', 'left', 'right']}>
      <View
        style={[styles.fill, { backgroundColor: isDark ? colors.background : '#FFF1F5' }]}
        onLayout={onBgLayout}
      >
        <View pointerEvents="none" style={styles.bg}>
          {isDark ? (
            <LinearGradient
              colors={colors.gradientHero}
              start={{ x: 0.15, y: 0 }}
              end={{ x: 0.85, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          ) : bgSize.width > 0 && bgSize.height > 0 ? (
            <LoveNotesBg width={bgSize.width} height={bgSize.height} />
          ) : null}
        </View>

        <View style={styles.headerPad}>
          <View pointerEvents="none" style={styles.headerHearts}>
            <MoodDoubleHearts width={118} height={76} />
          </View>

          <View style={styles.headerRow}>
            <BackButton fallbackHref="/" style={styles.backBtn} />
            <View style={styles.titleBlock}>
              <Text color={colors.textHeading} style={styles.title}>
                All Moods
              </Text>
              <Text color={colors.textSecondary} style={styles.subtitle}>
                Mood history from both of you.
              </Text>
            </View>
          </View>
        </View>

        {loading ? (
          <View style={styles.listPad}>
            <Skeleton height={148} radius={26} />
            <Skeleton height={28} radius={12} style={{ marginTop: 22 }} />
            <Skeleton height={84} radius={22} style={{ marginTop: 12 }} />
            <Skeleton height={84} radius={22} style={{ marginTop: 10 }} />
          </View>
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(item) => item.key}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View style={styles.summaryWrap}>
                <MoodsSummaryCard
                  range={range}
                  total={filtered.length}
                  counts={counts}
                  onPressRange={pickRange}
                />
              </View>
            }
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyEmoji}>💭</Text>
                <Text color={colors.textHeading} style={styles.emptyTitle}>
                  Soft silence for now
                </Text>
                <Text color={colors.textSecondary} center style={styles.emptyCopy}>
                  {emptyCopy}
                </Text>
                <Pressable
                  onPress={() => {
                    haptics.selection();
                    router.push('/(tabs)/mood');
                  }}
                  style={({ pressed }) => [
                    styles.emptyCta,
                    { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
                  ]}
                >
                  <Text color={colors.textInverse} style={styles.emptyCtaLabel}>
                    Share a mood
                  </Text>
                </Pressable>
              </View>
            }
            renderItem={({ item }) => {
              if (item.type === 'day') {
                return (
                  <View style={styles.dayHeader}>
                    <Text color={colors.textHeading} style={styles.dayLabel}>
                      {item.label}
                    </Text>
                    <View
                      style={[
                        styles.dayBadge,
                        {
                          backgroundColor: isDark
                            ? 'rgba(255, 122, 168, 0.16)'
                            : '#FFE4EC',
                        },
                      ]}
                    >
                      <Text color={colors.brand} style={styles.dayBadgeLabel}>
                        {item.count} {item.count === 1 ? 'Entry' : 'Entries'}
                      </Text>
                    </View>
                  </View>
                );
              }

              const entry = item.entry;
              const mine = entry.uid === profile?.uid;
              return (
                <View style={styles.entryWrap}>
                  <MoodHistoryEntryCard
                    mood={entry.mood}
                    message={entry.message}
                    createdAt={entry.createdAt}
                    senderLabel={
                      mine ? 'You' : partner?.displayName?.split(' ')[0] || 'Partner'
                    }
                    avatarId={mine ? profile?.avatarId : partner?.avatarId}
                    canManage={mine}
                    onEdit={() => onEdit(entry)}
                    onDelete={() => onDelete(entry)}
                  />
                </View>
              );
            }}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  bg: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  headerPad: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    marginBottom: spacing.md,
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    marginTop: 2,
  },
  headerHearts: {
    position: 'absolute',
    right: -4,
    top: 10,
    zIndex: 1,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2,
    paddingTop: 1,
    paddingRight: 96,
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  listPad: {
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 48,
    flexGrow: 1,
  },
  summaryWrap: {
    marginBottom: spacing.lg,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 6,
  },
  dayLabel: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  dayBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dayBadgeLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
  },
  entryWrap: {
    marginBottom: 10,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 36,
    paddingHorizontal: spacing.lg,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  emptyTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    lineHeight: 24,
  },
  emptyCopy: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 260,
    marginBottom: 8,
  },
  emptyCta: {
    marginTop: 6,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  emptyCtaLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18,
  },
});
