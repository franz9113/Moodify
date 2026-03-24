import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  getMoodEntriesByDate,
  getAllMoodEntries,
  getOverallMoodForDate,
  formatMoodsByDate,
  type MoodEntry,
} from '@/app/utils/storage';
import { getMoodColor, getMoodImage } from '@/app/utils/moodConfig';
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
import logoImage from '@/assets/dea20f2c36e47fcd5e92a36dccb36262d7f3d9e8.png';

export default function Home() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [showOverallSuggestions, setShowOverallSuggestions] = useState(false);

  // Data State
  const [entriesForSelectedDate, setEntriesForSelectedDate] = useState<
    MoodEntry[]
  >([]);
  const [allMoodsMap, setAllMoodsMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const overallMood = getOverallMoodForDate(entriesForSelectedDate);

  // Fetch Data from Supabase
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [dayEntries, allEntries] = await Promise.all([
        getMoodEntriesByDate(selectedDateStr),
        getAllMoodEntries(),
      ]);

      setEntriesForSelectedDate(dayEntries);
      setAllMoodsMap(formatMoodsByDate(allEntries));
      setLoading(false);
    };
    loadData();
  }, [selectedDateStr]);

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

  const getSuggestionsForMood = (mood: string | null) => {
    // 1. If mood is null, return the Calm suggestion immediately
    if (!mood)
      return {
        title: 'Embrace this peace',
        description: 'You found balance.',
        tool: 'Meditation',
      };

    const suggestions: Record<
      string,
      { title: string; description: string; tool: string }
    > = {
      Happy: {
        title: 'Keep the momentum going!',
        description: 'Your positive energy is wonderful.',
        tool: 'Gratitude Journal',
      },
      Sad: {
        title: "It's okay to feel sad",
        description: 'Allow yourself to feel these emotions.',
        tool: 'Deep Breathing',
      },
      Mad: {
        title: 'Channel your energy',
        description: 'Anger is a valid emotion.',
        tool: 'Muscle Relaxation',
      },
      Exhausted: {
        title: 'Rest and recharge',
        description: 'Your body needs rest.',
        tool: 'Relaxation',
      },
      Calm: {
        title: 'Embrace this peace',
        description: 'You found balance.',
        tool: 'Meditation',
      },
    };

    // 2. Use a fallback here just in case the mood string doesn't match a key
    return suggestions[mood] || suggestions.Calm;
  };

  return (
    <div className='flex flex-col h-full pb-20'>
      <div className='px-6 py-4 border-b border-gray-200 flex justify-center'>
        <img src={logoImage} alt='Moodify' className='h-12' />
      </div>

      <div className='flex-1 overflow-y-auto'>
        <div className='px-6 py-4'>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setShowFullCalendar(!showFullCalendar)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${showFullCalendar ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <Calendar size={20} />
            </button>

            <div className='flex-1 grid grid-cols-7 gap-1'>
              {weekDays.map((day) => (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className='relative flex flex-col items-center'
                >
                  <span className='text-xs text-gray-500 mb-1'>
                    {format(day, 'EEE').charAt(0)}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all ${getDayMoodColor(day)} ${isSameDay(day, selectedDate) ? 'ring-2 ring-cyan-500 scale-110' : ''}`}
                  >
                    {format(day, 'd')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {showFullCalendar && (
          <div className='px-6 py-4 border-t border-gray-200 bg-gray-50'>
            <div className='flex items-center justify-between mb-4'>
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft />
              </button>
              <h2 className='text-lg font-medium'>
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
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
                    setSelectedDate(day);
                    setShowFullCalendar(false);
                  }}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm ${getDayMoodColor(day)} ${isSameDay(day, selectedDate) ? 'ring-2 ring-cyan-500' : ''} ${!isSameMonth(day, currentMonth) ? 'opacity-30' : ''}`}
                >
                  {format(day, 'd')}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className='px-6 py-4'>
          <h3 className='text-lg mb-3'>
            {format(selectedDate, 'MMMM d, yyyy')}
          </h3>

          {loading ? (
            <p className='text-center text-gray-400 py-10'>Loading...</p>
          ) : (
            <>
              {overallMood && (
                <div className='mb-4'>
                  <button
                    onClick={() =>
                      setShowOverallSuggestions(!showOverallSuggestions)
                    }
                    className={`w-full ${getMoodColor(overallMood)} rounded-2xl p-6 flex flex-col items-center gap-3 transition-all`}
                  >
                    <p className='text-sm'>
                      Your overall mood is{' '}
                      <span className='font-semibold'>{overallMood}</span>
                    </p>
                    <img
                      src={getMoodImage(overallMood)}
                      alt={overallMood}
                      className='w-24 h-24'
                    />
                  </button>
                  {showOverallSuggestions && (
                    <div className='mt-3 bg-white border-2 border-cyan-500 rounded-xl p-4 shadow-lg'>
                      <div className='flex items-center gap-2 mb-3'>
                        <Sparkles size={20} className='text-cyan-500' />
                        <h4 className='font-medium'>Mood Regulation</h4>
                      </div>
                      <h5 className='font-medium'>
                        {getSuggestionsForMood(overallMood)?.title}
                      </h5>
                      <p className='text-sm text-gray-600'>
                        {getSuggestionsForMood(overallMood)?.description}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className='space-y-3'>
                <p className='text-sm text-gray-600'>Individual Entries</p>
                {entriesForSelectedDate.length > 0 ? (
                  entriesForSelectedDate.map((entry) => (
                    <div
                      key={entry.id}
                      className='bg-white border rounded-lg p-4 shadow-sm'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <img
                            src={getMoodImage(entry.mood_type)}
                            className='w-10 h-10'
                            alt=''
                          />
                          <div>
                            <p className='font-medium'>{entry.mood_type}</p>
                            <p className='text-sm text-gray-500'>
                              {entry.emotion}
                            </p>
                          </div>
                        </div>
                        <span className='text-xs text-gray-400'>
                          {entry.created_at
                            ? format(new Date(entry.created_at), 'h:mm a')
                            : ''}
                        </span>
                      </div>
                      {entry.note && (
                        <p className='text-sm text-gray-600 mt-2'>
                          {entry.note}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className='text-gray-500 text-center py-8'>
                    No entries yet.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <button
        onClick={() => {
          localStorage.setItem('currentMoodDate', selectedDateStr); // <--- HERE
          navigate('/mood-selection');
        }}
        className='fixed bottom-24 left-1/2 -translate-x-1/2 w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg text-white'
      >
        <Plus size={32} />
      </button>
    </div>
  );
}
