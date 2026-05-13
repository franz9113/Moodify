import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { MoodData } from '@/app/utils/statisticsCalculations';

const COLORS = {
  sage: '#D1DBD7',
  honeyGold: '#F5CB5C',
  text: '#374151',
};

interface MoodDistributionChartProps {
  data: MoodData[];
}

export default function MoodDistributionChart({
  data,
}: MoodDistributionChartProps) {
  if (data.length === 0) {
    return (
      <div className='bg-white rounded-3xl p-6 shadow-sm min-h-[250px]'>
        <div
          className='flex items-center justify-center h-40 opacity-40'
          style={{ color: COLORS.text }}
        >
          No records found
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-3xl p-6 shadow-sm min-h-[250px]'>
      <ResponsiveContainer width='100%' height={250}>
        <BarChart
          data={data}
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
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? COLORS.honeyGold : COLORS.sage}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
