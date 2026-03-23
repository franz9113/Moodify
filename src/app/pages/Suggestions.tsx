import { useNavigate } from 'react-router';
import { saveMoodEntry } from '@/app/utils/storage';
import { Check } from 'lucide-react';

export default function Suggestions() {
  const navigate = useNavigate();

  // Retrieve the data we've been carrying
  const finalData = JSON.parse(
    localStorage.getItem('currentMoodEntry') || '{}',
  );

  const MOOD_SUGGESTIONS: Record<
    string,
    { title: string; body: string; tool: string }
  > = {
    happy: {
      title: 'Keep the momentum going!',
      body: 'Your positive energy is wonderful. Consider sharing your joy with someone or documenting what made you happy today.',
      tool: 'Gratitude Journal',
    },
    calm: {
      title: 'Embrace this peace',
      body: "You've found a state of balance. Consider what helped you reach this point and how you can maintain it.",
      tool: 'Mindfulness Meditation',
    },
    mad: {
      title: 'Channel your energy',
      body: 'Anger is a valid emotion. Consider physical activity or journaling to process these feelings constructively.',
      tool: 'Progressive Muscle Relaxation',
    },
    sad: {
      title: "It's okay to feel sad",
      body: 'Allow yourself to feel these emotions. Try reaching out to a friend or engaging in a comforting activity.',
      tool: 'Deep Breathing Exercise',
    },
    exhausted: {
      title: 'Rest and recharge',
      body: 'Your body and mind need rest. Take time to restore your energy through rest and self-care.',
      tool: 'Relaxation Techniques',
    },
  };

  // FIX 1: Access the mood property from finalData
  const moodKey = finalData?.mood?.toLowerCase() || 'calm';
  const content = MOOD_SUGGESTIONS[moodKey] || MOOD_SUGGESTIONS['calm'];

  const handleFinish = async () => {
    const entryToSave = {
      date: finalData.date,
      mood_type: finalData.mood,
      emotion: finalData.emotion,
      note: finalData.journal || '',
      whatMadeYouFeel: finalData.whatMadeYouFeel,
      whatDidYouDo: finalData.whatDidYouDo,
      wasItRight: finalData.wasItRight,
      bodyParts: finalData.bodyParts?.join(', '),
    };

    const { error } = await saveMoodEntry(entryToSave);

    if (!error) {
      localStorage.removeItem('currentMoodEntry');
      navigate('/');
    } else {
      alert('Failed to save entry. Check if you added the database columns.');
    }
  };

  return (
    <div className='h-full flex flex-col bg-[#F0FBFA]'>
      <div className='flex-1 overflow-y-auto flex flex-col items-center pt-12 px-6'>
        <div className='w-16 h-16 bg-[#00D26A] rounded-full flex items-center justify-center mb-6 shadow-sm'>
          <Check className='text-white' size={32} strokeWidth={3} />
        </div>

        <h1 className='text-3xl font-bold text-[#1A1C1E] mb-2'>Entry Saved!</h1>
        <p className='text-gray-500 mb-8 text-center'>
          Thank you for sharing your feelings today
        </p>

        {/* PERSONALIZED SUGGESTION CARD */}
        <div className='w-full bg-white rounded-2xl p-6 shadow-sm mb-6 border border-gray-100'>
          <div className='flex items-center gap-2 mb-4'>
            <span className='text-cyan-500 text-xl'>✦</span>
            <h2 className='font-bold text-[#1A1C1E]'>
              Personalized Suggestion
            </h2>
          </div>

          <h3 className='font-bold text-[#1A1C1E] mb-2'>{content?.title}</h3>
          <p className='text-gray-600 text-sm mb-4 leading-relaxed'>
            {content?.body}
          </p>

          <div className='bg-[#F0FBFA] rounded-xl p-4'>
            <p className='text-xs text-gray-500 mb-1'>Recommended tool:</p>
            {/* FIX 3: Use content.tool */}
            <p className='text-cyan-700 font-bold'>{content?.tool}</p>
          </div>
        </div>

        {/* ENTRY SUMMARY CARD */}
        <div className='w-full bg-white rounded-2xl p-6 shadow-sm mb-12 border border-gray-100 text-left'>
          <h2 className='font-bold text-[#1A1C1E] mb-4'>Your Entry Summary</h2>

          <p className='text-xs text-gray-400 mb-1 font-bold uppercase tracking-wider'>
            Mood
          </p>
          <p className='font-bold text-[#1A1C1E] mb-4'>
            {finalData.mood} —{' '}
            <span className='text-gray-500'>{finalData.emotion}</span>
          </p>

          {finalData.whatMadeYouFeel && (
            <>
              <p className='text-xs text-gray-400 mb-1 font-bold uppercase tracking-wider'>
                What made you feel this way
              </p>
              <p className='font-bold text-[#1A1C1E] mb-4'>
                {finalData.whatMadeYouFeel}
              </p>
            </>
          )}

          {finalData.bodyParts?.length > 0 && (
            <>
              <p className='text-xs text-gray-400 mb-2 font-bold uppercase tracking-wider'>
                Body sensations
              </p>
              <div className='flex flex-wrap gap-2'>
                {finalData.bodyParts.map((part: string) => (
                  <span
                    key={part}
                    className='px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-bold border border-gray-100 shadow-sm'
                  >
                    {part.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className='p-6 bg-white border-t border-gray-100'>
        <button
          onClick={handleFinish}
          className='w-full py-4 bg-[#00B4D8] text-white rounded-xl font-black text-lg hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-100'
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
