import { addWeeks, addMonths, addYears } from 'date-fns';

/**
 * Custom hook for managing date range navigation
 */
export const useDateRangeNavigation = (
  viewMode: 'week' | 'month' | 'year',
  referenceDate: Date,
  onDateChange: (date: Date) => void,
) => {
  const handlePrev = () => {
    if (viewMode === 'week') onDateChange(addWeeks(referenceDate, -1));
    else if (viewMode === 'month') onDateChange(addMonths(referenceDate, -1));
    else onDateChange(addYears(referenceDate, -1));
  };

  const handleNext = () => {
    if (viewMode === 'week') onDateChange(addWeeks(referenceDate, 1));
    else if (viewMode === 'month') onDateChange(addMonths(referenceDate, 1));
    else onDateChange(addYears(referenceDate, 1));
  };

  return { handlePrev, handleNext };
};
