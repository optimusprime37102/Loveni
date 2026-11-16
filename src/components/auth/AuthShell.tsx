import { ReactNode } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BackButton } from '@/src/components/ui/BackButton';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/contexts/ThemeContext';
import { radii, spacing } from '@/src/theme/spacing';

const appIcon = require('../../../assets/images/splash-icon.png');

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: Props) {
  const { colors, theme } = useTheme();

  return (
    <Screen scroll padded={false} edges={['top', 'left', 'right', 'bottom']}>
      <LinearGradient
        colors={[colors.gradientHero[0], colors.background, colors.background]}
        locations={[0, 0.38, 1]}
        style={styles.fill}
      >
        <View style={styles.topBar}>
          <BackButton />
        </View>

        <Animated.View entering={FadeInUp.duration(550)} style={styles.brand}>
          <View
            style={[
              styles.mark,
              theme.shadows.glow,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Image source={appIcon} style={styles.icon} resizeMode="contain" />
          </View>
          <Text variant="display" color={colors.textHeading} style={styles.title}>
            {title}
          </Text>
          <Text muted style={styles.subtitle}>
            {subtitle}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(80).duration(550)}
          style={[
            styles.panel,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              ...theme.shadows.card,
            },
          ]}
        >
          {children}
        </Animated.View>

        <View style={styles.footer}>{footer}</View>
      </LinearGradient>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  topBar: {
    paddingTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  brand: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  mark: {
    width: 72,
    height: 72,
    borderRadius: radii.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  icon: {
    width: 52,
    height: 52,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: spacing.xs,
    maxWidth: 300,
    lineHeight: 22,
  },
  panel: {
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  footer: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
});
