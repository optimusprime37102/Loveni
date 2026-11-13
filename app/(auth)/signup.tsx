import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '@/src/utils/validation';
import { spacing } from '@/src/theme/spacing';

export default function SignupScreen() {
  const { signUp } = useAuth();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const next = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirm:
        confirm !== password ? 'Passwords do not match' : validatePassword(confirm),
    };
    setErrors(next);
    if (next.name || next.email || next.password || next.confirm) {
      haptics.error();
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, name);
      haptics.success();
      router.replace('/(onboarding)/profile-setup');
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
        Join Loveni
      </Text>
      <Text muted style={styles.subtitle}>
        Create your account, then invite the one who matters.
      </Text>

      <View style={styles.form}>
        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholder="Your first name"
          error={errors.name}
        />
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
          placeholder="At least 6 characters"
          error={errors.password}
        />
        <Input
          label="Confirm password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          placeholder="Repeat password"
          error={errors.confirm}
        />
        {errors.general ? (
          <Text variant="caption" color={colors.danger}>
            {errors.general}
          </Text>
        ) : null}
        <Button title="Create account" onPress={onSubmit} loading={loading} />
      </View>

      <Text muted center style={styles.footer}>
        Already have an account?{' '}
        <Link href="/(auth)/login" style={{ color: colors.primary }}>
          Sign in
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
