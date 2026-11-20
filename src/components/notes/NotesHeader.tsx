import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { HeartOutlineIcon } from '@/src/components/illustrations/OutlineIcons';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { fonts } from '@/src/theme/typography';
import { radii, spacing } from '@/src/theme/spacing';

interface Props {
  showWrite?: boolean;
  onWrite?: () => void;
}

export function NotesHeader({ showWrite = false, onWrite }: Props) {
  const { colors, theme } = useTheme();
  const haptics = useHaptics();

  return (
    <View style={styles.header}>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text color={colors.textHeading} style={styles.title} numberOfLines={1}>
            Love Notes
          </Text>
          <HeartOutlineIcon size={22} color={colors.primary} />
        </View>
        <Text color={colors.textSecondary} style={styles.subtitle}>
          Private words between you two.
        </Text>
      </View>

      {showWrite && onWrite ? (
        <Pressable
          onPress={() => {
            haptics.selection();
            onWrite();
          }}
          accessibilityRole="button"
          accessibilityLabel="Write a love note"
          style={({ pressed }) => [
            styles.writeShadow,
            theme.shadows.glow,
            { opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <LinearGradient
            colors={colors.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.writeBtn}
          >
            <SymbolView
              name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
              size={14}
              tintColor="#FFFFFF"
              weight="semibold"
              fallback={<Text style={styles.writeFallback}>✎</Text>}
            />
            <Text color="#FFFFFF" style={styles.writeLabel}>
              Write
            </Text>
          </LinearGradient>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  writeShadow: {
    borderRadius: radii.pill,
  },
  writeBtn: {
    minHeight: 42,
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  writeLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
  },
  writeFallback: {
    color: '#FFFFFF',
    fontSize: 13,
  },
});
