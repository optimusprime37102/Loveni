import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { Text } from '@/src/components/ui/Text';
import { Avatar } from '@/src/components/ui/Avatar';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useDaysTogether } from '@/src/hooks/useDaysTogether';
import { UserProfile } from '@/src/types/models';
import { radii, spacing } from '@/src/theme/spacing';

interface Props {
  me: UserProfile;
  partner: UserProfile | null;
  startDate: string | null;
}

export function DaysTogetherHero({ me, partner, startDate }: Props) {
  const { colors, theme } = useTheme();
  const { days, anniversary, hasStartDate } = useDaysTogether(startDate);
  const scale = useSharedValue(0.92);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 14 });
    opacity.value = withDelay(80, withSpring(1));
  }, [opacity, scale]);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[theme.shadows.soft, anim]}>
      <LinearGradient
        colors={colors.gradientHero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { borderColor: colors.border }]}
      >
        <View style={styles.avatars}>
          <Avatar avatarId={me.avatarId} size={64} ring />
          <View style={[styles.heartPill, { backgroundColor: colors.surface }]}>
            <Text style={{ fontSize: 18 }}>❤️</Text>
          </View>
          {partner ? (
            <Avatar avatarId={partner.avatarId} size={64} ring />
          ) : (
            <View
              style={[
                styles.placeholder,
                { borderColor: colors.borderStrong, backgroundColor: colors.surface },
              ]}
            >
              <Text muted>?</Text>
            </View>
          )}
        </View>

        <Text variant="label" color={colors.primary} center>
          Days together
        </Text>

        <Text variant="counter" color={colors.text} center>
          {hasStartDate ? days : '—'}
        </Text>

        <Text muted center>
          {partner
            ? `${me.displayName.split(' ')[0]} & ${partner.displayName.split(' ')[0]}`
            : 'Waiting for your person'}
        </Text>

        {anniversary ? (
          <View style={[styles.chip, { backgroundColor: colors.surfaceMuted }]}>
            <Text variant="caption" color={colors.primary}>
              {anniversary.daysUntil === 0
                ? `Happy ${anniversary.years}${getOrdinal(anniversary.years)} anniversary`
                : `${anniversary.daysUntil} day${anniversary.daysUntil === 1 ? '' : 's'} until anniversary`}
            </Text>
          </View>
        ) : (
          <View style={[styles.chip, { backgroundColor: colors.surfaceLavender }]}>
            <Text variant="caption" color={colors.secondary}>
              Set your start date to unlock the countdown
            </Text>
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
}

function getOrdinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radii.xl,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  heartPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -4,
    zIndex: 2,
  },
  placeholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
});
