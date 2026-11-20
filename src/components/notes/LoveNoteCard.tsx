import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { useRef, useState, type ElementRef } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';
import { FloatingHeartsLetter } from '@/src/components/illustrations/FloatingHeartsLetter';
import { HeartOutlineIcon } from '@/src/components/illustrations/OutlineIcons';
import { Avatar } from '@/src/components/ui/Avatar';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { AvatarId } from '@/src/types/models';
import { fonts } from '@/src/theme/typography';
import { radii } from '@/src/theme/spacing';

const MENU_WIDTH = 168;
const MENU_EST_HEIGHT = 108;
const SCREEN_PAD = 12;

interface Props {
  text: string;
  senderLabel: string;
  avatarId?: AvatarId | null;
  timeLabel: string;
  mine?: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

interface MenuAnchor {
  top: number;
  left: number;
}

function formatQuote(text: string) {
  const trimmed = text.trim();
  if (/[♡♥❤️💖💕💗💓💞💝🥰😍]/.test(trimmed)) return trimmed;
  return `${trimmed} ♡`;
}

export function LoveNoteCard({
  text,
  senderLabel,
  avatarId,
  timeLabel,
  mine = false,
  canDelete = false,
  canEdit = false,
  onDelete,
  onEdit,
}: Props) {
  const { colors, theme, isDark } = useTheme();
  const haptics = useHaptics();
  const moreRef = useRef<ElementRef<typeof Pressable>>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor | null>(null);

  const accent = mine ? '#F4A7C0' : '#C9B6E4';
  const gradient = isDark
    ? ([colors.surfaceCard, colors.surface] as const)
    : (['#FFF5F8', '#FFEAF1'] as const);
  const menuBg = isDark ? colors.surfaceCard : '#FFFFFF';
  const showActions = canEdit || canDelete;

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

  const handleEdit = () => {
    closeMenu();
    onEdit?.();
  };

  const handleDelete = () => {
    closeMenu();
    onDelete?.();
  };

  return (
    <View style={[styles.shadow, styles.shadowBg, theme.shadows.card]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Pressable
          ref={moreRef}
          onPress={openMenu}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Note options"
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

        <View style={styles.row}>
          <View style={styles.content}>
            <View style={styles.identity}>
              <Avatar avatarId={avatarId} size={36} ring />
              <View style={styles.meta}>
                <View style={styles.nameRow}>
                  <Text color={colors.textHeading} style={styles.name} numberOfLines={1}>
                    {senderLabel}
                  </Text>
                  <HeartOutlineIcon size={12} color={colors.primary} />
                </View>
                <Text color={colors.textMuted} style={styles.time} numberOfLines={1}>
                  {timeLabel}
                </Text>
              </View>
            </View>

            <View style={styles.quoteBlock}>
              <View style={[styles.accent, { backgroundColor: accent }]} />
              <Text color={colors.textHeading} style={styles.quote} numberOfLines={3}>
                {formatQuote(text)}
              </Text>
            </View>
          </View>

          <View pointerEvents="none" style={styles.artSlot}>
            <FloatingHeartsLetter width={62} height={62} />
          </View>
        </View>
      </LinearGradient>

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
              {showActions ? (
                <>
                  {canEdit ? (
                    <Pressable
                      onPress={handleEdit}
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
                  ) : null}
                  {canDelete ? (
                    <Pressable
                      onPress={handleDelete}
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
                  ) : null}
                </>
              ) : (
                <View style={styles.menuItem}>
                  <Text color={colors.textMuted} style={styles.menuLabel}>
                    Only the sender can edit or delete
                  </Text>
                </View>
              )}
            </Pressable>
          ) : null}
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 22,
  },
  shadowBg: {
    backgroundColor: '#FFF5F8',
  },
  card: {
    borderRadius: 22,
    borderWidth: 0,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  moreBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreFallback: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 1,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 8,
    paddingRight: 4,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 28,
  },
  meta: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  time: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
  },
  quoteBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accent: {
    width: 3.5,
    borderRadius: radii.pill,
    alignSelf: 'stretch',
    minHeight: 28,
  },
  quote: {
    flex: 1,
    fontFamily: fonts.script,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  artSlot: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,
    marginRight: 2,
  },
});
