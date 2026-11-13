import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/src/lib/firebase';
import { createUserProfile, getUserProfile } from '@/src/services/userService';
import { getAuthErrorMessage, validateEmail, validatePassword } from '@/src/utils/validation';

export function subscribeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export async function signUp(email: string, password: string, displayName?: string) {
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (emailError || passwordError) {
    throw new Error(emailError || passwordError);
  }

  try {
    const credential = await createUserWithEmailAndPassword(
      getFirebaseAuth(),
      email.trim(),
      password
    );

    if (displayName?.trim()) {
      await updateProfile(credential.user, { displayName: displayName.trim() });
    }

    const existing = await getUserProfile(credential.user.uid);
    if (!existing) {
      await createUserProfile({
        uid: credential.user.uid,
        email: email.trim(),
        displayName,
      });
    }

    return credential.user;
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code || '';
    throw new Error(getAuthErrorMessage(code));
  }
}

export async function signIn(email: string, password: string) {
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (emailError || passwordError) {
    throw new Error(emailError || passwordError);
  }

  try {
    const credential = await signInWithEmailAndPassword(
      getFirebaseAuth(),
      email.trim(),
      password
    );
    return credential.user;
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code || '';
    throw new Error(getAuthErrorMessage(code));
  }
}

export async function logOut() {
  await signOut(getFirebaseAuth());
}
