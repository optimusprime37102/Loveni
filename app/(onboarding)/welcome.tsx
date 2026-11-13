import { Redirect, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Button } from '@/src/components/ui/Button';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { radii, spacing } from '@/src/theme/spacing';

export default function WelcomeScreen() {
  const { user, loading } = useAuth();
  const { colors, theme } = useTheme();

  if (!loading && user) {
    return <Redirect href="/" />;
  }

  return (
    <Screen padded={false}>
      <LinearGradient colors={colors.gradientHero} style={styles.fill}>
        <View style={styles.content}>
          <Animated.View entering={FadeInUp.duration(700)} style={styles.brandBlock}>
            <View style={[styles.mark, theme.shadows.glow, { backgroundColor: colors.surface }]}>
              <Text style={styles.heart}>❤️</Text>
            </View>
            <Text variant="hero" color={colors.text} center>
              Loveni
            </Text>
            <Text muted center style={styles.tagline}>
              A quiet place for two hearts — days together, soft moods, and love notes in real
              time.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(700)} style={styles.actions}>
            <Button title="Create account" onPress={() => router.replace('/(auth)/signup')} />
            <Button
              title="I already have an account"
              variant="ghost"
              onPress={() => router.replace('/(auth)/login')}
            />
          </Animated.View>
        </View>
      </LinearGradient>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.huge,
    paddingBottom: spacing.xxxl,
  },
  brandBlock: {
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.huge,
  },
  mark: {
    width: 88,
    height: 88,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heart: { fontSize: 40 },
  tagline: { maxWidth: 320 },
  actions: { gap: spacing.sm },
});
