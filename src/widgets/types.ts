export type DaysTogetherWidgetProps = {
  brand: string;
  title: string;
  meInitial: string;
  partnerInitial: string;
  daysCount: string;
  daysCaption: string;
};

export type MoodTodayWidgetProps = {
  title: string;
  moodLabel: string;
  caption: string;
};

export type LoveNoteWidgetProps = {
  title: string;
  line: string;
};

export const DAYS_WIDGET_INITIAL: DaysTogetherWidgetProps = {
  brand: 'Loveni',
  title: 'Days Together',
  meInitial: 'Y',
  partnerInitial: 'P',
  daysCount: '128',
  daysCaption: 'days together',
};

export const MOOD_WIDGET_INITIAL: MoodTodayWidgetProps = {
  title: "Aeni's Mood",
  moodLabel: 'Happy',
  caption: 'Feeling really good today! ♡',
};

export const NOTE_WIDGET_INITIAL: LoveNoteWidgetProps = {
  title: "Today's Note",
  line: "Can't wait to see you ♡",
};
