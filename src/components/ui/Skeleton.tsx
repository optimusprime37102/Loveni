import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/src/contexts/ThemeContext';
import { radii } from '@/src/theme/spacing';

interface Props {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 16,
  radius = radii.md,
  style,
}: Props) {
  const { colors } = useTheme();
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.base,
        animatedStyle,
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: colors.skeleton,
        },
        style,
      ]}
    />
  );
}

export function HomeSkeleton() {
  return (
    <View style={{ gap: 16, padding: 20 }}>
      <Skeleton height={180} radius={24} />
      <Skeleton height={110} radius={20} />
      <Skeleton height={110} radius={20} />
      <Skeleton height={90} radius={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {},
});
