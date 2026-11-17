import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { EmptyNotesArt } from '@/src/components/illustrations/EmptyNotesArt';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { fonts } from '@/src/theme/typography';
import { radii, spacing } from '@/src/theme/spacing';

interface Props {
  onWrite: () => void;
}

export function NotesEmptyCard({ onWrite }: Props) {
  const { colors, theme, isDark } = useTheme();
  const haptics = useHaptics();
  const { width } = useWindowDimensions();

  const artWidth = Math.min(440, width - 24);
  const artHeight = Math.round(artWidth * (140 / 480));

  return (
    <Animated.View
      entering={FadeInDown.duration(480)}
      style={[
        styles.card,
        theme.shadows.soft,
        {
          backgroundColor: isDark ? colors.surfaceCard : '#FFF8FA',
          borderColor: isDark ? colors.border : 'rgba(245, 213, 223, 0.9)',
        },
      ]}
    >
      <View style={styles.artWrap}>
        <EmptyNotesArt width={artWidth} height={artHeight} />
      </View>

      <View style={styles.copy}>
        <Text color={colors.textHeading} style={styles.title} center>
          No notes yet
        </Text>
        <Text color={colors.textSecondary} style={styles.subtitle} center>
          Send a sweet note to your partner anytime.
        </Text>
      </View>

      <Pressable
        onPress={() => {
          haptics.selection();
          onWrite();
        }}
        accessibilityRole="button"
        accessibilityLabel="Write a note"
        style={({ pressed }) => [
          styles.ctaShadow,
          theme.shadows.glow,
          { opacity: pressed ? 0.92 : 1 },
        ]}
      >
        <LinearGradient
          colors={colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cta}
        >
          <SymbolView
            name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
            size={15}
            tintColor="#FFFFFF"
            weight="semibold"
            fallback={<Text style={styles.ctaFallback}>✎</Text>}
          />
          <Text color="#FFFFFF" style={styles.ctaLabel}>
            Write a note
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 32,
    borderWidth: 1,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: spacing.md,
  },
  artWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginHorizontal: -spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  copy: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 260,
  },
  ctaShadow: {
    alignSelf: 'stretch',
    borderRadius: radii.pill,
    marginTop: spacing.xs,
    marginHorizontal: spacing.sm,
  },
  cta: {
    minHeight: 52,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 20,
  },
  ctaFallback: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});
