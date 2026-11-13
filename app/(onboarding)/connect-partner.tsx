import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, BackHandler, Pressable, StyleSheet, View } from 'react-native';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import {
  acceptInviteCode,
  createInviteCode,
} from '@/src/services/pairingService';
import { setPartnerPromptSkipped } from '@/src/utils/partnerPrompt';
import { radii, spacing } from '@/src/theme/spacing';

export default function ConnectPartnerScreen() {
  const { user, profile } = useAuth();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [code, setCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);

  const goHome = async (markSkipped: boolean) => {
    if (markSkipped && user) {
      await setPartnerPromptSkipped(user.uid, true);
    }
    router.replace('/(tabs)');
  };

  useEffect(() => {
    if (profile?.coupleId) {
      router.replace('/(tabs)');
    }
  }, [profile?.coupleId]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (mode !== 'choose') {
        setMode('choose');
        return true;
      }
      void goHome(true);
      return true;
    });
    return () => sub.remove();
  }, [mode, user]);

  const onCreate = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const result = await createInviteCode(user.uid);
      setCode(result.code);
      setMode('create');
      haptics.success();
    } catch (e: unknown) {
      haptics.error();
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
      if (user) await setPartnerPromptSkipped(user.uid, false);
      haptics.success();
      router.replace('/(tabs)');
    } catch (e: unknown) {
      haptics.error();
      Alert.alert('Could not connect', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    await Clipboard.setStringAsync(code);
    haptics.light();
    Alert.alert('Copied', 'Invite code copied to clipboard.');
  };

  return (
    <Screen scroll>
      <Text variant="display" style={styles.title}>
        Connect your partner
      </Text>
      <Text muted style={styles.subtitle}>
        One private invite. Two people. No extra partners while you are linked.
      </Text>

      {mode === 'choose' ? (
        <View style={styles.stack}>
          <Card>
            <Text variant="heading">Share an invite</Text>
            <Text muted style={styles.cardCopy}>
              Generate a unique code and send it to your person.
            </Text>
            <Button title="Create invite code" onPress={onCreate} loading={loading} />
          </Card>
          <Card>
            <Text variant="heading">I have a code</Text>
            <Text muted style={styles.cardCopy}>
              Enter the invite your partner shared with you.
            </Text>
            <Button title="Enter invite code" variant="secondary" onPress={() => setMode('join')} />
          </Card>
          <Button
            title="Skip for now"
            variant="ghost"
            onPress={() => {
              haptics.selection();
              void goHome(true);
            }}
          />
        </View>
      ) : null}

      {mode === 'create' ? (
        <Card>
          <Text variant="label" color={colors.primary} center>
            Your invite code
          </Text>
          <Pressable onPress={copyCode} style={[styles.codeBox, { backgroundColor: colors.surfaceMuted }]}>
            <Text variant="display" color={colors.primary} center>
              {code}
            </Text>
          </Pressable>
          <Text muted center style={styles.cardCopy}>
            Share this code. It expires in 7 days and can only be used once.
          </Text>
          <Button title="Copy code" onPress={copyCode} />
          <Button title="Back" variant="ghost" onPress={() => setMode('choose')} />
          <Button
            title="Skip for now"
            variant="ghost"
            onPress={() => {
              haptics.selection();
              void goHome(true);
            }}
          />
        </Card>
      ) : null}

      {mode === 'join' ? (
        <Card>
          <Input
            label="Invite code"
            value={joinCode}
            onChangeText={setJoinCode}
            autoCapitalize="characters"
            placeholder="e.g. AB12CD"
            maxLength={8}
          />
          <View style={styles.stack}>
            <Button title="Connect" onPress={onJoin} loading={loading} />
            <Button title="Back" variant="ghost" onPress={() => setMode('choose')} />
            <Button
              title="Skip for now"
              variant="ghost"
              onPress={() => {
                haptics.selection();
                void goHome(true);
              }}
            />
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.xl },
  subtitle: { marginBottom: spacing.xl, marginTop: spacing.xs },
  stack: { gap: spacing.md },
  cardCopy: { marginVertical: spacing.md },
  codeBox: {
    marginTop: spacing.md,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
  },
});
