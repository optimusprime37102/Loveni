import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { radii } from '@/src/theme/spacing';

interface Props {
  fallbackHref?: '/(onboarding)/welcome' | '/';
  style?: ViewStyle;
}

export function BackButton({ fallbackHref = '/(onboarding)/welcome', style }: Props) {
  const { colors } = useTheme();
  const haptics = useHaptics();

  const onPress = () => {
    haptics.light();
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(fallbackHref);
  };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <SymbolView
        name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
        size={18}
        tintColor={colors.text}
        weight="semibold"
        fallback={<Text style={[styles.fallback, { color: colors.text }]}>‹</Text>}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    fontSize: 28,
    lineHeight: 30,
    marginTop: -2,
    fontWeight: '500',
  },
});
