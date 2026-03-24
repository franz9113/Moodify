import { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/app/utils/supabaseClient';
import { getMoodValue, getMoodImage } from '@/app/utils/moodConfig';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  addWeeks,
  addMonths,
  addYears,
  parseISO,
} from 'date-fns';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
} from 'recharts';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface MoodData {
  mood: string;
  count: number;
}

const getMoodLabel = (value: number) => {
  if (value === 0) return 'No Entry';
  if (value >= 4.5) return 'Great';
  if (value >= 3.5) return 'Positive';
  if (value >= 2.5) return 'Calm';
  if (value >= 1.5) return 'Low';
  return 'Exhausted';
};

export default function Statistics() {
  const [allEntries, setAllEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    async function fetchEntries() {
      setLoading(true);
      // Fetching using the 'date' column for consistency
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .order('date', { ascending: true });

      if (!error) setAllEntries(data || []);
      setLoading(false);
    }
    fetchEntries();
  }, []);

  const handlePrev = () => {
    if (viewMode === 'week') setReferenceDate(addWeeks(referenceDate, -1));
    else if (viewMode === 'month')
      setReferenceDate(addMonths(referenceDate, -1));
    else setReferenceDate(addYears(referenceDate, -1));
  };

  const handleNext = () => {
    if (viewMode === 'week') setReferenceDate(addWeeks(referenceDate, 1));
    else if (viewMode === 'month')
      setReferenceDate(addMonths(referenceDate, 1));
    else setReferenceDate(addYears(referenceDate, 1));
  };

  const getDateLabel = () => {
    if (viewMode === 'week') {
      return `${format(startOfWeek(referenceDate), 'MMM d')} - ${format(endOfWeek(referenceDate), 'd')}`;
    }
    if (viewMode === 'month') return format(referenceDate, 'MMMM yyyy');
    return format(referenceDate, 'yyyy');
  };

  const lastDayOfMonth = useMemo(
    () => parseInt(format(endOfMonth(referenceDate), 'd')),
    [referenceDate],
  );

  // Filter entries based on the 'date' string column
  const activeEntries = useMemo(() => {
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

    return allEntries.filter((entry) => {
      return entry.date >= startStr && entry.date <= endStr;
    });
  }, [allEntries, viewMode, referenceDate]);

  const moodCounts = useMemo<MoodData[]>(() => {
    const counts: Record<string, number> = {};
    activeEntries.forEach((entry) => {
      const mood = entry.mood_type;
      counts[mood] = (counts[mood] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([mood, count]) => ({ mood, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [activeEntries]);

  const trendData = useMemo(() => {
    // Pre-aggregate data by date string for performance
    const entryMap: Record<string, { sum: number; count: number }> = {};
    allEntries.forEach((e) => {
      const d = e.date; // Uses the 'date' column string
      if (!entryMap[d]) entryMap[d] = { sum: 0, count: 0 };
      entryMap[d].sum += getMoodValue(e.mood_type);
      entryMap[d].count += 1;
    });

    // Yearly View Logic
    if (viewMode === 'year') {
      return eachMonthOfInterval({
        start: startOfYear(referenceDate),
        end: endOfYear(referenceDate),
      }).map((month) => {
        const monthLabel = format(month, 'MMM');
        const monthPrefix = format(month, 'yyyy-MM');

        const monthEntries = Object.entries(entryMap).filter(([date]) =>
          date.startsWith(monthPrefix),
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
          label: monthLabel,
          displayLabel: monthLabel,
          mood: totalCount > 0 ? totalSum / totalCount : 0,
          count: totalCount,
        };
      });
    }

    // Weekly/Monthly View Logic
    const start =
      viewMode === 'week'
        ? startOfWeek(referenceDate)
        : startOfMonth(referenceDate);
    const end =
      viewMode === 'week'
        ? endOfWeek(referenceDate)
        : endOfMonth(referenceDate);

    return eachDayOfInterval({ start, end }).map((day) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const stats = entryMap[dateKey] || { sum: 0, count: 0 };

      return {
        label:
          viewMode === 'month' ? Number(format(day, 'd')) : format(day, 'EEE'),
        displayLabel:
          viewMode === 'week' ? format(day, 'EEE') : format(day, 'd'),
        mood: stats.count > 0 ? stats.sum / stats.count : 0,
        count: stats.count,
      };
    });
  }, [allEntries, viewMode, referenceDate]);

  if (loading)
    return (
      <div className='flex h-full items-center justify-center'>
        <Loader2 className='animate-spin text-cyan-500' />
      </div>
    );

  return (
    <div className='flex flex-col h-full pb-20'>
      <div className='px-6 py-4 border-b border-gray-100'>
        <h1 className='text-2xl font-bold'>Mood Statistics</h1>
      </div>

      <div className='flex-1 overflow-y-auto px-6 py-6 space-y-8'>
        {/* View Selection Tabs */}
        <div className='flex gap-2 bg-gray-50 p-1 rounded-xl w-fit'>
          {(['week', 'month', 'year'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-6 py-2 rounded-lg capitalize transition-all ${viewMode === mode ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-500'}`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Overview Card */}
        <div className='bg-gradient-to-br from-cyan-50 to-teal-50 rounded-3xl p-8 flex justify-between items-center'>
          <div>
            <h3 className='text-gray-700 font-medium mb-2 capitalize'>
              This {viewMode}
            </h3>
            <p className='text-5xl font-bold text-cyan-600'>
              {activeEntries.length}
            </p>
            <p className='text-gray-500 text-sm mt-1'>Total Entries</p>
          </div>
          {moodCounts[0] && (
            <div className='text-center'>
              <img
                src={getMoodImage(moodCounts[0].mood)}
                alt=''
                className='w-16 h-16 mx-auto mb-2'
              />
              <p className='text-xs text-gray-400'>Most Frequent</p>
              <p className='font-semibold text-gray-700 capitalize'>
                {moodCounts[0].mood}
              </p>
            </div>
          )}
        </div>

        {/* Line Chart Section */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-bold capitalize'>
              {viewMode}ly Mood Chart
            </h3>
            <div className='flex items-center gap-3'>
              <button
                onClick={handlePrev}
                className='p-1 hover:bg-gray-100 rounded-full'
              >
                <ChevronLeft size={20} className='text-gray-400' />
              </button>
              <span className='text-sm font-semibold text-gray-600 min-w-[80px] text-center'>
                {getDateLabel()}
              </span>
              <button
                onClick={handleNext}
                className='p-1 hover:bg-gray-100 rounded-full'
              >
                <ChevronRight size={20} className='text-gray-400' />
              </button>
            </div>
          </div>

          <div className='bg-white border border-gray-100 rounded-3xl p-4 shadow-sm h-[250px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={trendData}
                margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={true}
                  stroke='#e2e8f0'
                />
                {viewMode === 'month' ? (
                  <XAxis
                    dataKey='label'
                    type='number'
                    domain={[1, lastDayOfMonth]}
                    ticks={[2, 4, 6, 8, 10, 13, 16, 19, 22, 25, 28, 31].filter(
                      (t) => t <= lastDayOfMonth,
                    )}
                    axisLine={{ stroke: '#94a3b8' }}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                ) : (
                  <XAxis
                    dataKey='label'
                    axisLine={{ stroke: '#94a3b8' }}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                )}
                <YAxis
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 5]}
                  axisLine={{ stroke: '#94a3b8' }}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />

                <Tooltip
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload?.[0]?.payload;
                      if (!data) return null;

                      // Use the helper function here!
                      const moodLabel = getMoodLabel(data.mood);

                      // Optional: Dynamic colors for the text
                      const textColor =
                        data.mood >= 3.5
                          ? 'text-emerald-500'
                          : data.mood >= 2.5
                            ? 'text-cyan-500'
                            : 'text-purple-500';

                      return (
                        <div className='bg-white p-4 rounded-2xl shadow-2xl border border-gray-50 flex flex-col items-center min-w-[100px]'>
                          <p className='font-bold text-gray-800 text-sm mb-1'>
                            Day {data.displayLabel || data.label}
                          </p>
                          <p className={`${textColor} font-semibold text-xs`}>
                            {moodLabel}
                          </p>
                          <p className='text-gray-400 text-[10px]'>
                            {data.count}{' '}
                            {data.count === 1 ? 'entry' : 'entries'}
                          </p>
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
                  dot={false}
                  connectNulls={true}
                  activeDot={{
                    r: 4,
                    fill: '#06b6d4',
                    stroke: '#fff',
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Moods Section */}
        <div className='space-y-4'>
          <h3 className='text-lg font-bold'>Top 5 Moods</h3>
          <div className='bg-white border border-gray-100 rounded-3xl p-6 shadow-sm min-h-[180px] flex items-center justify-center'>
            {moodCounts.length > 0 ? (
              <ResponsiveContainer width='100%' height={250}>
                <BarChart
                  data={moodCounts}
                  layout='vertical'
                  margin={{ left: -20, bottom: 20 }}
                >
                  <CartesianGrid
                    horizontal={false}
                    stroke='#f1f5f9'
                    strokeDasharray='3 3'
                  />
                  <XAxis
                    type='number'
                    domain={[0, 'dataMax + 1']}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    type='category'
                    dataKey='mood'
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 13 }}
                    width={100}
                  />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar
                    dataKey='count'
                    fill='#06b6d4'
                    radius={[0, 10, 10, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className='text-gray-400 text-sm'>No mood data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
