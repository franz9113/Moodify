import { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/app/utils/supabaseClient';
import { Loader2 } from 'lucide-react';
import {
  calculateMoodCounts,
  getActiveEntries,
  calculateTrendData,
  getRangeLabel,
} from '@/app/utils/statisticsCalculations';
import { useDateRangeNavigation } from '@/app/hooks/useDateRangeNavigation';
import StatisticsOverview from '@/app/components/Statistics/StatisticsOverview';
import MoodTrendChart from '@/app/components/Statistics/MoodTrendChart';
import MoodDistributionChart from '@/app/components/Statistics/MoodDistributionChart';

const COLORS = {
  offWhite: '#F6F8F2',
  honeyGold: '#F5CB5C',
  text: '#374151',
  sage: '#D1DBD7',
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

  const { handlePrev, handleNext } = useDateRangeNavigation(
    viewMode,
    referenceDate,
    setReferenceDate,
  );

  const activeEntries = useMemo(
    () => getActiveEntries(allEntries, viewMode, referenceDate),
    [allEntries, viewMode, referenceDate],
  );

  const moodCounts = useMemo(
    () => calculateMoodCounts(activeEntries),
    [activeEntries],
  );

  const trendData = useMemo(
    () => calculateTrendData(allEntries, viewMode, referenceDate),
    [allEntries, viewMode, referenceDate],
  );

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
        <StatisticsOverview
          viewMode={viewMode}
          entryCount={activeEntries.length}
          moodCounts={moodCounts}
        />

        {/* Line Chart */}
        <MoodTrendChart
          data={trendData}
          viewMode={viewMode}
          rangeLabel={getRangeLabel(viewMode, referenceDate)}
          onPrevious={handlePrev}
          onNext={handleNext}
        />

        {/* Bar Chart */}
        <div className='space-y-4'>
          <h3 className='text-lg font-bold' style={{ color: COLORS.text }}>
            Mood Distribution
          </h3>
          <MoodDistributionChart data={moodCounts} />
        </div>
      </div>
    </div>
  );
}
