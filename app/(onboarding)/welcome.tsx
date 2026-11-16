import { Redirect, router } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Button } from '@/src/components/ui/Button';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { radii, spacing } from '@/src/theme/spacing';

const appIcon = require('../../assets/images/splash-icon.png');

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
              <Image source={appIcon} style={styles.icon} resizeMode="contain" />
            </View>
            <Text variant="hero" color={colors.text} center>
              Loveni
            </Text>
            <Text muted center style={styles.tagline}>
              Your Little World Together.
            </Text>
            <Text variant="bodySmall" muted center style={styles.support}>
              Soft days together, private love notes, and moods that stay between you two.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(700)} style={styles.actions}>
            <Button title="Create account" onPress={() => router.push('/(auth)/signup')} />
            <Button
              title="I already have an account"
              variant="ghost"
              onPress={() => router.push('/(auth)/login')}
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
    width: 96,
    height: 96,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  icon: {
    width: 72,
    height: 72,
  },
  tagline: { maxWidth: 320 },
  support: { maxWidth: 300, marginTop: -4 },
  actions: { gap: spacing.sm },
});
