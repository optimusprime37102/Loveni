import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card } from '@/src/components/ui/Card';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/contexts/ThemeContext';
import { LoveNote } from '@/src/types/models';
import { formatNoteTime } from '@/src/utils/dates';
import { spacing } from '@/src/theme/spacing';

interface Props {
  note: LoveNote | null;
  myUid: string;
  onPress: () => void;
}

export function LatestNoteCard({ note, myUid, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable onPress={onPress}>
      <Card>
        <View style={styles.header}>
          <Text variant="label" color={colors.primary}>
            Latest love note
          </Text>
          <Text variant="caption" color={colors.primary}>
            Open
          </Text>
        </View>
        {note ? (
          <>
            <Text variant="subtitle" style={styles.text} numberOfLines={3}>
              {note.text}
            </Text>
            <Text muted variant="caption">
              {note.fromUid === myUid ? 'From you' : 'From your partner'} ·{' '}
              {formatNoteTime(note.createdAt)}
            </Text>
          </>
        ) : (
          <Text muted style={styles.text}>
            No notes yet. Send something sweet.
          </Text>
        )}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  text: {
    marginBottom: spacing.xs,
  },
});
