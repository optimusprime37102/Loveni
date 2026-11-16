import { AvatarId } from '@/src/types/models';
import { palette } from '@/src/theme/colors';

export interface AvatarOption {
  id: AvatarId;
  emoji: string;
  label: string;
  gradient: [string, string];
}

export const AVATARS: AvatarOption[] = [
  { id: 'rose', emoji: '🌹', label: 'Rose', gradient: [palette.rose, palette.softRose] },
  { id: 'lavender', emoji: '💜', label: 'Lavender', gradient: [palette.lavenderMist, '#C4B5FD'] },
  { id: 'peach', emoji: '🍑', label: 'Peach', gradient: [palette.peach, '#FFD0C4'] },
  { id: 'blossom', emoji: '🌸', label: 'Blossom', gradient: ['#F9A8D4', palette.rose] },
  { id: 'moon', emoji: '🌙', label: 'Moon', gradient: ['#A78BFA', '#7C6AE8'] },
  { id: 'spark', emoji: '✨', label: 'Spark', gradient: ['#FDE68A', palette.peach] },
  { id: 'heart', emoji: '💗', label: 'Heart', gradient: [palette.deepRose, palette.rose] },
  { id: 'star', emoji: '⭐', label: 'Star', gradient: ['#FBBF24', palette.peach] },
];

export function getAvatar(id: AvatarId | null | undefined): AvatarOption {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}
