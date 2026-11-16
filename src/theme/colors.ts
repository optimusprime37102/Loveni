export const palette = {
  rose: '#F45B8C',
  berry: '#82163F',
  coral: '#FF8D9D',
  blushWhite: '#FFF7F9',
  lavenderMist: '#EDE5FF',
  plum: '#382331',
  white: '#FFFFFF',
  mauve: '#9A7A88',
  softBlush: '#FFE8EF',
  softRose: '#FFB0C4',
  lavender: '#EDE5FF',
  peach: '#FF8D9D',
  offWhite: '#FFF7F9',
  deepRose: '#82163F',
  mist: '#EDE5FF',
  blush: '#FFE8EF',
  success: '#5BB98B',
  danger: '#E45757',
  warning: '#E8A54B',
  overlay: 'rgba(56, 35, 49, 0.45)',
} as const;

export const lightColors = {
  primary: palette.rose,
  secondary: palette.lavenderMist,
  accent: palette.coral,
  background: palette.blushWhite,
  surface: palette.white,
  surfaceMuted: palette.softBlush,
  surfaceLavender: palette.lavenderMist,
  text: palette.plum,
  textSecondary: palette.mauve,
  textHeading: palette.berry,
  textInverse: palette.white,
  border: 'rgba(56, 35, 49, 0.08)',
  borderStrong: 'rgba(244, 91, 140, 0.22)',
  success: palette.success,
  danger: palette.danger,
  warning: palette.warning,
  overlay: palette.overlay,
  gradientPrimary: [palette.rose, palette.coral] as const,
  gradientSoft: [palette.softBlush, palette.lavenderMist] as const,
  gradientHero: ['#FFF9FB', '#FFEAF1', palette.blushWhite] as const,
  tabInactive: palette.mauve,
  skeleton: '#F3E6EB',
  shadow: 'rgba(56, 35, 49, 0.10)',
};

export const darkColors = {
  primary: '#FF7AA8',
  secondary: '#C9B8FF',
  accent: '#FFA8B5',
  background: '#1A1220',
  surface: '#261824',
  surfaceMuted: '#332033',
  surfaceLavender: '#2A2238',
  text: '#FBF5F8',
  textSecondary: '#B5A8B8',
  textHeading: '#FFD0DE',
  textInverse: '#1A1220',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 122, 168, 0.28)',
  success: '#6FCF97',
  danger: '#FF6B6B',
  warning: '#F0B45A',
  overlay: 'rgba(0, 0, 0, 0.55)',
  gradientPrimary: ['#FF7AA8', '#FFA8B5'] as const,
  gradientSoft: ['#332033', '#2A2238'] as const,
  gradientHero: ['#241824', '#1F1830', '#1A1220'] as const,
  tabInactive: '#8E8294',
  skeleton: '#332033',
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
  textHeading: string;
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
