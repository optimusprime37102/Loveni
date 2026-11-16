import { Link, Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthShell } from '@/src/components/auth/AuthShell';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Text } from '@/src/components/ui/Text';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { setPartnerPromptSkipped } from '@/src/utils/partnerPrompt';
import { validateEmail, validatePassword } from '@/src/utils/validation';
import { radii, spacing } from '@/src/theme/spacing';

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
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to keep your shared moments in sync."
      footer={
        <Text muted center>
          New here?{' '}
          <Link href="/(auth)/signup" style={{ color: colors.primary }}>
            Create an account
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
        label="Email"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          if (errors.email || errors.general) {
            setErrors((prev) => ({ ...prev, email: undefined, general: undefined }));
          }
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
          if (errors.password || errors.general) {
            setErrors((prev) => ({ ...prev, password: undefined, general: undefined }));
          }
        }}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        placeholder="Your password"
        error={errors.password}
        returnKeyType="go"
        onSubmitEditing={onSubmit}
      />

      <Button title="Sign in" onPress={onSubmit} loading={loading} style={styles.submit} />
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
