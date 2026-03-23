import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { getMoodImage } from '@/app/utils/moodConfig';

const getRecommendation = (mood: string) => {
  const m = mood?.toLowerCase();
  if (m === 'calm')
    return {
      title: 'Mindfulness Meditation',
      description: 'Maintain this balance with a brief breathing exercise.',
    };
  if (m === 'happy')
    return {
      title: 'Gratitude Journaling',
      description: 'Write down what made this moment special.',
    };
  if (m === 'mad')
    return {
      title: 'Progressive Muscle Relaxation',
      description: 'Try a quick walk or intense stretching to release energy.',
    };
  if (m === 'sad')
    return {
      title: 'Deep Breathing Exercise',
      description:
        'Take a moment to acknowledge your feelings without judgment.',
    };
  if (m === 'exhausted')
    return {
      title: 'Relaxation Techniques',
      description: 'Try a body scan or a short power nap.',
    };
  return {
    title: 'Reflection',
    description: 'Check in with yourself again in an hour.',
  };
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
      <div className='h-screen flex items-center justify-center font-bold text-gray-400'>
        Loading...
      </div>
    );
  }

  return (
    <div className='h-screen flex flex-col bg-white font-sans'>
      <div className='px-8 py-6 flex items-center justify-between sticky top-0 bg-white z-10'>
        <h1 className='text-2xl font-black text-gray-800'>Mood Entry</h1>
        <button
          onClick={() => {
            localStorage.removeItem('viewMoodEntry');
            navigate('/');
          }}
          className='p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors'
        >
          <X size={24} strokeWidth={3} />
        </button>
      </div>

      <div className='flex-1 overflow-y-auto px-8 pb-12'>
        <div className='max-w-md mx-auto space-y-10'>
          {/* Mood Emoji & Title Section */}
          <div className='text-center mt-4 mb-2'>
            <p className='text-sm font-bold text-gray-400'>
              {entry.created_at
                ? format(new Date(entry.created_at), "MMMM d, yyyy 'at' h:mm a")
                : 'March 23, 2026 at 6:09 PM'}
            </p>
          </div>
          <div className='text-center pt-4'>
            <div className='flex flex-col items-center mb-10'>
              <img
                src={getMoodImage(entry.mood || entry.mood_type)}
                alt={entry.mood}
                className='w-24 h-24 drop-shadow-sm'
              />
            </div>
            <h2 className='text-4xl font-black text-gray-800 tracking-tight'>
              {entry.mood || entry.mood_type}
            </h2>
            <p className='text-xl font-bold text-gray-400 mt-1'>
              {entry.emotion}
            </p>
          </div>

          {/* Details Section */}
          <div className='space-y-8'>
            <div className='space-y-2'>
              <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>
                What made you feel this way
              </p>
              <div className='bg-gray-50/80 p-5 rounded-[24px] border border-gray-100/50'>
                <p className='font-bold text-gray-800 leading-relaxed'>
                  {entry.whatMadeYouFeel ||
                    entry.trigger ||
                    'No trigger specified'}
                </p>
              </div>
            </div>

            {/* Response Block */}
            <div className='space-y-2'>
              <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>
                What you did in response
              </p>
              <div className='bg-gray-50/80 p-5 rounded-[24px] border border-gray-100/50'>
                <p className='font-bold text-gray-800 leading-relaxed'>
                  {entry.whatDidYouDo ||
                    entry.response ||
                    'No response recorded'}
                </p>
              </div>
            </div>
            {/* New Reflection Block - "Did you think it was right?" */}
            <div className='space-y-2'>
              <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>
                Did you think it was right?
              </p>
              <div className='bg-gray-50/80 p-5 rounded-[24px] border border-gray-100/50'>
                <p className='font-bold text-gray-800 leading-relaxed'>
                  {entry.was_right || entry.reflection || 'Not sure'}
                </p>
              </div>
            </div>

            {/* Body Sensations */}
            <div className='space-y-3'>
              <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>
                Where you felt it
              </p>
              <div className='flex flex-wrap gap-2'>
                {(() => {
                  const rawData =
                    entry.bodyParts || entry.physical_sensations || [];
                  const sensationsArray =
                    typeof rawData === 'string'
                      ? rawData.split(',').map((s) => s.trim())
                      : Array.isArray(rawData)
                        ? rawData
                        : [];

                  return sensationsArray.length > 0 ? (
                    sensationsArray.map((part: string) => (
                      <span
                        key={part}
                        className='px-5 py-2.5 bg-white rounded-full text-sm font-bold text-gray-700 border border-gray-100 shadow-sm'
                      >
                        {part.charAt(0).toUpperCase() +
                          part.slice(1).replace('-', ' ')}
                      </span>
                    ))
                  ) : (
                    <span className='text-gray-400 font-bold text-sm italic'>
                      No sensations recorded
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Journal Block */}
            {(entry.journal || entry.note) && (
              <div className='space-y-2'>
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>
                  Journal
                </p>
                <div className='bg-gray-50/80 p-5 rounded-[24px] border border-gray-100/50'>
                  <p className='font-medium text-gray-700 whitespace-pre-wrap leading-relaxed'>
                    {entry.journal || entry.note}
                  </p>
                </div>
              </div>
            )}

            {/* Recommendation Tool Block - Matching the Cyan Box */}
            <div className='bg-cyan-50/50 rounded-[32px] p-6 border border-cyan-100 mt-10'>
              <p className='text-[10px] font-black text-cyan-800 uppercase tracking-widest mb-2'>
                Recommended tool
              </p>
              <h4 className='text-xl font-black text-cyan-600 mb-1'>
                {getRecommendation(entry.mood || entry.mood_type).title}
              </h4>
              {/* <p className='text-sm font-medium text-cyan-700/70'>
                {getRecommendation(entry.mood || entry.mood_type).description}
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
