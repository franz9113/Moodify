import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfWeek, endOfWeek, eachDayOfInterval, eachMonthOfInterval } from 'date-fns';
import { getMoodValue } from '@/app/utils/moodConfig';

export interface MoodData {
  mood: string;
  count: number;
}

export interface TrendDataPoint {
  label: string;
  mood: number;
  count: number;
}

/**
 * Calculates mood distribution counts for the active period
 */
export const calculateMoodCounts = (activeEntries: any[]): MoodData[] => {
  const counts: Record<string, number> = {};
  activeEntries.forEach((entry) => {
    const moodName = entry.mood;
    if (moodName) counts[moodName] = (counts[moodName] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([mood, count]) => ({ mood, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

/**
 * Filters entries for the active date range
 */
export const getActiveEntries = (
  allEntries: any[],
  viewMode: 'week' | 'month' | 'year',
  referenceDate: Date,
): any[] => {
  const startStr = format(
    viewMode === 'week'
      ? startOfWeek(referenceDate)
      : viewMode === 'year'
        ? startOfYear(referenceDate)
        : startOfMonth(referenceDate),
    'yyyy-MM-dd',
  );
  const endStr = format(
    viewMode === 'week'
      ? endOfWeek(referenceDate)
      : viewMode === 'year'
        ? endOfYear(referenceDate)
        : endOfMonth(referenceDate),
    'yyyy-MM-dd',
  );
  return allEntries.filter(
    (entry) => entry.date >= startStr && entry.date <= endStr,
  );
};

/**
 * Calculates trend data for the selected view mode
 */
export const calculateTrendData = (
  allEntries: any[],
  viewMode: 'week' | 'month' | 'year',
  referenceDate: Date,
): TrendDataPoint[] => {
  const entryMap: Record<string, { sum: number; count: number }> = {};

  allEntries.forEach((e) => {
    const d = format(new Date(e.date), 'yyyy-MM-dd');
    if (!entryMap[d]) entryMap[d] = { sum: 0, count: 0 };
    entryMap[d].sum += e.mood_value || getMoodValue(e.mood);
    entryMap[d].count += 1;
  });

  const start =
    viewMode === 'week'
      ? startOfWeek(referenceDate)
      : viewMode === 'year'
        ? startOfYear(referenceDate)
        : startOfMonth(referenceDate);
  const end =
    viewMode === 'week'
      ? endOfWeek(referenceDate)
      : viewMode === 'year'
        ? endOfYear(referenceDate)
        : endOfMonth(referenceDate);

  const interval =
    viewMode === 'year'
      ? eachMonthOfInterval({ start, end })
      : eachDayOfInterval({ start, end });

  return interval.map((point) => {
    const dateKey =
      viewMode === 'year' ? format(point, 'yyyy-MM') : format(point, 'yyyy-MM-dd');

    if (viewMode === 'year') {
      const monthEntries = Object.entries(entryMap).filter(([date]) =>
        date.startsWith(dateKey),
      );
      const totalSum = monthEntries.reduce(
        (acc, [_, val]) => acc + val.sum,
        0,
      );
      const totalCount = monthEntries.reduce(
        (acc, [_, val]) => acc + val.count,
        0,
      );
      return {
        label: format(point, 'MMM'),
        mood: totalCount > 0 ? totalSum / totalCount : 0,
        count: totalCount,
      };
    }

    const stats = entryMap[dateKey] || { sum: 0, count: 0 };
    return {
      label: viewMode === 'month' ? format(point, 'd') : format(point, 'EEE'),
      mood: stats.count > 0 ? stats.sum / stats.count : 0,
      count: stats.count,
    };
  });
};

/**
 * Maps mood score to human-readable label
 */
export const getMoodLabel = (value: number): string => {
  if (!value || value === 0) return 'No Entry';
  if (value >= 4.5) return 'Great';
  if (value >= 3.5) return 'Positive';
  if (value >= 2.5) return 'Calm';
  if (value >= 1.5) return 'Low';
  return 'Exhausted';
};

/**
 * Gets date range label for the current view mode
 */
export const getRangeLabel = (
  viewMode: 'week' | 'month' | 'year',
  referenceDate: Date,
): string => {
  if (viewMode === 'week') {
    return `${format(startOfWeek(referenceDate), 'MMM d')} - ${format(endOfWeek(referenceDate), 'MMM d')}`;
  } else if (viewMode === 'month') {
    return format(referenceDate, 'MMMM yyyy');
  } else {
    return format(referenceDate, 'yyyy');
  }
};
