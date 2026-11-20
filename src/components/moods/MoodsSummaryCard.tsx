import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { MOODS, type MoodOption } from '@/src/constants/moods';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { MoodEmoji } from '@/src/types/models';
import { fonts } from '@/src/theme/typography';
import { spacing } from '@/src/theme/spacing';

export type MoodRangeKey = 'week' | 'month' | 'all';

const RANGE_LABELS: Record<MoodRangeKey, string> = {
  week: 'This Week',
  month: 'This Month',
  all: 'All Time',
};

interface Props {
  range: MoodRangeKey;
  total: number;
  counts: Partial<Record<MoodEmoji, number>>;
  onPressRange: () => void;
}

export function MoodsSummaryCard({ range, total, counts, onPressRange }: Props) {
  const { colors, theme, isDark } = useTheme();
  const haptics = useHaptics();
  const cardBg = isDark ? colors.surfaceCard : '#FFFFFF';
  const pillBg = isDark ? colors.surface : '#FFFFFF';
  const pillBorder = isDark ? colors.border : 'rgba(242, 95, 130, 0.18)';

  const tiles = MOODS.map((mood) => ({
    ...mood,
    count: counts[mood.emoji] ?? 0,
  })).filter((mood) => mood.count > 0);

  const displayTiles: (MoodOption & { count: number })[] =
    tiles.length > 0
      ? tiles
      : MOODS.map((mood) => ({ ...mood, count: 0 }));

  return (
    <View style={[styles.card, { backgroundColor: cardBg }, theme.shadows.card]}>
      <View style={styles.topRow}>
        <Pressable
          onPress={() => {
            haptics.selection();
            onPressRange();
          }}
          style={({ pressed }) => [
            styles.rangePill,
            {
              backgroundColor: pillBg,
              borderColor: pillBorder,
              opacity: pressed ? 0.88 : 1,
            },
            theme.shadows.soft,
          ]}
        >
          <SymbolView
            name={{ ios: 'calendar', android: 'calendar_today', web: 'calendar_today' }}
            size={15}
            tintColor={colors.primary}
            weight="medium"
            fallback={<Text color={colors.primary}>📅</Text>}
          />
          <Text color={colors.textHeading} style={styles.rangeLabel}>
            {RANGE_LABELS[range]}
          </Text>
          <SymbolView
            name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
            size={14}
            tintColor={colors.textHeading}
            weight="semibold"
            fallback={<Text color={colors.textHeading}>▾</Text>}
          />
        </Pressable>

        <View style={styles.totalRow}>
          <SymbolView
            name={{ ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' }}
            size={16}
            tintColor={colors.brand}
            weight="medium"
            fallback={<Text color={colors.brand}>▮</Text>}
          />
          <Text color={colors.brand} style={styles.totalLabel}>
            {total} Mood{total === 1 ? '' : 's'}
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tiles}
      >
        {displayTiles.map((mood) => (
          <View
            key={mood.emoji}
            style={[
              styles.tile,
              {
                backgroundColor: isDark ? 'rgba(255, 122, 168, 0.12)' : mood.tileBg,
              },
            ]}
          >
            <Text style={styles.tileEmoji}>{mood.emoji}</Text>
            <Text color={colors.textHeading} style={styles.tileLabel}>
              {mood.label}
            </Text>
            <Text color={colors.textHeading} style={styles.tileCount}>
              {mood.count}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export { RANGE_LABELS };

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 14,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  rangePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  rangeLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 16,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  totalLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
  },
  tiles: {
    gap: 10,
    paddingRight: spacing.sm,
  },
  tile: {
    width: 72,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 2,
  },
  tileEmoji: {
    fontSize: 22,
    lineHeight: 28,
  },
  tileLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
  },
  tileCount: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
  },
});
