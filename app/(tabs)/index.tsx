import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ConnectedActionsRow } from '@/src/components/home/ConnectedActionsRow';
import { DaysTogetherHero } from '@/src/components/home/DaysTogetherHero';
import { HomeHeader } from '@/src/components/home/HomeHeader';
import { LatestNoteCard } from '@/src/components/home/LatestNoteCard';
import { MoodPreviewCard } from '@/src/components/home/MoodPreviewCard';
import { UnlockFeaturesRow } from '@/src/components/home/UnlockFeaturesRow';
import { WaitingPartnerHero } from '@/src/components/home/WaitingPartnerHero';
import { LayeredHearts } from '@/src/components/illustrations/LayeredHearts';
import { HeartOutlineIcon } from '@/src/components/illustrations/OutlineIcons';
import { Screen } from '@/src/components/ui/Screen';
import { HomeSkeleton } from '@/src/components/ui/Skeleton';
import { Text } from '@/src/components/ui/Text';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCouple } from '@/src/contexts/CoupleContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { subscribeLoveNotes } from '@/src/services/notesService';
import { LoveNote } from '@/src/types/models';
import { fonts } from '@/src/theme/typography';
import { spacing } from '@/src/theme/spacing';

export default function HomeScreen() {
  const { profile } = useAuth();
  const { couple, partner, loading: coupleLoading, isConnected } = useCouple();
  const { colors, isDark } = useTheme();
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

  const goConnect = () => router.push('/(onboarding)/connect-partner');
  const goEnterCode = () => router.push('/(onboarding)/connect-partner?mode=join');
  const goMood = () =>
    isConnected ? router.push('/(tabs)/mood') : router.push('/(onboarding)/connect-partner');
  const goNotes = () =>
    isConnected ? router.push('/(tabs)/notes') : router.push('/(onboarding)/connect-partner');

  return (
    <Screen scroll padded={false} style={styles.screen}>
      <LinearGradient
        colors={isDark ? colors.gradientHero : (['#FFF2F5', '#FDEEF1', '#FDEEF1'] as const)}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 0.55 }}
        style={styles.backdrop}
      >
        <View style={styles.content}>
          <HomeHeader hasNotifications={!isConnected} />

          <View style={styles.heroBlock}>
            <View pointerEvents="none" style={styles.hearts}>
              <LayeredHearts width={150} height={120} />
            </View>

            <View style={styles.greeting}>
              {isConnected ? (
                <>
                  <Text color={colors.textHeading} style={styles.greetingTitle} numberOfLines={1}>
                    {`Hello, ${firstName} ♡`}
                  </Text>
                  <Text
                    color={colors.textHeading}
                    numberOfLines={1}
                    style={styles.greetingCopy}
                  >
                    Every day is sweeter together.
                  </Text>
                </>
              ) : (
                <>
                  <View style={styles.titleRow}>
                    <Text color={colors.textHeading} style={styles.greetingTitle} numberOfLines={1}>
                      {`Hello, ${firstName}`}
                    </Text>
                    <HeartOutlineIcon size={24} color={colors.textHeading} />
                  </View>
                  <Text
                    color={colors.textHeading}
                    numberOfLines={1}
                    style={styles.greetingCopy}
                  >
                    Connect your person to start your shared journey.
                  </Text>
                </>
              )}
            </View>

            <View style={styles.stack}>
              {isConnected && partner ? (
                <DaysTogetherHero
                  me={profile}
                  partner={partner}
                  startDate={couple?.startDate ?? null}
                />
              ) : (
                <WaitingPartnerHero
                  me={profile}
                  onConnect={goConnect}
                  onEnterCode={goEnterCode}
                />
              )}

              {isConnected ? (
                <ConnectedActionsRow onLoveNote={goNotes} onShareMood={goMood} />
              ) : (
                <UnlockFeaturesRow />
              )}

              <MoodPreviewCard
                me={profile}
                partner={partner}
                locked={!isConnected}
                onPress={goMood}
              />
              <LatestNoteCard
                note={latestNote}
                myUid={profile.uid}
                locked={!isConnected}
                onPress={goNotes}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
  },
  backdrop: {
    flexGrow: 1,
    minHeight: '100%',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  heroBlock: {
    position: 'relative',
  },
  hearts: {
    position: 'absolute',
    top: -22,
    right: -18,
    zIndex: 0,
    opacity: 0.58,
  },
  greeting: {
    marginBottom: spacing.md,
    gap: 5,
    zIndex: 2,
    width: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greetingTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.6,
    flexShrink: 1,
  },
  greetingCopy: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    width: '100%',
    opacity: 0.78,
  },
  stack: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
    zIndex: 1,
  },
});
