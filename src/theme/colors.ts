export const palette = {
  rose: '#F45B89',
  lavender: '#A78BFA',
  peach: '#FFB6A3',
  offWhite: '#FFF9FB',
  white: '#FFFFFF',
  plum: '#302438',
  mauve: '#948597',
  blush: '#FFE4EC',
  mist: '#F3EEF8',
  softRose: '#F7A8C1',
  deepRose: '#D63E6F',
  success: '#5BB98B',
  danger: '#E45757',
  warning: '#E8A54B',
  overlay: 'rgba(48, 36, 56, 0.45)',
} as const;

export const lightColors = {
  primary: palette.rose,
  secondary: palette.lavender,
  accent: palette.peach,
  background: palette.offWhite,
  surface: palette.white,
  surfaceMuted: palette.blush,
  surfaceLavender: palette.mist,
  text: palette.plum,
  textSecondary: palette.mauve,
  textInverse: palette.white,
  border: 'rgba(48, 36, 56, 0.08)',
  borderStrong: 'rgba(244, 91, 137, 0.22)',
  success: palette.success,
  danger: palette.danger,
  warning: palette.warning,
  overlay: palette.overlay,
  gradientPrimary: [palette.rose, palette.lavender] as const,
  gradientSoft: [palette.blush, palette.mist] as const,
  gradientHero: ['#FFF0F5', '#F8F0FF', '#FFF9FB'] as const,
  tabInactive: palette.mauve,
  skeleton: '#F0E6EB',
  shadow: 'rgba(48, 36, 56, 0.12)',
};

export const darkColors = {
  primary: '#FF7AA8',
  secondary: '#C4B0FF',
  accent: '#FFC4B5',
  background: '#1A1420',
  surface: '#261C2C',
  surfaceMuted: '#332433',
  surfaceLavender: '#2C2438',
  text: '#FBF5F8',
  textSecondary: '#B5A8B8',
  textInverse: '#1A1420',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 122, 168, 0.28)',
  success: '#6FCF97',
  danger: '#FF6B6B',
  warning: '#F0B45A',
  overlay: 'rgba(0, 0, 0, 0.55)',
  gradientPrimary: ['#FF7AA8', '#C4B0FF'] as const,
  gradientSoft: ['#332433', '#2C2438'] as const,
  gradientHero: ['#241824', '#1F1830', '#1A1420'] as const,
  tabInactive: '#8E8294',
  skeleton: '#332433',
  shadow: 'rgba(0, 0, 0, 0.4)',
};

export type AppColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  surfaceLavender: string;
  text: string;
  textSecondary: string;
  textInverse: string;
  border: string;
  borderStrong: string;
  success: string;
  danger: string;
  warning: string;
  overlay: string;
  gradientPrimary: readonly [string, string];
  gradientSoft: readonly [string, string];
  gradientHero: readonly [string, string, string];
  tabInactive: string;
  skeleton: string;
  shadow: string;
};
