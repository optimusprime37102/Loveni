import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';

setGlobalOptions({ region: 'us-central1' });
admin.initializeApp();

const db = admin.firestore();
const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateCode(length = 6) {
  let code = '';
  for (let i = 0; i < length; i += 1) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

function requireAuth(uid?: string) {
  if (!uid) throw new HttpsError('unauthenticated', 'Sign in required.');
  return uid;
}

export const createInvite = onCall(async (request) => {
  const uid = requireAuth(request.auth?.uid);
  const userRef = db.collection('users').doc(uid);
  const expiresAt = Date.now() + INVITE_TTL_MS;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = generateCode();
    const inviteRef = db.collection('invites').doc(code);

    try {
      await db.runTransaction(async (tx) => {
        const userSnap = await tx.get(userRef);
        if (!userSnap.exists) throw new HttpsError('failed-precondition', 'Profile not found.');
        if (userSnap.data()?.coupleId) {
          throw new HttpsError('failed-precondition', 'You are already connected to a partner.');
        }

        const inviteSnap = await tx.get(inviteRef);
        if (inviteSnap.exists) throw new Error('CODE_COLLISION');

        tx.set(inviteRef, {
          code,
          createdBy: uid,
          status: 'open',
          claimedBy: null,
          coupleId: null,
          createdAt: Date.now(),
          expiresAt,
        });
      });

      return { code, expiresAt };
    } catch (error: unknown) {
      if ((error as Error).message === 'CODE_COLLISION') continue;
      throw error;
    }
  }

  throw new HttpsError('internal', 'Could not generate a unique invite code.');
});

export const acceptInvite = onCall(async (request) => {
  const uid = requireAuth(request.auth?.uid);
  const code = String(request.data?.code || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

  if (code.length < 4) {
    throw new HttpsError('invalid-argument', 'Enter a valid invite code.');
  }

  const inviteRef = db.collection('invites').doc(code);
  const meRef = db.collection('users').doc(uid);

  const coupleId = await db.runTransaction(async (tx) => {
    const [inviteSnap, meSnap] = await Promise.all([tx.get(inviteRef), tx.get(meRef)]);
    if (!inviteSnap.exists) throw new HttpsError('not-found', 'Invite code not found.');

    const invite = inviteSnap.data()!;
    if (invite.status !== 'open') {
      throw new HttpsError('failed-precondition', 'This invite has already been used.');
    }
    if (invite.expiresAt && invite.expiresAt < Date.now()) {
      throw new HttpsError('failed-precondition', 'This invite has expired.');
    }
    if (invite.createdBy === uid) {
      throw new HttpsError('invalid-argument', 'You cannot accept your own invite.');
    }
    if (!meSnap.exists) throw new HttpsError('failed-precondition', 'Profile not found.');
    if (meSnap.data()?.coupleId) {
      throw new HttpsError('failed-precondition', 'You are already connected to a partner.');
    }

    const partnerRef = db.collection('users').doc(invite.createdBy);
    const partnerSnap = await tx.get(partnerRef);
    if (!partnerSnap.exists) {
      throw new HttpsError('failed-precondition', 'Partner profile not found.');
    }
    if (partnerSnap.data()?.coupleId) {
      throw new HttpsError('failed-precondition', 'That person is already connected to someone.');
    }

    const coupleRef = db.collection('couples').doc();
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

    return coupleRef.id;
  });

  return { coupleId };
});

export const disconnectPartner = onCall(async (request) => {
  const uid = requireAuth(request.auth?.uid);
  const meRef = db.collection('users').doc(uid);

  await db.runTransaction(async (tx) => {
    const meSnap = await tx.get(meRef);
    if (!meSnap.exists) throw new HttpsError('failed-precondition', 'Profile not found.');

    const me = meSnap.data()!;
    if (!me.coupleId || !me.partnerId) {
      throw new HttpsError('failed-precondition', 'You are not connected to a partner.');
    }

    const partnerRef = db.collection('users').doc(me.partnerId);
    const coupleRef = db.collection('couples').doc(me.coupleId);
    const partnerSnap = await tx.get(partnerRef);
    const now = Date.now();

    tx.update(meRef, {
      coupleId: null,
      partnerId: null,
      updatedAt: now,
    });

    if (partnerSnap.exists && partnerSnap.data()?.coupleId === me.coupleId) {
      tx.update(partnerRef, {
        coupleId: null,
        partnerId: null,
        updatedAt: now,
      });
    }

    tx.update(coupleRef, {
      memberIds: [],
      disconnectedAt: now,
      disconnectedBy: uid,
      updatedAt: now,
    });
  });

  return { ok: true };
});
