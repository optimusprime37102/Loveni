import { Avatar } from '@/src/components/ui/Avatar';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useDaysTogether } from '@/src/hooks/useDaysTogether';
import { palette } from '@/src/theme/colors';
import { radii, spacing } from '@/src/theme/spacing';
import { UserProfile } from '@/src/types/models';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

interface Props {
  me: UserProfile;
  partner: UserProfile | null;
  startDate: string | null;
}

const AVATAR_SIZE = 64;

const MOTIFS = [
  { emoji: '🌹', top: 16, left: 12, size: 20, rotate: '-16deg', opacity: 0.55 },
  { emoji: '💕', top: 18, right: 14, size: 18, rotate: '12deg', opacity: 0.5 },
  { emoji: '🌸', top: 72, left: 8, size: 16, rotate: '18deg', opacity: 0.42 },
  { emoji: '💗', top: 68, right: 10, size: 15, rotate: '-10deg', opacity: 0.38 },
  { emoji: '❀', bottom: 78, left: 16, size: 14, rotate: '8deg', opacity: 0.35 },
  { emoji: '💞', bottom: 25, left: 16, size: 14, rotate: '8deg', opacity: 0.35 },
  { emoji: '🌺', bottom: 72, right: 18, size: 15, rotate: '-14deg', opacity: 0.4 },
  { emoji: '💑🏻', bottom: 18, right: 14, size: 18, rotate: '12deg', opacity: 0.5 },

  
] as const;

const FLOATING_HEARTS = [
  { left: '8%', delay: 0, size: 14, duration: 5200, drift: 8, outline: false },
  { left: '22%', delay: 700, size: 11, duration: 5800, drift: -7, outline: true },
  { left: '38%', delay: 300, size: 13, duration: 5000, drift: 10, outline: false },
  { left: '54%', delay: 1100, size: 10, duration: 6400, drift: -8, outline: true },
  { left: '68%', delay: 500, size: 15, duration: 5600, drift: 6, outline: false },
  { left: '82%', delay: 1400, size: 12, duration: 6000, drift: -9, outline: true },
  { left: '14%', delay: 1900, size: 9, duration: 4800, drift: 7, outline: false },
  { left: '76%', delay: 2300, size: 11, duration: 5400, drift: -5, outline: false },
] as const;

function FloatingHeart({
  left,
  delay,
  size,
  duration,
  drift,
  outline,
}: {
  left: `${number}%`;
  delay: number;
  size: number;
  duration: number;
  drift: number;
  outline: boolean;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration, easing: Easing.linear }),
          withTiming(0, { duration: 1 })
        ),
        -1,
        false
      )
    );

    return () => {
      cancelAnimation(progress);
    };
  }, [delay, duration, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0, 0.12, 0.65, 1],
      [0, outline ? 0.32 : 0.42, outline ? 0.24 : 0.34, 0],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [0, -220], Extrapolation.CLAMP),
      },
      {
        translateX: interpolate(
          progress.value,
          [0, 0.5, 1],
          [0, drift, drift * 0.3],
          Extrapolation.CLAMP
        ),
      },
      {
        scale: interpolate(progress.value, [0, 0.35, 1], [0.7, 1, 0.88], Extrapolation.CLAMP),
      },
    ],
  }));

  return (
    <Animated.Text
      style={[
        styles.floatHeart,
        {
          left,
          fontSize: size,
          color: outline ? 'rgba(244, 91, 140, 0.42)' : palette.softRose,
        },
        style,
      ]}
    >
      {outline ? '♡' : '♥'}
    </Animated.Text>
  );
}

export function DaysTogetherHero({ me, partner, startDate }: Props) {
  const { theme, isDark } = useTheme();
  const { days, anniversary, hasStartDate } = useDaysTogether(startDate);
  const connected = Boolean(partner);
  const scale = useSharedValue(0.96);
  const opacity = useSharedValue(0);

  const love = isDark
    ? {
        gradient: ['#3A1C2A', '#2A1520', '#1F1218'] as const,
        border: 'rgba(255, 122, 168, 0.28)',
        label: '#FF9EC0',
        text: '#FBF5F8',
        muted: '#B5A8B8',
        line: 'rgba(255, 158, 192, 0.6)',
        connectorBg: '#3A1C2A',
        connectorBorder: 'rgba(255, 158, 192, 0.45)',
        connectorIcon: '#FF9EC0',
        chipBg: 'rgba(255, 122, 168, 0.18)',
        chipText: '#FFD0DE',
        placeholderBorder: 'rgba(255, 158, 192, 0.4)',
        placeholderBg: 'rgba(255, 255, 255, 0.05)',
        motifBoost: 0.85,
      }
    : {
        gradient: ['#FFF5F8', '#FFE8EF', '#F8D6E4'] as const,
        border: 'rgba(244, 91, 140, 0.22)',
        label: palette.rose,
        text: palette.berry,
        muted: palette.mauve,
        line: 'rgba(130, 22, 63, 0.32)',
        connectorBg: palette.white,
        connectorBorder: 'rgba(244, 91, 140, 0.35)',
        connectorIcon: palette.rose,
        chipBg: 'rgba(255, 255, 255, 0.82)',
        chipText: palette.berry,
        placeholderBorder: 'rgba(154, 122, 136, 0.4)',
        placeholderBg: 'rgba(255, 255, 255, 0.75)',
        motifBoost: 1,
      };

  useEffect(() => {
    scale.value = withSpring(1, { damping: 16 });
    opacity.value = withDelay(50, withSpring(1));
  }, [opacity, scale]);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[theme.shadows.soft, anim]}>
      <LinearGradient
        colors={love.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { borderColor: love.border }]}
      >
        <LinearGradient
          colors={[palette.rose, palette.coral]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.accentBar}
        />

        {connected ? (
          <View pointerEvents="none" style={styles.floatLayer}>
            {FLOATING_HEARTS.map((heart) => (
              <FloatingHeart
                key={`${heart.left}-${heart.delay}`}
                left={heart.left}
                delay={heart.delay}
                size={heart.size}
                duration={heart.duration}
                drift={heart.drift}
                outline={heart.outline}
              />
            ))}
          </View>
        ) : null}

        {MOTIFS.map((motif, index) => (
          <Text
            key={`${motif.emoji}-${index}`}
            pointerEvents="none"
            style={[
              styles.motif,
              {
                top: 'top' in motif ? motif.top : undefined,
                left: 'left' in motif ? motif.left : undefined,
                right: 'right' in motif ? motif.right : undefined,
                bottom: 'bottom' in motif ? motif.bottom : undefined,
                fontSize: motif.size,
                opacity: motif.opacity * love.motifBoost,
                transform: [{ rotate: motif.rotate }],
              },
            ]}
          >
            {motif.emoji}
          </Text>
        ))}

        <View style={styles.content}>
          <View style={styles.avatars}>
            <Avatar avatarId={me.avatarId} size={AVATAR_SIZE} ring />

            <View style={styles.link}>
              <Svg width={118} height={44} viewBox="0 0 118 44" style={styles.linkSvg}>
                <Path
                  d="M 0 22 Q 59 6 118 22"
                  stroke={love.line}
                  strokeWidth={1.75}
                  strokeDasharray="1.5 5"
                  strokeLinecap="round"
                  fill="none"
                />
              </Svg>

              <View
                style={[
                  styles.connector,
                  {
                    backgroundColor: love.connectorBg,
                    borderColor: love.connectorBorder,
                  },
                ]}
              >
                {connected ? (
                  <SymbolView
                    name={{ ios: 'heart.fill', android: 'favorite', web: 'favorite' }}
                    size={15}
                    tintColor={love.connectorIcon}
                    weight="semibold"
                    fallback={<Text style={styles.connectorFallback}>♥</Text>}
                  />
                ) : (
                  <SymbolView
                    name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }}
                    size={14}
                    tintColor={love.connectorIcon}
                    weight="semibold"
                    fallback={
                      <Text style={[styles.connectorFallback, { color: love.connectorIcon }]}>
                        🔒
                      </Text>
                    }
                  />
                )}
              </View>
            </View>

            {partner ? (
              <Avatar avatarId={partner.avatarId} size={AVATAR_SIZE} ring />
            ) : (
              <View
                style={[
                  styles.placeholder,
                  {
                    borderColor: love.placeholderBorder,
                    backgroundColor: love.placeholderBg,
                  },
                ]}
              >
                <Text style={{ color: love.muted, fontSize: 20 }}>?</Text>
              </View>
            )}
          </View>

          <View style={styles.labelRow}>
            <Text style={[styles.labelHeart, { color: love.label }]}>♥</Text>
            <Text variant="label" color={love.label} center>
              Days together
            </Text>
            <Text style={[styles.labelHeart, { color: love.label }]}>♥</Text>
          </View>

          <Text variant="counter" color={love.text} center style={styles.counter}>
            {hasStartDate ? days : '—'}
          </Text>

          <Text center style={{ color: love.muted }}>
            {partner
              ? `${me.displayName.split(' ')[0]} & ${partner.displayName.split(' ')[0]}`
              : 'Waiting for your person'}
          </Text>

          {anniversary ? (
            <View style={[styles.chip, { backgroundColor: love.chipBg }]}>
              <Text variant="caption" color={love.chipText}>
                {anniversary.daysUntil === 0
                  ? `Happy ${anniversary.years}${getOrdinal(anniversary.years)} anniversary`
                  : `${anniversary.daysUntil} day${anniversary.daysUntil === 1 ? '' : 's'} until anniversary`}
              </Text>
            </View>
          ) : (
            <View style={[styles.chip, { backgroundColor: love.chipBg }]}>
              <Text variant="caption" color={love.chipText}>
                {connected
                  ? '❀  Set your start date to unlock the countdown'
                  : '♡  Connect to unlock your shared days'}
              </Text>
            </View>
          )}
        </View>
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
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  floatLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0,
  },
  floatHeart: {
    position: 'absolute',
    bottom: -8,
  },
  motif: {
    position: 'absolute',
    zIndex: 1,
  },
  content: {
    zIndex: 2,
    alignItems: 'center',
    width: '100%',
    gap: spacing.xs,
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  link: {
    width: 118,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -8,
  },
  linkSvg: {
    position: 'absolute',
    top: 14,
  },
  connector: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    borderWidth: 1.5,
    marginTop: -12,
  },
  connectorFallback: {
    fontSize: 13,
    lineHeight: 16,
    color: palette.rose,
  },
  placeholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelHeart: {
    fontSize: 11,
    opacity: 0.9,
  },
  counter: {
    marginVertical: 2,
  },
  chip: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.pill,
  },
});
