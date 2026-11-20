import { MoodEmoji } from '@/src/types/models';

export interface MoodOption {
  emoji: MoodEmoji;
  label: string;
  description: string;
  /** Soft pastel tile background */
  tileBg: string;
  /** Accent bar / badge wash */
  accent: string;
  badgeBg: string;
}

export const MOODS: MoodOption[] = [
  {
    emoji: '🥰',
    label: 'Loved',
    description: 'Feeling cherished',
    tileBg: '#FFE0E8',
    accent: '#F25F82',
    badgeBg: '#FFE4EC',
  },
  {
    emoji: '😊',
    label: 'Happy',
    description: 'Bright and light',
    tileBg: '#FFF3C9',
    accent: '#E2B93D',
    badgeBg: '#FFF6D6',
  },
  {
    emoji: '😴',
    label: 'Tired',
    description: 'Running on soft energy',
    tileBg: '#E8DFF8',
    accent: '#9B7EDE',
    badgeBg: '#EFE8FB',
  },
  {
    emoji: '🥺',
    label: 'Soft',
    description: 'A little tender today',
    tileBg: '#DDE8FF',
    accent: '#6F8FE0',
    badgeBg: '#E8EFFE',
  },
  {
    emoji: '😍',
    label: 'Smitten',
    description: 'Thinking of you',
    tileBg: '#FFD9C8',
    accent: '#F08A5D',
    badgeBg: '#FFE6DA',
  },
  {
    emoji: '😔',
    label: 'Low',
    description: 'Could use a hug',
    tileBg: '#E8E6C8',
    accent: '#A3A06A',
    badgeBg: '#F0EFD8',
  },
];

export function getMood(emoji: MoodEmoji | null | undefined): MoodOption | null {
  if (!emoji) return null;
  return MOODS.find((m) => m.emoji === emoji) ?? null;
}
