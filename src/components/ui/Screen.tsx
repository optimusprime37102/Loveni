import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/contexts/ThemeContext';
import { spacing } from '@/src/theme/spacing';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
}

export function Screen({
  children,
  scroll,
  padded = true,
  style,
  edges = ['top', 'left', 'right'],
}: Props) {
  const { colors } = useTheme();

  const content = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        padded && styles.padded,
        styles.scrollContent,
        style,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[padded && styles.padded, styles.fill, style]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: colors.background }]} edges={edges}>
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
