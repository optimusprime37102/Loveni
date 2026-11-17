import { Avatar } from '@/src/components/ui/Avatar';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { palette } from '@/src/theme/colors';
import { radii, spacing } from '@/src/theme/spacing';
import { fonts } from '@/src/theme/typography';
import { UserProfile } from '@/src/types/models';
import { LinearGradient } from 'expo-linear-gradient';
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
  onConnect: () => void;
  onEnterCode: () => void;
}

const AVATAR_SIZE = 72;
const cardBg = require('../../../assets/images/loveni_top_card_bg.png');

export function WaitingPartnerHero({ me, onConnect, onEnterCode }: Props) {
  const { colors, theme, isDark } = useTheme();
  const haptics = useHaptics();
  const scale = useSharedValue(0.96);
  const opacity = useSharedValue(0);

  const love = isDark
    ? {
        border: 'rgba(255, 122, 168, 0.28)',
        line: 'rgba(255, 158, 192, 0.55)',
        connectorBg: '#3A1C2A',
        connectorBorder: 'rgba(255, 158, 192, 0.45)',
        placeholderBorder: 'rgba(255, 158, 192, 0.4)',
        placeholderBg: 'rgba(255, 255, 255, 0.05)',
        ghostBorder: 'rgba(255, 158, 192, 0.35)',
        ghostBg: 'rgba(38, 24, 36, 0.85)',
      }
    : {
        border: colors.border,
        line: 'rgba(101, 12, 52, 0.28)',
        connectorBg: palette.white,
        connectorBorder: 'rgba(242, 95, 130, 0.35)',
        placeholderBorder: 'rgba(141, 83, 106, 0.35)',
        placeholderBg: 'rgba(255, 248, 250, 0.92)',
        ghostBorder: colors.border,
        ghostBg: 'rgba(255, 248, 250, 0.92)',
      };

  useEffect(() => {
    scale.value = withSpring(1, { damping: 16 });
    opacity.value = withDelay(40, withSpring(1));
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
                  name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }}
                  size={14}
                  tintColor={colors.primary}
                  weight="semibold"
                  fallback={<Text style={styles.connectorFallback}>🔒</Text>}
                />
              </View>
            </View>

            <View
              style={[
                styles.placeholder,
                {
                  borderColor: love.placeholderBorder,
                  backgroundColor: love.placeholderBg,
                },
              ]}
            >
              <Text style={{ color: colors.textSecondary, fontSize: 22 }}>?</Text>
            </View>
          </View>

          <Text color={colors.textHeading} center style={styles.title}>
            Waiting for your person ♡
          </Text>
          <Text color={colors.textSecondary} center style={styles.copy}>
            Connect with your special someone and share beautiful moments together.
          </Text>

          <Pressable
            onPress={() => {
              haptics.light();
              onConnect();
            }}
            style={({ pressed }) => [
              styles.primaryBtn,
              theme.shadows.glow,
              { opacity: pressed ? 0.92 : 1 },
            ]}
          >
            <LinearGradient
              colors={colors.gradientPrimary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryGradient}
            >
              <Text style={styles.primaryLabel} color={colors.textInverse}>
                + Connect Partner
              </Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => {
              haptics.selection();
              onEnterCode();
            }}
            style={({ pressed }) => [
              styles.ghostBtn,
              theme.shadows.card,
              {
                borderColor: love.ghostBorder,
                backgroundColor: pressed ? colors.surfaceMuted : love.ghostBg,
              },
            ]}
          >
            <SymbolView
              name={{ ios: 'ticket', android: 'confirmation_number', web: 'confirmation_number' }}
              size={16}
              tintColor={colors.textHeading}
              weight="medium"
              fallback={<Text style={{ color: colors.textHeading, fontSize: 14 }}>🎟️</Text>}
            />
            <Text style={styles.ghostLabel} color={colors.textHeading}>
              Enter invite code
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
    marginBottom: spacing.lg,
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
    color: palette.rose,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  copy: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    maxWidth: 280,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  primaryBtn: {
    width: '100%',
    borderRadius: radii.pill,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  primaryGradient: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primaryLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 22,
  },
  ghostBtn: {
    width: '100%',
    minHeight: 50,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  ghostLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 22,
  },
});
