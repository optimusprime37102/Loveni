import { StyleSheet, View } from 'react-native';
import { HeartOutlineIcon } from '@/src/components/illustrations/OutlineIcons';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/contexts/ThemeContext';
import { fonts } from '@/src/theme/typography';
import { spacing } from '@/src/theme/spacing';

export function NotesHeader() {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text color={colors.textHeading} style={styles.title} numberOfLines={1}>
          Love Notes
        </Text>
        <HeartOutlineIcon size={22} color={colors.primary} />
      </View>
      <Text color={colors.textSecondary} style={styles.subtitle}>
        Private words between you two.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
});
