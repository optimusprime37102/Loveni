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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width={140} height={40} radius={20} />
        <Skeleton width={42} height={42} radius={21} />
      </View>
      <Skeleton width="70%" height={34} radius={12} />
      <Skeleton width="85%" height={18} radius={10} />
      <Skeleton height={280} radius={28} />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Skeleton height={120} radius={24} style={{ flex: 1 }} />
        <Skeleton height={120} radius={24} style={{ flex: 1 }} />
        <Skeleton height={120} radius={24} style={{ flex: 1 }} />
      </View>
      <Skeleton height={104} radius={28} />
      <Skeleton height={104} radius={28} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {},
});
