import { useState, useMemo } from 'react';
import { getMoodEntries } from '@/app/utils/storage';
import { getMoodValue, getMoodImage } from '@/app/utils/moodConfig';
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  subWeeks,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  subYears,
} from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Statistics() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'year'>('month');
  const allEntries = getMoodEntries();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);

  const yearStart = startOfYear(currentYear);
  const yearEnd = endOfYear(currentYear);

  // Filter entries for current month
  const monthEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= monthStart && entryDate <= monthEnd;
    });
  }, [allEntries, monthStart, monthEnd]);

  // Filter entries for current week
  const weekEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });
  }, [allEntries, weekStart, weekEnd]);

  // Filter entries for current year
  const yearEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= yearStart && entryDate <= yearEnd;
    });
  }, [allEntries, yearStart, yearEnd]);

  // Mood count data - top 5 moods
  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    // allEntries.forEach((entry) => {
    //   if (!counts[entry.mood]) {
    //     counts[entry.mood] = 0;
    //   }
    //   counts[entry.mood]++;
    // });
    allEntries.forEach((entry) => {
      counts[entry.mood] = (counts[entry.mood] ?? 0) + 1;
    });

    return Object.entries(counts)
      .map(([mood, count]) => ({
        mood,
        count,
        image: getMoodImage(mood),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [allEntries]);

  // Weekly mood trend
  const weeklyTrend = useMemo(() => {
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return days.map((day, index) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayEntries = allEntries.filter((e) => e.date === dayStr);

      let avgMood = 0;
      if (dayEntries.length > 0) {
        avgMood =
          dayEntries.reduce((sum, entry) => sum + getMoodValue(entry.mood), 0) /
          dayEntries.length;
      }

      return {
        id: dayStr,
        day: format(day, 'EEE'),
        mood: avgMood,
        count: dayEntries.length,
      };
    });
  }, [allEntries, weekStart, weekEnd]);

  // Monthly mood trend
  const monthlyTrend = useMemo(() => {
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return days.map((day, index) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayEntries = monthEntries.filter((e) => e.date === dayStr);

      let avgMood = 0;
      if (dayEntries.length > 0) {
        avgMood =
          dayEntries.reduce((sum, entry) => sum + getMoodValue(entry.mood), 0) /
          dayEntries.length;
      }

      return {
        id: dayStr,
        day: format(day, 'd'),
        mood: avgMood,
        count: dayEntries.length,
      };
    });
  }, [monthEntries, monthStart, monthEnd]);

  // Yearly mood trend
  const yearlyTrend = useMemo(() => {
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    return months.map((month, index) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthEntries = yearEntries.filter((e) => {
        const entryDate = new Date(e.date);
        return entryDate >= monthStart && entryDate <= monthEnd;
      });

      let avgMood = 0;
      if (monthEntries.length > 0) {
        avgMood =
          monthEntries.reduce(
            (sum, entry) => sum + getMoodValue(entry.mood),
            0,
          ) / monthEntries.length;
      }

      return {
        id: format(month, 'yyyy-MM'),
        month: format(month, 'MMM'),
        mood: avgMood,
        count: monthEntries.length,
      };
    });
  }, [yearEntries, yearStart, yearEnd]);

  const mostFrequentMood = useMemo(() => {
    if (moodCounts.length === 0) return null;
    return moodCounts[0];
  }, [moodCounts]);

  return (
    <div className='flex flex-col h-full pb-20'>
      <div className='px-6 py-4 border-b border-gray-200'>
        <h1 className='text-2xl'>Mood Statistics</h1>
      </div>

      <div className='flex-1 overflow-y-auto'>
        {/* View Mode Tabs */}
        <div className='px-6 py-4 border-b border-gray-200'>
          <div className='flex gap-2'>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'week'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'month'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('year')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'year'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        <div className='px-6 py-6 space-y-6'>
          {/* Overview */}
          <div className='bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-6'>
            <h3 className='text-lg mb-4'>
              {viewMode === 'week' && 'This Week'}
              {viewMode === 'month' && 'This Month'}
              {viewMode === 'year' && 'This Year'}
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-3xl font-bold text-cyan-600'>
                  {viewMode === 'week' && weekEntries.length}
                  {viewMode === 'month' && monthEntries.length}
                  {viewMode === 'year' && yearEntries.length}
                </p>
                <p className='text-sm text-gray-600'>Total Entries</p>
              </div>
              {mostFrequentMood && mostFrequentMood.count > 0 && (
                <div>
                  <img
                    src={mostFrequentMood.image}
                    alt={mostFrequentMood.mood}
                    className='w-12 h-12'
                  />
                  <p className='text-sm text-gray-600'>Most Frequent</p>
                  <p className='text-xs text-gray-500'>
                    {mostFrequentMood.mood}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Trend */}
          {viewMode === 'week' && (
            <div>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg'>Weekly Mood Chart</h3>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                    className='p-1'
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className='text-sm text-gray-600'>
                    {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
                  </span>
                  <button
                    onClick={() => {
                      const next = subWeeks(currentWeek, -1);
                      if (next <= new Date()) {
                        setCurrentWeek(next);
                      }
                    }}
                    className='p-1'
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <div className='bg-white rounded-xl p-4 border border-gray-200'>
                <ResponsiveContainer width='100%' height={200}>
                  <LineChart
                    data={weeklyTrend}
                    key={`week-${format(weekStart, 'yyyy-MM-dd')}`}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='day' />
                    <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const value = payload?.[0]?.value as number;
                          const count = payload?.[0]?.payload.count;
                          const moodLabel =
                            value >= 4.5
                              ? 'Very Positive'
                              : value >= 3.5
                                ? 'Positive'
                                : value >= 2.5
                                  ? 'Neutral'
                                  : value >= 1.5
                                    ? 'Low'
                                    : value > 0
                                      ? 'Very Low'
                                      : 'No entries';
                          return (
                            <div className='bg-white p-3 rounded-lg shadow-lg border border-gray-200'>
                              <p className='font-medium'>
                                {payload?.[0]?.payload.day}
                              </p>
                              <p className='text-sm text-gray-600'>
                                {moodLabel}
                              </p>
                              {count > 0 && (
                                <p className='text-xs text-gray-500'>
                                  {count} {count === 1 ? 'entry' : 'entries'}
                                </p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type='monotone'
                      dataKey='mood'
                      stroke='#06b6d4'
                      strokeWidth={2}
                      dot={{ fill: '#06b6d4', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Monthly Trend */}
          {viewMode === 'month' && (
            <div>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg'>Monthly Mood Chart</h3>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className='p-1'
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className='text-sm text-gray-600'>
                    {format(currentMonth, 'MMMM yyyy')}
                  </span>
                  <button
                    onClick={() => {
                      const next = subMonths(currentMonth, -1);
                      if (next <= new Date()) {
                        setCurrentMonth(next);
                      }
                    }}
                    className='p-1'
                    disabled={
                      startOfMonth(subMonths(currentMonth, -1)) >
                      startOfMonth(new Date())
                    }
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <div className='bg-white rounded-xl p-4 border border-gray-200'>
                <ResponsiveContainer width='100%' height={200}>
                  <LineChart
                    data={monthlyTrend}
                    key={`month-${format(monthStart, 'yyyy-MM')}`}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='day' />
                    <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const value = payload?.[0]?.value as number;
                          const count = payload?.[0]?.payload.count;
                          const moodLabel =
                            value >= 4.5
                              ? 'Very Positive'
                              : value >= 3.5
                                ? 'Positive'
                                : value >= 2.5
                                  ? 'Neutral'
                                  : value >= 1.5
                                    ? 'Low'
                                    : value > 0
                                      ? 'Very Low'
                                      : 'No entries';
                          return (
                            <div className='bg-white p-3 rounded-lg shadow-lg border border-gray-200'>
                              <p className='font-medium'>
                                Day {payload?.[0]?.payload.day}
                              </p>
                              <p className='text-sm text-gray-600'>
                                {moodLabel}
                              </p>
                              {count > 0 && (
                                <p className='text-xs text-gray-500'>
                                  {count} {count === 1 ? 'entry' : 'entries'}
                                </p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type='monotone'
                      dataKey='mood'
                      stroke='#14b8a6'
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Yearly Trend */}
          {viewMode === 'year' && (
            <div>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg'>Yearly Mood Chart</h3>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setCurrentYear(subYears(currentYear, 1))}
                    className='p-1'
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className='text-sm text-gray-600'>
                    {format(currentYear, 'yyyy')}
                  </span>
                  <button
                    onClick={() => {
                      const next = subYears(currentYear, -1);
                      if (next <= new Date()) {
                        setCurrentYear(next);
                      }
                    }}
                    className='p-1'
                    disabled={
                      startOfYear(subYears(currentYear, -1)) >
                      startOfYear(new Date())
                    }
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <div className='bg-white rounded-xl p-4 border border-gray-200'>
                <ResponsiveContainer width='100%' height={200}>
                  <LineChart
                    data={yearlyTrend}
                    key={`year-${format(yearStart, 'yyyy')}`}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='month' />
                    <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const value = payload?.[0]?.value as number;
                          const count = payload?.[0]?.payload.count;
                          const moodLabel =
                            value >= 4.5
                              ? 'Very Positive'
                              : value >= 3.5
                                ? 'Positive'
                                : value >= 2.5
                                  ? 'Neutral'
                                  : value >= 1.5
                                    ? 'Low'
                                    : value > 0
                                      ? 'Very Low'
                                      : 'No entries';
                          return (
                            <div className='bg-white p-3 rounded-lg shadow-lg border border-gray-200'>
                              <p className='font-medium'>
                                {payload?.[0]?.payload.month}
                              </p>
                              <p className='text-sm text-gray-600'>
                                {moodLabel}
                              </p>
                              {count > 0 && (
                                <p className='text-xs text-gray-500'>
                                  {count} {count === 1 ? 'entry' : 'entries'}
                                </p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type='monotone'
                      dataKey='mood'
                      stroke='#8b5cf6'
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Top 5 Moods Distribution */}
          <div>
            <h3 className='text-lg mb-4'>Top 5 Moods</h3>
            <div className='bg-white rounded-xl p-4 border border-gray-200'>
              {moodCounts.length > 0 ? (
                <ResponsiveContainer width='100%' height={250}>
                  <BarChart data={moodCounts} layout='vertical'>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis type='number' />
                    <YAxis type='category' dataKey='mood' />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className='bg-white p-3 rounded-lg shadow-lg border border-gray-200'>
                              <p className='font-medium'>
                                {payload?.[0]?.payload.mood}
                              </p>
                              <p className='text-sm text-gray-600'>
                                {payload?.[0]?.value} times
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey='count' fill='#06b6d4' radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className='text-center text-gray-500 py-8'>
                  No mood data yet
                </p>
              )}
            </div>
          </div>

          {allEntries.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-gray-500'>No mood entries yet</p>
              <p className='text-sm text-gray-400 mt-2'>
                Start tracking your moods to see statistics
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
