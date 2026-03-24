import { useState } from 'react';
import { useNavigate } from 'react-router';
import { X } from 'lucide-react';
import { MOODS } from '@/app/utils/moodConfig';
import { CustomButton } from '@/app/components/custom/CustomComponents';

const emotions = {
  Happy: ['Joyful', 'Excited', 'Content', 'Grateful', 'Proud'],
  Sad: ['Disappointed', 'Lonely', 'Hurt', 'Grief', 'Hopeless'],
  Mad: ['Frustrated', 'Irritated', 'Furious', 'Resentful', 'Annoyed'],
  Exhausted: ['Tired', 'Drained', 'Fatigued', 'Burned Out', 'Weary'],
  Calm: ['Peaceful', 'Relaxed', 'Serene', 'Balanced', 'Centered'],
};

export default function MoodSelection() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

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
        {/* Mood Selection - Large Icon Buttons */}
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
                  className={`p-1 rounded-full transition-all ${
                    selectedMood === mood.name
                      ? 'ring-4 ring-cyan-500'
                      : 'ring-0'
                  }`}
                >
                  <img
                    src={mood.image}
                    alt={mood.name}
                    className='w-14 h-14 object-contain'
                  />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    selectedMood === mood.name
                      ? 'text-cyan-600'
                      : 'text-gray-400'
                  }`}
                >
                  {mood.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Emotion Buttons - Using the new 'selected' variant */}
        {selectedMood && (
          <div className='space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500'>
            <h2 className='text-lg font-semibold mb-4 text-gray-700'>
              What emotion are you experiencing?
            </h2>
            {emotions[selectedMood as keyof typeof emotions].map((emotion) => (
              <CustomButton
                key={emotion}
                // SWITCH: 'selected' for light fill, 'outline' for unselected
                variant={selectedEmotion === emotion ? 'selected' : 'outline'}
                onClick={() => setSelectedEmotion(emotion)}
              >
                {emotion}
              </CustomButton>
            ))}
          </div>
        )}
      </div>

      {/* Primary Action Button (Solid Cyan) */}
      {selectedMood && selectedEmotion && (
        <div className='fixed bottom-0 left-0 right-0 px-6 py-6 bg-white border-t border-gray-50'>
          <CustomButton
            variant='primary'
            onClick={() => navigate('/questions')}
          >
            Continue
          </CustomButton>
        </div>
      )}
    </div>
  );
}
