import { useState } from 'react';
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
  getAllMoodsByDate,
  getOverallMoodForDate,
} from '@/app/utils/storage';
import {
  getMoodColor,
  getMoodImage,
  getMoodConfig,
} from '@/app/utils/moodConfig';
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

  const moodsByDate = getAllMoodsByDate();
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const entriesForSelectedDate = getMoodEntriesByDate(selectedDateStr);
  const overallMood = getOverallMoodForDate(selectedDateStr);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startDayOfWeek).fill(null);

  // Get current week days
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getDayMoodColor = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const overallMood = getOverallMoodForDate(dateStr);
    if (!overallMood) return 'bg-gray-100';
    return getMoodColor(overallMood);
  };

  const getSuggestionsForMood = (mood: string) => {
    const suggestions: Record<
      string,
      { title: string; description: string; tool: string }
    > = {
      Happy: {
        title: 'Keep the momentum going!',
        description:
          'Your positive energy is wonderful. Consider sharing your joy with someone or documenting what made you happy today.',
        tool: 'Gratitude Journal',
      },
      Sad: {
        title: "It's okay to feel sad",
        description:
          'Allow yourself to feel these emotions. Try reaching out to a friend or engaging in a comforting activity.',
        tool: 'Deep Breathing Exercise',
      },
      Mad: {
        title: 'Channel your energy',
        description:
          'Anger is a valid emotion. Consider physical activity or journaling to process these feelings constructively.',
        tool: 'Progressive Muscle Relaxation',
      },
      Exhausted: {
        title: 'Rest and recharge',
        description:
          'Your body and mind need rest. Take time to restore your energy through rest and self-care.',
        tool: 'Relaxation Techniques',
      },
      Calm: {
        title: 'Embrace this peace',
        description:
          "You've found a state of balance. Consider what helped you reach this point and how you can maintain it.",
        tool: 'Mindfulness Meditation',
      },
    };
    return suggestions[mood] || suggestions.Calm;
  };

  const handleAddMood = () => {
    localStorage.setItem('currentMoodDate', selectedDateStr);
    navigate('/mood-selection');
  };

  return (
    <div className='flex flex-col h-full pb-20'>
      {/* Header */}
      <div className='px-6 py-4 border-b border-gray-200 flex justify-center'>
        <img src={logoImage} alt='Moodify' className='h-12' />
      </div>

      <div className='flex-1 overflow-y-auto'>
        {/* Week View with Calendar Button */}
        <div className='px-6 py-4'>
          <div className='flex items-center gap-2'>
            {/* Calendar Button */}
            <button
              onClick={() => setShowFullCalendar(!showFullCalendar)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                showFullCalendar
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Calendar size={20} />
            </button>

            {/* Week Days */}
            <div className='flex-1 grid grid-cols-7 gap-1'>
              {weekDays.map((day) => {
                const isSelected = isSameDay(day, selectedDate);
                const moodColor = getDayMoodColor(day);
                const isToday = isSameDay(day, new Date());

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className='relative flex flex-col items-center'
                  >
                    <span className='text-xs text-gray-500 mb-1'>
                      {format(day, 'EEE').charAt(0)}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all ${moodColor} ${
                        isSelected ? 'ring-2 ring-cyan-500 scale-110' : ''
                      } ${isToday && !isSelected ? 'ring-1 ring-gray-300' : ''}`}
                    >
                      {format(day, 'd')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Full Calendar (collapsible) */}
        {showFullCalendar && (
          <div className='px-6 py-4 border-t border-gray-200 bg-gray-50'>
            <div className='flex items-center justify-between mb-4'>
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className='p-2'
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className='text-lg'>{format(currentMonth, 'MMMM yyyy')}</h2>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className='p-2'
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className='grid grid-cols-7 gap-1 mb-2'>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className='text-center text-xs text-gray-500 py-1'
                >
                  {day}
                </div>
              ))}
            </div>

            <div className='grid grid-cols-7 gap-1'>
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className='aspect-square' />
              ))}
              {daysInMonth.map((day) => {
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const moodColor = getDayMoodColor(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => {
                      setSelectedDate(day);
                      setShowFullCalendar(false);
                    }}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                      isSelected ? 'ring-2 ring-cyan-500' : ''
                    } ${!isCurrentMonth ? 'text-gray-300' : ''} ${moodColor}`}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Date Entries */}
        <div className='px-6 py-4'>
          <h3 className='text-lg mb-3'>
            {format(selectedDate, 'MMMM d, yyyy')}
          </h3>

          {/* Overall Mood Section */}
          {overallMood && (
            <div className='mb-4'>
              <button
                onClick={() =>
                  setShowOverallSuggestions(!showOverallSuggestions)
                }
                className={`w-full ${getMoodColor(overallMood)} rounded-2xl p-6 flex flex-col items-center gap-3 transition-all hover:shadow-md`}
              >
                <p className='text-sm text-gray-700'>
                  Your overall mood today is{' '}
                  <span className='font-semibold'>{overallMood}</span>
                </p>
                <img
                  src={getMoodImage(overallMood)}
                  alt={overallMood}
                  className='w-24 h-24'
                />
              </button>
              <p className='text-xs text-gray-500 text-center mt-2'>
                Click for tools and suggestions!
              </p>

              {/* Suggestions Modal */}
              {showOverallSuggestions && (
                <div className='mt-3 bg-white border-2 border-cyan-500 rounded-xl p-4 shadow-lg'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Sparkles size={20} className='text-cyan-500' />
                    <h4 className='font-medium'>Mood Regulation</h4>
                  </div>
                  {(() => {
                    const suggestion = getSuggestionsForMood(overallMood);
                    return (
                      <>
                        <h5 className='font-medium mb-2'>{suggestion.title}</h5>
                        <p className='text-sm text-gray-600 mb-3'>
                          {suggestion.description}
                        </p>
                        <div className='bg-cyan-50 rounded-lg p-3'>
                          <p className='text-xs text-gray-600 mb-1'>
                            Recommended tool:
                          </p>
                          <p className='text-sm font-medium text-cyan-700'>
                            {suggestion.tool}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Individual Mood Entries */}
          {entriesForSelectedDate.length > 0 ? (
            <div className='space-y-3'>
              <p className='text-sm text-gray-600 mb-2'>Individual Entries</p>
              {entriesForSelectedDate.map((entry) => (
                <div
                  key={entry.id}
                  className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow'
                  onClick={() => {
                    localStorage.setItem(
                      'viewMoodEntry',
                      JSON.stringify(entry),
                    );
                    navigate('/mood-entry');
                  }}
                >
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center gap-2'>
                      <img
                        src={getMoodImage(entry.mood)}
                        alt={entry.mood}
                        className='w-10 h-10'
                      />
                      <div>
                        <p className='font-medium'>{entry.mood}</p>
                        <p className='text-sm text-gray-500'>{entry.emotion}</p>
                      </div>
                    </div>
                    <span className='text-xs text-gray-400'>
                      {format(entry.timestamp, 'h:mm a')}
                    </span>
                  </div>
                  {entry.journal && (
                    <p className='text-sm text-gray-600 line-clamp-2'>
                      {entry.journal}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500 text-center py-8'>
              No mood entries for this day
            </p>
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={handleAddMood}
        className='fixed bottom-24 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:bg-cyan-600 transition-colors z-10'
      >
        <Plus size={32} className='text-white' />
      </button>
    </div>
  );
}
