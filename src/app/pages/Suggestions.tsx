import { useNavigate } from 'react-router';
import { saveMoodEntry } from '@/app/utils/storage';
import { Check } from 'lucide-react';

export default function Suggestions() {
  const navigate = useNavigate();

  // Retrieve the data we've been carrying
  const finalData = JSON.parse(
    localStorage.getItem('currentMoodEntry') || '{}',
  );

  const handleFinish = async () => {
    const entryToSave = {
      date: finalData.date, // Saves to the day picked on the calendar
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
      {/* HEADER SECTION */}
      <div className='flex-1 overflow-y-auto flex flex-col items-center pt-12 px-6'>
        <div className='w-16 h-16 bg-[#00D26A] rounded-full flex items-center justify-center mb-6 shadow-sm'>
          <Check className='text-white' size={32} strokeWidth={3} />
        </div>

        <h1 className='text-3xl font-bold text-[#1A1C1E] mb-2'>Entry Saved!</h1>
        <p className='text-gray-500 mb-8'>
          Thank you for sharing your feelings today
        </p>

        {/* PERSONALIZED SUGGESTION CARD */}
        <div className='w-full bg-white rounded-2xl p-6 shadow-sm mb-6 border border-gray-100'>
          <div className='flex items-center gap-2 mb-4'>
            <span className='text-cyan-500'>✦</span>
            <h2 className='font-bold text-[#1A1C1E]'>
              Personalized Suggestion
            </h2>
          </div>
          <h3 className='font-bold text-[#1A1C1E] mb-2'>Embrace this peace</h3>
          <p className='text-gray-600 text-sm mb-4 leading-relaxed'>
            You've found a state of balance. Consider what helped you reach this
            point and how you can maintain it.
          </p>
          <div className='bg-[#F0FBFA] rounded-xl p-4'>
            <p className='text-xs text-gray-500 mb-1'>Recommended tool:</p>
            <p className='text-cyan-700 font-bold'>Mindfulness Meditation</p>
          </div>
        </div>

        {/* ENTRY SUMMARY CARD */}
        <div className='w-full bg-white rounded-2xl p-6 shadow-sm mb-12 border border-gray-100 text-left'>
          <h2 className='font-bold text-[#1A1C1E] mb-4'>Your Entry Summary</h2>

          <p className='text-xs text-gray-400 mb-1'>Mood</p>
          <p className='font-bold text-[#1A1C1E] mb-4'>
            {finalData.mood} - {finalData.emotion}
          </p>

          {finalData.whatMadeYouFeel && (
            <>
              <p className='text-xs text-gray-400 mb-1'>
                What made you feel this way
              </p>
              <p className='font-bold text-[#1A1C1E] mb-4'>
                {finalData.whatMadeYouFeel}
              </p>
            </>
          )}

          {finalData.bodyParts?.length > 0 && (
            <>
              <p className='text-xs text-gray-400 mb-2'>Body sensations</p>
              <div className='flex flex-wrap gap-2'>
                {finalData.bodyParts.map((part: string) => (
                  <span
                    key={part}
                    className='px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs'
                  >
                    {part.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* FOOTER BUTTON */}
      <div className='p-6 bg-white border-t border-gray-100'>
        <button
          onClick={handleFinish}
          className='w-full py-4 bg-[#00B4D8] text-white rounded-xl font-bold text-lg hover:bg-cyan-600 transition-colors'
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
