import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { X, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { getMoodImage } from '@/app/utils/moodConfig';
import { THEME } from '@/app/utils/theme';
import { CustomButton } from '@/app/components/custom/CustomComponents';

const getRecommendation = (mood: string) => {
  const recommendations: Record<string, string> = {
    Calm: 'Mindfulness Meditation',
    Happy: 'Gratitude Journal',
    Mad: 'Progressive Muscle Relaxation',
    Exhausted: 'Relaxation Techniques',
    Sad: 'Deep Breathing Exercise',
  };
  return recommendations[mood] || 'Mindfulness Meditation';
};

export default function MoodEntry() {
  const navigate = useNavigate();
  const [entry, setEntry] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('viewMoodEntry');
    if (stored) {
      setEntry(JSON.parse(stored));
    }
  }, []);

  if (!entry) {
    return (
      <div
        className='h-full flex items-center justify-center font-bold'
        style={{
          backgroundColor: THEME.colors.background,
          color: THEME.colors.text,
        }}
      >
        Loading...
      </div>
    );
  }

  // Calculate these ONLY after we know 'entry' exists
  const moodName = entry.mood || entry.mood_type;
  const recommendedTool = getRecommendation(moodName);

  return (
    <div
      className='h-full flex flex-col'
      style={{ backgroundColor: THEME.colors.background }}
    >
      {/* Header */}
      <div className='px-6 py-4 flex items-center justify-between bg-white shadow-sm'>
        <h1 className='text-xl font-bold' style={{ color: THEME.colors.text }}>
          Mood Entry
        </h1>
        <CustomButton
          variant='ghost'
          fullWidth={false}
          onClick={() => {
            localStorage.removeItem('viewMoodEntry');
            navigate('/');
          }}
          className='p-2'
        >
          <X size={24} />
        </CustomButton>
      </div>

      <div className='flex-1 overflow-y-auto px-6 py-8'>
        <div className='max-w-md mx-auto space-y-8'>
          {/* Main Mood Header Section */}
          <div className='text-center space-y-3'>
            <p
              className='text-xs font-bold uppercase tracking-widest opacity-50'
              style={{ color: THEME.colors.text }}
            >
              {format(
                new Date(entry.timestamp || entry.created_at),
                "MMMM d, yyyy 'at' h:mm a",
              )}
            </p>
            <div className='flex items-center justify-center'>
              <div className='p-4'>
                <img
                  src={getMoodImage(moodName)}
                  alt={moodName}
                  className='w-24 h-24 object-contain'
                />
              </div>
            </div>
            <h2
              className='text-3xl font-black'
              style={{ color: THEME.colors.text }}
            >
              {moodName}
            </h2>
            <p
              className='text-lg font-medium opacity-70'
              style={{ color: THEME.colors.text }}
            >
              {entry.emotion}
            </p>
          </div>

          {/* Details Section */}
          <div className='space-y-4'>
            {[
              {
                label: 'The Trigger',
                value: entry.whatMadeYouFeel || entry.trigger,
              },
              {
                label: 'Your Response',
                value: entry.whatDidYouDo || entry.action,
              },
              {
                label: 'Reflection',
                value: entry.wasItRight || entry.reflection,
              },
            ].map(
              (item, index) =>
                item.value && (
                  <div
                    key={index}
                    className='bg-white rounded-2xl p-5 border-2 shadow-sm'
                    style={{ borderColor: THEME.colors.neutral }}
                  >
                    <p
                      className='text-[10px] font-black uppercase tracking-widest mb-1 opacity-40'
                      style={{ color: THEME.colors.text }}
                    >
                      {item.label}
                    </p>
                    <p
                      className='font-bold text-base leading-tight'
                      style={{ color: THEME.colors.text }}
                    >
                      {item.value}
                    </p>
                  </div>
                ),
            )}

            {/* Body Mapping Section */}
            {Array.isArray(entry.bodyParts) && entry.bodyParts.length > 0 && (
              <div
                className='bg-white rounded-2xl p-5 border-2 shadow-sm'
                style={{ borderColor: THEME.colors.neutral }}
              >
                <p
                  className='text-[10px] font-black uppercase tracking-widest mb-3 opacity-40'
                  style={{ color: THEME.colors.text }}
                >
                  Physical Sensations
                </p>
                <div className='flex flex-wrap gap-2'>
                  {entry.bodyParts.map((part: string) => (
                    <span
                      key={part}
                      className='px-3 py-1.5 font-bold rounded-lg text-xs'
                      style={{
                        backgroundColor: THEME.colors.primary,
                        color: THEME.colors.text,
                      }}
                    >
                      {part.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation Box - Specifically styled for the Cyan Highlight */}
            <div
              className='rounded-2xl p-6 border-2 shadow-md flex items-start gap-4 animate-in zoom-in duration-500 delay-500'
              style={{
                backgroundColor: `${THEME.colors.primary}20`,
                borderColor: THEME.colors.primary,
              }}
            >
              <Sparkles className='mt-1' style={{ color: THEME.colors.text }} />
              <div>
                <p
                  className='text-[10px] font-black uppercase opacity-60 tracking-wider mb-1'
                  style={{ color: THEME.colors.text }}
                >
                  Recommended tool
                </p>
                <p
                  className='text-lg font-black'
                  leading-tight
                  style={{ color: THEME.colors.text }}
                >
                  {recommendedTool}
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          {/* <div className='pt-4 pb-10'>
            <CustomButton variant='outline' onClick={() => navigate('/')}>
              Back to Dashboard
            </CustomButton>
          </div> */}
        </div>
      </div>
    </div>
  );
}
