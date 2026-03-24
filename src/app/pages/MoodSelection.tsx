import { useState } from 'react';
import { useNavigate } from 'react-router';
import { X } from 'lucide-react';
import { MOODS } from '@/app/utils/moodConfig';
import { CustomButton } from '@/app/components/custom/CustomComponents';
import { THEME } from '../utils/theme';

const emotions = {
  Happy: ['Joyful', 'Excited', 'Content', 'Grateful', 'Proud'],
  Sad: ['Disappointed', 'Lonely', 'Hurt', 'Grief', 'Hopeless'],
  Mad: ['Frustrated', 'Irritated', 'Furious', 'Resentful', 'Annoyed'],
  Exhausted: ['Tired', 'Drained', 'Fatigued', 'Burned Out', 'Weary'],
  Calm: ['Peaceful', 'Relaxed', 'Serene', 'Balanced', 'Centered'],
};

// Map mood names to numeric values for your database (int4)
const MOOD_VALUES: Record<string, number> = {
  Happy: 5,
  Calm: 4,
  Sad: 2,
  Mad: 1,
  Exhausted: 1,
};

export default function MoodSelection() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selectedMood || !selectedEmotion) return;

    // 1. Check if a date was passed from the Home/Calendar screen
    const savedDate = localStorage.getItem('currentMoodDate');

    // 2. Fallback to today's date if no date was found in storage
    const finalDate = savedDate || new Date().toISOString().split('T')[0];

    const newEntry = {
      mood: selectedMood,
      emotion: selectedEmotion,
      moodValue: MOOD_VALUES[selectedMood] || 3,
      date: finalDate, // This ensures it saves to the day you actually clicked!
    };

    localStorage.setItem('currentMoodEntry', JSON.stringify(newEntry));

    // 3. Clear the temporary date so it doesn't "stick" for future entries
    localStorage.removeItem('currentMoodDate');

    navigate('/questions');
  };

  return (
    <div className='h-screen flex flex-col bg-white'>
      {/* Header */}
      <div className='px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white'>
        <h1 className='text-xl font-bold text-gray-800'>
          How are you feeling?
        </h1>
        <CustomButton
          variant='ghost'
          fullWidth={false}
          onClick={() => navigate('/')}
          className='p-2'
        >
          <X size={24} />
        </CustomButton>
      </div>

      <div className='flex-1 overflow-y-auto px-6 py-6 pb-32'>
        {/* Mood Selection */}
        <div className='mb-10'>
          <h2 className='text-lg font-semibold mb-6 text-gray-700'>
            What are you feeling today?
          </h2>

          <div className='flex justify-between items-center gap-2'>
            {MOODS.map((mood) => (
              <button
                key={mood.name}
                onClick={() => {
                  setSelectedMood(mood.name);
                  setSelectedEmotion(null);
                }}
                className={`flex flex-col items-center gap-2 transition-all flex-1 touch-manipulation active:scale-90 ${
                  selectedMood === mood.name
                    ? 'scale-110'
                    : 'opacity-40 grayscale-[50%]'
                }`}
              >
                <div
                  className={`p-1 rounded-full transition-all`}
                  style={{
                    boxShadow:
                      selectedMood === mood.name
                        ? `0 0 0 4px ${THEME.colors.primary}`
                        : 'none',
                  }}
                >
                  <img
                    src={mood.image}
                    alt={mood.name}
                    className='w-14 h-14 object-contain'
                  />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider`}
                  style={{
                    color:
                      selectedMood === mood.name
                        ? THEME.colors.primary
                        : '#9CA3AF',
                  }}
                >
                  {mood.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Emotion Buttons */}
        {selectedMood && (
          <div className='space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500'>
            <h2 className='text-lg font-semibold mb-4 text-gray-700'>
              What emotion are you experiencing?
            </h2>
            {emotions[selectedMood as keyof typeof emotions].map((emotion) => (
              <CustomButton
                key={emotion}
                variant={selectedEmotion === emotion ? 'selected' : 'outline'}
                onClick={() => setSelectedEmotion(emotion)}
              >
                {emotion}
              </CustomButton>
            ))}
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      {selectedMood && selectedEmotion && (
        <div className='fixed bottom-0 left-0 right-0 px-6 py-6 bg-white border-t border-gray-50'>
          <CustomButton variant='primary' onClick={handleContinue}>
            Continue
          </CustomButton>
        </div>
      )}
    </div>
  );
}
