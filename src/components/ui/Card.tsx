import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';
import { radii, spacing } from '@/src/theme/spacing';

interface Props extends ViewProps {
  padded?: boolean;
  muted?: boolean;
  style?: ViewStyle;
}

export function Card({ children, padded = true, muted, style, ...rest }: Props) {
  const { colors, theme } = useTheme();

  return (
    <View
      {...rest}
      style={[
        styles.card,
        theme.shadows.card,
        {
          backgroundColor: muted ? colors.surfaceMuted : colors.surface,
          borderColor: colors.border,
          padding: padded ? spacing.lg : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.card,
    borderWidth: 1,
  },
});
