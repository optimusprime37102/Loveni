import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  where,
  type DocumentReference,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getDb, getFirebaseFunctions } from '@/src/lib/firebase';
import { generateInviteCode, normalizeInviteCode } from '@/src/utils/inviteCode';

const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function pairingMode(): 'functions' | 'client' {
  const mode = process.env.EXPO_PUBLIC_PAIRING_MODE;
  return mode === 'functions' ? 'functions' : 'client';
}

async function findInviteRefByCode(code: string): Promise<DocumentReference> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, 'invites'), where('code', '==', code), limit(1))
  );
  if (!snap.empty) return snap.docs[0].ref;

  // Legacy invites used the code as the document id.
  return doc(db, 'invites', code);
}

async function revokeLegacyOpenInvites(uid: string): Promise<DocumentReference[]> {
  const db = getDb();
  const snap = await getDocs(
    query(
      collection(db, 'invites'),
      where('createdBy', '==', uid),
      where('status', '==', 'open')
    )
  );

  return snap.docs
    .filter((item) => item.id !== uid)
    .map((item) => item.ref);
}

export async function createInviteCode(uid: string): Promise<{ code: string; expiresAt: number }> {
  if (pairingMode() === 'functions') {
    try {
      const fn = httpsCallable(getFirebaseFunctions(), 'createInvite');
      const result = await fn({});
      return result.data as { code: string; expiresAt: number };
    } catch (error) {
      // Fall through to client pairing for Expo Go before functions are deployed.
      console.warn('createInvite callable failed, using client pairing', error);
    }
  }

  const db = getDb();
  const userRef = doc(db, 'users', uid);
  const inviteRef = doc(db, 'invites', uid);
  const expiresAt = Date.now() + INVITE_TTL_MS;
  const legacyRefs = await revokeLegacyOpenInvites(uid);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateInviteCode();

    try {
      const collisionSnap = await getDocs(
        query(collection(db, 'invites'), where('code', '==', code), limit(1))
      );
      const collision = collisionSnap.docs.find((item) => item.id !== uid);
      if (collision) throw new Error('CODE_COLLISION');

      await runTransaction(db, async (tx) => {
        const userSnap = await tx.get(userRef);
        if (!userSnap.exists()) throw new Error('Profile not found.');
        const user = userSnap.data();
        if (user.coupleId) throw new Error('You are already connected to a partner.');

        const existingSnap = await tx.get(inviteRef);
        const legacySnaps = await Promise.all(legacyRefs.map((ref) => tx.get(ref)));
        const now = Date.now();

        legacySnaps.forEach((legacySnap, index) => {
          if (legacySnap.exists() && legacySnap.data()?.status === 'open') {
            tx.update(legacyRefs[index], {
              status: 'revoked',
              revokedAt: now,
            });
          }
        });

        tx.set(inviteRef, {
          code,
          createdBy: uid,
          status: 'open',
          claimedBy: null,
          coupleId: null,
          createdAt: existingSnap.exists()
            ? (existingSnap.data()?.createdAt ?? now)
            : now,
          expiresAt,
          updatedAt: now,
          createdAtServer: existingSnap.exists()
            ? (existingSnap.data()?.createdAtServer ?? serverTimestamp())
            : serverTimestamp(),
          updatedAtServer: serverTimestamp(),
        });
      });

      return { code, expiresAt };
    } catch (error: unknown) {
      if ((error as Error).message === 'CODE_COLLISION') continue;
      throw error;
    }
  }

  throw new Error('Could not generate a unique invite code. Try again.');
}

export async function acceptInviteCode(
  uid: string,
  rawCode: string
): Promise<{ coupleId: string }> {
  const code = normalizeInviteCode(rawCode);
  if (code.length < 4) throw new Error('Enter a valid invite code.');

  if (pairingMode() === 'functions') {
    try {
      const fn = httpsCallable(getFirebaseFunctions(), 'acceptInvite');
      const result = await fn({ code });
      return result.data as { coupleId: string };
    } catch (error) {
      console.warn('acceptInvite callable failed, using client pairing', error);
    }
  }

  const db = getDb();
  const inviteRef = await findInviteRefByCode(code);
  const meRef = doc(db, 'users', uid);

  return runTransaction(db, async (tx) => {
    const [inviteSnap, meSnap] = await Promise.all([tx.get(inviteRef), tx.get(meRef)]);

    if (!inviteSnap.exists()) throw new Error('Invite code not found.');
    const invite = inviteSnap.data();
    if (normalizeInviteCode(String(invite.code ?? inviteSnap.id)) !== code) {
      throw new Error('Invite code not found.');
    }
    if (invite.status !== 'open') throw new Error('This invite has already been used.');
    if (invite.expiresAt && invite.expiresAt < Date.now()) {
      throw new Error('This invite has expired. Ask your partner for a new one.');
    }
    if (invite.createdBy === uid) throw new Error('You cannot accept your own invite.');

    if (!meSnap.exists()) throw new Error('Profile not found.');
    const me = meSnap.data();
    if (me.coupleId) throw new Error('You are already connected to a partner.');

    const partnerRef = doc(db, 'users', invite.createdBy);
    const partnerSnap = await tx.get(partnerRef);
    if (!partnerSnap.exists()) throw new Error('Partner profile not found.');
    const partner = partnerSnap.data();
    if (partner.coupleId) throw new Error('That person is already connected to someone.');

    const coupleRef = doc(db, 'couples', `${invite.createdBy}_${uid}`);
    const now = Date.now();

    tx.set(coupleRef, {
      memberIds: [invite.createdBy, uid],
      startDate: null,
      createdAt: now,
      updatedAt: now,
      createdBy: invite.createdBy,
    });

    tx.update(inviteRef, {
      status: 'claimed',
      claimedBy: uid,
      coupleId: coupleRef.id,
      claimedAt: now,
    });

    tx.update(meRef, {
      coupleId: coupleRef.id,
      partnerId: invite.createdBy,
      updatedAt: now,
    });

    tx.update(partnerRef, {
      coupleId: coupleRef.id,
      partnerId: uid,
      updatedAt: now,
    });

    return { coupleId: coupleRef.id };
  });
}

export async function disconnectFromPartner(uid: string): Promise<void> {
  if (pairingMode() === 'functions') {
    try {
      const fn = httpsCallable(getFirebaseFunctions(), 'disconnectPartner');
      await fn({});
      return;
    } catch (error) {
      console.warn('disconnectPartner callable failed, using client pairing', error);
    }
  }

  const db = getDb();
  const meRef = doc(db, 'users', uid);

  await runTransaction(db, async (tx) => {
    const meSnap = await tx.get(meRef);
    if (!meSnap.exists()) throw new Error('Profile not found.');
    const me = meSnap.data();
    if (!me.coupleId || !me.partnerId) throw new Error('You are not connected to a partner.');

    const partnerRef = doc(db, 'users', me.partnerId);
    const coupleRef = doc(db, 'couples', me.coupleId);

    // Firestore requires every read to finish before any write in a transaction.
    const [partnerSnap, coupleSnap] = await Promise.all([
      tx.get(partnerRef),
      tx.get(coupleRef),
    ]);

    const now = Date.now();

    tx.update(meRef, {
      coupleId: null,
      partnerId: null,
      updatedAt: now,
    });

    if (partnerSnap.exists()) {
      const partner = partnerSnap.data();
      if (partner.coupleId === me.coupleId) {
        tx.update(partnerRef, {
          coupleId: null,
          partnerId: null,
          updatedAt: now,
        });
      }
    }

    if (coupleSnap.exists()) {
      tx.update(coupleRef, {
        disconnectedAt: now,
        disconnectedBy: uid,
        memberIds: [],
        updatedAt: now,
      });
    }
  });
}
