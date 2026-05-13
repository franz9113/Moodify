import { ChevronRight } from 'lucide-react';
import { THEME } from '@/app/utils/theme';
import { QUESTIONS } from '@/app/utils/moodConfig';

interface QuestionCardProps {
  questionIndex: number;
  question: (typeof QUESTIONS)[0];
  isOptionSelected: (option: string) => boolean;
  onAnswer: (answer: string) => void;
  customAnswer: string;
  showCustomInput: boolean;
  onCustomAnswerChange: (value: string) => void;
  onCustomSubmit: () => void;
}

export default function QuestionCard({
  questionIndex,
  question,
  isOptionSelected,
  onAnswer,
  customAnswer,
  showCustomInput,
  onCustomAnswerChange,
  onCustomSubmit,
}: QuestionCardProps) {
  return (
    <div className='flex-1 overflow-y-auto px-6 py-8'>
      <h2 className='text-2xl mb-8 font-bold leading-tight'>
        {question?.question}
      </h2>
      <div className='space-y-4'>
        {question?.options.map((option) => (
          <button
            key={option}
            onClick={() => onAnswer(option)}
            className='w-full py-5 px-5 rounded-2xl border-2 text-left flex items-center justify-between'
            style={{
              backgroundColor: isOptionSelected(option)
                ? THEME.colors.primaryLight
                : THEME.colors.white,
              borderColor: isOptionSelected(option)
                ? THEME.colors.primary
                : THEME.colors.neutral,
              color: THEME.colors.text,
            }}
          >
            <span className='font-semibold'>{option}</span>
            <ChevronRight size={20} className='opacity-30' />
          </button>
        ))}
      </div>
      {showCustomInput && (
        <div className='mt-8'>
          <input
            type='text'
            value={customAnswer}
            onChange={(e) => onCustomAnswerChange(e.target.value)}
            className='w-full py-4 px-5 rounded-2xl border-2 outline-none'
            style={{ borderColor: THEME.colors.primary }}
            placeholder='Tell us more...'
            autoFocus
          />
          <button
            onClick={onCustomSubmit}
            className='w-full py-4 rounded-2xl font-bold mt-4 shadow-lg'
            style={{
              backgroundColor: THEME.colors.primary,
              color: THEME.colors.text,
            }}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
