import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '@/src/components/ui/Card';
import { Text } from '@/src/components/ui/Text';
import { getMood } from '@/src/constants/moods';
import { useTheme } from '@/src/contexts/ThemeContext';
import { UserProfile } from '@/src/types/models';
import { formatRelativeShort } from '@/src/utils/dates';
import { spacing } from '@/src/theme/spacing';

interface Props {
  me: UserProfile;
  partner: UserProfile | null;
}

function isToday(timestamp?: number | null) {
  if (!timestamp) return false;
  const date = new Date(timestamp);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function MoodPreviewCard({ me, partner }: Props) {
  const { colors } = useTheme();
  const myToday = isToday(me.moodUpdatedAt);
  const partnerToday = isToday(partner?.moodUpdatedAt);
  const myMood = myToday ? getMood(me.currentMood) : null;
  const partnerMood = partnerToday ? getMood(partner?.currentMood) : null;

  return (
    <Card>
      <Text variant="label" color={colors.primary}>
        Today's moods
      </Text>
      <View style={styles.row}>
        <MoodCell
          title="You"
          emoji={myMood?.emoji}
          label={myMood?.label || 'No mood yet'}
          message={myToday ? me.moodMessage : null}
          time={myToday ? me.moodUpdatedAt : null}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <MoodCell
          title={partner?.displayName?.split(' ')[0] || 'Partner'}
          emoji={partnerMood?.emoji}
          label={partnerMood?.label || 'Waiting…'}
          message={partnerToday ? partner?.moodMessage || null : null}
          time={partnerToday ? partner?.moodUpdatedAt || null : null}
        />
      </View>
    </Card>
  );
}

function MoodCell({
  title,
  emoji,
  label,
  message,
  time,
}: {
  title: string;
  emoji?: string;
  label: string;
  message?: string | null;
  time?: number | null;
}) {
  return (
    <View style={styles.cell}>
      <Text variant="caption" muted>
        {title}
      </Text>
      <Text style={styles.emoji}>{emoji || '🤍'}</Text>
      <Text variant="subtitle">{label}</Text>
      {message ? (
        <Text variant="bodySmall" muted numberOfLines={2} center>
          {message}
        </Text>
      ) : null}
      {time ? (
        <Text variant="caption" muted>
          {formatRelativeShort(time)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
  },
  emoji: {
    fontSize: 32,
    lineHeight: 40,
  },
});
