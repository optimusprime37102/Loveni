import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { HeartCloud } from '@/src/components/illustrations/HeartCloud';
import { Text } from '@/src/components/ui/Text';
import { getMood } from '@/src/constants/moods';
import { useTheme } from '@/src/contexts/ThemeContext';
import { MoodEmoji } from '@/src/types/models';
import { fonts } from '@/src/theme/typography';
import { formatNoteTime } from '@/src/utils/dates';

interface Props {
  mood: MoodEmoji;
  senderLabel: string;
  createdAt: number;
}

export function MoodRecentCard({ mood, senderLabel, createdAt }: Props) {
  const { colors, theme, isDark } = useTheme();
  const option = getMood(mood);
  const accent = option?.accent ?? colors.primary;
  const badgeBg = isDark ? 'rgba(255, 122, 168, 0.14)' : (option?.badgeBg ?? '#EFE8FB');
  const cardBg = isDark ? colors.surfaceCard : '#FFFFFF';
  const ringBg = isDark ? 'rgba(255, 122, 168, 0.18)' : `${accent}28`;

  return (
    <View style={[styles.shadow, { backgroundColor: cardBg }, theme.shadows.card]}>
      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <View style={styles.accentRail}>
          <LinearGradient
            colors={[accent, `${accent}99`]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.accent}
          />
        </View>

        <View style={[styles.emojiRing, { backgroundColor: ringBg, borderColor: `${accent}66` }]}>
          <Text style={styles.emoji}>{mood}</Text>
        </View>

        <View style={styles.meta}>
          <Text color={colors.textHeading} style={styles.name} numberOfLines={1}>
            {senderLabel}
          </Text>
          <View style={[styles.badge, { backgroundColor: badgeBg }]}>
            <Text style={styles.badgeEmoji}>{mood}</Text>
            <Text color={colors.textHeading} style={styles.badgeLabel}>
              {option?.label ?? 'Mood'}
            </Text>
          </View>
          <Text color={colors.textMuted} style={styles.time} numberOfLines={1}>
            {formatNoteTime(createdAt)}
          </Text>
        </View>

        <View pointerEvents="none" style={styles.decor}>
          <HeartCloud width={92} height={55} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 26,
  },
  card: {
    height: 92,
    borderRadius: 26,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  accentRail: {
    width: 18,
    height: '100%',
    paddingLeft: 10,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  accent: {
    width: 4,
    flex: 1,
    borderRadius: 999,
  },
  emojiRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 26,
    lineHeight: 32,
  },
  meta: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: 4,
    paddingRight: 78,
  },
  name: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeEmoji: {
    fontSize: 12,
    lineHeight: 14,
  },
  badgeLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 14,
  },
  time: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
  },
  decor: {
    position: 'absolute',
    right: 0,
    bottom: 10,
    width: 96,
    height: 58,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});
