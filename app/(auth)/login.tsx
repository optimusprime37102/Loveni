import { Link, Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { setPartnerPromptSkipped } from '@/src/utils/partnerPrompt';
import { validateEmail, validatePassword } from '@/src/utils/validation';
import { spacing } from '@/src/theme/spacing';

export default function LoginScreen() {
  const { user, signIn } = useAuth();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  if (user && !loading) {
    return <Redirect href="/" />;
  }

  const onSubmit = async () => {
    const next = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(next);
    if (next.email || next.password) {
      haptics.error();
      return;
    }

    try {
      setLoading(true);
      const signedInUser = await signIn(email, password);
      // Show connect-partner again after each login until they connect or skip.
      await setPartnerPromptSkipped(signedInUser.uid, false);
      haptics.success();
      router.replace('/');
    } catch (e: unknown) {
      haptics.error();
      setErrors({ general: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <Text variant="display" style={styles.title}>
        Welcome back
      </Text>
      <Text muted style={styles.subtitle}>
        Sign in to keep your shared moments in sync.
      </Text>

      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          placeholder="you@email.com"
          error={errors.email}
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Your password"
          error={errors.password}
        />
        {errors.general ? (
          <Text variant="caption" color={colors.danger}>
            {errors.general}
          </Text>
        ) : null}
        <Button title="Sign in" onPress={onSubmit} loading={loading} />
      </View>

      <Text muted center style={styles.footer}>
        New here?{' '}
        <Link href="/(auth)/signup" style={{ color: colors.primary }}>
          Create an account
        </Link>
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.xl },
  subtitle: { marginBottom: spacing.xl, marginTop: spacing.xs },
  form: { gap: spacing.md },
  footer: { marginTop: spacing.xl },
});
