import { TextStyle } from 'react-native';

export const fonts = {
  display: 'PlusJakartaSans_700Bold',
  displayBold: 'PlusJakartaSans_800ExtraBold',
  displayMedium: 'PlusJakartaSans_600SemiBold',
  body: 'PlusJakartaSans_400Regular',
  bodyMedium: 'PlusJakartaSans_500Medium',
  bodyBold: 'PlusJakartaSans_700Bold',
} as const;

export const typography = {
  hero: {
    fontFamily: fonts.displayBold,
    fontSize: 42,
    lineHeight: 48,
    letterSpacing: -0.8,
  } satisfies TextStyle,
  display: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.4,
  } satisfies TextStyle,
  title: {
    fontFamily: fonts.displayMedium,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.3,
  } satisfies TextStyle,
  heading: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
  } satisfies TextStyle,
  subtitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 22,
  } satisfies TextStyle,
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
  } satisfies TextStyle,
  bodySmall: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  } satisfies TextStyle,
  caption: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.15,
  } satisfies TextStyle,
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  } satisfies TextStyle,
  counter: {
    fontFamily: fonts.displayBold,
    fontSize: 56,
    lineHeight: 62,
    letterSpacing: -1.2,
  } satisfies TextStyle,
} as const;
