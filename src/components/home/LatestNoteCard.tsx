import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { FeaturePreviewCard } from '@/src/components/home/FeaturePreviewCard';
import { EmptyNotesArt } from '@/src/components/illustrations/EmptyNotesArt';
import { FloatingHeartsLetter } from '@/src/components/illustrations/FloatingHeartsLetter';
import { LoveLetter } from '@/src/components/illustrations/LoveLetter';
import { EnvelopeOutlineIcon } from '@/src/components/illustrations/OutlineIcons';
import { Card } from '@/src/components/ui/Card';
import { Text } from '@/src/components/ui/Text';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useHaptics } from '@/src/hooks/useHaptics';
import { LoveNote } from '@/src/types/models';
import { fonts } from '@/src/theme/typography';
import { radii, spacing } from '@/src/theme/spacing';

interface Props {
  note: LoveNote | null;
  myUid: string;
  locked?: boolean;
  onPress: () => void;
}

function NoteHeartBadge({ size = 22 }: { size?: number }) {
  return (
    <View style={[styles.badge, { width: size, height: size, borderRadius: size * 0.28 }]}>
      <Svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 20.5C11 20.5 10 19.73 8.96 18.91C6.02 16.59 2 14 2 9.14C2 4.27 7.5 0.83 12 5.5C16.5 0.83 22 4.27 22 9.14C22 14 18 16.59 15.04 18.91C14 19.73 13 20.5 12 20.5Z"
          fill="#FFFFFF"
        />
      </Svg>
    </View>
  );
}

function formatQuote(text: string) {
  const trimmed = text.trim();
  const withHeart = /[♡♥]$/.test(trimmed) ? trimmed : `${trimmed} ♡`;
  return `“${withHeart}”`;
}

function CardHeader({ onPressLink }: { onPressLink?: () => void }) {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <NoteHeartBadge />
        <Text color={colors.textHeading} style={styles.title} numberOfLines={1}>
          Latest Love Note
        </Text>
      </View>
      <Pressable onPress={onPressLink} hitSlop={8}>
        <Text color={colors.primary} style={styles.link}>
          View All  ›
        </Text>
      </Pressable>
    </View>
  );
}

function EmptyNotesCard({ onPress }: { onPress: () => void }) {
  const { colors, theme } = useTheme();
  const haptics = useHaptics();

  return (
    <Card style={styles.emptyCard}>
      <CardHeader onPressLink={onPress} />

      <View style={styles.emptyArtWrap}>
        <EmptyNotesArt width={280} height={72} />
      </View>

      <View style={styles.emptyCopy}>
        <Text color={colors.textHeading} style={styles.emptyTitle} center>
          No love notes yet ♡
        </Text>
        <Text color={colors.textSecondary} style={styles.emptySubtitle} center>
          A little love note could make their day.
        </Text>
      </View>

      <Pressable
        onPress={() => {
          haptics.selection();
          onPress();
        }}
        style={({ pressed }) => [
          styles.ctaShadow,
          theme.shadows.glow,
          { opacity: pressed ? 0.92 : 1 },
        ]}
      >
        <LinearGradient
          colors={colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cta}
        >
          <SymbolView
            name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
            size={14}
            tintColor="#FFFFFF"
            weight="semibold"
            fallback={<Text style={styles.ctaFallback}>✎</Text>}
          />
          <Text color="#FFFFFF" style={styles.ctaLabel}>
            Write Your First Note
          </Text>
          <Text color="#FFFFFF" style={styles.ctaChevron}>
            ›
          </Text>
        </LinearGradient>
      </Pressable>
    </Card>
  );
}

function FilledNotesCard({
  note,
  myUid,
  onPress,
}: {
  note: LoveNote;
  myUid: string;
  onPress: () => void;
}) {
  const { colors, theme, isDark } = useTheme();
  const haptics = useHaptics();

  const paperBg = isDark ? 'rgba(255, 122, 168, 0.1)' : '#FFF0F4';
  const holeColor = isDark ? 'rgba(255, 158, 192, 0.28)' : '#F5C8D6';
  const spineColor = isDark ? 'rgba(255, 158, 192, 0.22)' : '#F7D6E1';
  const fromLabel = note.fromUid === myUid ? 'From you' : 'From your person';

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onPress();
      }}
    >
      <Card style={styles.card}>
        <CardHeader onPressLink={onPress} />

        <View style={[styles.paper, theme.shadows.soft, { backgroundColor: paperBg }]}>
          <View style={[styles.spine, { backgroundColor: spineColor }]}>
            {[0, 1, 2, 3].map((index) => (
              <View key={index} style={[styles.hole, { backgroundColor: holeColor }]} />
            ))}
          </View>

          <View style={styles.noteBody}>
            <Text
              color={isDark ? '#FFD0DE' : '#4A0A26'}
              style={styles.quote}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.78}
            >
              {formatQuote(note.text)}
            </Text>
            <Text color={colors.textSecondary} style={styles.from} numberOfLines={1}>
              {fromLabel}
            </Text>
          </View>

          <View pointerEvents="none" style={styles.art}>
            <FloatingHeartsLetter width={68} height={68} />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

export function LatestNoteCard({ note, myUid, locked, onPress }: Props) {
  const { colors } = useTheme();

  if (locked) {
    return (
      <FeaturePreviewCard
        title="Love Notes"
        description="Your shared notes will appear here."
        leadingIcon={<EnvelopeOutlineIcon size={26} color={colors.primary} />}
        illustration={<LoveLetter width={108} height={76} />}
        onPress={onPress}
      />
    );
  }

  if (!note) {
    return <EmptyNotesCard onPress={onPress} />;
  }

  return <FilledNotesCard note={note} myUid={myUid} onPress={onPress} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    gap: spacing.md,
    overflow: 'hidden',
  },
  emptyCard: {
    borderRadius: 22,
    gap: 8,
    overflow: 'hidden',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
    minWidth: 0,
  },
  badge: {
    backgroundColor: '#F25F82',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  link: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    flexShrink: 0,
  },
  emptyArtWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -2,
    marginBottom: -6,
  },
  emptyCopy: {
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing.sm,
  },
  emptyTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  emptySubtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
  },
  ctaShadow: {
    alignSelf: 'center',
    borderRadius: radii.pill,
    width: '72%',
    maxWidth: 260,
    marginTop: 2,
  },
  cta: {
    minHeight: 40,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  ctaLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 17,
  },
  ctaChevron: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 16,
    marginTop: -1,
  },
  ctaFallback: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  paper: {
    borderRadius: 18,
    height: 86,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  spine: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
  },
  hole: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  noteBody: {
    flex: 1,
    minWidth: 0,
    paddingTop: 14,
    paddingBottom: 14,
    paddingRight: 74,
    paddingLeft: 6,
    gap: 5,
    justifyContent: 'center',
  },
  quote: {
    fontFamily: fonts.scriptBold,
    fontSize: 19,
    lineHeight: 24,
    letterSpacing: 0.1,
    width: '100%',
  },
  from: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
  },
  art: {
    position: 'absolute',
    right: 0,
    bottom: -2,
  },
});
