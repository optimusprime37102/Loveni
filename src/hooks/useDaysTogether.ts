import { useMemo } from 'react';
import { daysTogether, nextAnniversary, formatFriendlyDate } from '@/src/utils/dates';

export function useDaysTogether(startDate: string | null | undefined) {
  return useMemo(() => {
    const days = daysTogether(startDate);
    const anniversary = nextAnniversary(startDate);
    return {
      days,
      anniversary,
      startLabel: formatFriendlyDate(startDate),
      hasStartDate: Boolean(startDate),
    };
  }, [startDate]);
}
