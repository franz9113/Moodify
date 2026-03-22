import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMoodEntriesByDate, getAllMoodEntries } from '@/app/utils/storage';
import { getMoodImage, getMoodBgColor } from '@/app/utils/moodConfig';
import {
  format,
  isSameDay,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from 'date-fns';
import logoImage from '@/assets/dea20f2c36e47fcd5e92a36dccb36262d7f3d9e8.png';

export default function Home() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFullCalendar, setIsFullCalendar] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [allEntries, setAllEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [daily, everything] = await Promise.all([
        getMoodEntriesByDate(selectedDateStr),
        getAllMoodEntries(),
      ]);
      setEntries(daily);
      setAllEntries(everything);
      setLoading(false);
    };
    fetchData();
  }, [selectedDateStr]);

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeek(selectedDate), i),
  );
  const monthDays = eachDayOfInterval({
    start: startOfMonth(selectedDate),
    end: endOfMonth(selectedDate),
  });

  const renderDateCircle = (day: Date, isSmall = false) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayEntry = allEntries.find((e) => e.date === dayStr);
    const isSelected = isSameDay(day, selectedDate);
    const hasEntry = !!dayEntry;

    return (
      <button
        key={day.toISOString()}
        onClick={() => {
          setSelectedDate(day);
          setIsFullCalendar(false); // Hide calendar on selection
        }}
        className='flex flex-col items-center outline-none'
      >
        {!isSmall && (
          <span className='text-[10px] text-gray-400 uppercase mb-1 font-bold'>
            {format(day, 'EEE').charAt(0)}
          </span>
        )}
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all
          ${isSelected ? 'border-2 border-cyan-400' : 'border-2 border-transparent'}
          ${hasEntry ? getMoodBgColor(dayEntry.mood_type) : 'bg-gray-50'}
          ${hasEntry ? 'text-white' : 'text-gray-600'}
        `}
        >
          {format(day, 'd')}
        </div>
      </button>
    );
  };

  return (
    <div className='flex flex-col bg-white min-h-full pb-32'>
      <div className='px-6 py-4 flex justify-center bg-white sticky top-0 z-10 border-b border-gray-50'>
        <img src={logoImage} alt='Moodify' className='h-6' />
      </div>

      <div className='px-6 py-6 w-full'>
        <div className='flex items-start gap-3 mb-6'>
          <button
            onClick={() => setIsFullCalendar(!isFullCalendar)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 
              ${isFullCalendar ? 'bg-cyan-500 text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}
          >
            <Calendar size={24} />
          </button>
          <div className='flex-1 grid grid-cols-7 gap-1'>
            {weekDays.map((day) => renderDateCircle(day))}
          </div>
        </div>

        {isFullCalendar && (
          <div className='mb-8 p-6 bg-gray-50/50 rounded-[32px] border border-gray-100'>
            <div className='flex items-center justify-between mb-6 px-2'>
              <ChevronLeft size={20} className='text-gray-300' />
              <h4 className='font-bold text-gray-800'>
                {format(selectedDate, 'MMMM yyyy')}
              </h4>
              <ChevronRight size={20} className='text-gray-300' />
            </div>
            <div className='grid grid-cols-7 gap-y-4 text-center'>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                <span key={d} className='text-[10px] font-bold text-gray-300'>
                  {d}
                </span>
              ))}
              {monthDays.map((day) => renderDateCircle(day, true))}
            </div>
          </div>
        )}

        <h3 className='text-xl font-bold text-gray-800 mb-6'>
          {format(selectedDate, 'MMMM d, yyyy')}
        </h3>

        <div className='space-y-4'>
          {loading ? (
            <p className='text-center text-gray-300 py-10'>Loading...</p>
          ) : entries.length > 0 ? (
            <>
              <p className='text-gray-400 text-sm font-bold mb-2 uppercase tracking-wide'>
                Individual Entries
              </p>
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className='bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex items-center justify-between'
                >
                  <div className='flex items-center gap-4'>
                    <img
                      src={getMoodImage(entry.mood_type)}
                      className='w-12 h-12'
                      alt={entry.mood_type}
                    />
                    <div>
                      <p className='font-bold text-gray-800 text-lg'>
                        {entry.mood_type}
                      </p>
                      <p className='text-sm text-gray-400 font-medium'>
                        {entry.emotion}
                      </p>
                    </div>
                  </div>
                  <div className='text-gray-300 text-sm font-bold'>
                    {entry.created_at
                      ? format(new Date(entry.created_at), 'h:mm a')
                      : 'Now'}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className='text-center text-gray-300 py-20 italic font-medium'>
              No mood entries for this day
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() =>
          navigate('/mood-selection', { state: { date: selectedDateStr } })
        }
        className='fixed bottom-24 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center shadow-xl z-20'
      >
        <Plus size={36} strokeWidth={3} className='text-white' />
      </button>
    </div>
  );
}
