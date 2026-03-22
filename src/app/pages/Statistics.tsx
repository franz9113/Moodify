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
  isSameDay,
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
  Cell,
} from 'recharts';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

// Define strict types to fix the 'unknown' error
interface MoodData {
  mood: string;
  count: number;
}

export default function Statistics() {
  const [allEntries, setAllEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth] = useState(new Date());
  const [currentWeek] = useState(new Date());
  const [currentYear] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'year'>('month');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  useEffect(() => {
    async function fetchEntries() {
      setLoading(true);
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error) setAllEntries(data || []);
      setLoading(false);
    }
    fetchEntries();
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);
  const yearStart = startOfYear(currentYear);
  const yearEnd = endOfYear(currentYear);

  const activeEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      const date = new Date(entry.created_at);
      if (viewMode === 'week') return date >= weekStart && date <= weekEnd;
      if (viewMode === 'year') return date >= yearStart && date <= yearEnd;
      return date >= monthStart && date <= monthEnd;
    });
  }, [
    allEntries,
    viewMode,
    monthStart,
    monthEnd,
    weekStart,
    weekEnd,
    yearStart,
    yearEnd,
  ]);

  // Fix: Explicitly typing the returned array as MoodData[]
  const moodCounts = useMemo<MoodData[]>(() => {
    const counts: Record<string, number> = {};
    activeEntries.forEach((entry) => {
      const mood = entry.mood_type;
      counts[mood] = (counts[mood] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([mood, count]) => ({ mood, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [activeEntries]);

  const trendData = useMemo(() => {
    if (viewMode === 'year') {
      return eachMonthOfInterval({ start: yearStart, end: yearEnd }).map(
        (month) => {
          const label = format(month, 'MMM');
          const entries = allEntries.filter(
            (e) => format(new Date(e.created_at), 'MMM') === label,
          );
          const avg = entries.length
            ? entries.reduce((s, e) => s + getMoodValue(e.mood_type), 0) /
              entries.length
            : 0;
          return { label, mood: avg, count: entries.length };
        },
      );
    }
    const days =
      viewMode === 'week'
        ? eachDayOfInterval({ start: weekStart, end: weekEnd })
        : eachDayOfInterval({ start: monthStart, end: monthEnd });

    return days.map((day) => {
      const entries = allEntries.filter((e) =>
        isSameDay(new Date(e.created_at), day),
      );
      const avg = entries.length
        ? entries.reduce((s, e) => s + getMoodValue(e.mood_type), 0) /
          entries.length
        : 0;
      return {
        label: viewMode === 'week' ? format(day, 'EEE') : format(day, 'd'),
        mood: avg,
        count: entries.length,
      };
    });
  }, [
    allEntries,
    viewMode,
    monthStart,
    monthEnd,
    weekStart,
    weekEnd,
    yearStart,
    yearEnd,
  ]);

  if (loading)
    return (
      <div className='flex h-full items-center justify-center'>
        <Loader2 className='animate-spin text-cyan-500' />
      </div>
    );

  const mostFrequent = moodCounts[0];

  return (
    <div className='flex flex-col h-full pb-20'>
      <div className='px-6 py-4 border-b border-gray-100'>
        <h1 className='text-2xl font-bold'>Mood Statistics</h1>
      </div>

      <div className='flex-1 overflow-y-auto px-6 py-6 space-y-8'>
        {/* Tabs */}
        <div className='flex gap-2 bg-gray-50 p-1 rounded-xl w-fit'>
          {(['week', 'month', 'year'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-6 py-2 rounded-lg capitalize transition-all ${viewMode === mode ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
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
          {mostFrequent && (
            <div className='text-center'>
              <img
                src={getMoodImage(mostFrequent.mood)}
                alt=''
                className='w-16 h-16 mx-auto mb-2'
              />
              <p className='text-xs text-gray-400'>Most Frequent</p>
              <p className='font-semibold text-gray-700 capitalize'>
                {mostFrequent.mood}
              </p>
            </div>
          )}
        </div>

        {/* Line Chart Section with Custom Tooltip */}
        <div className='space-y-4'>
          <h3 className='text-lg font-bold capitalize'>
            {viewMode}ly Mood Chart
          </h3>
          <div className='bg-white border border-gray-100 rounded-3xl p-4 shadow-sm min-h-[220px] flex items-center justify-center'>
            {/* Logic to show "No entries" only if EVERY data point has 0 entries */}
            {trendData.some((d) => d.count > 0) ? (
              <ResponsiveContainer width='100%' height={220}>
                <LineChart data={trendData}>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='#f1f5f9'
                  />
                  <XAxis
                    dataKey='label'
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      const data = (payload as any)?.[0]?.payload;
                      if (active && data) {
                        return (
                          <div className='bg-white p-3 rounded-xl shadow-xl border border-gray-100 flex flex-col items-start min-w-[100px]'>
                            <p className='font-bold text-gray-800 text-sm'>
                              {data.label}
                            </p>
                            <p className='text-[10px] text-gray-400 font-medium'>
                              Positive
                            </p>
                            <p className='text-xs text-gray-500'>
                              {data.count} entries
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
                    stroke='#8b5cf6'
                    strokeWidth={3}
                    dot={false}
                    activeDot={{
                      r: 6,
                      fill: '#8b5cf6',
                      stroke: '#fff',
                      strokeWidth: 2,
                    }}
                    connectNulls={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              /* Display "No entries" when no data exists */
              <div className='text-center py-10'>
                <p className='text-gray-400 text-sm italic'>No entries</p>
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart Section with Hover Effect */}
        <div className='space-y-4'>
          <h3 className='text-lg font-bold'>Top 5 Moods</h3>
          <div className='bg-white border border-gray-100 rounded-3xl p-6 shadow-sm'>
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
                {/* Restored XAxis to show numbers (0, 2, 4, 6, 8) below the bars */}
                <XAxis
                  type='number'
                  domain={[0, 8]}
                  ticks={[0, 2, 4, 6, 8]}
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
                  barSize={32}
                >
                  {moodCounts.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={hoveredBar === index ? '#0891b2' : '#06b6d4'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
