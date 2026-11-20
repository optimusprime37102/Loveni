import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { LoveNotesBg } from '@/src/components/illustrations/LoveNotesBg';
import { MoodDoubleHearts } from '@/src/components/illustrations/MoodDoubleHearts';
import { HeartOutlineIcon } from '@/src/components/illustrations/OutlineIcons';
import { MoodRecentCard } from '@/src/components/moods/MoodRecentCard';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { MOODS } from '@/src/constants/moods';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCouple } from '@/src/contexts/CoupleContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import {
  shareMood,
  subscribeMoodHistory,
  updateMoodEntry,
} from '@/src/services/moodService';
import { MoodEmoji, MoodEntry } from '@/src/types/models';
import { fonts } from '@/src/theme/typography';
import { radii, spacing } from '@/src/theme/spacing';

const MOOD_EMOJIS = new Set(MOODS.map((m) => m.emoji));

/** Design grid order: Loved, Happy, Low / Tired, Soft, Smitten */
const PICKER_ORDER: MoodEmoji[] = ['🥰', '😊', '😔', '😴', '🥺', '😍'];

export default function MoodScreen() {
  const { profile } = useAuth();
  const { couple, partner } = useCouple();
  const { colors, theme, isDark } = useTheme();
  const haptics = useHaptics();
  const params = useLocalSearchParams<{
    moodId?: string;
    mood?: string;
    message?: string;
  }>();

  const moodId = typeof params.moodId === 'string' ? params.moodId : undefined;
  const paramMood =
    typeof params.mood === 'string' && MOOD_EMOJIS.has(params.mood as MoodEmoji)
      ? (params.mood as MoodEmoji)
      : null;
  const paramMessage = typeof params.message === 'string' ? params.message : '';
  const isEditing = Boolean(moodId);

  const [selected, setSelected] = useState<MoodEmoji | null>(
    paramMood || profile?.currentMood || null
  );
  const [message, setMessage] = useState(paramMessage);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [bgSize, setBgSize] = useState({ width: 0, height: 0 });

  const pickerMoods = useMemo(
    () =>
      PICKER_ORDER.map((emoji) => MOODS.find((m) => m.emoji === emoji)).filter(
        (m): m is (typeof MOODS)[number] => Boolean(m)
      ),
    []
  );

  useEffect(() => {
    if (paramMood) setSelected(paramMood);
    if (typeof params.message === 'string') setMessage(params.message);
  }, [paramMood, params.message]);

  useEffect(() => {
    if (!couple?.id) return;
    return subscribeMoodHistory(couple.id, setHistory, undefined, 12);
  }, [couple?.id]);

  const onBgLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width !== bgSize.width || height !== bgSize.height) {
      setBgSize({ width, height });
    }
  };

  const onShare = async () => {
    if (!selected || !profile || !couple) return;
    try {
      setLoading(true);
      if (isEditing && moodId) {
        await updateMoodEntry({
          moodId,
          uid: profile.uid,
          mood: selected,
          message,
        });
        haptics.success();
        router.back();
        return;
      }

      await shareMood({
        uid: profile.uid,
        coupleId: couple.id,
        mood: selected,
        message,
      });
      setMessage('');
      haptics.success();
      Alert.alert('Mood shared', 'Your partner can see it instantly.');
    } catch (e: unknown) {
      haptics.error();
      Alert.alert(
        isEditing ? 'Could not save mood' : 'Could not share mood',
        (e as Error).message
      );
    } finally {
      setLoading(false);
    }
  };

  const panelBg = isDark ? colors.surfaceCard : '#FFF7FA';
  const tileBg = isDark ? colors.surface : '#FFFFFF';
  const noteBg = isDark ? colors.surfaceMuted : '#FCE8EF';
  const recent = history.slice(0, 4);

  return (
    <Screen padded={false} edges={['top', 'left', 'right']}>
      <View
        style={[styles.fill, { backgroundColor: isDark ? colors.background : '#FFF1F5' }]}
        onLayout={onBgLayout}
      >
        <View pointerEvents="none" style={styles.bg}>
          {isDark ? (
            <LinearGradient
              colors={colors.gradientHero}
              start={{ x: 0.15, y: 0 }}
              end={{ x: 0.85, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          ) : bgSize.width > 0 && bgSize.height > 0 ? (
            <LoveNotesBg width={bgSize.width} height={bgSize.height} />
          ) : null}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.pageHeader}>
            <View pointerEvents="none" style={styles.headerHearts}>
              <MoodDoubleHearts width={112} height={72} />
            </View>
            <View style={styles.pageTitleRow}>
              <Text color={colors.textHeading} style={styles.pageTitle}>
                {isEditing ? 'Edit Mood' : 'Mood'}
              </Text>
              <HeartOutlineIcon size={20} color={colors.primary} />
            </View>
            <Text color={colors.textSecondary} style={styles.pageSubtitle}>
              {isEditing
                ? 'Update how you felt in this moment.'
                : `Share how you feel. ${partner?.displayName?.split(' ')[0] || 'Your partner'} sees it live.`}
            </Text>
          </View>

          <View style={[styles.panel, { backgroundColor: panelBg }, theme.shadows.soft]}>
            <View style={styles.chooseHeader}>
              <View style={[styles.chooseIcon, { backgroundColor: isDark ? colors.surfaceMuted : '#FFE0EA' }]}>
                <Text style={styles.chooseIconEmoji}>😊</Text>
              </View>
              <View style={styles.chooseCopy}>
                <Text color={colors.textHeading} style={styles.chooseTitle}>
                  Choose a Mood
                </Text>
                <Text color={colors.textSecondary} style={styles.chooseSubtitle}>
                  How are you feeling right now?
                </Text>
              </View>
            </View>

            <View style={styles.grid}>
              {pickerMoods.map((mood) => {
                const active = selected === mood.emoji;
                return (
                  <Pressable
                    key={mood.emoji}
                    onPress={() => {
                      haptics.selection();
                      setSelected(mood.emoji);
                    }}
                    style={({ pressed }) => [
                      styles.tile,
                      theme.shadows.card,
                      {
                        backgroundColor: active ? 'transparent' : tileBg,
                        opacity: pressed ? 0.92 : 1,
                      },
                    ]}
                  >
                    {active ? (
                      <LinearGradient
                        colors={colors.gradientPrimary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                    ) : null}
                    {active ? (
                      <View style={styles.check}>
                        <SymbolView
                          name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                          size={11}
                          tintColor={colors.primary}
                          weight="bold"
                          fallback={
                            <Text color={colors.primary} style={styles.checkFallback}>
                              ✓
                            </Text>
                          }
                        />
                      </View>
                    ) : null}
                    <Text style={styles.tileEmoji}>{mood.emoji}</Text>
                    <Text
                      color={active ? colors.textInverse : colors.textHeading}
                      style={styles.tileLabel}
                    >
                      {mood.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.noteBlock}>
              <View style={styles.noteLabelRow}>
                <SymbolView
                  name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                  size={14}
                  tintColor={colors.textHeading}
                  weight="medium"
                  fallback={<Text color={colors.textHeading}>✎</Text>}
                />
                <Text color={colors.textHeading} style={styles.noteLabel}>
                  Add a note (optional)
                </Text>
              </View>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="A soft note about today..."
                placeholderTextColor={colors.textMuted}
                maxLength={160}
                style={[
                  styles.noteInput,
                  {
                    backgroundColor: noteBg,
                    color: colors.textHeading,
                  },
                ]}
              />
            </View>

            <Pressable
              onPress={onShare}
              disabled={!selected || loading}
              style={({ pressed }) => [
                styles.cta,
                theme.shadows.glow,
                { opacity: !selected || loading ? 0.55 : pressed ? 0.92 : 1 },
              ]}
            >
              <LinearGradient
                colors={colors.gradientPrimary}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.ctaGradient}
              >
                {loading ? (
                  <ActivityIndicator color={colors.textInverse} />
                ) : (
                  <>
                    <SymbolView
                      name={{ ios: 'paperplane.fill', android: 'send', web: 'send' }}
                      size={16}
                      tintColor={colors.textInverse}
                      weight="semibold"
                      fallback={<Text color={colors.textInverse}>➤</Text>}
                    />
                    <Text color={colors.textInverse} style={styles.ctaLabel}>
                      {isEditing ? 'Save Mood' : 'Share Mood'}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </View>

          {!isEditing ? (
            <View style={styles.recentSection}>
              <View style={styles.recentHeader}>
                <View style={styles.recentTitleRow}>
                  <View
                    style={[
                      styles.clockBtn,
                      {
                        backgroundColor: isDark ? colors.surfaceMuted : '#FFE0EA',
                      },
                    ]}
                  >
                    <SymbolView
                      name={{ ios: 'clock.fill', android: 'schedule', web: 'schedule' }}
                      size={16}
                      tintColor={colors.brand}
                      weight="medium"
                      fallback={<Text color={colors.brand}>⏱</Text>}
                    />
                  </View>
                  <Text color={colors.textHeading} style={styles.recentTitle}>
                    Recent Moods
                  </Text>
                </View>

                <Pressable
                  onPress={() => {
                    haptics.selection();
                    router.push('/mood/history');
                  }}
                  style={({ pressed }) => [
                    styles.viewAll,
                    {
                      borderColor: isDark ? colors.border : 'rgba(242, 95, 130, 0.28)',
                      backgroundColor: isDark ? colors.surfaceCard : '#FFFFFF',
                      opacity: pressed ? 0.88 : 1,
                    },
                  ]}
                >
                  <Text color={colors.primary} style={styles.viewAllLabel}>
                    View All
                  </Text>
                  <Text color={colors.primary} style={styles.viewAllChevron}>
                    ›
                  </Text>
                </Pressable>
              </View>

              {recent.length === 0 ? (
                <Text color={colors.textSecondary} style={styles.emptyRecent}>
                  No moods yet — share how you feel today.
                </Text>
              ) : (
                <View style={styles.recentList}>
                  {recent.map((item) => {
                    const mine = item.uid === profile?.uid;
                    return (
                      <MoodRecentCard
                        key={item.id}
                        mood={item.mood}
                        senderLabel={
                          mine ? 'You' : partner?.displayName?.split(' ')[0] || 'Partner'
                        }
                        createdAt={item.createdAt}
                      />
                    );
                  })}
                </View>
              )}
            </View>
          ) : null}
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  bg: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 110,
    gap: spacing.md,
  },
  pageHeader: {
    position: 'relative',
    paddingRight: 100,
    marginBottom: spacing.xs,
    gap: 4,
  },
  headerHearts: {
    position: 'absolute',
    right: -6,
    top: 4,
  },
  pageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.6,
  },
  pageSubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 240,
  },
  panel: {
    borderRadius: 28,
    padding: spacing.md,
    gap: spacing.md,
  },
  chooseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chooseIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chooseIconEmoji: {
    fontSize: 22,
    lineHeight: 26,
  },
  chooseCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  chooseTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  chooseSubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    width: '31%',
    flexGrow: 1,
    minWidth: 96,
    maxWidth: '33.5%',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  check: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  checkFallback: {
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    lineHeight: 12,
  },
  tileEmoji: {
    fontSize: 30,
    lineHeight: 36,
  },
  tileLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 16,
  },
  noteBlock: {
    gap: 8,
  },
  noteLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  noteLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  },
  noteInput: {
    borderRadius: 18,
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  cta: {
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  ctaGradient: {
    minHeight: 54,
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  ctaLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 20,
  },
  recentSection: {
    gap: 12,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  recentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  clockBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  viewAllLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
  },
  viewAllChevron: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 16,
    marginTop: -1,
  },
  recentList: {
    gap: 10,
  },
  emptyRecent: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 4,
  },
});
