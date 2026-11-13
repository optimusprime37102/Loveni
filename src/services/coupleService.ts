import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getDb, getFirebaseFunctions } from '@/src/lib/firebase';
import { CoupleProfile } from '@/src/types/models';
import { generateInviteCode, normalizeInviteCode } from '@/src/utils/inviteCode';

function couplesRef(coupleId: string) {
  return doc(getDb(), 'couples', coupleId);
}

function mapCouple(id: string, data: Record<string, unknown>): CoupleProfile {
  const members = (data.memberIds as string[]) || [];
  return {
    id,
    memberIds: [members[0] || '', members[1] || ''] as [string, string],
    startDate: (data.startDate as string | null) ?? null,
    createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now(),
    createdBy: String(data.createdBy ?? ''),
  };
}

export async function getCouple(coupleId: string): Promise<CoupleProfile | null> {
  const snap = await getDoc(couplesRef(coupleId));
  if (!snap.exists()) return null;
  return mapCouple(coupleId, snap.data() as Record<string, unknown>);
}

export function subscribeCouple(
  coupleId: string,
  onData: (couple: CoupleProfile | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    couplesRef(coupleId),
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      onData(mapCouple(coupleId, snap.data() as Record<string, unknown>));
    },
    (error) => onError?.(error)
  );
}

export async function updateRelationshipStartDate(
  coupleId: string,
  startDate: string
): Promise<void> {
  await updateDoc(couplesRef(coupleId), {
    startDate,
    updatedAt: Date.now(),
    updatedAtServer: serverTimestamp(),
  });
}

export async function createInvite(): Promise<{ code: string; expiresAt: number }> {
  const createInviteFn = httpsCallable(getFirebaseFunctions(), 'createInvite');
  const result = await createInviteFn({ code: generateInviteCode() });
  return result.data as { code: string; expiresAt: number };
}

export async function acceptInvite(code: string): Promise<{ coupleId: string }> {
  const acceptInviteFn = httpsCallable(getFirebaseFunctions(), 'acceptInvite');
  const result = await acceptInviteFn({ code: normalizeInviteCode(code) });
  return result.data as { coupleId: string };
}

export async function disconnectPartner(): Promise<void> {
  const disconnectFn = httpsCallable(getFirebaseFunctions(), 'disconnectPartner');
  await disconnectFn({});
}

/** Client fallback helpers used only when Cloud Functions are unavailable in local demos. */
export function getCallableErrorMessage(error: unknown): string {
  const err = error as { code?: string; message?: string };
  if (err?.code === 'functions/not-found' || err?.code === 'functions/unavailable') {
    return 'Partner pairing backend is not deployed yet. Deploy Cloud Functions (see README).';
  }
  if (err?.message) return err.message;
  return 'Unable to complete partner action. Please try again.';
}
