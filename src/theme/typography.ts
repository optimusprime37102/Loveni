import { TextStyle } from 'react-native';

export const fonts = {
  display: 'CormorantGaramond_600SemiBold',
  displayBold: 'CormorantGaramond_700Bold',
  displayMedium: 'CormorantGaramond_500Medium',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
} as const;

export const typography = {
  hero: {
    fontFamily: fonts.displayBold,
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -0.5,
  } satisfies TextStyle,
  display: {
    fontFamily: fonts.displayBold,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.3,
  } satisfies TextStyle,
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 34,
  } satisfies TextStyle,
  heading: {
    fontFamily: fonts.bodyBold,
    fontSize: 20,
    lineHeight: 26,
  } satisfies TextStyle,
  subtitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 17,
    lineHeight: 24,
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
    letterSpacing: 0.2,
  } satisfies TextStyle,
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  } satisfies TextStyle,
  counter: {
    fontFamily: fonts.displayBold,
    fontSize: 64,
    lineHeight: 68,
    letterSpacing: -1,
  } satisfies TextStyle,
} as const;
