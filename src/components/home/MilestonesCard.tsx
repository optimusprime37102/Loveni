import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '@/src/components/ui/Card';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useDaysTogether } from '@/src/hooks/useDaysTogether';
import { radii, spacing } from '@/src/theme/spacing';

interface Props {
  startDate: string | null;
  connected: boolean;
}

const DAY_MARKS = [7, 30, 100, 365, 500, 1000] as const;

export function MilestonesCard({ startDate, connected }: Props) {
  const { colors } = useTheme();
  const { days, anniversary, hasStartDate } = useDaysTogether(startDate);

  const milestones = useMemo(() => {
    const items: { id: string; title: string; subtitle: string; done: boolean }[] = [];

    if (hasStartDate && typeof days === 'number') {
      for (const mark of DAY_MARKS) {
        const remaining = mark - days;
        items.push({
          id: `day-${mark}`,
          title: `${mark} days`,
          subtitle:
            remaining <= 0
              ? 'Reached'
              : remaining === 1
                ? '1 day away'
                : `${remaining} days away`,
          done: remaining <= 0,
        });
      }
    }

    if (anniversary) {
      items.push({
        id: 'anniversary',
        title: `${anniversary.years}${getOrdinal(anniversary.years)} anniversary`,
        subtitle:
          anniversary.daysUntil === 0
            ? 'Today'
            : anniversary.daysUntil === 1
              ? 'Tomorrow'
              : `${anniversary.daysUntil} days away`,
        done: anniversary.daysUntil === 0,
      });
    }

    const upcoming = items.filter((item) => !item.done).slice(0, 3);
    const recent = items.filter((item) => item.done).slice(-1);
    return [...recent, ...upcoming].slice(0, 3);
  }, [anniversary, days, hasStartDate]);

  return (
    <Card>
      <Text variant="label" color={colors.primary}>
        Milestones
      </Text>
      <Text muted style={styles.lead}>
        {connected
          ? hasStartDate
            ? 'Little markers on your shared timeline.'
            : 'Set your start date to unlock milestones.'
          : 'Connect with your person to grow milestones together.'}
      </Text>

      {milestones.length ? (
        <View style={styles.list}>
          {milestones.map((item) => (
            <View
              key={item.id}
              style={[
                styles.row,
                {
                  backgroundColor: item.done ? colors.surfaceMuted : colors.surfaceLavender,
                },
              ]}
            >
              <View
                style={[
                  styles.dot,
                  { backgroundColor: item.done ? colors.primary : colors.borderStrong },
                ]}
              />
              <View style={styles.copy}>
                <Text variant="subtitle">{item.title}</Text>
                <Text variant="caption" muted>
                  {item.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text variant="bodySmall" muted>
          Your first milestones will appear once your start date is set.
        </Text>
      )}
    </Card>
  );
}

function getOrdinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

const styles = StyleSheet.create({
  lead: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  list: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});
