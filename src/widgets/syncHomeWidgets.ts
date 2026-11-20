import { Platform } from 'react-native';
import { createWidget, type Widget } from 'expo-widgets';
import { getMood } from '@/src/constants/moods';
import { daysTogether } from '@/src/utils/dates';
import { LoveNote, UserProfile } from '@/src/types/models';
import {
  DAYS_WIDGET_INITIAL,
  MOOD_WIDGET_INITIAL,
  NOTE_WIDGET_INITIAL,
  type DaysTogetherWidgetProps,
  type LoveNoteWidgetProps,
  type MoodTodayWidgetProps,
} from '@/src/widgets/types';

type SyncInput = {
  me: UserProfile;
  partner: UserProfile | null;
  startDate: string | null;
  note: LoveNote | null;
  connected: boolean;
};

/**
 * App-side widget handles for updateSnapshot only.
 * Do NOT import the *.android.tsx / *.ios.tsx layout files here — those pass a
 * layout function into native createWidget, which crashes Android (expects a string).
 * Layouts come from the embedded initialLayout registry built at prebuild time.
 */
function createAppWidgetBridge<T extends object>(
  name: string,
  initialProps: T
): Widget<T> | null {
  if (Platform.OS === 'web') return null;
  try {
    return createWidget(name, '' as never, initialProps);
  } catch (error) {
    console.warn(`Home widget bridge unavailable for ${name}`, error);
    return null;
  }
}

const daysWidget = createAppWidgetBridge('DaysTogetherWidget', DAYS_WIDGET_INITIAL);
const moodWidget = createAppWidgetBridge('MoodTodayWidget', MOOD_WIDGET_INITIAL);
const noteWidget = createAppWidgetBridge('LoveNoteWidget', NOTE_WIDGET_INITIAL);

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

function firstInitial(name?: string | null) {
  const trimmed = (name || '').trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
}

function firstName(name?: string | null) {
  const trimmed = (name || '').trim();
  if (!trimmed) return 'Partner';
  return trimmed.split(/\s+/)[0];
}

function withHeart(text: string) {
  return /[♡♥]$/.test(text) ? text : `${text} ♡`;
}

export async function syncHomeWidgets(input: SyncInput): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    const days = daysTogether(input.startDate);
    const partnerName = firstName(input.partner?.displayName);
    const partnerToday = input.connected && isToday(input.partner?.moodUpdatedAt);
    const partnerMood = partnerToday ? getMood(input.partner?.currentMood) : null;
    const moodMessage = input.partner?.moodMessage?.trim();

    const noteText = input.note?.text?.trim();
    const noteLine = noteText
      ? withHeart(noteText)
      : input.connected
        ? "Can't wait to see you ♡"
        : 'Connect to share notes ♡';

    const daysProps: DaysTogetherWidgetProps = {
      brand: 'Loveni',
      title: 'Days Together',
      meInitial: firstInitial(input.me.displayName),
      partnerInitial: firstInitial(input.partner?.displayName || 'P'),
      daysCount: String(days ?? 0),
      daysCaption: 'days together',
    };

    const moodProps: MoodTodayWidgetProps = {
      title: `${partnerName}'s Mood`,
      moodLabel: partnerMood?.label ?? (input.connected ? 'Waiting' : 'Soon'),
      caption: moodMessage
        ? withHeart(moodMessage)
        : partnerMood
          ? 'Feeling really good today! ♡'
          : input.connected
            ? 'Waiting for their mood ♡'
            : 'Connect to see moods ♡',
    };

    const noteProps: LoveNoteWidgetProps = {
      title: "Today's Note",
      line: noteLine,
    };

    daysWidget?.updateSnapshot(daysProps);
    moodWidget?.updateSnapshot(moodProps);
    noteWidget?.updateSnapshot(noteProps);
  } catch (error) {
    console.warn('Could not update home screen widgets', error);
  }
}
