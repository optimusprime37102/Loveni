import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { subscribeCouple } from '@/src/services/coupleService';
import { subscribeUserProfile } from '@/src/services/userService';
import { CoupleProfile, UserProfile } from '@/src/types/models';

interface CoupleContextValue {
  couple: CoupleProfile | null;
  partner: UserProfile | null;
  loading: boolean;
  isConnected: boolean;
}

const CoupleContext = createContext<CoupleContextValue | null>(null);

export function CoupleProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const [couple, setCouple] = useState<CoupleProfile | null>(null);
  const [partner, setPartner] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile?.coupleId) {
      setCouple(null);
      setPartner(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = subscribeCouple(
      profile.coupleId,
      (next) => {
        setCouple(next);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return unsub;
  }, [profile?.coupleId]);

  useEffect(() => {
    if (!profile?.partnerId) {
      setPartner(null);
      return;
    }

    const unsub = subscribeUserProfile(profile.partnerId, setPartner);
    return unsub;
  }, [profile?.partnerId]);

  const value = useMemo(
    () => ({
      couple,
      partner,
      loading,
      isConnected: Boolean(profile?.coupleId && profile?.partnerId),
    }),
    [couple, partner, loading, profile?.coupleId, profile?.partnerId]
  );

  return <CoupleContext.Provider value={value}>{children}</CoupleContext.Provider>;
}

export function useCouple() {
  const ctx = useContext(CoupleContext);
  if (!ctx) throw new Error('useCouple must be used within CoupleProvider');
  return ctx;
}
