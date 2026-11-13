import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Avatar } from '@/src/components/ui/Avatar';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCouple } from '@/src/contexts/CoupleContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import {
  acceptInviteCode,
  createInviteCode,
  disconnectFromPartner,
} from '@/src/services/pairingService';
import { radii, spacing } from '@/src/theme/spacing';

export default function ManagePartnerScreen() {
  const { user, profile } = useAuth();
  const { partner, isConnected } = useCouple();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const [inviteCode, setInviteCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);

  const onCreateInvite = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const result = await createInviteCode(user.uid);
      setInviteCode(result.code);
      haptics.success();
    } catch (e: unknown) {
      Alert.alert('Could not create invite', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onJoin = async () => {
    if (!user) return;
    try {
      setLoading(true);
      await acceptInviteCode(user.uid, joinCode);
      haptics.success();
      router.replace('/(tabs)');
    } catch (e: unknown) {
      Alert.alert('Could not connect', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onDisconnect = () => {
    Alert.alert(
      'Disconnect partner?',
      'You will both lose access to the shared couple space until you reconnect.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            try {
              setLoading(true);
              await disconnectFromPartner(user.uid);
              haptics.medium();
              router.replace('/(onboarding)/connect-partner');
            } catch (e: unknown) {
              Alert.alert('Could not disconnect', (e as Error).message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text color={colors.primary}>Back</Text>
        </Pressable>
        <Text variant="heading">Partner</Text>
        <View style={{ width: 40 }} />
      </View>

      {isConnected && partner ? (
        <Card>
          <View style={styles.partner}>
            <Avatar avatarId={partner.avatarId} size={64} ring />
            <View>
              <Text variant="heading">{partner.displayName}</Text>
              <Text muted>{partner.email}</Text>
            </View>
          </View>
          <Text muted style={{ marginVertical: spacing.md }}>
            You are connected as a couple. Only one active partner is allowed at a time.
          </Text>
          <Button
            title="Disconnect"
            variant="danger"
            onPress={onDisconnect}
            loading={loading}
          />
        </Card>
      ) : (
        <View style={{ gap: spacing.md }}>
          <Card>
            <Text variant="heading">Create invite</Text>
            <Text muted style={styles.copy}>
              Share a one-time code with your partner.
            </Text>
            {inviteCode ? (
              <Pressable
                onPress={async () => {
                  await Clipboard.setStringAsync(inviteCode);
                  Alert.alert('Copied', inviteCode);
                }}
                style={[styles.code, { backgroundColor: colors.surfaceMuted }]}
              >
                <Text variant="display" color={colors.primary} center>
                  {inviteCode}
                </Text>
              </Pressable>
            ) : null}
            <Button title="Generate code" onPress={onCreateInvite} loading={loading} />
          </Card>

          <Card>
            <Text variant="heading">Join with code</Text>
            <Input
              label="Invite code"
              value={joinCode}
              onChangeText={setJoinCode}
              autoCapitalize="characters"
              placeholder="AB12CD"
              style={{ marginTop: spacing.md }}
            />
            <Button title="Connect" onPress={onJoin} loading={loading} style={{ marginTop: spacing.md }} />
          </Card>

          {profile?.coupleId ? null : (
            <Text muted center>
              Connect a partner to unlock shared notes, moods, and days together.
            </Text>
          )}
        </View>
      )}
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
  partner: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  copy: { marginVertical: spacing.md },
  code: {
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
});
