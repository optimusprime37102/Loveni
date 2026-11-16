import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { DaysTogetherHero } from '@/src/components/home/DaysTogetherHero';
import { LatestNoteCard } from '@/src/components/home/LatestNoteCard';
import { MilestonesCard } from '@/src/components/home/MilestonesCard';
import { MoodPreviewCard } from '@/src/components/home/MoodPreviewCard';
import { QuickActions } from '@/src/components/home/QuickActions';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { HomeSkeleton } from '@/src/components/ui/Skeleton';
import { Text } from '@/src/components/ui/Text';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCouple } from '@/src/contexts/CoupleContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { subscribeLoveNotes } from '@/src/services/notesService';
import { LoveNote } from '@/src/types/models';
import { spacing } from '@/src/theme/spacing';

export default function HomeScreen() {
  const { profile } = useAuth();
  const { couple, partner, loading: coupleLoading, isConnected } = useCouple();
  const { colors } = useTheme();
  const [latestNote, setLatestNote] = useState<LoveNote | null>(null);
  const [notesLoading, setNotesLoading] = useState(Boolean(profile?.coupleId));

  useEffect(() => {
    if (!couple?.id) {
      setLatestNote(null);
      setNotesLoading(false);
      return;
    }

    setNotesLoading(true);
    const unsub = subscribeLoveNotes(
      couple.id,
      (notes) => {
        setLatestNote(notes[0] || null);
        setNotesLoading(false);
      },
      () => setNotesLoading(false),
      1
    );
    return unsub;
  }, [couple?.id]);

  if (!profile || (profile.coupleId && (coupleLoading || notesLoading))) {
    return (
      <Screen padded={false}>
        <HomeSkeleton />
      </Screen>
    );
  }

  const firstName = profile.displayName.split(' ')[0];
  const partnerName = partner?.displayName.split(' ')[0];

  const actions = [
    {
      emoji: '💞',
      label: isConnected ? 'Partner' : 'Connect',
      onPress: () => router.push(isConnected ? '/partner/manage' : '/(onboarding)/connect-partner'),
    },
    {
      emoji: '💌',
      label: 'Note',
      onPress: () =>
        isConnected ? router.push('/note/create') : router.push('/(onboarding)/connect-partner'),
    },
    {
      emoji: '😊',
      label: 'Mood',
      onPress: () =>
        isConnected ? router.push('/(tabs)/mood') : router.push('/(onboarding)/connect-partner'),
    },
  ];

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text variant="caption" color={colors.primary}>
          Your little world together
        </Text>
        <Text variant="title" color={colors.textHeading}>
          {isConnected && partnerName ? `${firstName} & ${partnerName}` : `Hello, ${firstName}`}
        </Text>
      </View>

      <View style={styles.stack}>
        <DaysTogetherHero me={profile} partner={partner} startDate={couple?.startDate ?? null} />

        {!isConnected ? (
          <Card>
            <Text variant="heading">Connect your partner</Text>
            <Text muted style={{ marginVertical: spacing.sm }}>
              Invite them with a code to unlock shared days, notes, and moods.
            </Text>
            <Button
              title="Connect partner"
              onPress={() => router.push('/(onboarding)/connect-partner')}
            />
          </Card>
        ) : null}

        <QuickActions actions={actions} />
        <MoodPreviewCard me={profile} partner={partner} />
        <LatestNoteCard
          note={latestNote}
          myUid={profile.uid}
          onPress={() =>
            isConnected
              ? router.push('/(tabs)/notes')
              : router.push('/(onboarding)/connect-partner')
          }
        />
        <MilestonesCard startDate={couple?.startDate ?? null} connected={isConnected} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    gap: 4,
  },
  stack: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
});
