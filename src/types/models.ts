export type MoodEmoji = '🥰' | '😊' | '😔' | '😴' | '🥺' | '😍';

export type AvatarId =
  | 'rose'
  | 'lavender'
  | 'peach'
  | 'blossom'
  | 'moon'
  | 'spark'
  | 'heart'
  | 'star';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  avatarId: AvatarId;
  coupleId: string | null;
  partnerId: string | null;
  currentMood: MoodEmoji | null;
  moodMessage: string | null;
  moodUpdatedAt: number | null;
  onboardingComplete: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CoupleProfile {
  id: string;
  memberIds: [string, string];
  startDate: string | null;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

export type InviteStatus = 'open' | 'claimed' | 'revoked';

export interface InviteCode {
  code: string;
  createdBy: string;
  status: InviteStatus;
  claimedBy: string | null;
  coupleId: string | null;
  createdAt: number;
  expiresAt: number;
}

export interface LoveNote {
  id: string;
  coupleId: string;
  fromUid: string;
  toUid: string;
  text: string;
  createdAt: number;
  deleted: boolean;
}

export interface MoodEntry {
  id: string;
  coupleId: string;
  uid: string;
  mood: MoodEmoji;
  message: string | null;
  createdAt: number;
}

export interface AuthFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  general?: string;
}
