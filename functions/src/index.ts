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

function normalizeCode(value: unknown) {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

async function resolveInviteRef(code: string) {
  const byCode = await db.collection('invites').where('code', '==', code).limit(1).get();
  if (!byCode.empty) return byCode.docs[0].ref;
  return db.collection('invites').doc(code);
}

export const createInvite = onCall(async (request) => {
  const uid = requireAuth(request.auth?.uid);
  const userRef = db.collection('users').doc(uid);
  const inviteRef = db.collection('invites').doc(uid);
  const expiresAt = Date.now() + INVITE_TTL_MS;

  const legacySnap = await db
    .collection('invites')
    .where('createdBy', '==', uid)
    .where('status', '==', 'open')
    .get();
  const legacyRefs = legacySnap.docs
    .filter((item) => item.id !== uid)
    .map((item) => item.ref);

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = generateCode();

    try {
      const collisionSnap = await db
        .collection('invites')
        .where('code', '==', code)
        .limit(1)
        .get();
      if (collisionSnap.docs.some((item) => item.id !== uid)) {
        throw new Error('CODE_COLLISION');
      }

      await db.runTransaction(async (tx) => {
        const userSnap = await tx.get(userRef);
        if (!userSnap.exists) throw new HttpsError('failed-precondition', 'Profile not found.');
        if (userSnap.data()?.coupleId) {
          throw new HttpsError('failed-precondition', 'You are already connected to a partner.');
        }

        const existingSnap = await tx.get(inviteRef);
        const legacyDocs = await Promise.all(legacyRefs.map((ref) => tx.get(ref)));
        const now = Date.now();

        legacyDocs.forEach((legacyDoc, index) => {
          if (legacyDoc.exists && legacyDoc.data()?.status === 'open') {
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
          createdAt: existingSnap.exists ? (existingSnap.data()?.createdAt ?? now) : now,
          expiresAt,
          updatedAt: now,
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
  const code = normalizeCode(request.data?.code);

  if (code.length < 4) {
    throw new HttpsError('invalid-argument', 'Enter a valid invite code.');
  }

  const inviteRef = await resolveInviteRef(code);
  const meRef = db.collection('users').doc(uid);

  const coupleId = await db.runTransaction(async (tx) => {
    const [inviteSnap, meSnap] = await Promise.all([tx.get(inviteRef), tx.get(meRef)]);
    if (!inviteSnap.exists) throw new HttpsError('not-found', 'Invite code not found.');

    const invite = inviteSnap.data()!;
    if (normalizeCode(invite.code ?? inviteSnap.id) !== code) {
      throw new HttpsError('not-found', 'Invite code not found.');
    }
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

    const coupleRef = db.collection('couples').doc(`${invite.createdBy}_${uid}`);
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

    if (partnerSnap.exists && partnerSnap.data()?.coupleId === me.coupleId) {
      tx.update(partnerRef, {
        coupleId: null,
        partnerId: null,
        updatedAt: now,
      });
    }

    if (coupleSnap.exists) {
      tx.update(coupleRef, {
        memberIds: [],
        disconnectedAt: now,
        disconnectedBy: uid,
        updatedAt: now,
      });
    }
  });

  return { ok: true };
});
