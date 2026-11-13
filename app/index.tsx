import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Text } from '@/src/components/ui/Text';
import { Screen } from '@/src/components/ui/Screen';
import { hasSkippedPartnerPrompt } from '@/src/utils/partnerPrompt';

export default function Index() {
  const { user, profile, loading, configured } = useAuth();
  const { colors } = useTheme();
  const [skipChecked, setSkipChecked] = useState(false);
  const [skippedPartner, setSkippedPartner] = useState(false);

  useEffect(() => {
    let active = true;
    if (!user) {
      setSkipChecked(true);
      setSkippedPartner(false);
      return;
    }

    setSkipChecked(false);
    hasSkippedPartnerPrompt(user.uid).then((skipped) => {
      if (!active) return;
      setSkippedPartner(skipped);
      setSkipChecked(true);
    });

    return () => {
      active = false;
    };
  }, [user?.uid]);

  if (!configured) {
    return (
      <Screen scroll>
        <View style={styles.center}>
          <Text style={styles.emoji}>❤️</Text>
          <Text variant="display" center>
            Loveni
          </Text>
          <Text muted center style={styles.copy}>
            Place your Firebase Android `google-services.json` in the project root, then reload
            the app.
          </Text>
        </View>
      </Screen>
    );
  }

  if (loading || (user && !skipChecked)) {
    return (
      <View style={[styles.boot, { backgroundColor: colors.background }]}>
        <Text variant="display" color={colors.primary}>
          Loveni ❤️
        </Text>
        <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  if (!profile?.onboardingComplete) {
    return <Redirect href="/(onboarding)/profile-setup" />;
  }

  if (!profile.coupleId && !skippedPartner) {
    return <Redirect href="/(onboarding)/connect-partner" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
    paddingTop: 80,
  },
  emoji: { fontSize: 56, textAlign: 'center' },
  copy: { marginBottom: 12 },
});
