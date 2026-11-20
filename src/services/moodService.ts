import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  Unsubscribe,
} from 'firebase/firestore';
import { getDb } from '@/src/lib/firebase';
import { updateUserProfile } from '@/src/services/userService';
import { MoodEmoji, MoodEntry } from '@/src/types/models';

function mapMood(id: string, data: Record<string, unknown>): MoodEntry {
  return {
    id,
    coupleId: String(data.coupleId ?? ''),
    uid: String(data.uid ?? ''),
    mood: data.mood as MoodEmoji,
    message: (data.message as string | null) ?? null,
    createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
    deleted: Boolean(data.deleted),
  };
}

export function subscribeMoodHistory(
  coupleId: string,
  onData: (entries: MoodEntry[]) => void,
  onError?: (error: Error) => void,
  max = 30
): Unsubscribe {
  const q = query(
    collection(getDb(), 'moods'),
    where('coupleId', '==', coupleId),
    orderBy('createdAt', 'desc'),
    limit(max)
  );

  return onSnapshot(
    q,
    (snap) => {
      const entries = snap.docs
        .map((d) => mapMood(d.id, d.data() as Record<string, unknown>))
        .filter((entry) => !entry.deleted);
      onData(entries);
    },
    (error) => onError?.(error)
  );
}

export async function shareMood(input: {
  uid: string;
  coupleId: string;
  mood: MoodEmoji;
  message?: string;
}): Promise<void> {
  const message = input.message?.trim() || null;
  if (message && message.length > 160) {
    throw new Error('Mood messages can be up to 160 characters');
  }

  const now = Date.now();

  await addDoc(collection(getDb(), 'moods'), {
    coupleId: input.coupleId,
    uid: input.uid,
    mood: input.mood,
    message,
    createdAt: now,
    deleted: false,
    createdAtServer: serverTimestamp(),
  });

  await updateUserProfile(input.uid, {
    currentMood: input.mood,
    moodMessage: message,
    moodUpdatedAt: now,
  });
}

export async function updateMoodEntry(input: {
  moodId: string;
  uid: string;
  mood: MoodEmoji;
  message?: string | null;
}): Promise<void> {
  const message = input.message?.trim() || null;
  if (message && message.length > 160) {
    throw new Error('Mood messages can be up to 160 characters');
  }

  const now = Date.now();

  await updateDoc(doc(getDb(), 'moods', input.moodId), {
    mood: input.mood,
    message,
    updatedAt: now,
  });

  await updateUserProfile(input.uid, {
    currentMood: input.mood,
    moodMessage: message,
    moodUpdatedAt: now,
  });
}

export async function deleteMoodEntry(moodId: string): Promise<void> {
  await updateDoc(doc(getDb(), 'moods', moodId), {
    deleted: true,
    deletedAt: Date.now(),
  });
}
