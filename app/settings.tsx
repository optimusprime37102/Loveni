import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { useCouple } from '@/src/contexts/CoupleContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { radii, spacing } from '@/src/theme/spacing';

const MODES = [
  { id: 'system' as const, label: 'System' },
  { id: 'light' as const, label: 'Light' },
  { id: 'dark' as const, label: 'Dark' },
];

export default function SettingsScreen() {
  const { colors, mode, setMode } = useTheme();
  const { isConnected } = useCouple();
  const haptics = useHaptics();

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Text color={colors.primary}>Back</Text>
        </Pressable>
        <Text variant="heading">Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <Card>
        <Text variant="label" color={colors.primary}>
          Appearance
        </Text>
        <Text muted style={{ marginVertical: spacing.sm }}>
          Soft light by day, gentle night mode when you want it quieter.
        </Text>
        <View style={styles.row}>
          {MODES.map((item) => {
            const active = mode === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  haptics.selection();
                  setMode(item.id);
                }}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.surfaceMuted : colors.background,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text color={active ? colors.primary : colors.text}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <Text variant="label" color={colors.primary}>
          Your world
        </Text>
        <Pressable
          style={[styles.linkRow, { borderTopColor: colors.border }]}
          onPress={() => router.push(isConnected ? '/partner/manage' : '/(onboarding)/connect-partner')}
        >
          <View style={styles.linkCopy}>
            <Text variant="subtitle">{isConnected ? 'Partner' : 'Connect partner'}</Text>
            <Text variant="caption" muted>
              {isConnected ? 'Manage your connection' : 'Invite with a private code'}
            </Text>
          </View>
          <Text color={colors.primary}>›</Text>
        </Pressable>
        <Pressable
          style={[styles.linkRow, { borderTopColor: colors.border }]}
          onPress={() => router.push('/relationship/edit')}
        >
          <View style={styles.linkCopy}>
            <Text variant="subtitle">Relationship date</Text>
            <Text variant="caption" muted>
              Powers days together and milestones
            </Text>
          </View>
          <Text color={colors.primary}>›</Text>
        </Pressable>
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <Text variant="heading">About Loveni</Text>
        <Text muted style={{ marginTop: spacing.sm }}>
          Love + Aeni. Your Little World Together. Version 1.0 — days together, private love notes,
          and mood sharing with real-time Firebase sync.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  chip: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: spacing.sm,
  },
  linkCopy: {
    flex: 1,
    gap: 2,
    paddingRight: spacing.md,
  },
});
