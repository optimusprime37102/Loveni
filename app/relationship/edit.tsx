import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { Text } from '@/src/components/ui/Text';
import { useCouple } from '@/src/contexts/CoupleContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useDaysTogether } from '@/src/hooks/useDaysTogether';
import { useHaptics } from '@/src/hooks/useHaptics';
import { updateRelationshipStartDate } from '@/src/services/coupleService';
import { parseDateOnly, toDateOnlyString, formatFriendlyDate } from '@/src/utils/dates';
import { spacing } from '@/src/theme/spacing';

export default function EditRelationshipScreen() {
  const { couple } = useCouple();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const initial = useMemo(
    () => parseDateOnly(couple?.startDate) || new Date(),
    [couple?.startDate]
  );
  const [date, setDate] = useState(initial);
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const [loading, setLoading] = useState(false);
  const preview = useDaysTogether(toDateOnlyString(date));

  const onSave = async () => {
    if (!couple) return;
    try {
      setLoading(true);
      await updateRelationshipStartDate(couple.id, toDateOnlyString(date));
      haptics.success();
      Alert.alert('Saved', 'Your days together are synced for both of you.');
      router.back();
    } catch (e: unknown) {
      haptics.error();
      Alert.alert('Could not save', (e as Error).message);
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
        <Text variant="heading">Relationship</Text>
        <View style={{ width: 48 }} />
      </View>

      <Card>
        <Text variant="label" color={colors.primary}>
          Start date
        </Text>
        <Text variant="title" style={{ marginTop: spacing.sm }}>
          {formatFriendlyDate(toDateOnlyString(date))}
        </Text>
        <Text muted style={{ marginVertical: spacing.md }}>
          This date syncs instantly with your partner and powers your day count and anniversary
          countdown.
        </Text>

        {Platform.OS === 'android' && !showPicker ? (
          <Button title="Pick a date" variant="secondary" onPress={() => setShowPicker(true)} />
        ) : null}

        {showPicker ? (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            onChange={(_, selected) => {
              if (Platform.OS === 'android') setShowPicker(false);
              if (selected) setDate(selected);
            }}
          />
        ) : null}

        <View style={[styles.preview, { backgroundColor: colors.surfaceMuted }]}>
          <Text variant="caption" color={colors.primary}>
            Preview
          </Text>
          <Text variant="heading">{preview.days} days together</Text>
          {preview.anniversary ? (
            <Text muted>
              Anniversary in {preview.anniversary.daysUntil} day
              {preview.anniversary.daysUntil === 1 ? '' : 's'}
            </Text>
          ) : null}
        </View>

        <Button title="Save date" onPress={onSave} loading={loading} style={{ marginTop: spacing.lg }} />
      </Card>
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
  preview: {
    marginTop: spacing.lg,
    borderRadius: 16,
    padding: spacing.md,
    gap: 4,
  },
});
