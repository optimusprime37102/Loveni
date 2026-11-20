import {
  addYears,
  differenceInCalendarDays,
  format,
  isValid,
  parseISO,
  setYear,
  startOfDay,
} from 'date-fns';

export function parseDateOnly(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = parseISO(value);
  return isValid(date) ? startOfDay(date) : null;
}

export function toDateOnlyString(date: Date): string {
  return format(startOfDay(date), 'yyyy-MM-dd');
}

export function daysTogether(startDate: string | null | undefined): number | null {
  const start = parseDateOnly(startDate);
  if (!start) return null;
  const today = startOfDay(new Date());
  const days = differenceInCalendarDays(today, start) + 1;
  return Math.max(days, 1);
}

export function nextAnniversary(startDate: string | null | undefined): {
  date: Date;
  daysUntil: number;
  years: number;
} | null {
  const start = parseDateOnly(startDate);
  if (!start) return null;

  const today = startOfDay(new Date());
  let next = setYear(start, today.getFullYear());
  if (next < today) {
    next = addYears(next, 1);
  }

  const years = next.getFullYear() - start.getFullYear();
  return {
    date: next,
    daysUntil: differenceInCalendarDays(next, today),
    years: Math.max(years, 1),
  };
}

export function formatFriendlyDate(value: string | null | undefined): string {
  const date = parseDateOnly(value);
  if (!date) return 'Not set';
  return format(date, 'MMMM d, yyyy');
}

export function formatNoteTime(timestamp: number): string {
  const date = new Date(timestamp);
  if (!isValid(date)) return '';
  return format(date, 'MMM d · h:mm a');
}

export function formatLoveNoteTime(timestamp: number): string {
  const date = new Date(timestamp);
  if (!isValid(date)) return '';
  const days = differenceInCalendarDays(startOfDay(new Date()), startOfDay(date));
  const clock = format(date, 'h:mm a');
  if (days === 0) return `Today, ${clock}`;
  if (days === 1) return `Yesterday, ${clock}`;
  return format(date, 'MMM d, h:mm a');
}

export function formatRelativeShort(timestamp: number): string {
  const date = new Date(timestamp);
  if (!isValid(date)) return '';
  const days = differenceInCalendarDays(startOfDay(new Date()), startOfDay(date));
  if (days === 0) return format(date, 'h:mm a');
  if (days === 1) return 'Yesterday';
  if (days < 7) return format(date, 'EEEE');
  return format(date, 'MMM d');
}

export function formatMoodClock(timestamp: number): string {
  const date = new Date(timestamp);
  if (!isValid(date)) return '';
  return format(date, 'h:mm a');
}

export function formatMoodDayHeading(timestamp: number): string {
  const date = new Date(timestamp);
  if (!isValid(date)) return '';
  const days = differenceInCalendarDays(startOfDay(new Date()), startOfDay(date));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

export function moodDayKey(timestamp: number): string {
  const date = new Date(timestamp);
  if (!isValid(date)) return '';
  return format(startOfDay(date), 'yyyy-MM-dd');
}
