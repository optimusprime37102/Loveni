import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Avatar } from '@/src/components/ui/Avatar';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCouple } from '@/src/contexts/CoupleContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { formatFriendlyDate } from '@/src/utils/dates';
import { radii, spacing } from '@/src/theme/spacing';

export default function ProfileScreen() {
  const { profile, logOut } = useAuth();
  const { partner, couple } = useCouple();
  const { colors, theme } = useTheme();
  const haptics = useHaptics();

  if (!profile) return null;

  const rows = [
    {
      label: 'Relationship details',
      emoji: '📅',
      onPress: () => router.push('/relationship/edit'),
    },
    {
      label: 'Partner connection',
      emoji: '💞',
      onPress: () => router.push('/partner/manage'),
    },
    {
      label: 'Settings',
      emoji: '⚙️',
      onPress: () => router.push('/settings'),
    },
  ];

  const onLogout = () => {
    Alert.alert('Sign out?', 'You can sign back in anytime.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await logOut();
          haptics.medium();
          router.replace('/(onboarding)/welcome');
        },
      },
    ]);
  };

  return (
    <Screen scroll>
      <Text variant="title" style={styles.title}>
        Profile
      </Text>

      <Card style={styles.heroCard}>
        <View style={styles.heroRow}>
          <Avatar avatarId={profile.avatarId} size={72} ring />
          <View style={{ flex: 1 }}>
            <Text variant="heading">{profile.displayName}</Text>
            <Text muted>{profile.email}</Text>
            <Text variant="caption" color={colors.primary} style={{ marginTop: 6 }}>
              Together since {formatFriendlyDate(couple?.startDate)}
            </Text>
          </View>
        </View>

        {partner ? (
          <View style={[styles.partnerRow, { backgroundColor: colors.surfaceLavender }]}>
            <Avatar avatarId={partner.avatarId} size={44} />
            <View>
              <Text variant="caption" muted>
                Partner
              </Text>
              <Text variant="subtitle">{partner.displayName}</Text>
            </View>
          </View>
        ) : null}
      </Card>

      <View style={styles.menu}>
        {rows.map((row) => (
          <Pressable
            key={row.label}
            onPress={() => {
              haptics.selection();
              row.onPress();
            }}
            style={[
              styles.row,
              theme.shadows.card,
              { backgroundColor: colors.surface },
            ]}
          >
            <Text style={{ fontSize: 20 }}>{row.emoji}</Text>
            <Text variant="subtitle" style={{ flex: 1 }}>
              {row.label}
            </Text>
            <Text color={colors.textSecondary}>›</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={onLogout} style={styles.logout}>
        <Text color={colors.danger} center>
          Sign out
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.md, marginBottom: spacing.lg },
  heroCard: { marginBottom: spacing.lg },
  heroRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  partnerRow: {
    marginTop: spacing.lg,
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  menu: { gap: spacing.sm },
  row: {
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logout: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
    padding: spacing.md,
  },
});
