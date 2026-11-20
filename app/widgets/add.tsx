import { router } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/contexts/ThemeContext';
import { fonts } from '@/src/theme/typography';
import { spacing } from '@/src/theme/spacing';

const ANDROID_STEPS = [
  'Long-press an empty spot on your home screen',
  'Tap Widgets',
  'Find Loveni',
  'Add Days Together, Mood Today, or Love Note',
];

const IOS_STEPS = [
  'Long-press the home screen until apps jiggle',
  'Tap the + button in the top corner',
  'Search for Loveni',
  'Choose Days Together, Mood Today, or Love Note and tap Add Widget',
];

export default function AddWidgetsScreen() {
  const { colors } = useTheme();
  const steps = Platform.OS === 'ios' ? IOS_STEPS : ANDROID_STEPS;

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text color={colors.primary} style={styles.close}>
            Close
          </Text>
        </Pressable>
        <Text color={colors.textHeading} style={styles.title}>
          Home widgets
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <Card style={styles.card}>
        <Text color={colors.textHeading} style={styles.lead}>
          Pin Days, Mood, and Love Note on your device home screen.
        </Text>
        <Text color={colors.textSecondary} style={styles.copy}>
          Widgets update when you open Loveni after sharing a mood, writing a note, or changing your
          start date. A development build is required — Expo Go does not support widgets.
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text color={colors.primary} style={styles.sectionLabel}>
          How to add
        </Text>
        {steps.map((step, index) => (
          <View key={step} style={styles.stepRow}>
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text color="#FFFFFF" style={styles.badgeText}>
                {index + 1}
              </Text>
            </View>
            <Text color={colors.textHeading} style={styles.stepText}>
              {step}
            </Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  close: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    width: 48,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    lineHeight: 22,
  },
  card: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  lead: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 22,
  },
  copy: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 6,
  },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  badgeText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
  },
  stepText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
});
