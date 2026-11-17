export const LoveniTheme = {
  colors: {
    primary: '#F25F82',
    primaryDark: '#DD3C6A',
    brand: '#CE2457',

    background: '#FDEEF1',
    surface: '#FEF3F5',
    surfaceLight: '#FFF8FA',

    heroPink: '#FEC9DB',
    lightPink: '#FFE2EA',
    border: '#F5D5DF',

    textPrimary: '#650C34',
    textSecondary: '#8D536A',
    textMuted: '#A77989',

    white: '#FFFFFF',
    tabActive: '#FDE0EA',
    iconActive: '#CE2457',
    iconInactive: '#775364',

    success: '#5E9B78',
    error: '#C74762',
  },

  gradients: {
    primary: ['#F25F82', '#DD3C6A'] as const,
    hero: ['#FEC9DB', '#FFF0F4'] as const,
    softCard: ['#FFF8FA', '#FDE7ED'] as const,
    background: ['#FFF2F5', '#FDEEF1'] as const,
  },

  radius: {
    small: 12,
    medium: 16,
    card: 20,
    hero: 24,
    pill: 999,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },

  typography: {
    fontFamily: 'Poppins',
    greeting: 26,
    sectionTitle: 18,
    cardTitle: 16,
    body: 14,
    caption: 12,
  },
} as const;

/** @deprecated Prefer LoveniTheme.colors — kept for gradual migration */
export const palette = {
  rose: LoveniTheme.colors.primary,
  berry: LoveniTheme.colors.textPrimary,
  coral: LoveniTheme.colors.primaryDark,
  blushWhite: LoveniTheme.colors.background,
  lavenderMist: LoveniTheme.colors.lightPink,
  plum: LoveniTheme.colors.textPrimary,
  white: LoveniTheme.colors.white,
  mauve: LoveniTheme.colors.textSecondary,
  softBlush: LoveniTheme.colors.lightPink,
  softRose: LoveniTheme.colors.heroPink,
  lavender: LoveniTheme.colors.lightPink,
  peach: LoveniTheme.colors.primary,
  offWhite: LoveniTheme.colors.surfaceLight,
  deepRose: LoveniTheme.colors.brand,
  mist: LoveniTheme.colors.lightPink,
  blush: LoveniTheme.colors.lightPink,
  success: LoveniTheme.colors.success,
  danger: LoveniTheme.colors.error,
  warning: '#E8A54B',
  overlay: 'rgba(101, 12, 52, 0.45)',
} as const;

export const lightColors = {
  primary: LoveniTheme.colors.primary,
  primaryDark: LoveniTheme.colors.primaryDark,
  brand: LoveniTheme.colors.brand,
  secondary: LoveniTheme.colors.lightPink,
  accent: LoveniTheme.colors.primaryDark,
  background: LoveniTheme.colors.background,
  surface: LoveniTheme.colors.surfaceLight,
  surfaceMuted: LoveniTheme.colors.lightPink,
  surfaceLavender: LoveniTheme.colors.surface,
  surfaceCard: LoveniTheme.colors.surface,
  heroPink: LoveniTheme.colors.heroPink,
  lightPink: LoveniTheme.colors.lightPink,
  text: LoveniTheme.colors.textPrimary,
  textSecondary: LoveniTheme.colors.textSecondary,
  textMuted: LoveniTheme.colors.textMuted,
  textHeading: LoveniTheme.colors.textPrimary,
  textInverse: LoveniTheme.colors.white,
  border: LoveniTheme.colors.border,
  borderStrong: LoveniTheme.colors.border,
  success: LoveniTheme.colors.success,
  danger: LoveniTheme.colors.error,
  warning: '#E8A54B',
  overlay: palette.overlay,
  gradientPrimary: LoveniTheme.gradients.primary,
  gradientSoft: LoveniTheme.gradients.softCard,
  gradientHero: [...LoveniTheme.gradients.background, LoveniTheme.colors.background] as const,
  gradientCard: LoveniTheme.gradients.softCard,
  tabActive: LoveniTheme.colors.tabActive,
  tabInactive: LoveniTheme.colors.iconInactive,
  iconActive: LoveniTheme.colors.iconActive,
  iconInactive: LoveniTheme.colors.iconInactive,
  skeleton: '#F3DCE3',
  shadow: 'rgba(206, 36, 87, 0.12)',
};

export const darkColors = {
  primary: '#FF7AA8',
  primaryDark: '#FF5E95',
  brand: '#FF8DB0',
  secondary: '#3A2430',
  accent: '#FFA8B5',
  background: '#1A1220',
  surface: '#261824',
  surfaceMuted: '#332033',
  surfaceLavender: '#2A2238',
  surfaceCard: '#2E1C28',
  heroPink: '#5A2A3C',
  lightPink: '#3A2430',
  text: '#FBF5F8',
  textSecondary: '#B5A8B8',
  textMuted: '#9A8896',
  textHeading: '#FFD0DE',
  textInverse: '#1A1220',
  border: 'rgba(255, 158, 192, 0.18)',
  borderStrong: 'rgba(255, 122, 168, 0.28)',
  success: '#6FCF97',
  danger: '#FF6B6B',
  warning: '#F0B45A',
  overlay: 'rgba(0, 0, 0, 0.55)',
  gradientPrimary: ['#FF7AA8', '#FFA8B5'] as const,
  gradientSoft: ['#332033', '#2A2238'] as const,
  gradientHero: ['#241824', '#1F1830', '#1A1220'] as const,
  gradientCard: ['#2E1C28', '#261824'] as const,
  tabActive: 'rgba(255, 122, 168, 0.18)',
  tabInactive: '#8E8294',
  iconActive: '#FF8DB0',
  iconInactive: '#8E8294',
  skeleton: '#332033',
  shadow: 'rgba(0, 0, 0, 0.4)',
};

export type AppColors = {
  primary: string;
  primaryDark: string;
  brand: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  surfaceLavender: string;
  surfaceCard: string;
  heroPink: string;
  lightPink: string;
  text: string;
  textSecondary: string;
  textMuted: string;
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
  gradientCard: readonly [string, string];
  tabActive: string;
  tabInactive: string;
  iconActive: string;
  iconInactive: string;
  skeleton: string;
  shadow: string;
};
