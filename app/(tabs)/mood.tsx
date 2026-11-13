import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { MOODS } from '@/src/constants/moods';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCouple } from '@/src/contexts/CoupleContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { shareMood, subscribeMoodHistory } from '@/src/services/moodService';
import { MoodEmoji, MoodEntry } from '@/src/types/models';
import { formatNoteTime } from '@/src/utils/dates';
import { radii, spacing } from '@/src/theme/spacing';

export default function MoodScreen() {
  const { profile } = useAuth();
  const { couple, partner } = useCouple();
  const { colors, theme } = useTheme();
  const haptics = useHaptics();
  const [selected, setSelected] = useState<MoodEmoji | null>(profile?.currentMood || null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<MoodEntry[]>([]);

  useEffect(() => {
    if (!couple?.id) return;
    return subscribeMoodHistory(couple.id, setHistory);
  }, [couple?.id]);

  const onShare = async () => {
    if (!selected || !profile || !couple) return;
    try {
      setLoading(true);
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
      Alert.alert('Could not share mood', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <Text variant="title" style={styles.title}>
        Mood
      </Text>
      <Text muted style={styles.subtitle}>
        Share how you feel. {partner?.displayName || 'Your partner'} sees it live.
      </Text>

      <Card>
        <Text variant="label" color={colors.secondary}>
          Choose a mood
        </Text>
        <View style={styles.grid}>
          {MOODS.map((mood) => {
            const active = selected === mood.emoji;
            return (
              <Pressable
                key={mood.emoji}
                onPress={() => {
                  haptics.selection();
                  setSelected(mood.emoji);
                }}
                style={[
                  styles.moodItem,
                  theme.shadows.card,
                  {
                    backgroundColor: active ? colors.surfaceMuted : colors.surface,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={styles.emoji}>{mood.emoji}</Text>
                <Text variant="caption" center>
                  {mood.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Input
          label="Optional message"
          value={message}
          onChangeText={setMessage}
          placeholder="A soft note about today…"
          maxLength={160}
          style={{ marginTop: spacing.md }}
        />

        <Button
          title="Share mood"
          onPress={onShare}
          loading={loading}
          disabled={!selected}
          style={{ marginTop: spacing.md }}
        />
      </Card>

      <Text variant="heading" style={styles.historyTitle}>
        Recent moods
      </Text>
      {history.length === 0 ? (
        <Text muted>No mood history yet.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const mine = item.uid === profile?.uid;
            return (
              <View
                style={[
                  styles.historyItem,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <Text style={{ fontSize: 28 }}>{item.mood}</Text>
                <View style={{ flex: 1 }}>
                  <Text variant="subtitle">
                    {mine ? 'You' : partner?.displayName || 'Partner'}
                  </Text>
                  {item.message ? <Text muted>{item.message}</Text> : null}
                  <Text variant="caption" muted>
                    {formatNoteTime(item.createdAt)}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.md },
  subtitle: { marginBottom: spacing.lg, marginTop: 4 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  moodItem: {
    width: '30%',
    flexGrow: 1,
    minWidth: 96,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  emoji: { fontSize: 28 },
  historyTitle: { marginTop: spacing.xl, marginBottom: spacing.md },
  historyItem: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
});
