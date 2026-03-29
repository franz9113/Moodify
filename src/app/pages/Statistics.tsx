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
  Cell,
} from 'recharts';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const COLORS = {
  sage: '#D1DBD7',
  offWhite: '#F6F8F2',
  honeyGold: '#F5CB5C',
  text: '#374151',
};

interface MoodData {
  mood: string;
  count: number;
}


const getMoodLabel = (value: number) => {
  if (!value || value === 0) return 'No Entry';
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
      const { data, error } = await supabase
        .from('mood_entries')
        .select('mood, date, mood_value')
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

  const getRangeLabel = () => {
  if (viewMode === 'week') {
    return `${format(startOfWeek(referenceDate), 'MMM d')} - ${format(endOfWeek(referenceDate), 'MMM d')}`;
  } else if (viewMode === 'month') {
    return format(referenceDate, 'MMMM yyyy');
  } else {
    return format(referenceDate, 'yyyy');
  }
};

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
    return allEntries.filter(
      (entry) => entry.date >= startStr && entry.date <= endStr,
    );
  }, [allEntries, viewMode, referenceDate]);

  const moodCounts = useMemo<MoodData[]>(() => {
    const counts: Record<string, number> = {};
    activeEntries.forEach((entry) => {
      const moodName = entry.mood;
      if (moodName) counts[moodName] = (counts[moodName] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([mood, count]) => ({ mood, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [activeEntries]);

 const trendData = useMemo(() => {
  const entryMap: Record<string, { sum: number; count: number }> = {};
  
  allEntries.forEach((e) => {
    // FIX 1: Normalize e.date to YYYY-MM-DD so it matches dateKey exactly
    const d = format(new Date(e.date), 'yyyy-MM-dd'); 
    
    if (!entryMap[d]) entryMap[d] = { sum: 0, count: 0 };
    entryMap[d].sum += e.mood_value || getMoodValue(e.mood);
    entryMap[d].count += 1;
  });

  const start =
    viewMode === 'week' ? startOfWeek(referenceDate) : 
    viewMode === 'year' ? startOfYear(referenceDate) : startOfMonth(referenceDate);
  const end =
    viewMode === 'week' ? endOfWeek(referenceDate) : 
    viewMode === 'year' ? endOfYear(referenceDate) : endOfMonth(referenceDate);

  const interval =
    viewMode === 'year' ? eachMonthOfInterval({ start, end }) : eachDayOfInterval({ start, end });

  return interval.map((point) => {
    const dateKey = viewMode === 'year' ? format(point, 'yyyy-MM') : format(point, 'yyyy-MM-dd');

    if (viewMode === 'year') {
      const monthEntries = Object.entries(entryMap).filter(([date]) => date.startsWith(dateKey));
      const totalSum = monthEntries.reduce((acc, [_, val]) => acc + val.sum, 0);
      const totalCount = monthEntries.reduce((acc, [_, val]) => acc + val.count, 0);
      return {
        label: format(point, 'MMM'),
        mood: totalCount > 0 ? totalSum / totalCount : 0,
        count: totalCount, // Ensure count is passed for year view too
      };
    }

    const stats = entryMap[dateKey] || { sum: 0, count: 0 };
    return {
      label: viewMode === 'month' ? format(point, 'd') : format(point, 'EEE'),
      mood: stats.count > 0 ? stats.sum / stats.count : 0,
      count: stats.count, // FIX 2: Explicitly return count so the Tooltip can see it
    };
  });
}, [allEntries, viewMode, referenceDate]);

  if (loading)
    return (
      <div
        className='flex h-full items-center justify-center'
        style={{ backgroundColor: COLORS.offWhite }}
      >
        <Loader2 className='animate-spin' size={48} color={COLORS.honeyGold} />
      </div>
    );

  return (
    <div
      className='flex flex-col h-full pb-20'
      style={{ backgroundColor: COLORS.offWhite }}
    >
      <div className='px-6 py-4 border-b' style={{ borderColor: COLORS.sage }}>
        <h1 className='text-2xl font-bold' style={{ color: COLORS.text }}>
          Mood Statistics
        </h1>
      </div>

      <div className='flex-1 overflow-y-auto px-6 py-6 space-y-8'>
        {/* Tabs */}
        <div
          className='flex gap-2 p-1 rounded-xl w-fit'
          style={{ backgroundColor: COLORS.sage + '40' }}
        >
          {(['week', 'month', 'year'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className='px-6 py-2 rounded-lg transition-all'
              style={{
                backgroundColor:
                  viewMode === mode ? COLORS.honeyGold : 'transparent',
                color: COLORS.text,
                fontWeight: viewMode === mode ? 'bold' : 'normal',
              }}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Overview Card */}
        <div
          className='rounded-3xl p-8 flex justify-between items-center border shadow-sm'
          style={{ backgroundColor: COLORS.sage, borderColor: COLORS.sage }}
        >
          <div>
            <h3
              className='font-medium mb-2 opacity-70'
              style={{ color: COLORS.text }}
            >
              This {viewMode}
            </h3>
            <p className='text-5xl font-bold' style={{ color: COLORS.text }}>
              {activeEntries?.length ?? 0}
            </p>
            <p
              className='text-sm mt-1 opacity-50'
              style={{ color: COLORS.text }}
            >
              Total Entries
            </p>
          </div>
          {moodCounts.length > 0 && (
            <div className='text-center'>
              <img
                src={getMoodImage(moodCounts[0]?.mood ?? '')}
                alt=''
                className='w-16 h-16 mx-auto mb-2'
              />
              <p className='text-xs opacity-50' style={{ color: COLORS.text }}>
                Most Frequent
              </p>
              <p
                className='font-semibold capitalize'
                style={{ color: COLORS.text }}
              >
                {moodCounts[0]?.mood ?? 'N/A'}
              </p>
            </div>
          )}
        </div>

        {/* Line Chart */}
        {/* Line Chart */}
<div className='space-y-4'>
  <div className='flex items-center justify-between'>
    <h3 className='text-lg font-bold' style={{ color: COLORS.text }}>
      {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}ly Mood Chart
    </h3>
    <div className='flex items-center gap-4'>
      <button onClick={handlePrev} className='p-1 hover:bg-black/5 rounded-full transition-colors'>
        <ChevronLeft size={20} color={COLORS.text} />
      </button>
      <span className='text-sm font-medium' style={{ color: COLORS.text }}>
        {getRangeLabel()}
      </span>
      <button onClick={handleNext} className='p-1 hover:bg-black/5 rounded-full transition-colors'>
        <ChevronRight size={20} color={COLORS.text} />
      </button>
    </div>
  </div>

  <div className='bg-white rounded-3xl p-4 shadow-sm h-[250px]'>
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart
        data={trendData}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray='3 3'
          vertical={false}
          stroke={COLORS.sage}
        />
        <XAxis
          dataKey='label'
          axisLine={{ stroke: COLORS.sage }}
          tick={{ fill: COLORS.text, fontSize: 12 }}
        />
        <YAxis
          domain={[0, 5]}
          ticks={[1, 2, 3, 4, 5]}
          axisLine={{ stroke: COLORS.sage }}
          tick={{ fill: COLORS.text, fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '15px',
            border: 'none',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            padding: '12px',
          }}
          labelFormatter={(label) => `Day ${label}`}
          formatter={(value: number, name: any, props: any) => {
            const count = props.payload.count || 0;
            return [
              <div key='tooltip'>
                <div className='font-bold text-gray-800'>
                  {getMoodLabel(value)}
                </div>
                <div className='text-xs text-gray-500'>
                  {count} {count === 1 ? 'entry' : 'entries'}
                </div>
              </div>,
              null,
            ];
          }}
        />
        <Line
          type='monotone'
          dataKey='mood'
          stroke={COLORS.honeyGold}
          strokeWidth={3}

          dot={{ r: 0 }}
          activeDot={{
            r: 6,
            fill: COLORS.honeyGold,
            stroke: '#fff',
            strokeWidth: 2,
          }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

        {/* Bar Chart */}
        <div className='space-y-4'>
          <h3 className='text-lg font-bold' style={{ color: COLORS.text }}>
            Mood Distribution
          </h3>
          <div className='bg-white rounded-3xl p-6 shadow-sm min-h-[250px]'>
            {moodCounts.length > 0 ? (
              <ResponsiveContainer width='100%' height={250}>
                <BarChart
                  data={moodCounts}
                  layout='vertical'
                  margin={{ left: 10, right: 30 }}
                >
                  <CartesianGrid horizontal={false} stroke={COLORS.sage} />
                  <XAxis
                    type='number'
                    axisLine={{ stroke: COLORS.sage }}
                    tick={{ fill: COLORS.text, fontSize: 12 }}
                  />
                  <YAxis
                    type='category'
                    dataKey='mood'
                    axisLine={{ stroke: COLORS.sage }}
                    tickLine={false}
                    tick={{ fill: COLORS.text, fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey='count' radius={[0, 10, 10, 0]} barSize={24}>
                    {moodCounts.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? COLORS.honeyGold : COLORS.sage}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div
                className='flex items-center justify-center h-40 opacity-40'
                style={{ color: COLORS.text }}
              >
                No records found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
