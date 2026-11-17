import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, Path, Stop, LinearGradient as SvgGradient } from 'react-native-svg';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { fonts } from '@/src/theme/typography';

interface Props {
  onLoveNote: () => void;
  onShareMood: () => void;
}

function LoveNoteActionIcon({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <Defs>
        <SvgGradient id="noteEnv" x1="6" y1="10" x2="38" y2="36" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFE8F0" />
          <Stop offset="1" stopColor="#FFB7CE" />
        </SvgGradient>
      </Defs>
      <Path
        d="M7 14.5c0-2.4 1.9-4.4 4.4-4.4h21.2c2.4 0 4.4 2 4.4 4.4v15c0 2.4-2 4.4-4.4 4.4H11.4c-2.5 0-4.4-2-4.4-4.4v-15z"
        fill="url(#noteEnv)"
      />
      <Path
        d="M9.2 15.2l12.8 9.6 12.8-9.6"
        stroke="#FFFFFF"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 29.6c-.8-.7-2.9-2.4-3.1-3.8-.2-1.3.7-2.3 1.8-2.2.7.1 1.2.6 1.3 1.2.2-.7.8-1.2 1.6-1.2 1.2 0 2 1 1.8 2.2-.3 1.5-2.6 3.2-3.4 3.8z"
        fill="#CE2457"
      />
    </Svg>
  );
}

function ShareMoodActionIcon({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <Circle cx="22" cy="23" r="15" fill="#FFFFFF" />
      <Path
        d="M15.2 21.2c.2-1.4 1.1-2.2 2.2-2 .8.2 1.3 1 1.2 2.1-.1.8-.7 1.5-1.5 1.4-.9-.1-1.6-.7-1.9-1.5z"
        fill="#CE2457"
      />
      <Path
        d="M25.4 21.2c.2-1.4 1.1-2.2 2.2-2 .8.2 1.3 1 1.2 2.1-.1.8-.7 1.5-1.5 1.4-.9-.1-1.6-.7-1.9-1.5z"
        fill="#CE2457"
      />
      <Circle cx="16.2" cy="24.8" r="1.5" fill="#FFB7CE" opacity={0.9} />
      <Circle cx="27.8" cy="24.8" r="1.5" fill="#FFB7CE" opacity={0.9} />
      <Path
        d="M16.8 26.8c1.4 2 3.2 3 5.2 3s3.8-1 5.2-3"
        stroke="#CE2457"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M32.2 15.4c-1-.9-3.6-3-3.9-4.8-.3-1.7.9-3 2.3-2.8.9.1 1.5.7 1.7 1.5.3-.9 1-1.5 2-1.5 1.6 0 2.6 1.3 2.3 2.9-.4 1.9-3.3 3.9-4.4 4.7z"
        fill="#F25F82"
      />
    </Svg>
  );
}

function ActionCard({
  gradient,
  icon,
  title,
  subtitle,
  titleColor,
  subtitleColor,
  chevronColor,
  showWatermark,
  onPress,
}: {
  gradient: readonly [string, string];
  icon: ReactNode;
  title: string;
  subtitle: string;
  titleColor: string;
  subtitleColor: string;
  chevronColor: string;
  showWatermark?: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const haptics = useHaptics();

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      style={({ pressed }) => [
        styles.shadow,
        theme.shadows.card,
        { opacity: pressed ? 0.92 : 1 },
      ]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {showWatermark ? <Text style={styles.watermark}>♡</Text> : null}

        <View style={styles.iconSlot}>{icon}</View>

        <View style={styles.copy}>
          <Text color={titleColor} style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.subtitleRow}>
            <Text
              color={subtitleColor}
              style={styles.subtitle}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.9}
            >
              {subtitle}
            </Text>
            <Text color={chevronColor} style={styles.chevron}>
              ›
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export function ConnectedActionsRow({ onLoveNote, onShareMood }: Props) {
  const { isDark } = useTheme();

  const noteGradient = isDark
    ? (['#FF7AA8', '#DD3C6A'] as const)
    : (['#FF8FB3', '#F25F82'] as const);
  const moodGradient = isDark
    ? (['#4A3558', '#3A2438'] as const)
    : (['#E9D5F5', '#F6D5E8'] as const);

  return (
    <View style={styles.row}>
      <ActionCard
        gradient={noteGradient}
        icon={<LoveNoteActionIcon size={ICON_SIZE} />}
        title="Love Note"
        subtitle="Send something sweet"
        titleColor="#FFFFFF"
        subtitleColor="rgba(255,255,255,0.92)"
        chevronColor="rgba(255,255,255,0.95)"
        onPress={onLoveNote}
      />
      <ActionCard
        gradient={moodGradient}
        icon={<ShareMoodActionIcon size={ICON_SIZE} />}
        title="Share Mood"
        subtitle="How are you feeling?"
        titleColor={isDark ? '#FFD0DE' : '#650C34'}
        subtitleColor={isDark ? '#B5A8B8' : '#8D536A'}
        chevronColor={isDark ? '#B5A8B8' : '#8D536A'}
        showWatermark={!isDark}
        onPress={onShareMood}
      />
    </View>
  );
}

const CARD_HEIGHT = 64;
const ICON_SIZE = 36;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  shadow: {
    flex: 1,
    borderRadius: 20,
  },
  card: {
    height: CARD_HEIGHT,
    borderRadius: 20,
    paddingLeft: 8,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    top: 4,
    right: 10,
    fontSize: 16,
    color: 'rgba(242, 95, 130, 0.12)',
  },
  iconSlot: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
    flexShrink: 0,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: 2,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.2,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  subtitle: {
    flexShrink: 1,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: -0.2,
  },
  chevron: {
    flexShrink: 0,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 15,
    marginLeft: 5,
    includeFontPadding: false,
  },
});
