import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Bell } from 'lucide-react';
import { supabase } from '@/app/utils/supabaseClient';
import { getMoodImage } from '@/app/utils/moodConfig';
import { calculateOverallMoodName, getSuggestionsForMood } from '@/app/utils/moodCalculations';
import { THEME } from '@/app/utils/theme';
import { CustomButton } from '@/app/components/custom/CustomComponents';
import HomeCalendar from '@/app/components/Home/HomeCalendar';
import MoodSuggestion from '@/app/components/Home/MoodSuggestion';
import { format } from 'date-fns';
import logoImage from '@/assets/dea20f2c36e47fcd5e92a36dccb36262d7f3d9e8.png';

export default function Home() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showOverallSuggestions, setShowOverallSuggestions] = useState(false);
  const [entriesForSelectedDate, setEntriesForSelectedDate] = useState<any[]>([]);
  const [allMoodsMap, setAllMoodsMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: allData, error: allError } = await supabase
          .from('mood_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (allError) throw allError;

        // Group entries by date
        const groupedByDate: Record<string, any[]> = {};
        allData?.forEach((entry) => {
          const dateKey = entry.date;
          if (!dateKey) return; // Skip if date is somehow missing

          if (!groupedByDate[dateKey]) {
            groupedByDate[dateKey] = [];
          }
          groupedByDate[dateKey].push(entry);
        });

        // Create a map of Date -> Calculated Overall Mood
        const moodMap: Record<string, string> = {};
        Object.keys(groupedByDate).forEach((date) => {
          // FIX: Added '?? []' to handle potential undefined values
          const calculatedMood = calculateOverallMoodName(
            groupedByDate[date] ?? [],
          );
          if (calculatedMood) moodMap[date] = calculatedMood;
        });

        setAllMoodsMap(moodMap);
        // FIX: Added '?? []' here as well for safety
        setEntriesForSelectedDate(groupedByDate[selectedDateStr] ?? []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedDateStr]);

  // Overall mood for the currently selected day view
  const overallMood = useMemo(
    () => calculateOverallMoodName(entriesForSelectedDate),
    [entriesForSelectedDate],
  );



  return (
    <div
      className='flex flex-col h-full pb-20'
      style={{ backgroundColor: THEME.colors.background }}
    >
      <div className='px-6 py-2 flex items-center justify-between bg-white shadow-sm relative'>
  <div className="w-10" /> 

  <img src={logoImage} alt='Moodify' className='h-24' />

  {/* Notification Bell Container */}
  <button 
    className="relative p-2"
    onClick={() => navigate('/app/notifications')}
  >
    <Bell size={24} style={{ color: THEME.colors.text }} />

    <span className="absolute top-1 right-1 flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
    </span>
  </button>
</div>

      <div className='flex-1 overflow-y-auto'>
        <HomeCalendar
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          allMoodsMap={allMoodsMap}
          onMonthChange={setCurrentMonth}
          onDateSelect={setSelectedDate}
        />

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
                <MoodSuggestion
                  mood={overallMood}
                  isExpanded={showOverallSuggestions}
                  onToggle={() => setShowOverallSuggestions(!showOverallSuggestions)}
                  suggestion={getSuggestionsForMood(overallMood)}
                />
              )}

              <div className='space-y-4'>
                {entriesForSelectedDate.length > 0 && (
                  <p
                    className='text-xs uppercase font-bold tracking-widest opacity-50'
                    style={{ color: THEME.colors.text }}
                  >
                    Individual Entries
                  </p>
                )}

                {entriesForSelectedDate.length > 0 ? (
                  entriesForSelectedDate.map((entry) => (
                    <CustomButton
                      key={entry.id}
                      variant='outline'
                      onClick={() => {
                        localStorage.setItem(
                          'viewMoodEntry',
                          JSON.stringify(entry),
                        );
                        navigate('/app/mood-entry');
                      }}
                      className='px-4 py-4 h-auto mb-3'
                    >
                      <div className='flex items-center justify-between w-full'>
                        <div className='flex items-center gap-3'>
                          <img
                            src={getMoodImage(entry.mood)}
                            className='w-12 h-12 object-contain'
                            alt={entry.mood}
                          />
                          <div className='text-left'>
                            <p
                              className='font-bold text-base'
                              style={{ color: THEME.colors.text }}
                            >
                              {entry.mood}
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
                    No mood entries for this day
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className='fixed bottom-24 left-1/2 -translate-x-1/2'>
        <CustomButton
          variant='primary'
          fullWidth={false}
          onClick={() => {
            localStorage.setItem('currentMoodDate', selectedDateStr);
            navigate('/app/mood-selection', {
              state: { selectedDate: selectedDateStr },
            });
          }}
          className='w-16 h-16 rounded-full shadow-xl p-0'
        >
          <Plus size={32} />
        </CustomButton>
      </div>
    </div>
  );
}
