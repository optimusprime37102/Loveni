import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { spacing } from '@/src/theme/spacing';

interface Props {
  emoji: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ emoji, title, subtitle, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text variant="title" center>
        {title}
      </Text>
      <Text muted center style={styles.subtitle}>
        {subtitle}
      </Text>
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} style={styles.btn} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  subtitle: {
    maxWidth: 280,
  },
  btn: {
    marginTop: spacing.md,
    minWidth: 180,
  },
});
