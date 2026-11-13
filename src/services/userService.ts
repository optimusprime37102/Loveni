import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { getDb } from '@/src/lib/firebase';
import { AvatarId, UserProfile } from '@/src/types/models';

function usersRef(uid: string) {
  return doc(getDb(), 'users', uid);
}

function mapUser(uid: string, data: Record<string, unknown>): UserProfile {
  return {
    uid,
    email: String(data.email ?? ''),
    displayName: String(data.displayName ?? ''),
    avatarId: (data.avatarId as AvatarId) || 'rose',
    coupleId: (data.coupleId as string | null) ?? null,
    partnerId: (data.partnerId as string | null) ?? null,
    currentMood: (data.currentMood as UserProfile['currentMood']) ?? null,
    moodMessage: (data.moodMessage as string | null) ?? null,
    moodUpdatedAt: typeof data.moodUpdatedAt === 'number' ? data.moodUpdatedAt : null,
    onboardingComplete: Boolean(data.onboardingComplete),
    createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now(),
  };
}

export async function createUserProfile(input: {
  uid: string;
  email: string;
  displayName?: string;
}): Promise<UserProfile> {
  const now = Date.now();
  const profile: UserProfile = {
    uid: input.uid,
    email: input.email,
    displayName: input.displayName?.trim() || '',
    avatarId: 'rose',
    coupleId: null,
    partnerId: null,
    currentMood: null,
    moodMessage: null,
    moodUpdatedAt: null,
    onboardingComplete: false,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(usersRef(input.uid), {
    ...profile,
    createdAtServer: serverTimestamp(),
    updatedAtServer: serverTimestamp(),
  });

  return profile;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(usersRef(uid));
  if (!snap.exists()) return null;
  return mapUser(uid, snap.data() as Record<string, unknown>);
}

export function subscribeUserProfile(
  uid: string,
  onData: (profile: UserProfile | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    usersRef(uid),
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      onData(mapUser(uid, snap.data() as Record<string, unknown>));
    },
    (error) => onError?.(error)
  );
}

export async function updateUserProfile(
  uid: string,
  patch: Partial<
    Pick<
      UserProfile,
      | 'displayName'
      | 'avatarId'
      | 'onboardingComplete'
      | 'currentMood'
      | 'moodMessage'
      | 'moodUpdatedAt'
    >
  >
): Promise<void> {
  await updateDoc(usersRef(uid), {
    ...patch,
    updatedAt: Date.now(),
    updatedAtServer: serverTimestamp(),
  });
}

export async function completeProfileSetup(
  uid: string,
  displayName: string,
  avatarId: AvatarId
): Promise<void> {
  await updateUserProfile(uid, {
    displayName: displayName.trim(),
    avatarId,
    onboardingComplete: true,
  });
}
