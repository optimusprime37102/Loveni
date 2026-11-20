import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  LayoutChangeEvent,
  StyleSheet,
  View,
} from 'react-native';
import { LoveNotesBg } from '@/src/components/illustrations/LoveNotesBg';
import { LoveNoteCard } from '@/src/components/notes/LoveNoteCard';
import { NotesCoupleBanner } from '@/src/components/notes/NotesCoupleBanner';
import { NotesEmptyCard } from '@/src/components/notes/NotesEmptyCard';
import { NotesHeader } from '@/src/components/notes/NotesHeader';
import { Screen } from '@/src/components/ui/Screen';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCouple } from '@/src/contexts/CoupleContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { deleteLoveNote, subscribeLoveNotes } from '@/src/services/notesService';
import { LoveNote } from '@/src/types/models';
import { formatLoveNoteTime } from '@/src/utils/dates';
import { spacing } from '@/src/theme/spacing';

export default function NotesScreen() {
  const { profile } = useAuth();
  const { couple, partner } = useCouple();
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();
  const [notes, setNotes] = useState<LoveNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [bgSize, setBgSize] = useState({ width: 0, height: 0 });

  const goWrite = () => router.push('/note/create');
  const goEdit = (note: LoveNote) => {
    if (note.fromUid !== profile?.uid) return;
    router.push({
      pathname: '/note/create',
      params: { noteId: note.id, text: note.text },
    });
  };
  const hasNotes = notes.length > 0;

  const onBgLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width !== bgSize.width || height !== bgSize.height) {
      setBgSize({ width, height });
    }
  };

  useEffect(() => {
    if (!couple?.id) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const unsub = subscribeLoveNotes(
      couple.id,
      (next) => {
        setNotes(next);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [couple?.id]);

  const onDelete = (note: LoveNote) => {
    if (note.fromUid !== profile?.uid) return;

    Alert.alert('Delete note?', 'This removes it for both of you.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteLoveNote(note.id);
            haptics.medium();
          } catch (e: unknown) {
            Alert.alert('Could not delete', (e as Error).message);
          }
        },
      },
    ]);
  };

  // Dim translucent gradient — screen bg design shows through
  const panelGradient = isDark
    ? (['rgba(74, 36, 56, 0.64)', 'rgba(53, 32, 48, 0.44)', 'rgba(42, 26, 38, 0.26)'] as const)
    : (['rgba(247, 196, 214, 0.6)', 'rgba(252, 224, 234, 0.4)', 'rgba(255, 245, 248, 0.24)'] as const);
  const fadeColors = isDark
    ? (['rgba(42, 26, 38, 0)', 'rgba(42, 26, 38, 0.28)', 'rgba(42, 26, 38, 0.55)'] as const)
    : (['rgba(255, 245, 248, 0)', 'rgba(252, 224, 234, 0.22)', 'rgba(247, 196, 214, 0.4)'] as const);

  return (
    <Screen padded={false} edges={['top', 'left', 'right']}>
      <View
        style={[styles.fill, { backgroundColor: isDark ? colors.background : '#FFF1F5' }]}
        onLayout={onBgLayout}
      >
        <View pointerEvents="none" style={styles.bg}>
          {isDark ? (
            <LinearGradient
              colors={colors.gradientHero}
              start={{ x: 0.15, y: 0 }}
              end={{ x: 0.85, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          ) : bgSize.width > 0 && bgSize.height > 0 ? (
            <LoveNotesBg width={bgSize.width} height={bgSize.height} />
          ) : null}
        </View>

        <NotesHeader showWrite={hasNotes} onWrite={goWrite} />

        {loading ? (
          <View style={styles.outerPad}>
            <LinearGradient
              colors={panelGradient}
              locations={[0, 0.4, 1]}
              style={[styles.panel, styles.panelFill]}
            >
              <Skeleton height={72} radius={40} />
              <Skeleton height={96} radius={22} style={{ marginTop: 16 }} />
            </LinearGradient>
          </View>
        ) : !hasNotes ? (
          <View style={[styles.outerPad, styles.emptyList]}>
            <NotesEmptyCard onWrite={goWrite} />
          </View>
        ) : (
          <View style={styles.outerPad}>
            <LinearGradient
              colors={panelGradient}
              locations={[0, 0.4, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={[styles.panel, styles.panelFill]}
            >
              <FlatList
                data={notes}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={false}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                ListHeaderComponentStyle={styles.clear}
                ListHeaderComponent={
                  <NotesCoupleBanner
                    myAvatarId={profile?.avatarId}
                    partnerAvatarId={partner?.avatarId}
                  />
                }
                CellRendererComponent={({ children, style, ...props }) => (
                  <View {...props} style={[style, styles.clear]}>
                    {children}
                  </View>
                )}
                renderItem={({ item }) => {
                  const mine = item.fromUid === profile?.uid;
                  return (
                    <LoveNoteCard
                      text={item.text}
                      senderLabel={
                        mine ? 'You' : partner?.displayName?.split(' ')[0] || 'Partner'
                      }
                      avatarId={mine ? profile?.avatarId : partner?.avatarId}
                      timeLabel={formatLoveNoteTime(item.createdAt)}
                      mine={mine}
                      canEdit={mine}
                      canDelete={mine}
                      onEdit={() => goEdit(item)}
                      onDelete={() => onDelete(item)}
                    />
                  );
                }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />

              <LinearGradient
                pointerEvents="none"
                colors={fadeColors}
                locations={[0, 0.45, 1]}
                style={styles.bottomFade}
              />
            </LinearGradient>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  bg: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  outerPad: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: 0,
  },
  emptyList: {
    justifyContent: 'center',
    paddingBottom: spacing.md,
  },
  panel: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0,
    overflow: 'hidden',
    paddingTop: spacing.xs,
  },
  panelFill: {
    flex: 1,
  },
  clear: {
    backgroundColor: 'transparent',
  },
  list: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    paddingBottom: 88,
    backgroundColor: 'transparent',
    flexGrow: 1,
  },
  separator: {
    height: spacing.sm,
    backgroundColor: 'transparent',
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
});
