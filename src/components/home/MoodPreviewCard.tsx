import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { FeaturePreviewCard } from '@/src/components/home/FeaturePreviewCard';
import { HeartCloud } from '@/src/components/illustrations/HeartCloud';
import { HeartOutlineIcon } from '@/src/components/illustrations/OutlineIcons';
import { Avatar } from '@/src/components/ui/Avatar';
import { Card } from '@/src/components/ui/Card';
import { Text } from '@/src/components/ui/Text';
import { getMood } from '@/src/constants/moods';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { UserProfile } from '@/src/types/models';
import { fonts } from '@/src/theme/typography';
import { radii, spacing } from '@/src/theme/spacing';

interface Props {
  me: UserProfile;
  partner: UserProfile | null;
  locked?: boolean;
  onPress: () => void;
}

function isToday(timestamp?: number | null) {
  if (!timestamp) return false;
  const date = new Date(timestamp);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function DualHeartsIcon({ size = 18, color = '#F25F82' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.2 18.2C6.6 16.8 2.8 13.4 2.2 10.6 1.5 7.2 4 4.8 6.6 5c1.4.1 2.5 1 3 2.2.4-1.4 1.6-2.4 3.2-2.3 2.8.2 4.4 3 3.4 6.1-.7 2.3-3.6 5-5.2 6.4-.4.4-.8.6-1.2.6-.5 0-.9-.2-1.6-.8z"
        fill={color}
        opacity={0.55}
      />
      <Path
        d="M14.8 19C13 17.4 8.8 13.6 8.2 10.6 7.5 7 10.2 4.4 13 4.6c1.5.1 2.6 1.1 3.1 2.4.5-1.5 1.7-2.5 3.4-2.4 3 .2 4.6 3.2 3.5 6.5-.8 2.5-4 5.5-5.8 7-.5.4-.9.7-1.4.7-.4 0-.9-.2-2-.8z"
        fill={color}
      />
    </Svg>
  );
}

export function MoodPreviewCard({ me, partner, locked, onPress }: Props) {
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();

  if (locked || !partner) {
    return (
      <FeaturePreviewCard
        title="Today's Mood"
        description="Share your mood after connecting."
        leadingIcon={<HeartOutlineIcon size={26} color={colors.primary} />}
        illustration={<HeartCloud width={110} height={66} />}
        onPress={onPress}
      />
    );
  }

  const myToday = isToday(me.moodUpdatedAt);
  const partnerToday = isToday(partner.moodUpdatedAt);
  const myMood = myToday ? getMood(me.currentMood) : null;
  const partnerMood = partnerToday ? getMood(partner.currentMood) : null;
  const pillBg = isDark ? 'rgba(255, 122, 168, 0.12)' : '#FFF0F4';
  const divider = isDark ? 'rgba(255, 158, 192, 0.18)' : '#F5D5DF';

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onPress();
      }}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <DualHeartsIcon size={18} color={colors.primary} />
            <Text color={colors.textHeading} style={styles.title} numberOfLines={1}>
              Today's Moods
            </Text>
          </View>
          <Text color={colors.primary} style={styles.link}>
            View History  ›
          </Text>
        </View>

        <View style={styles.row}>
          <MoodPill
            avatarId={me.avatarId}
            role="You"
            label={myMood?.label || 'Unset'}
            emoji={myMood?.emoji || '😊'}
            backgroundColor={pillBg}
            textColor={colors.textHeading}
            mutedColor={colors.textSecondary}
          />
          <View style={[styles.divider, { backgroundColor: divider }]} />
          <MoodPill
            avatarId={partner.avatarId}
            role="Partner"
            label={partnerMood?.label || 'Waiting'}
            emoji={partnerMood?.emoji || '💕'}
            backgroundColor={pillBg}
            textColor={colors.textHeading}
            mutedColor={colors.textSecondary}
          />
        </View>
      </Card>
    </Pressable>
  );
}

function MoodPill({
  avatarId,
  role,
  label,
  emoji,
  backgroundColor,
  textColor,
  mutedColor,
}: {
  avatarId: UserProfile['avatarId'];
  role: string;
  label: string;
  emoji: string;
  backgroundColor: string;
  textColor: string;
  mutedColor: string;
}) {
  return (
    <View style={[styles.pill, { backgroundColor }]}>
      <Avatar avatarId={avatarId} size={AVATAR_SIZE} />
      <View style={styles.pillCopy}>
        <Text color={mutedColor} style={styles.role}>
          {role}
        </Text>
        <Text
          color={textColor}
          style={styles.moodLabel}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          {label}
        </Text>
      </View>
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
  );
}

const AVATAR_SIZE = 30;

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  link: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    flexShrink: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: 6,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 8,
    gap: 6,
    minHeight: 54,
    minWidth: 0,
  },
  pillCopy: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  role: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
  },
  moodLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 17,
    letterSpacing: -0.2,
  },
  emoji: {
    fontSize: 22,
    lineHeight: 26,
    width: 26,
    textAlign: 'center',
    flexShrink: 0,
  },
});
