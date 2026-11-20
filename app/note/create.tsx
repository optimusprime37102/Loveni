import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCouple } from '@/src/contexts/CoupleContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { sendLoveNote, updateLoveNote } from '@/src/services/notesService';
import { validateNote } from '@/src/utils/validation';
import { spacing } from '@/src/theme/spacing';

const EMOJI_SHORTCUTS = ['❤️', '🥰', '😘', '✨', '🌹', '🤍', '🌙', '💌'];

export default function CreateNoteScreen() {
  const { profile } = useAuth();
  const { couple, partner } = useCouple();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const params = useLocalSearchParams<{ noteId?: string; text?: string }>();

  const noteId = typeof params.noteId === 'string' ? params.noteId : undefined;
  const initialText = typeof params.text === 'string' ? params.text : '';
  const isEditing = Boolean(noteId);

  const [text, setText] = useState(initialText);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => (isEditing ? 'Edit love note' : 'New love note'), [isEditing]);
  const cta = useMemo(() => (isEditing ? 'Save note' : 'Send note'), [isEditing]);

  const onSend = async () => {
    const noteError = validateNote(text);
    if (noteError) {
      setError(noteError);
      haptics.error();
      return;
    }
    if (!profile || !couple || !partner) {
      Alert.alert('Connect a partner first');
      return;
    }

    try {
      setLoading(true);
      if (isEditing && noteId) {
        await updateLoveNote(noteId, text);
      } else {
        await sendLoveNote({
          coupleId: couple.id,
          fromUid: profile.uid,
          toUid: partner.uid,
          text,
        });
      }
      haptics.success();
      router.back();
    } catch (e: unknown) {
      haptics.error();
      Alert.alert(
        isEditing ? 'Could not save note' : 'Could not send note',
        (e as Error).message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text color={colors.primary}>Close</Text>
        </Pressable>
        <Text variant="heading">{title}</Text>
        <View style={{ width: 48 }} />
      </View>

      <Text muted style={styles.subtitle}>
        For {partner?.displayName || 'your partner'} — soft, short, and real-time.
      </Text>

      <Input
        label="Your note"
        value={text}
        onChangeText={(v) => {
          setText(v);
          setError(undefined);
        }}
        placeholder="I've been thinking about you…"
        multiline
        style={{ minHeight: 140, textAlignVertical: 'top' }}
        maxLength={500}
        error={error}
        hint={`${text.length}/500`}
      />

      <View style={styles.emojis}>
        {EMOJI_SHORTCUTS.map((emoji) => (
          <Pressable
            key={emoji}
            onPress={() => {
              haptics.selection();
              setText((prev) => `${prev}${emoji}`);
            }}
            style={[styles.emojiBtn, { backgroundColor: colors.surfaceMuted }]}
          >
            <Text style={{ fontSize: 20 }}>{emoji}</Text>
          </Pressable>
        ))}
      </View>

      <Button title={cta} onPress={onSend} loading={loading} style={styles.cta} />
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
  subtitle: { marginBottom: spacing.lg },
  emojis: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  emojiBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: { marginTop: spacing.xl },
});
