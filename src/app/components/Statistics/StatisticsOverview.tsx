import { getMoodImage } from '@/app/utils/moodConfig';
import { MoodData } from '@/app/utils/statisticsCalculations';

const COLORS = {
  sage: '#D1DBD7',
  honeyGold: '#F5CB5C',
  text: '#374151',
};

interface StatisticsOverviewProps {
  viewMode: 'week' | 'month' | 'year';
  entryCount: number;
  moodCounts: MoodData[];
}

export default function StatisticsOverview({
  viewMode,
  entryCount,
  moodCounts,
}: StatisticsOverviewProps) {
  return (
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
          {entryCount}
        </p>
        <p className='text-sm mt-1 opacity-50' style={{ color: COLORS.text }}>
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
  );
}
