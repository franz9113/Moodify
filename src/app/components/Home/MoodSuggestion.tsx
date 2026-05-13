import { Sparkles } from 'lucide-react';
import { THEME } from '@/app/utils/theme';
import { getMoodColor, getMoodImage } from '@/app/utils/moodConfig';

interface MoodSuggestionProps {
  mood: string;
  isExpanded: boolean;
  onToggle: () => void;
  suggestion: {
    title: string;
    description: string;
  };
}

export default function MoodSuggestion({
  mood,
  isExpanded,
  onToggle,
  suggestion,
}: MoodSuggestionProps) {
  return (
    <div className='mb-6'>
      <button
        onClick={onToggle}
        className={`w-full rounded-3xl p-6 flex flex-col items-center gap-3 transition-all shadow-sm border-2 ${getMoodColor(mood)}`}
        style={{ borderColor: THEME.colors.primary }}
      >
        <p className='text-sm' style={{ color: THEME.colors.text }}>
          Your overall mood is{' '}
          <span className='font-bold'>{mood}</span>
        </p>
        <img
          src={getMoodImage(mood)}
          alt={mood}
          className='w-24 h-24'
        />
      </button>

      {isExpanded && (
        <div
          className='mt-3 bg-white border-2 rounded-2xl p-4 shadow-lg animate-in zoom-in-95'
          style={{ borderColor: THEME.colors.primary }}
        >
          <div className='flex items-center gap-2 mb-2'>
            <Sparkles
              size={20}
              style={{ color: THEME.colors.primary }}
            />
            <h4
              className='font-bold'
              style={{ color: THEME.colors.text }}
            >
              Mood Regulation
            </h4>
          </div>
          <h5
            className='font-bold'
            style={{ color: THEME.colors.text }}
          >
            {suggestion.title}
          </h5>
          <p
            className='text-sm'
            style={{ color: THEME.colors.text }}
          >
            {suggestion.description}
          </p>
        </div>
      )}
    </div>
  );
}
