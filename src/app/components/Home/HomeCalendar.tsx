import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  addDays,
} from 'date-fns';
import { THEME } from '@/app/utils/theme';
import { getMoodColor } from '@/app/utils/moodConfig';
import { CustomButton } from '@/app/components/custom/CustomComponents';

interface HomeCalendarProps {
  currentMonth: Date;
  selectedDate: Date;
  allMoodsMap: Record<string, string>;
  onMonthChange: (date: Date) => void;
  onDateSelect: (date: Date) => void;
}

export default function HomeCalendar({
  currentMonth,
  selectedDate,
  allMoodsMap,
  onMonthChange,
  onDateSelect,
}: HomeCalendarProps) {
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startDayOfWeek).fill(null);
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getDayMoodColor = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const moodType = allMoodsMap[dateStr];
    return moodType ? getMoodColor(moodType) : 'bg-gray-100';
  };

  return (
    <>
      {/* Date Selector (Top Strip) */}
      <div className='p-4'>
        <div className='flex items-center gap-2'>
          <CustomButton
            variant={showFullCalendar ? 'primary' : 'outline'}
            fullWidth={false}
            onClick={() => setShowFullCalendar(!showFullCalendar)}
            className='w-12 h-12 p-0'
          >
            <Calendar size={15} />
          </CustomButton>

          <div className='flex-1 grid grid-cols-7 gap-2'>
            {weekDays.map((day) => (
              <button
                key={day.toISOString()}
                onClick={() => onDateSelect(day)}
                className='relative flex flex-col items-center'
              >
                <span
                  className='text-xs mb-1'
                  style={{ color: THEME.colors.text }}
                >
                  {format(day, 'EEE').charAt(0)}
                </span>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all ${getDayMoodColor(day)} ${isSameDay(day, selectedDate) ? 'ring-2 ring-[#F5CB5C] scale-110' : ''}`}
                >
                  {format(day, 'd')}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Full Month Calendar View */}
      {showFullCalendar && (
        <div className='px-6 py-4 border-t border-gray-200 bg-white shadow-inner'>
          <div className='flex items-center justify-between mb-4'>
            <button
              onClick={() => onMonthChange(subMonths(currentMonth, 1))}
            >
              <ChevronLeft />
            </button>
            <h2
              className='text-lg font-bold'
              style={{ color: THEME.colors.text }}
            >
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => onMonthChange(addMonths(currentMonth, 1))}
            >
              <ChevronRight />
            </button>
          </div>
          <div className='grid grid-cols-7 gap-1'>
            {emptyDays.map((_, i) => (
              <div key={i} />
            ))}
            {daysInMonth.map((day) => (
              <button
                key={day.toISOString()}
                onClick={() => {
                  onDateSelect(day);
                  setShowFullCalendar(false);
                }}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm ${getDayMoodColor(day)} ${isSameDay(day, selectedDate) ? 'ring-2 ring-[#F5CB5C]' : ''} ${!isSameMonth(day, currentMonth) ? 'opacity-30' : ''}`}
              >
                {format(day, 'd')}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
