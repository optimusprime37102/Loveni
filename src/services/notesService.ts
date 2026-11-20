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
import { LoveNote } from '@/src/types/models';

function mapNote(id: string, data: Record<string, unknown>): LoveNote {
  return {
    id,
    coupleId: String(data.coupleId ?? ''),
    fromUid: String(data.fromUid ?? ''),
    toUid: String(data.toUid ?? ''),
    text: String(data.text ?? ''),
    createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
    deleted: Boolean(data.deleted),
  };
}

export function subscribeLoveNotes(
  coupleId: string,
  onData: (notes: LoveNote[]) => void,
  onError?: (error: Error) => void,
  max = 50
): Unsubscribe {
  const q = query(
    collection(getDb(), 'notes'),
    where('coupleId', '==', coupleId),
    where('deleted', '==', false),
    orderBy('createdAt', 'desc'),
    limit(max)
  );

  return onSnapshot(
    q,
    (snap) => {
      const notes = snap.docs.map((d) => mapNote(d.id, d.data() as Record<string, unknown>));
      onData(notes);
    },
    (error) => onError?.(error)
  );
}

export async function sendLoveNote(input: {
  coupleId: string;
  fromUid: string;
  toUid: string;
  text: string;
}): Promise<string> {
  const trimmed = input.text.trim();
  if (!trimmed) throw new Error('Write a little something first');
  if (trimmed.length > 500) throw new Error('Notes can be up to 500 characters');

  const ref = await addDoc(collection(getDb(), 'notes'), {
    coupleId: input.coupleId,
    fromUid: input.fromUid,
    toUid: input.toUid,
    text: trimmed,
    createdAt: Date.now(),
    deleted: false,
    createdAtServer: serverTimestamp(),
  });

  return ref.id;
}

export async function updateLoveNote(noteId: string, text: string): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('Write a little something first');
  if (trimmed.length > 500) throw new Error('Notes can be up to 500 characters');

  await updateDoc(doc(getDb(), 'notes', noteId), {
    text: trimmed,
    updatedAt: Date.now(),
  });
}

export async function deleteLoveNote(noteId: string): Promise<void> {
  await updateDoc(doc(getDb(), 'notes', noteId), {
    deleted: true,
    deletedAt: Date.now(),
  });
}
