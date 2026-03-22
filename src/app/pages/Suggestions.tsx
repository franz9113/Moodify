import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Check, Sparkles } from 'lucide-react';
import { saveMoodEntry, type MoodEntry } from '@/app/utils/storage';

const suggestions: Record<
  string,
  { title: string; description: string; tool: string }
> = {
  Happy: {
    title: 'Keep the momentum going!',
    description:
      'Your positive energy is wonderful. Consider sharing your joy with someone.',
    tool: 'Gratitude Journal',
  },
  Sad: {
    title: "It's okay to feel sad",
    description:
      'Allow yourself to feel these emotions. Try reaching out to a friend.',
    tool: 'Deep Breathing Exercise',
  },
  Mad: {
    title: 'Channel your energy',
    description:
      'Anger is a valid emotion. Consider physical activity or journaling.',
    tool: 'Progressive Muscle Relaxation',
  },
  Exhausted: {
    title: 'Rest and recharge',
    description:
      'Your body and mind need rest. Take time to restore your energy.',
    tool: 'Relaxation Techniques',
  },
  Calm: {
    title: 'Embrace this peace',
    description:
      "You've found a state of balance. Consider what helped you reach this point.",
    tool: 'Mindfulness Meditation',
  },
};

export default function Suggestions() {
  const navigate = useNavigate();
  const [moodData, setMoodData] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // 1. Get data from localStorage
    const storedEntry = localStorage.getItem('currentMoodEntry');
    const storedDate = localStorage.getItem('currentMoodDate');

    if (!storedEntry) {
      navigate('/'); // Redirect if there's nothing to save
      return;
    }

    const data = JSON.parse(storedEntry);
    const suggestion =
      suggestions[data.mood as keyof typeof suggestions] ||
      suggestions['Happy'];

    // 2. Build the completed entry (Matching your MoodEntry interface)
    const completedEntry: MoodEntry = {
      // FIX: Use null coalescing ?? and type assertion to solve the TS error
      date: (storedDate ?? new Date().toISOString().split('T')[0]) as string,
      mood_type: data.mood, // Changed from 'mood' to 'mood_type' to match storage.ts
      emotion: data.emotion || '',
      note: data.journal || '', // Mapping journal field to 'note' for database
      whatMadeYouFeel: data.whatMadeYouFeel || '',
      bodyParts: data.bodyParts || [],
    };

    // 3. Save to Supabase
    const performSave = async () => {
      const { error } = await saveMoodEntry(completedEntry);
      if (error) {
        console.error('Failed to save to Supabase:', error.message);
      } else {
        setSaved(true);
      }
    };

    setMoodData({ ...data, suggestion });
    performSave();
  }, [navigate]);

  const handleFinish = () => {
    localStorage.removeItem('currentMoodEntry');
    localStorage.removeItem('currentMoodDate');
    navigate('/');
  };

  if (!moodData) {
    return (
      <div className='h-full flex items-center justify-center'>Loading...</div>
    );
  }

  return (
    <div className='h-full flex flex-col bg-white'>
      <div className='flex-1 overflow-y-auto px-6 py-8'>
        <div className='max-w-md mx-auto'>
          {/* 1. Header with Green Check (Matches 3rd Image) */}
          <div className='mb-8 flex flex-col items-center'>
            <div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-sm'>
              <Check size={32} className='text-white' />
            </div>
            <h1 className='text-3xl font-bold text-center mb-1'>
              Entry Saved!
            </h1>
            <p className='text-gray-500 text-center'>
              Thank you for sharing your feelings today
            </p>
          </div>

          {/* 2. Personalized Suggestion Box (Matches 2nd/3rd Image) */}
          <div className='bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6'>
            <div className='flex items-center gap-2 mb-4 text-cyan-500'>
              <Sparkles size={20} />
              <h2 className='text-lg font-semibold'>Personalized Suggestion</h2>
            </div>

            <h3 className='text-xl font-bold mb-2'>
              {moodData.suggestion.title}
            </h3>
            <p className='text-gray-600 mb-6 leading-relaxed'>
              "{moodData.suggestion.description}"
            </p>

            <div className='bg-cyan-50 rounded-2xl p-4'>
              <p className='text-xs uppercase tracking-wider text-cyan-600 font-bold mb-1'>
                Recommended tool:
              </p>
              <p className='font-bold text-cyan-800 text-lg'>
                {moodData.suggestion.tool}
              </p>
            </div>
          </div>

          {/* 3. Your Entry Summary (Matches 2nd Image) */}
          <div className='bg-gray-50/50 rounded-3xl p-6 border border-gray-100'>
            <h3 className='text-sm font-bold uppercase text-gray-400 mb-4 tracking-widest'>
              Your Entry Summary
            </h3>
            <div className='space-y-4'>
              <div>
                <p className='text-xs text-gray-500 uppercase font-semibold mb-1'>
                  Mood
                </p>
                <p className='text-gray-800 font-medium'>
                  {moodData.mood} - {moodData.emotion}
                </p>
              </div>
              {moodData.whatMadeYouFeel && (
                <div>
                  <p className='text-xs text-gray-500 uppercase font-semibold mb-1'>
                    What made you feel this way
                  </p>
                  <p className='text-gray-800 font-medium'>
                    {moodData.whatMadeYouFeel}
                  </p>
                </div>
              )}
              {moodData.bodyParts?.length > 0 && (
                <div>
                  <p className='text-xs text-gray-500 uppercase font-semibold mb-1'>
                    Body sensations
                  </p>
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {moodData.bodyParts.map((part: string) => (
                      <span
                        key={part}
                        className='px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium'
                      >
                        {part}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Button (Matches 2nd Image) */}
      <div className='px-6 py-6 bg-white'>
        <button
          onClick={handleFinish}
          className='w-full py-4 bg-cyan-500 text-white font-bold rounded-2xl shadow-md hover:bg-cyan-600 transition-all'
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
