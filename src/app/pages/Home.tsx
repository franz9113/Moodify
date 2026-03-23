import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';
import { getMoodEntriesByDate, getAllMoodEntries } from '@/app/utils/storage';
// Removed the non-existent getMoodTextColor
import {
  getMoodImage,
  getMoodBgColor,
  calculateOverallMood,
} from '@/app/utils/moodConfig';
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

  const [showRegulation, setShowRegulation] = useState(false);
  const [selectedEntryForModal, setSelectedEntryForModal] = useState<
    any | null
  >(null);

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
      setShowRegulation(false);
      setSelectedEntryForModal(null);
    };
    fetchData();
  }, [selectedDateStr]);

  // Use your actual logic from moodConfig to get the summary mood name
  const overallMoodName = useMemo(() => {
    return calculateOverallMood(entries.map((e) => e.mood_type));
  }, [entries]);

  // Helper for text colors on the banners to match your design images
  const getBannerTextColor = (mood: string) => {
    const m = mood?.toLowerCase();
    if (m === 'calm') return 'text-emerald-800';
    if (m === 'exhausted') return 'text-purple-900';
    if (m === 'happy') return 'text-amber-900';
    if (m === 'mad') return 'text-rose-900';
    if (m === 'sad') return 'text-cyan-900';
    return 'text-gray-800';
  };

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeek(selectedDate), i),
  );

  return (
    <div className='flex flex-col bg-white min-h-full pb-32 relative font-sans'>
      {/* Logo Header */}
      <div className='px-6 py-4 flex justify-center bg-white sticky top-0 z-10 border-b border-gray-50'>
        <img src={logoImage} alt='Moodify' className='h-6' />
      </div>

      <div className='px-6 py-6 w-full'>
        {/* Weekly Calendar Strip */}
        {/* Weekly Calendar Strip */}
        <div className='flex items-start gap-3 mb-6'>
          <button
            type='button'
            onClick={() => setIsFullCalendar(!isFullCalendar)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 
              ${isFullCalendar ? 'bg-cyan-500 text-white shadow-md' : 'bg-gray-50 text-gray-400'}`}
          >
            <Calendar size={24} strokeWidth={2.5} />
          </button>

          <div className='flex-1 grid grid-cols-7 gap-1'>
            {weekDays.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              const dayStr = format(day, 'yyyy-MM-dd');

              // FIX: Get ALL entries for this day to match the banner color logic
              const daysEntries = allEntries.filter((e) => e.date === dayStr);
              const dayOverallMood =
                daysEntries.length > 0
                  ? calculateOverallMood(daysEntries.map((e) => e.mood_type))
                  : null;

              return (
                <button
                  key={day.toISOString()}
                  type='button'
                  onClick={() => {
                    setSelectedDate(day);
                    setIsFullCalendar(false); // Add this line to close the calendar
                  }}
                  className='flex flex-col items-center group'
                >
                  <span
                    className={`text-[10px] font-black mb-1 uppercase tracking-tighter
                    ${isSelected ? 'text-cyan-500' : 'text-gray-300'}`}
                  >
                    {format(day, 'EEE').charAt(0)}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all
                      ${isSelected ? 'border-4 border-cyan-400 shadow-sm' : 'border-2 border-transparent'}
                      ${dayOverallMood ? getMoodBgColor(dayOverallMood) : 'bg-gray-50'}
                      ${dayOverallMood ? 'text-white' : 'text-gray-400'}
                    `}
                  >
                    {format(day, 'd')}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- Full Calendar View --- */}
        {isFullCalendar && (
          <div className='mb-8 p-6 bg-gray-50 rounded-[32px] border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300'>
            <div className='flex justify-between items-center mb-6'>
              <h4 className='font-black text-gray-800 uppercase text-xs tracking-widest px-2'>
                {format(selectedDate, 'MMMM yyyy')}
              </h4>
              <div className='flex gap-2'>
                <button
                  onClick={() => setSelectedDate(addDays(selectedDate, -30))}
                  className='p-1 text-gray-400 hover:text-cyan-500'
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setSelectedDate(addDays(selectedDate, 30))}
                  className='p-1 text-gray-400 hover:text-cyan-500'
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className='grid grid-cols-7 gap-1 text-center'>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <span
                  key={`${d}-${i}`}
                  className='text-[10px] font-black text-gray-300 mb-2'
                >
                  {d}
                </span>
              ))}
              {/* This generates the current month's dates */}
              {eachDayOfInterval({
                start: startOfMonth(selectedDate),
                end: endOfMonth(selectedDate),
              }).map((day, i) => {
                // 1. You MUST add these lines here so 'isSel' and 'dMood' exist
                const isSel = isSameDay(day, selectedDate);
                const dStr = format(day, 'yyyy-MM-dd');
                const dEntries = allEntries.filter((e) => e.date === dStr);
                const dMood =
                  dEntries.length > 0
                    ? calculateOverallMood(dEntries.map((e) => e.mood_type))
                    : null;

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedDate(day);
                      setIsFullCalendar(false); // 2. This part closes the calendar
                    }}
                    className={`aspect-square flex items-center justify-center text-xs font-bold rounded-xl transition-all
        ${isSel ? 'ring-2 ring-cyan-400 ring-offset-2' : ''}
        ${dMood ? getMoodBgColor(dMood) + ' text-white' : 'text-gray-400 hover:bg-white'}
      `}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <h3 className='text-xl font-black text-gray-800 mb-6'>
          {format(selectedDate, 'MMMM d, yyyy')}
        </h3>

        {/* --- Overall Mood Card --- */}
        {entries.length > 0 && (
          <div className='mb-8'>
            <div
              onClick={() => setShowRegulation(!showRegulation)}
              className={`${getMoodBgColor(overallMoodName)} rounded-[32px] p-8 flex flex-col items-center cursor-pointer transition-all active:scale-95 shadow-sm`}
            >
              <p className={`mb-4 text-center text-md text-gray-600`}>
                Your overall mood today is {overallMoodName}
              </p>
              <img
                src={getMoodImage(overallMoodName)}
                className='w-24 h-24'
                alt={overallMoodName}
              />
            </div>
            <p className='text-center text-gray-400 text-xs mt-3 font-medium'>
              Click for tools and suggestions!
            </p>
          </div>
        )}

        {/* --- Mood Regulation Card --- */}
        {showRegulation && (
          <div className='mb-8 bg-white border-2 border-cyan-400 rounded-[32px] p-6 shadow-lg animate-in fade-in zoom-in duration-300'>
            <div className='flex items-center gap-2 mb-3'>
              <Sparkles className='w-5 h-5 text-cyan-500' />
              <h3 className='text-lg font-black text-gray-800'>
                Mood Regulation
              </h3>
            </div>
            <h4 className='font-bold text-gray-800 mb-1'>Embrace this peace</h4>
            <p className='text-gray-500 text-sm mb-4 leading-relaxed'>
              You've found a state of balance. Consider what helped you reach
              this point and how you can maintain it.
            </p>
            <div className='bg-cyan-50/50 p-4 rounded-2xl border border-cyan-100'>
              <p className='text-cyan-800 text-[10px] font-black uppercase mb-1'>
                Recommended tool:
              </p>
              <p className='text-cyan-600 font-bold text-base'>
                Mindfulness Meditation
              </p>
            </div>
          </div>
        )}

        {/* --- Individual Entries List --- */}
        <div className='space-y-4'>
          <p className='text-gray-400 text-[10px] font-black uppercase tracking-widest'>
            Individual Entries
          </p>
          {loading ? (
            <p className='text-center text-gray-300 py-10'>Loading...</p>
          ) : entries.length > 0 ? (
            entries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => {
                  // 1. Save entry to localStorage so the next page can read it
                  localStorage.setItem('viewMoodEntry', JSON.stringify(entry));
                  // 2. Navigate to the dedicated entry page
                  navigate('/mood-entry');
                }}
                className='bg-white border border-gray-100 rounded-[28px] p-5 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all'
              >
                <div className='flex items-center gap-4'>
                  <img
                    src={getMoodImage(entry.mood_type)}
                    className='w-12 h-12'
                    alt=''
                  />
                  <div>
                    <p className='font-black text-gray-800 text-lg leading-tight'>
                      {entry.mood_type}
                    </p>
                    <p className='text-sm text-gray-400 font-bold'>
                      {entry.emotion}
                    </p>
                  </div>
                </div>
                <div className='text-gray-300 text-[10px] font-black uppercase'>
                  {entry.created_at
                    ? format(new Date(entry.created_at), 'h:mm a')
                    : 'Now'}
                </div>
              </div>
            ))
          ) : (
            <p className='text-center text-gray-300 py-20 italic font-medium'>
              No mood entries for this day
            </p>
          )}
        </div>
      </div>

      {/* --- Mood Entry Detail Modal --- */}
      {selectedEntryForModal && (
        <div className='fixed inset-0 bg-black/40 z-50 flex items-end justify-center'>
          <div className='bg-white w-full max-w-md rounded-t-[40px] p-8 pb-12 shadow-2xl relative animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-8'>
              <h2 className='text-2xl font-black text-gray-800'>Mood Entry</h2>
              <button
                onClick={() => setSelectedEntryForModal(null)}
                className='p-2 bg-gray-50 rounded-full text-gray-400'
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className='flex flex-col items-center mb-10'>
              <img
                src={getMoodImage(selectedEntryForModal.mood_type)}
                className='w-20 h-20 mb-3'
                alt=''
              />
              <p className='text-3xl font-black text-gray-800'>
                {selectedEntryForModal.mood_type}
              </p>
              <p className='text-lg font-bold text-gray-400'>
                {selectedEntryForModal.emotion}
              </p>
            </div>

            <div className='space-y-6'>
              <div>
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2'>
                  What made you feel this way
                </p>
                <div className='bg-gray-50/50 p-4 rounded-2xl font-bold text-gray-800'>
                  {selectedEntryForModal.trigger || 'Not specified'}
                </div>
              </div>
              <div>
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2'>
                  What you did in response
                </p>
                <div className='bg-gray-50/50 p-4 rounded-2xl font-bold text-gray-800'>
                  {selectedEntryForModal.response || 'Not specified'}
                </div>
              </div>
              <div>
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2'>
                  Where you felt it
                </p>
                <div className='flex flex-wrap gap-2'>
                  {selectedEntryForModal.physical_sensations?.map(
                    (s: string) => (
                      <span
                        key={s}
                        className='px-4 py-2 border border-gray-100 rounded-full text-sm font-bold text-gray-700 bg-white'
                      >
                        {s}
                      </span>
                    ),
                  ) || <span className='text-gray-400 font-bold'>None</span>}
                </div>
              </div>

              {/* Specific Logic for Exhausted Recommendation */}
              {selectedEntryForModal.mood_type === 'Exhausted' && (
                <div className='bg-cyan-50/50 p-5 rounded-[24px] border border-cyan-100 mt-4'>
                  <p className='text-cyan-800 text-[10px] font-black uppercase mb-1'>
                    Recommended tool
                  </p>
                  <p className='text-cyan-600 font-black text-lg'>
                    Relaxation Techniques
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Plus Button */}
      <button
        onClick={() =>
          navigate('/mood-selection', { state: { date: selectedDateStr } })
        }
        className='fixed bottom-24 left-1/2 -translate-x-1/2 w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center shadow-xl z-20 transition-transform active:scale-90'
      >
        <Plus size={36} strokeWidth={3} className='text-white' />
      </button>
    </div>
  );
}
