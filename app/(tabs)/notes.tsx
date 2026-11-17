import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoveNotesBg } from '@/src/components/illustrations/LoveNotesBg';
import { NotesEmptyCard } from '@/src/components/notes/NotesEmptyCard';
import { NotesHeader } from '@/src/components/notes/NotesHeader';
import { Screen } from '@/src/components/ui/Screen';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { Text } from '@/src/components/ui/Text';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCouple } from '@/src/contexts/CoupleContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { deleteLoveNote, subscribeLoveNotes } from '@/src/services/notesService';
import { LoveNote } from '@/src/types/models';
import { formatNoteTime } from '@/src/utils/dates';
import { fonts } from '@/src/theme/typography';
import { radii, spacing } from '@/src/theme/spacing';

export default function NotesScreen() {
  const { profile } = useAuth();
  const { couple, partner } = useCouple();
  const { colors, theme, isDark } = useTheme();
  const haptics = useHaptics();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [notes, setNotes] = useState<LoveNote[]>([]);
  const [loading, setLoading] = useState(true);

  const goWrite = () => router.push('/note/create');
  const bgHeight = height - insets.bottom;

  useEffect(() => {
    if (!couple?.id) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const unsub = subscribeLoveNotes(
      couple.id,
      (next) => {
        setNotes(next);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [couple?.id]);

  const onDelete = (note: LoveNote) => {
    if (note.fromUid !== profile?.uid) {
      Alert.alert('Only the sender can delete this note.');
      return;
    }

    Alert.alert('Delete note?', 'This removes it for both of you.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteLoveNote(note.id);
            haptics.medium();
          } catch (e: unknown) {
            Alert.alert('Could not delete', (e as Error).message);
          }
        },
      },
    ]);
  };

  return (
    <Screen padded={false} edges={['top', 'left', 'right']}>
      <View style={[styles.fill, { backgroundColor: isDark ? colors.background : '#FFF1F5' }]}>
        <View pointerEvents="none" style={styles.bg}>
          {isDark ? (
            <LinearGradient
              colors={colors.gradientHero}
              start={{ x: 0.15, y: 0 }}
              end={{ x: 0.85, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <LoveNotesBg width={width} height={bgHeight} />
          )}
        </View>

        <NotesHeader />

        {loading ? (
          <View style={styles.listPad}>
            <Skeleton height={280} radius={32} />
          </View>
        ) : (
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listPad,
              notes.length === 0 && styles.emptyList,
            ]}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <NotesEmptyCard onWrite={goWrite} />
              </View>
            }
            renderItem={({ item }) => {
              const mine = item.fromUid === profile?.uid;
              return (
                <Pressable
                  onLongPress={() => onDelete(item)}
                  style={[
                    styles.note,
                    theme.shadows.card,
                    {
                      backgroundColor: mine
                        ? isDark
                          ? colors.surfaceMuted
                          : '#FFF0F4'
                        : isDark
                          ? colors.surface
                          : '#FFF8FA',
                      alignSelf: mine ? 'flex-end' : 'flex-start',
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    color={colors.primary}
                    style={styles.noteMeta}
                    numberOfLines={1}
                  >
                    {mine ? 'You' : partner?.displayName || 'Partner'}
                  </Text>
                  <Text color={colors.textHeading} style={styles.body}>
                    {item.text}
                  </Text>
                  <Text color={colors.textMuted} style={styles.noteMeta}>
                    {formatNoteTime(item.createdAt)} · hold to delete
                  </Text>
                </Pressable>
              );
            }}
          />
        )}
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
  listPad: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.sm,
    flexGrow: 1,
  },
  emptyList: {
    justifyContent: 'center',
  },
  emptyWrap: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  note: {
    maxWidth: '88%',
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: 6,
  },
  noteMeta: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
});
