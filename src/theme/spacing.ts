import { LoveniTheme } from './colors';

export const spacing = {
  xxs: LoveniTheme.spacing.xs,
  xs: LoveniTheme.spacing.sm,
  sm: LoveniTheme.spacing.md,
  md: LoveniTheme.spacing.lg,
  lg: LoveniTheme.spacing.xl,
  xl: LoveniTheme.spacing.xxl,
  xxl: 32,
  xxxl: 40,
  huge: 56,
} as const;

export const radii = {
  sm: LoveniTheme.radius.small,
  md: LoveniTheme.radius.medium,
  lg: LoveniTheme.radius.card,
  xl: LoveniTheme.radius.hero,
  xxl: 28,
  card: LoveniTheme.radius.card,
  hero: LoveniTheme.radius.hero,
  pill: LoveniTheme.radius.pill,
} as const;
