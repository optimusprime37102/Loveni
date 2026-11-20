import { useEffect } from 'react';
import { Platform } from 'react-native';
import { LoveNote, UserProfile } from '@/src/types/models';
import { syncHomeWidgets } from '@/src/widgets/syncHomeWidgets';

type Args = {
  me: UserProfile | null | undefined;
  partner: UserProfile | null;
  startDate: string | null;
  note: LoveNote | null;
  connected: boolean;
  enabled?: boolean;
};

export function useSyncHomeWidgets({
  me,
  partner,
  startDate,
  note,
  connected,
  enabled = true,
}: Args) {
  useEffect(() => {
    if (!enabled || !me || Platform.OS === 'web') return;
    void syncHomeWidgets({
      me,
      partner,
      startDate,
      note,
      connected,
    });
  }, [
    enabled,
    me,
    partner,
    startDate,
    note,
    connected,
    me?.currentMood,
    me?.moodUpdatedAt,
    me?.avatarId,
    partner?.avatarId,
    note?.text,
    note?.id,
  ]);
}
