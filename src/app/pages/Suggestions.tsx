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

export default function Suggestions() {
  const navigate = useNavigate();
  const [moodData, setMoodData] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('currentMoodEntry') || '{}');
    const suggestion = suggestions[data.mood as keyof typeof suggestions];

    if (data && suggestion) {
      const completedEntry: MoodEntry = {
        id: Date.now().toString(),
        date: (localStorage.getItem('currentMoodDate') ||
          new Date().toISOString().split('T')[0]) as string,
        mood: data.mood,
        emotion: data.emotion,
        whatMadeYouFeel: data.whatMadeYouFeel || '',
        whatDidYouDo: data.whatDidYouDo || '',
        wasItRight: data.wasItRight || '',
        bodyParts: data.bodyParts || [],
        journal: data.journal || '',
        suggestion: suggestion?.tool || '',
        timestamp: Date.now(),
      };
      setMoodData({ ...data, suggestion });
      saveMoodEntry(completedEntry);
      setSaved(true);
    }
  }, []);

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
    <div className='h-full flex flex-col bg-gradient-to-b from-cyan-50 to-white'>
      <div className='flex-1 overflow-y-auto px-6 py-8'>
        <div className='max-w-md mx-auto'>
          {saved && (
            <div className='mb-6 flex items-center justify-center'>
              <div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center'>
                <Check size={32} className='text-white' />
              </div>
            </div>
          )}

          <h1 className='text-3xl text-center mb-2'>Entry Saved!</h1>
          <p className='text-gray-600 text-center mb-8'>
            Thank you for sharing your feelings today
          </p>

          <div className='bg-white rounded-2xl p-6 shadow-lg mb-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Sparkles size={24} className='text-cyan-500' />
              <h2 className='text-xl'>Personalized Suggestion</h2>
            </div>

            <h3 className='text-lg font-medium mb-2'>
              {moodData.suggestion.title}
            </h3>
            <p className='text-gray-600 mb-4'>
              {moodData.suggestion.description}
            </p>

            <div className='bg-cyan-50 rounded-lg p-4'>
              <p className='text-sm text-gray-600 mb-1'>Recommended tool:</p>
              <p className='font-medium text-cyan-700'>
                {moodData.suggestion.tool}
              </p>
            </div>
          </div>

          <div className='bg-white rounded-2xl p-6 shadow-lg'>
            <h3 className='text-lg mb-4'>Your Entry Summary</h3>
            <div className='space-y-3'>
              <div>
                <p className='text-sm text-gray-600'>Mood</p>
                <p className='font-medium'>
                  {moodData.mood} - {moodData.emotion}
                </p>
              </div>
              {moodData.whatMadeYouFeel && (
                <div>
                  <p className='text-sm text-gray-600'>
                    What made you feel this way
                  </p>
                  <p className='font-medium'>{moodData.whatMadeYouFeel}</p>
                </div>
              )}
              {moodData.bodyParts && moodData.bodyParts.length > 0 && (
                <div>
                  <p className='text-sm text-gray-600'>Body sensations</p>
                  <div className='flex flex-wrap gap-2 mt-1'>
                    {moodData.bodyParts.map((part: string) => (
                      <span
                        key={part}
                        className='px-2 py-1 bg-gray-100 rounded-full text-sm'
                      >
                        {part.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='px-6 py-4 border-t border-gray-200 bg-white'>
        <button
          onClick={handleFinish}
          className='w-full py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors'
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
