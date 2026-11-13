import { MoodEmoji } from '@/src/types/models';

export interface MoodOption {
  emoji: MoodEmoji;
  label: string;
  description: string;
}

export const MOODS: MoodOption[] = [
  { emoji: '🥰', label: 'Loved', description: 'Feeling cherished' },
  { emoji: '😊', label: 'Happy', description: 'Bright and light' },
  { emoji: '😔', label: 'Low', description: 'Could use a hug' },
  { emoji: '😴', label: 'Tired', description: 'Running on soft energy' },
  { emoji: '🥺', label: 'Soft', description: 'A little tender today' },
  { emoji: '😍', label: 'Smitten', description: 'Thinking of you' },
];

export function getMood(emoji: MoodEmoji | null | undefined): MoodOption | null {
  if (!emoji) return null;
  return MOODS.find((m) => m.emoji === emoji) ?? null;
}
