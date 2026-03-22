import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, Plus } from 'lucide-react';
import { getMoodEntriesByDate } from '@/app/utils/storage';
import { getMoodImage } from '@/app/utils/moodConfig';
import { format, isSameDay, startOfWeek, addDays } from 'date-fns';
import logoImage from '@/assets/dea20f2c36e47fcd5e92a36dccb36262d7f3d9e8.png';

export default function Home() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getMoodEntriesByDate(selectedDateStr);
      setEntries(data || []);
      setLoading(false);
    };
    fetchData();
  }, [selectedDateStr]);

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeek(selectedDate), i),
  );

  return (
    <div className='flex flex-col bg-white min-h-full pb-32'>
      <div className='px-6 py-4 flex justify-center bg-white sticky top-0 z-10 border-b border-gray-50'>
        <img src={logoImage} alt='Moodify' className='h-6' />
      </div>

      <div className='px-6 py-6 w-full'>
        {/* Calendar Strip */}
        <div className='flex items-center gap-2 mb-10'>
          <div className='w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400'>
            <Calendar size={20} />
          </div>
          <div className='flex-1 grid grid-cols-7 gap-1'>
            {weekDays.map((day) => (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className='flex flex-col items-center'
              >
                <span className='text-[10px] text-gray-400 uppercase mb-1'>
                  {format(day, 'EEE').charAt(0)}
                </span>
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${
                    isSameDay(day, selectedDate)
                      ? 'bg-cyan-500 text-white shadow-md'
                      : 'text-gray-600'
                  }`}
                >
                  {format(day, 'd')}
                </div>
              </button>
            ))}
          </div>
        </div>

        <h3 className='text-lg font-bold text-gray-800 mb-6'>
          {format(selectedDate, 'MMMM d, yyyy')}
        </h3>

        {entries.length > 0 && (
          <p className='text-gray-500 text-sm font-medium mb-4'>
            Individual Entries
          </p>
        )}

        {/* Entries */}
        <div className='space-y-4'>
          {loading ? (
            <p className='text-center text-gray-300 py-10'>Loading..</p>
          ) : entries.length > 0 ? (
            entries.map((entry) => (
              <div
                key={entry.id}
                className='bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4'
              >
                <div className='flex items-center gap-4'>
                  <img
                    src={getMoodImage(entry.mood_type)}
                    className='w-10 h-10'
                    alt={entry.mood_type}
                  />
                  <div>
                    {/* Mood Title */}
                    <p className='font-medium text-gray-800 leading-tight'>
                      {entry.mood_type}
                    </p>
                    {/* Emotion Subtitle */}
                    <p className='text-sm text-gray-400'>
                      {entry.emotion || 'Peaceful'}
                    </p>
                  </div>
                </div>

                {/* 2. Added Time Created on the Right */}
                <div className='text-gray-400 text-sm font-medium'>
                  {entry.timestamp
                    ? format(new Date(entry.timestamp), 'h:mm a')
                    : '7:02 PM'}
                </div>
              </div>
            ))
          ) : (
            <p className='text-center text-gray-300 py-20 italic'>
              No mood entries for this day
            </p>
          )}
        </div>
      </div>

      {/* PLUS BUTTON */}
      <button
        onClick={() => navigate('/mood-selection')}
        className='fixed bottom-24 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:bg-cyan-600 transition-colors z-10'
      >
        <Plus size={32} strokeWidth={3} className='text-white' />
      </button>
    </div>
  );
}
