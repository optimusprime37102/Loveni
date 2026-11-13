import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { AVATARS } from '@/src/constants/avatars';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { completeProfileSetup } from '@/src/services/userService';
import { AvatarId } from '@/src/types/models';
import { validateName } from '@/src/utils/validation';
import { radii, spacing } from '@/src/theme/spacing';

export default function ProfileSetupScreen() {
  const { user, profile } = useAuth();
  const { colors, theme } = useTheme();
  const haptics = useHaptics();
  const [name, setName] = useState(profile?.displayName || '');
  const [avatarId, setAvatarId] = useState<AvatarId>(profile?.avatarId || 'rose');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const onContinue = async () => {
    const nameError = validateName(name);
    if (nameError) {
      setError(nameError);
      haptics.error();
      return;
    }
    if (!user) return;

    try {
      setLoading(true);
      await completeProfileSetup(user.uid, name, avatarId);
      haptics.success();
      router.replace('/(onboarding)/connect-partner');
    } catch (e: unknown) {
      Alert.alert('Could not save profile', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <Text variant="display" style={styles.title}>
        Make it yours
      </Text>
      <Text muted style={styles.subtitle}>
        Choose a name and avatar your partner will recognize.
      </Text>

      <Input
        label="Your name"
        value={name}
        onChangeText={(v) => {
          setName(v);
          setError(undefined);
        }}
        placeholder="e.g. Maya"
        autoCapitalize="words"
        error={error}
        maxLength={40}
      />

      <Text variant="caption" color={colors.textSecondary} style={styles.avatarLabel}>
        Avatar
      </Text>
      <View style={styles.grid}>
        {AVATARS.map((avatar) => {
          const selected = avatar.id === avatarId;
          return (
            <Pressable
              key={avatar.id}
              onPress={() => {
                haptics.selection();
                setAvatarId(avatar.id);
              }}
              style={[
                styles.avatarItem,
                theme.shadows.card,
                {
                  borderColor: selected ? colors.primary : colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <LinearGradient colors={avatar.gradient} style={styles.avatarCircle}>
                <Text style={{ fontSize: 28 }}>{avatar.emoji}</Text>
              </LinearGradient>
              <Text variant="caption" center>
                {avatar.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Button title="Continue" onPress={onContinue} loading={loading} style={styles.cta} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.xl },
  subtitle: { marginBottom: spacing.xl, marginTop: spacing.xs },
  avatarLabel: { marginTop: spacing.lg, marginBottom: spacing.sm },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  avatarItem: {
    width: '23%',
    minWidth: 72,
    flexGrow: 1,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    gap: 6,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: { marginTop: spacing.xxl },
});
