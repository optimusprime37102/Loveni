import { Avatar } from '@/src/components/ui/Avatar';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useDaysTogether } from '@/src/hooks/useDaysTogether';
import { useHaptics } from '@/src/hooks/useHaptics';
import { palette } from '@/src/theme/colors';
import { radii, spacing } from '@/src/theme/spacing';
import { fonts } from '@/src/theme/typography';
import { UserProfile } from '@/src/types/models';
import { format, parseISO, isValid } from 'date-fns';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

interface Props {
  me: UserProfile;
  partner: UserProfile;
  startDate: string | null;
}

const AVATAR_SIZE = 72;
const cardBg = require('../../../assets/images/loveni_top_card_bg.png');

function formatSinceDate(startDate: string | null) {
  if (!startDate) return null;
  const date = parseISO(startDate);
  if (!isValid(date)) return null;
  return format(date, 'MMM dd, yyyy');
}

export function DaysTogetherHero({ me, partner, startDate }: Props) {
  const { colors, theme, isDark } = useTheme();
  const haptics = useHaptics();
  const { days, hasStartDate } = useDaysTogether(startDate);
  const sinceLabel = formatSinceDate(startDate);
  const scale = useSharedValue(0.96);
  const opacity = useSharedValue(0);

  const openStartDate = () => {
    haptics.selection();
    router.push('/relationship/edit');
  };

  const love = isDark
    ? {
        line: 'rgba(255, 158, 192, 0.55)',
        connectorBg: '#3A1C2A',
        connectorBorder: 'rgba(255, 158, 192, 0.45)',
        connectorIcon: '#FF9EC0',
        chipBg: 'rgba(255, 255, 255, 0.12)',
        chipBorder: 'rgba(255, 158, 192, 0.28)',
        chipText: '#FFD0DE',
        counter: '#FFD0DE',
        label: '#FF9EC0',
        journey: '#FFB0C8',
      }
    : {
        line: 'rgba(101, 12, 52, 0.28)',
        connectorBg: palette.white,
        connectorBorder: 'rgba(242, 95, 130, 0.35)',
        connectorIcon: palette.rose,
        chipBg: 'rgba(255, 255, 255, 0.72)',
        chipBorder: 'rgba(242, 95, 130, 0.22)',
        chipText: colors.textHeading,
        counter: colors.textHeading,
        label: colors.textHeading,
        journey: '#8B1E45',
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
      <View style={styles.card}>
        <Image source={cardBg} style={styles.background} resizeMode="stretch" />
        {isDark ? <View style={styles.darkScrim} /> : null}

        <View style={styles.content}>
          <View style={styles.avatars}>
            <Avatar avatarId={me.avatarId} size={AVATAR_SIZE} ring />

            <View style={styles.link}>
              <Svg width={108} height={40} viewBox="0 0 108 40" style={styles.linkSvg}>
                <Path
                  d="M 0 20 Q 54 4 108 20"
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
                <SymbolView
                  name={{ ios: 'heart.fill', android: 'favorite', web: 'favorite' }}
                  size={14}
                  tintColor={love.connectorIcon}
                  weight="semibold"
                  fallback={<Text style={styles.connectorFallback}>♥</Text>}
                />
              </View>
            </View>

            <Avatar avatarId={partner.avatarId} size={AVATAR_SIZE} ring />
          </View>

          <View style={styles.journeyRow}>
            <Text color={love.journey} style={styles.journeyHeart}>
              ♡
            </Text>
            <Text color={love.journey} style={styles.journeyTitle}>
              OUR JOURNEY TOGETHER
            </Text>
            <Text color={love.journey} style={styles.journeyHeart}>
              ♡
            </Text>
          </View>

          <Text color={love.counter} center style={styles.counter}>
            {hasStartDate ? days : 0}
          </Text>

          <View style={styles.daysRow}>
            <Text color={love.label} style={styles.daysLabel}>
              Days Together
            </Text>
            <Text color={love.label} style={styles.daysHeart}>
              ♡
            </Text>
          </View>

          <Pressable
            onPress={openStartDate}
            accessibilityRole="button"
            accessibilityLabel={sinceLabel ? 'Edit start date' : 'Set your start date'}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: love.chipBg,
                borderColor: love.chipBorder,
                opacity: pressed ? 0.88 : 1,
              },
            ]}
          >
            <SymbolView
              name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
              size={14}
              tintColor={love.chipText}
              weight="medium"
              fallback={<Text style={{ color: love.chipText, fontSize: 12 }}>📅</Text>}
            />
            <Text color={love.chipText} style={styles.chipText}>
              {sinceLabel ? `Since ${sinceLabel}` : 'Set your start date'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 37,
    borderWidth: 0,
    overflow: 'hidden',
    backgroundColor: '#FBE4EF',
  },
  background: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  darkScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(26, 18, 32, 0.55)',
  },
  content: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    width: '100%',
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  link: {
    width: 108,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -6,
  },
  linkSvg: {
    position: 'absolute',
    top: 12,
  },
  connector: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginTop: -10,
  },
  connectorFallback: {
    fontSize: 12,
    lineHeight: 16,
    color: palette.rose,
  },
  journeyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 2,
  },
  journeyHeart: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
  },
  journeyTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.4,
  },
  counter: {
    fontFamily: fonts.displayBold,
    fontSize: 56,
    lineHeight: 62,
    letterSpacing: -1.2,
    marginTop: 2,
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 2,
  },
  daysLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  daysHeart: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18,
    marginTop: 1,
  },
  chip: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
  },
});
