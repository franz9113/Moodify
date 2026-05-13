import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { TrendDataPoint, getMoodLabel } from '@/app/utils/statisticsCalculations';

const COLORS = {
  sage: '#D1DBD7',
  honeyGold: '#F5CB5C',
  text: '#374151',
};

interface MoodTrendChartProps {
  data: TrendDataPoint[];
  viewMode: 'week' | 'month' | 'year';
  rangeLabel: string;
  onPrevious: () => void;
  onNext: () => void;
}

export default function MoodTrendChart({
  data,
  viewMode,
  rangeLabel,
  onPrevious,
  onNext,
}: MoodTrendChartProps) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-bold' style={{ color: COLORS.text }}>
          {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}ly Mood Chart
        </h3>
        <div className='flex items-center gap-4'>
          <button
            onClick={onPrevious}
            className='p-1 hover:bg-black/5 rounded-full transition-colors'
          >
            <ChevronLeft size={20} color={COLORS.text} />
          </button>
          <span className='text-sm font-medium' style={{ color: COLORS.text }}>
            {rangeLabel}
          </span>
          <button
            onClick={onNext}
            className='p-1 hover:bg-black/5 rounded-full transition-colors'
          >
            <ChevronRight size={20} color={COLORS.text} />
          </button>
        </div>
      </div>

      <div className='bg-white rounded-3xl p-4 shadow-sm h-[250px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={data}
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
  );
}
