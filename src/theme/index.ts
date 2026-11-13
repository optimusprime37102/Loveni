import { darkColors, lightColors, palette } from './colors';
import { radii, spacing } from './spacing';
import { cardShadow, glowShadow, softShadow } from './shadows';
import { fonts, typography } from './typography';

export const theme = {
  light: {
    colors: lightColors,
    spacing,
    radii,
    typography,
    fonts,
    shadows: { soft: softShadow, card: cardShadow, glow: glowShadow },
    palette,
  },
  dark: {
    colors: darkColors,
    spacing,
    radii,
    typography,
    fonts,
    shadows: { soft: softShadow, card: cardShadow, glow: glowShadow },
    palette,
  },
} as const;

export type AppTheme = (typeof theme)['light'] | (typeof theme)['dark'];

export * from './colors';
export * from './spacing';
export * from './shadows';
export * from './typography';
