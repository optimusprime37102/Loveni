import { SymbolView } from 'expo-symbols';
import { useRef, useState, type ElementRef } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';
import { Avatar } from '@/src/components/ui/Avatar';
import { Text } from '@/src/components/ui/Text';
import { getMood } from '@/src/constants/moods';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { AvatarId, MoodEmoji } from '@/src/types/models';
import { fonts } from '@/src/theme/typography';
import { formatMoodClock } from '@/src/utils/dates';

const MENU_WIDTH = 168;
const MENU_EST_HEIGHT = 108;
const SCREEN_PAD = 12;

interface Props {
  mood: MoodEmoji;
  message: string | null;
  createdAt: number;
  senderLabel: string;
  avatarId?: AvatarId | null;
  canManage?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

interface MenuAnchor {
  top: number;
  left: number;
}

export function MoodHistoryEntryCard({
  mood,
  message,
  createdAt,
  senderLabel,
  avatarId,
  canManage = false,
  onEdit,
  onDelete,
}: Props) {
  const { colors, theme, isDark } = useTheme();
  const haptics = useHaptics();
  const moreRef = useRef<ElementRef<typeof Pressable>>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor | null>(null);

  const option = getMood(mood);
  const accent = option?.accent ?? colors.primary;
  const badgeBg = isDark ? 'rgba(255, 122, 168, 0.14)' : (option?.badgeBg ?? '#EFE8FB');
  const cardBg = isDark ? colors.surfaceCard : '#FFF7FA';
  const menuBg = isDark ? colors.surfaceCard : '#FFFFFF';

  const openMenu = () => {
    haptics.selection();
    moreRef.current?.measureInWindow((x, y, width, height) => {
      const { width: screenW, height: screenH } = Dimensions.get('window');
      const belowTop = y + height + 6;
      const aboveTop = y - MENU_EST_HEIGHT - 6;
      const fitsBelow = belowTop + MENU_EST_HEIGHT <= screenH - SCREEN_PAD;
      const top = fitsBelow ? belowTop : Math.max(SCREEN_PAD, aboveTop);
      const left = Math.min(
        Math.max(SCREEN_PAD, x + width - MENU_WIDTH),
        screenW - MENU_WIDTH - SCREEN_PAD
      );
      setMenuAnchor({ top, left });
      setMenuOpen(true);
    });
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setMenuAnchor(null);
  };

  return (
    <View style={[styles.shadow, { backgroundColor: cardBg }, theme.shadows.card]}>
      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <View style={styles.accentRail}>
          <View style={[styles.accent, { backgroundColor: accent }]} />
        </View>

        <View style={styles.avatarWrap}>
          <Avatar avatarId={avatarId} size={42} ring />
        </View>

        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text color={colors.textHeading} style={styles.name} numberOfLines={1}>
              {senderLabel}
            </Text>

            <View style={[styles.badge, { backgroundColor: badgeBg }]}>
              <Text style={styles.badgeEmoji}>{mood}</Text>
              <Text color={colors.textHeading} style={styles.badgeLabel}>
                {option?.label ?? 'Mood'}
              </Text>
            </View>

            <View style={styles.topSpacer} />

            <Text color={colors.textMuted} style={styles.time}>
              {formatMoodClock(createdAt)}
            </Text>

            {canManage ? (
              <Pressable
                ref={moreRef}
                onPress={openMenu}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Mood options"
                style={({ pressed }) => [styles.moreBtn, { opacity: pressed ? 0.55 : 1 }]}
              >
                <SymbolView
                  name={{ ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' }}
                  size={16}
                  tintColor={colors.textHeading}
                  weight="bold"
                  fallback={
                    <Text color={colors.textHeading} style={styles.moreFallback}>
                      ···
                    </Text>
                  }
                />
              </Pressable>
            ) : (
              <View style={styles.moreBtn} />
            )}
          </View>

          {message ? (
            <View style={styles.noteRow}>
              <SymbolView
                name={{ ios: 'doc.text', android: 'description', web: 'description' }}
                size={13}
                tintColor={colors.textMuted}
                weight="medium"
                fallback={<Text color={colors.textMuted}>📝</Text>}
              />
              <Text color={colors.textSecondary} style={styles.note} numberOfLines={2}>
                {message}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={closeMenu}>
        <Pressable style={styles.backdrop} onPress={closeMenu}>
          {menuAnchor ? (
            <Pressable
              onPress={() => {}}
              style={[
                styles.menu,
                theme.shadows.soft,
                {
                  top: menuAnchor.top,
                  left: menuAnchor.left,
                  backgroundColor: menuBg,
                  borderColor: isDark ? colors.border : 'rgba(245, 213, 223, 0.95)',
                },
              ]}
            >
              <Pressable
                onPress={() => {
                  closeMenu();
                  onEdit?.();
                }}
                style={({ pressed }) => [
                  styles.menuItem,
                  { backgroundColor: pressed ? 'rgba(101, 12, 52, 0.06)' : 'transparent' },
                ]}
              >
                <SymbolView
                  name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                  size={16}
                  tintColor={colors.textHeading}
                  weight="medium"
                  fallback={<Text color={colors.textHeading}>✎</Text>}
                />
                <Text color={colors.textHeading} style={styles.menuLabel}>
                  Edit
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  closeMenu();
                  onDelete?.();
                }}
                style={({ pressed }) => [
                  styles.menuItem,
                  { backgroundColor: pressed ? 'rgba(242, 95, 130, 0.08)' : 'transparent' },
                ]}
              >
                <SymbolView
                  name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                  size={16}
                  tintColor={colors.danger}
                  weight="medium"
                  fallback={<Text color={colors.danger}>⌫</Text>}
                />
                <Text color={colors.danger} style={styles.menuLabel}>
                  Delete
                </Text>
              </Pressable>
            </Pressable>
          ) : null}
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 24,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 72,
    paddingRight: 10,
  },
  accentRail: {
    width: 18,
    alignSelf: 'stretch',
    paddingLeft: 10,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: 'center',
  },
  accent: {
    width: 4,
    flex: 1,
    borderRadius: 999,
  },
  avatarWrap: {
    marginLeft: 2,
    marginRight: 10,
  },
  content: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 8,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 24,
  },
  name: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.2,
    flexShrink: 0,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    flexShrink: 1,
  },
  badgeEmoji: {
    fontSize: 12,
    lineHeight: 16,
  },
  badgeLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
  },
  topSpacer: {
    flex: 1,
    minWidth: 6,
  },
  time: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    flexShrink: 0,
  },
  moreBtn: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  moreFallback: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    lineHeight: 15,
    letterSpacing: 1,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingRight: 28,
  },
  note: {
    flex: 1,
    fontFamily: fonts.script,
    fontSize: 16,
    lineHeight: 20,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(101, 12, 52, 0.18)',
  },
  menu: {
    position: 'absolute',
    width: MENU_WIDTH,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 6,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  menuLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18,
  },
});
