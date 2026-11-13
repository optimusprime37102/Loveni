import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Screen } from '@/src/components/ui/Screen';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCouple } from '@/src/contexts/CoupleContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { deleteLoveNote, subscribeLoveNotes } from '@/src/services/notesService';
import { LoveNote } from '@/src/types/models';
import { formatNoteTime } from '@/src/utils/dates';
import { radii, spacing } from '@/src/theme/spacing';

export default function NotesScreen() {
  const { profile } = useAuth();
  const { couple, partner } = useCouple();
  const { colors, theme } = useTheme();
  const haptics = useHaptics();
  const [notes, setNotes] = useState<LoveNote[]>([]);
  const [loading, setLoading] = useState(true);

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
      <View style={styles.header}>
        <View>
          <Text variant="title">Love notes</Text>
          <Text muted>Private words between you two</Text>
        </View>
        <Button
          title="Write"
          onPress={() => router.push('/note/create')}
          style={styles.writeBtn}
        />
      </View>

      {loading ? (
        <View style={styles.listPad}>
          <Skeleton height={110} radius={20} />
          <Skeleton height={110} radius={20} style={{ marginTop: 12 }} />
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPad}
          ListEmptyComponent={
            <EmptyState
              emoji="💌"
              title="No notes yet"
              subtitle="Send a short note your partner can open anytime."
              actionLabel="Write a note"
              onAction={() => router.push('/note/create')}
            />
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
                    backgroundColor: mine ? colors.surfaceMuted : colors.surface,
                    alignSelf: mine ? 'flex-end' : 'flex-start',
                  },
                ]}
              >
                <Text variant="caption" color={colors.primary}>
                  {mine ? 'You' : partner?.displayName || 'Partner'}
                </Text>
                <Text style={styles.body}>{item.text}</Text>
                <Text variant="caption" muted>
                  {formatNoteTime(item.createdAt)} · hold to delete
                </Text>
              </Pressable>
            );
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  writeBtn: {
    minWidth: 96,
    minHeight: 44,
  },
  listPad: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.sm,
    flexGrow: 1,
  },
  note: {
    maxWidth: '88%',
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: 6,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
});
