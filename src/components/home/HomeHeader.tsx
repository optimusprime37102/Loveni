import { Pressable, StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { LoveniHorizontalLogo } from '@/src/components/illustrations/LoveniHorizontalLogo';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { palette } from '@/src/theme/colors';
import { radii, spacing } from '@/src/theme/spacing';

interface Props {
  onPressNotifications?: () => void;
  hasNotifications?: boolean;
}

export function HomeHeader({ onPressNotifications, hasNotifications = false }: Props) {
  const { colors } = useTheme();
  const haptics = useHaptics();

  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <LoveniHorizontalLogo width={136} height={36} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        hitSlop={8}
        onPress={() => {
          haptics.selection();
          onPressNotifications?.();
        }}
        style={({ pressed }) => [
          styles.bell,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <SymbolView
          name={{ ios: 'bell', android: 'notifications', web: 'notifications' }}
          size={18}
          tintColor={colors.textHeading}
          weight="medium"
          fallback={<Text style={[styles.bellFallback, { color: colors.textHeading }]}>🔔</Text>}
        />
        {hasNotifications ? <View style={styles.dot} /> : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bell: {
    width: 42,
    height: 42,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellFallback: {
    fontSize: 16,
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.danger,
    borderWidth: 1.5,
    borderColor: palette.white,
  },
});
