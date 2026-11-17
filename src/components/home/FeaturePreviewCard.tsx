import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { fonts } from '@/src/theme/typography';
import { radii, spacing } from '@/src/theme/spacing';

interface Props {
  title: string;
  description: string;
  leadingIcon: ReactNode;
  illustration: ReactNode;
  onPress: () => void;
}

export function FeaturePreviewCard({
  title,
  description,
  leadingIcon,
  illustration,
  onPress,
}: Props) {
  const { colors, theme } = useTheme();
  const haptics = useHaptics();

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      style={({ pressed }) => [
        styles.card,
        theme.shadows.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.94 : 1,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconSlot}>{leadingIcon}</View>

        <View style={styles.copy}>
          <Text color={colors.textHeading} numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          <Text color={colors.textSecondary} numberOfLines={1} style={styles.description}>
            {description}
          </Text>
        </View>
      </View>

      <View style={styles.art}>{illustration}</View>
    </Pressable>
  );
}

const CARD_HEIGHT = 96;

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    borderRadius: radii.card,
    borderWidth: 1,
    paddingLeft: spacing.sm,
    paddingRight: 4,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
    paddingRight: spacing.xs,
  },
  iconSlot: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: 3,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
  },
  art: {
    width: 104,
    height: CARD_HEIGHT,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: -2,
  },
});
