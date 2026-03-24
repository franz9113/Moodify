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
import { THEME } from '@/app/utils/theme';
import { CustomButton } from '@/app/components/custom/CustomComponents';
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

  const [entriesForSelectedDate, setEntriesForSelectedDate] = useState<
    MoodEntry[]
  >([]);
  const [allMoodsMap, setAllMoodsMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const overallMood = getOverallMoodForDate(entriesForSelectedDate);

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
    if (!mood)
      return { title: 'Embrace this peace', description: 'You found balance.' };
    const suggestions: Record<string, { title: string; description: string }> =
      {
        Happy: {
          title: 'Keep the momentum going!',
          description: 'Your positive energy is wonderful.',
        },
        Sad: {
          title: "It's okay to feel sad",
          description: 'Allow yourself to feel these emotions.',
        },
        Mad: {
          title: 'Channel your energy',
          description: 'Anger is a valid emotion.',
        },
        Exhausted: {
          title: 'Rest and recharge',
          description: 'Your body needs rest.',
        },
        Calm: {
          title: 'Embrace this peace',
          description: 'You found balance.',
        },
      };
    return suggestions[mood] || suggestions.Calm;
  };

  return (
    <div
      className='flex flex-col h-full pb-20'
      style={{ backgroundColor: THEME.colors.background }}
    >
      {/* Header */}
      <div className='px-6 py-4 flex justify-center bg-white shadow-sm'>
        <img src={logoImage} alt='Moodify' className='h-12' />
      </div>

      <div className='flex-1 overflow-y-auto'>
        {/* Requirement (d): Daily Positive Comment */}
        <div
          className='px-6 pt-6 text-center italic opacity-80'
          style={{ color: THEME.colors.text }}
        >
          "You're doing great today!"
        </div>

        {/* Date Selector Section */}
        <div className='px-6 py-4'>
          <div className='flex items-center gap-2'>
            <CustomButton
              variant={showFullCalendar ? 'primary' : 'outline'}
              fullWidth={false}
              onClick={() => setShowFullCalendar(!showFullCalendar)}
              className='w-12 h-12 p-0'
            >
              <Calendar size={20} />
            </CustomButton>

            <div className='flex-1 grid grid-cols-7 gap-1'>
              {weekDays.map((day) => (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
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

        {showFullCalendar && (
          <div className='px-6 py-4 border-t border-gray-200 bg-white shadow-inner'>
            <div className='flex items-center justify-between mb-4'>
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
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
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm ${getDayMoodColor(day)} ${isSameDay(day, selectedDate) ? 'ring-2 ring-[#F5CB5C]' : ''} ${!isSameMonth(day, currentMonth) ? 'opacity-30' : ''}`}
                >
                  {format(day, 'd')}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className='px-6 py-4'>
          <h3
            className='text-xl font-bold mb-4'
            style={{ color: THEME.colors.text }}
          >
            {format(selectedDate, 'MMMM d, yyyy')}
          </h3>

          {loading ? (
            <p
              className='text-center py-10'
              style={{ color: THEME.colors.text }}
            >
              Loading...
            </p>
          ) : (
            <>
              {overallMood && (
                <div className='mb-6'>
                  <button
                    onClick={() =>
                      setShowOverallSuggestions(!showOverallSuggestions)
                    }
                    className={`w-full rounded-3xl p-6 flex flex-col items-center gap-3 transition-all shadow-sm border-2 ${getMoodColor(overallMood)}`}
                    style={{ borderColor: THEME.colors.primary }}
                  >
                    <p className='text-sm' style={{ color: THEME.colors.text }}>
                      Your overall mood is{' '}
                      <span className='font-bold'>{overallMood}</span>
                    </p>
                    <img
                      src={getMoodImage(overallMood)}
                      alt={overallMood}
                      className='w-24 h-24'
                    />
                  </button>

                  {showOverallSuggestions && (
                    <div
                      className='mt-3 bg-white border-2 rounded-2xl p-4 shadow-lg animate-in zoom-in-95 duration-200'
                      style={{ borderColor: THEME.colors.primary }}
                    >
                      <div className='flex items-center gap-2 mb-2'>
                        <Sparkles
                          size={20}
                          style={{ color: THEME.colors.primary }}
                        />
                        <h4
                          className='font-bold'
                          style={{ color: THEME.colors.text }}
                        >
                          Mood Regulation
                        </h4>
                      </div>
                      <h5
                        className='font-bold'
                        style={{ color: THEME.colors.text }}
                      >
                        {getSuggestionsForMood(overallMood)?.title}
                      </h5>
                      <p
                        className='text-sm'
                        style={{ color: THEME.colors.text }}
                      >
                        {getSuggestionsForMood(overallMood)?.description}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Individual History List */}
              <div className='space-y-4'>
                <p
                  className='text-xs uppercase font-bold tracking-widest opacity-50'
                  style={{ color: THEME.colors.text }}
                >
                  History
                </p>

                {entriesForSelectedDate.length > 0 ? (
                  entriesForSelectedDate.map((entry) => (
                    /* PASTE THE CUSTOM BUTTON HERE */
                    <CustomButton
                      key={entry.id}
                      variant='outline'
                      onClick={() => {
                        // This saves the specific entry data so MoodEntry.tsx can read it
                        localStorage.setItem(
                          'viewMoodEntry',
                          JSON.stringify(entry),
                        );
                        navigate('/mood-entry');
                      }}
                      className='px-4 py-4 h-auto mb-3'
                    >
                      <div className='flex items-center justify-between w-full'>
                        <div className='flex items-center gap-3'>
                          <img
                            src={getMoodImage(entry.mood_type)}
                            className='w-12 h-12 object-contain'
                            alt={entry.mood_type}
                          />
                          <div className='text-left'>
                            <p
                              className='font-bold text-base'
                              style={{ color: THEME.colors.text }}
                            >
                              {entry.mood_type}
                            </p>
                            <p
                              className='text-sm opacity-70 font-medium'
                              style={{ color: THEME.colors.text }}
                            >
                              {entry.emotion}
                            </p>
                          </div>
                        </div>

                        <div className='text-right'>
                          <span
                            className='text-xs opacity-40 font-bold'
                            style={{ color: THEME.colors.text }}
                          >
                            {entry.created_at
                              ? format(new Date(entry.created_at), 'h:mm a')
                              : ''}
                          </span>
                        </div>
                      </div>
                    </CustomButton>
                  ))
                ) : (
                  <p
                    className='text-center py-10 opacity-50'
                    style={{ color: THEME.colors.text }}
                  >
                    No entries yet.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Floating Plus Button using Custom Style */}
      <div className='fixed bottom-24 left-1/2 -translate-x-1/2'>
        <CustomButton
          variant='primary'
          fullWidth={false}
          onClick={() => {
            localStorage.setItem('currentMoodDate', selectedDateStr);
            navigate('/mood-selection');
          }}
          className='w-16 h-16 rounded-full shadow-xl p-0'
        >
          <Plus size={32} />
        </CustomButton>
      </div>
    </div>
  );
}
