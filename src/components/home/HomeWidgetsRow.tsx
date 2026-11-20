import { format, isValid, parseISO } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Avatar } from '@/src/components/ui/Avatar';
import { Text } from '@/src/components/ui/Text';
import { getMood } from '@/src/constants/moods';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useDaysTogether } from '@/src/hooks/useDaysTogether';
import { useHaptics } from '@/src/hooks/useHaptics';
import { LoveNote, UserProfile } from '@/src/types/models';
import { fonts } from '@/src/theme/typography';
import { radii, spacing } from '@/src/theme/spacing';

const daysBg = require('../../../assets/images/days_widget_bg.png');
const moodBg = require('../../../assets/images/mood_widget_bg.png');
const notesBg = require('../../../assets/images/notes_widget_bg.png');

const WIDGET_H = 122;
const DAYS_W = 210;
const SQUARE_W = 122;
const GAP = 10;

interface Props {
  me: UserProfile;
  partner: UserProfile | null;
  startDate: string | null;
  note: LoveNote | null;
  locked?: boolean;
  onPressDays: () => void;
  onPressMood: () => void;
  onPressNotes: () => void;
  onPressAll?: () => void;
}

function formatAnniversary(startDate: string | null) {
  if (!startDate) return null;
  const date = parseISO(startDate);
  if (!isValid(date)) return null;
  return format(date, 'MMM dd, yyyy');
}

function isToday(timestamp?: number | null) {
  if (!timestamp) return false;
  const date = new Date(timestamp);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function WidgetsGridIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Circle cx="4" cy="4" r="2" fill={color} />
      <Circle cx="12" cy="4" r="2" fill={color} />
      <Circle cx="4" cy="12" r="2" fill={color} />
      <Circle cx="12" cy="12" r="2" fill={color} />
    </Svg>
  );
}

function DaysWidget({
  me,
  partner,
  startDate,
  onPress,
}: {
  me: UserProfile;
  partner: UserProfile | null;
  startDate: string | null;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const { days, hasStartDate } = useDaysTogether(startDate);
  const anniversaryLabel = formatAnniversary(startDate);

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel="Days together widget"
      style={({ pressed }) => [
        styles.daysShadow,
        theme.shadows.soft,
        { opacity: pressed ? 0.94 : 1 },
      ]}
    >
      <LinearGradient
        colors={['#4A1528', '#2E0C18', '#1A0810']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.daysCard}
      >
        <View style={styles.daysLeft}>
          <View style={styles.avatarStack}>
            <Avatar avatarId={me.avatarId} size={28} ring />
            {partner ? (
              <View style={styles.avatarOverlap}>
                <Avatar avatarId={partner.avatarId} size={28} ring />
              </View>
            ) : null}
          </View>

          <Text
            color="#FFFFFF"
            style={styles.daysCount}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.72}
          >
            {hasStartDate ? `${days} days` : '0 days'}
          </Text>
          <Text color="rgba(255,255,255,0.82)" style={styles.daysTogether}>
            together ♡
          </Text>
        </View>

        <View style={styles.daysPhotoWrap}>
          <Image source={daysBg} style={styles.daysPhoto} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(20,6,12,0.78)']}
            style={styles.daysPhotoScrim}
          />
          <View style={styles.daysPhotoCopy}>
            <Text color="#FFFFFF" style={styles.anniTitle} numberOfLines={1}>
              Anniversary
            </Text>
            <Text color="rgba(255,255,255,0.9)" style={styles.anniDate} numberOfLines={1}>
              {anniversaryLabel ?? 'Set date'}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function MoodWidget({
  me,
  locked,
  onPress,
}: {
  me: UserProfile;
  locked?: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const myToday = !locked && isToday(me.moodUpdatedAt);
  const mood = myToday ? getMood(me.currentMood) : null;
  const label = mood?.label ?? (locked ? 'Soon' : 'Happy');
  const emoji = mood?.emoji ?? '😊';
  const chipBg = mood?.badgeBg ?? '#FFF6D6';

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel="Mood today widget"
      style={({ pressed }) => [
        styles.squareShadow,
        theme.shadows.soft,
        { opacity: pressed ? 0.94 : 1 },
      ]}
    >
      <View style={styles.squareCard}>
        <Image source={moodBg} style={styles.squareImage} resizeMode="cover" />
        <View style={styles.moodScrim} />
        <View style={styles.moodContent}>
          <View style={styles.moodEmojiWrap}>
            <Text style={styles.moodHeart}>♡</Text>
            <Text style={styles.moodEmoji}>{emoji}</Text>
          </View>
          <Text color="#3A1630" style={styles.moodTitle} numberOfLines={1}>
            Mood Today
          </Text>
          <View style={[styles.moodChip, { backgroundColor: chipBg }]}>
            <Text color="#3A1630" style={styles.moodChipLabel} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function NotesWidget({
  note,
  locked,
  onPress,
}: {
  note: LoveNote | null;
  locked?: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const preview = note?.text?.trim()
    ? note.text.trim()
    : locked
      ? 'Connect to share notes'
      : 'Every moment with you feels...';

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel="Love note widget"
      style={({ pressed }) => [
        styles.squareShadow,
        theme.shadows.soft,
        { opacity: pressed ? 0.94 : 1 },
      ]}
    >
      <View style={styles.squareCard}>
        <Image source={notesBg} style={styles.squareImage} resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(255,236,242,0.55)', 'rgba(255,228,236,0.92)']}
          locations={[0.35, 0.62, 1]}
          style={styles.notesScrim}
        />
        <View style={styles.notesContent}>
          <Text color="#8B1E45" style={styles.notesTitle} numberOfLines={1}>
            Love Note
          </Text>
          <Text color="#6B2A44" style={styles.notesQuote} numberOfLines={2}>
            {`“${preview}${/[♡♥]$/.test(preview) ? '' : ' ♡'}”`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export function HomeWidgetsRow({
  me,
  partner,
  startDate,
  note,
  locked,
  onPressDays,
  onPressMood,
  onPressNotes,
  onPressAll,
}: Props) {
  const { colors } = useTheme();
  const haptics = useHaptics();

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <WidgetsGridIcon color={colors.textHeading} />
          <Text color={colors.textHeading} style={styles.sectionTitle}>
            Widgets
          </Text>
        </View>

        <Pressable
          onPress={() => {
            haptics.selection();
            onPressAll?.();
          }}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="All widgets"
        >
          <View style={styles.allRow}>
            <Text color={colors.primary} style={styles.allLabel}>
              Add to Home
            </Text>
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              size={12}
              tintColor={colors.primary}
              weight="semibold"
              fallback={<Text color={colors.primary} style={styles.allChevron}>›</Text>}
            />
          </View>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        decelerationRate="fast"
      >
        <DaysWidget me={me} partner={partner} startDate={startDate} onPress={onPressDays} />
        <MoodWidget me={me} locked={locked} onPress={onPressMood} />
        <NotesWidget note={note} locked={locked} onPress={onPressNotes} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  allRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  allLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 16,
  },
  allChevron: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 16,
    marginTop: -1,
  },
  row: {
    gap: GAP,
    paddingVertical: 4,
    paddingRight: spacing.lg,
  },
  daysShadow: {
    borderRadius: 20,
  },
  daysCard: {
    width: DAYS_W,
    height: WIDGET_H,
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    padding: 8,
    gap: 6,
  },
  daysLeft: {
    flex: 1.15,
    minWidth: 0,
    justifyContent: 'center',
    paddingLeft: 4,
    paddingRight: 2,
    gap: 1,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarOverlap: {
    marginLeft: -12,
  },
  daysCount: {
    fontFamily: fonts.displayBold,
    fontSize: 17,
    lineHeight: 20,
    letterSpacing: -0.3,
    width: '100%',
  },
  daysTogether: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
  },
  daysPhotoWrap: {
    width: 86,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#2A1018',
  },
  daysPhoto: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  daysPhotoScrim: {
    ...StyleSheet.absoluteFill,
  },
  daysPhotoCopy: {
    position: 'absolute',
    left: 7,
    right: 7,
    bottom: 7,
    gap: 1,
  },
  anniTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    lineHeight: 13,
  },
  anniDate: {
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
  },
  squareShadow: {
    borderRadius: 20,
  },
  squareCard: {
    width: SQUARE_W,
    height: WIDGET_H,
    borderRadius: 20,
    overflow: 'hidden',
  },
  squareImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  moodScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 248, 252, 0.18)',
  },
  moodContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    gap: 2,
  },
  moodEmojiWrap: {
    alignItems: 'center',
    marginBottom: 0,
  },
  moodHeart: {
    fontSize: 10,
    lineHeight: 12,
    color: '#F25F82',
    marginBottom: -4,
  },
  moodEmoji: {
    fontSize: 28,
    lineHeight: 32,
  },
  moodTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: -0.2,
  },
  moodChip: {
    marginTop: 2,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  moodChipLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
  },
  notesScrim: {
    ...StyleSheet.absoluteFill,
  },
  notesContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 10,
    gap: 2,
  },
  notesTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: -0.2,
  },
  notesQuote: {
    fontFamily: fonts.script,
    fontSize: 12,
    lineHeight: 15,
  },
});
