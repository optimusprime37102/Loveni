import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { radii, spacing } from '@/src/theme/spacing';

interface Action {
  emoji: string;
  label: string;
  onPress: () => void;
}

export function QuickActions({ actions }: { actions: Action[] }) {
  const { colors, theme } = useTheme();
  const haptics = useHaptics();

  return (
    <View style={styles.row}>
      {actions.map((action) => (
        <Pressable
          key={action.label}
          onPress={() => {
            haptics.selection();
            action.onPress();
          }}
          style={({ pressed }) => [
            styles.item,
            theme.shadows.card,
            {
              backgroundColor: colors.surface,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Text style={styles.emoji}>{action.emoji}</Text>
          <Text variant="caption" center>
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  item: {
    flex: 1,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    gap: 6,
  },
  emoji: {
    fontSize: 22,
  },
});
