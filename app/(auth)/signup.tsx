import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthShell } from '@/src/components/auth/AuthShell';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Text } from '@/src/components/ui/Text';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '@/src/utils/validation';
import { radii, spacing } from '@/src/theme/spacing';

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

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field] && !prev.general) return prev;
      return { ...prev, [field]: undefined, general: undefined };
    });
  };

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
    <AuthShell
      title="Join Loveni"
      subtitle="Create your account, then invite the one who matters."
      footer={
        <Text muted center>
          Already have an account?{' '}
          <Link href="/(auth)/login" style={{ color: colors.primary }}>
            Sign in
          </Link>
        </Text>
      }
    >
      {errors.general ? (
        <View style={[styles.errorBanner, { backgroundColor: 'rgba(228, 87, 87, 0.1)' }]}>
          <Text variant="bodySmall" color={colors.danger}>
            {errors.general}
          </Text>
        </View>
      ) : null}

      <Input
        label="Name"
        value={name}
        onChangeText={(value) => {
          setName(value);
          clearFieldError('name');
        }}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        placeholder="Your first name"
        error={errors.name}
        returnKeyType="next"
      />
      <Input
        label="Email"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          clearFieldError('email');
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        placeholder="you@email.com"
        error={errors.email}
        returnKeyType="next"
      />
      <Input
        label="Password"
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          clearFieldError('password');
        }}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        placeholder="At least 6 characters"
        error={errors.password}
        returnKeyType="next"
      />
      <Input
        label="Confirm password"
        value={confirm}
        onChangeText={(value) => {
          setConfirm(value);
          clearFieldError('confirm');
        }}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        placeholder="Repeat password"
        error={errors.confirm}
        returnKeyType="go"
        onSubmitEditing={onSubmit}
      />

      <Button title="Create account" onPress={onSubmit} loading={loading} style={styles.submit} />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  errorBanner: {
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  submit: {
    marginTop: spacing.xs,
  },
});
