import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { User } from 'firebase/auth';
import { isFirebaseConfigured } from '@/src/lib/firebase';
import { logOut, signIn, signUp, subscribeAuth } from '@/src/services/authService';
import { subscribeUserProfile } from '@/src/services/userService';
import { UserProfile } from '@/src/types/models';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  configured: boolean;
  signIn: typeof signIn;
  signUp: typeof signUp;
  logOut: typeof logOut;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isFirebaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    const unsub = subscribeAuth((nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setLoading(false);
      }
    });

    return unsub;
  }, [configured]);

  useEffect(() => {
    if (!configured || !user) return;

    setLoading(true);
    const unsub = subscribeUserProfile(
      user.uid,
      (nextProfile) => {
        setProfile(nextProfile);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return unsub;
  }, [configured, user]);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      configured,
      signIn,
      signUp,
      logOut,
    }),
    [user, profile, loading, configured]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
