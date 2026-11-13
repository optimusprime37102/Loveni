import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { Text } from '@/src/components/ui/Text';
import { radii } from '@/src/theme/spacing';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  style,
}: Props) {
  const { colors, theme } = useTheme();
  const haptics = useHaptics();
  const isDisabled = disabled || loading;

  const handlePress = () => {
    haptics.light();
    onPress();
  };

  if (variant === 'primary') {
    return (
      <Pressable
        onPress={handlePress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.base,
          theme.shadows.glow,
          { opacity: isDisabled ? 0.55 : pressed ? 0.92 : 1 },
          style,
        ]}
      >
        <LinearGradient
          colors={colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <Text variant="subtitle" color={colors.textInverse}>
              {title}
            </Text>
          )}
        </LinearGradient>
      </Pressable>
    );
  }

  const background =
    variant === 'secondary'
      ? colors.surfaceMuted
      : variant === 'danger'
        ? 'rgba(228, 87, 87, 0.12)'
        : 'transparent';

  const textColor =
    variant === 'danger'
      ? colors.danger
      : variant === 'ghost'
        ? colors.primary
        : colors.text;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles.flat,
        {
          backgroundColor: background,
          borderColor: variant === 'ghost' ? colors.border : 'transparent',
          borderWidth: variant === 'ghost' ? 1 : 0,
          opacity: isDisabled ? 0.55 : pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text variant="subtitle" color={textColor}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    minHeight: 54,
  },
  gradient: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  flat: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
