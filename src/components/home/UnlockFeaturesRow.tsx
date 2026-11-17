import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  DaysTogetherIcon,
  LoveNotesIcon,
  MoodSharingIcon,
} from '@/src/components/illustrations/UnlockIcons';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/contexts/ThemeContext';
import { fonts } from '@/src/theme/typography';
import { radii, spacing } from '@/src/theme/spacing';

const FEATURES: {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
}[] = [
  {
    id: 'days',
    title: 'Days Together',
    subtitle: 'Count your journey',
    icon: <DaysTogetherIcon width={36} height={36} />,
  },
  {
    id: 'notes',
    title: 'Love Notes',
    subtitle: 'Share sweet notes',
    icon: <LoveNotesIcon width={36} height={36} />,
  },
  {
    id: 'moods',
    title: 'Mood Sharing',
    subtitle: 'Stay in sync always',
    icon: <MoodSharingIcon width={36} height={36} />,
  },
];

export function UnlockFeaturesRow() {
  const { colors, theme } = useTheme();

  return (
    <View
      style={[
        styles.shell,
        theme.shadows.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <Text color={colors.textHeading} numberOfLines={1} style={styles.heading}>
          What unlocks after connecting
        </Text>
        <Text style={[styles.heart, { color: colors.primary }]}>♡</Text>
      </View>

      <View style={styles.row}>
        {FEATURES.map((feature) => (
          <View
            key={feature.id}
            style={[styles.cardShadow, theme.shadows.card]}
          >
            <LinearGradient
              colors={colors.gradientCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.card, { borderColor: colors.border }]}
            >
              <View style={styles.iconWrap}>{feature.icon}</View>
              <Text
                color={colors.textHeading}
                center
                numberOfLines={1}
                style={styles.title}
              >
                {feature.title}
              </Text>
              <Text
                color={colors.textSecondary}
                center
                numberOfLines={1}
                style={styles.subtitle}
              >
                {feature.subtitle}
              </Text>
            </LinearGradient>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: radii.card,
    borderWidth: 1,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.sm,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.xs,
  },
  heading: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  heart: {
    fontSize: 15,
    lineHeight: 18,
    marginTop: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  cardShadow: {
    flex: 1,
    borderRadius: radii.md,
  },
  card: {
    borderRadius: radii.md,
    borderWidth: 1,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 108,
  },
  iconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: -0.15,
    width: '100%',
    paddingHorizontal: 2,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13,
    width: '100%',
    paddingHorizontal: 2,
  },
});
