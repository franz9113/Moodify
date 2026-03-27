import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { X, ChevronRight, Loader2 } from 'lucide-react';
import { THEME } from '../utils/theme';
import BodyMap from '@/app/components/custom/BodyMap';

const questions = [
  {
    id: 'whatMadeYouFeel',
    question: 'What made you feel this way?',
    options: [
      'Work/School',
      'Relationships',
      'Health',
      'Financial concerns',
      'Personal achievements',
      'Other',
    ],
  },
  {
    id: 'whatDidYouDo',
    question: 'What did you do in response to that emotion?',
    options: [
      'Talked to someone',
      'Exercised',
      'Took a break',
      'Wrote about it',
      'Did nothing',
      'Other',
    ],
  },
  {
    id: 'was_it_right',
    question: 'Did you think what you were feeling was right?',
    options: ['Yes', 'No', 'Not sure'],
  },
];

export default function Questions() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const editId = state?.editId;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(
    state?.existingAnswers || {},
  );
  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>(
    state?.existingBodyParts || [],
  );

  const [showBodyMap, setShowBodyMap] = useState(false);
  const [customAnswer, setCustomAnswer] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;

    if (answer === 'Other') {
      setShowCustomInput(true);
      return;
    }

    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowCustomInput(false);
      setCustomAnswer('');
    } else {
      setShowBodyMap(true);
    }
  };

  const handleCustomSubmit = () => {
    if (!currentQuestion || !customAnswer.trim()) return;

    const newAnswers = { ...answers, [currentQuestion.id]: customAnswer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowCustomInput(false);
      setCustomAnswer('');
    } else {
      setShowBodyMap(true);
    }
  };

  const handleFinalSubmit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const savedDate =
        state?.selectedDate ||
        localStorage.getItem('currentMoodDate') ||
        new Date().toISOString().split('T')[0];

      // Package data for the next steps
      const entryToSave = {
        id: editId,
        mood: state?.moodType || state?.existingMood || 'Mood',
        emotion: state?.moodSubtype || state?.existingEmotion || '',
        whatMadeYouFeel: answers.whatMadeYouFeel || '',
        whatDidYouDo: answers.whatDidYouDo || '',
        was_it_right: answers.was_it_right || 'Not sure',
        bodyParts: selectedBodyParts || [],
        date: savedDate,
        moodValue: state?.moodValue || 3,
        // Carry over existing journal if editing
        journalText: state?.existingJournal || '',
      };

      localStorage.setItem('currentMoodEntry', JSON.stringify(entryToSave));
      localStorage.removeItem('currentMoodDate');

      // GO TO JOURNAL NEXT
      navigate('/app/journal');
    } catch (err) {
      console.error('Preparation failed', err);
    } finally {
      setLoading(false);
    }
  };

  if (showBodyMap) {
    return (
      <div
        className='flex flex-col min-h-[100dvh]'
        style={{ backgroundColor: THEME.colors.background }}
      >
        <div
          className='px-6 py-4 flex items-center justify-between border-b'
          style={{ borderColor: THEME.colors.neutral }}
        >
          <h1 className='text-lg font-bold'>
            Focus on where your body is reacting to this mood
          </h1>
          <button onClick={() => navigate('/app')} className='p-2'>
            <X size={24} />
          </button>
        </div>

        <div className='flex-1 flex flex-col px-6 py-8 overflow-hidden'>
          <div className='flex-1 flex items-center justify-center py-4'>
            <BodyMap
              onSelect={(part) =>
                setSelectedBodyParts((prev) =>
                  prev.includes(part)
                    ? prev.filter((p) => p !== part)
                    : [...prev, part],
                )
              }
              selectedParts={selectedBodyParts}
            />
          </div>
          <div className='min-h-[64px] flex flex-wrap gap-2 justify-center mt-4 px-4'>
  {selectedBodyParts.map((part) => (
    <span
      key={part}
      className='
        /* Shape Controls */
        min-w-[90px]               /* Forces the oblong shape even for short text */
        h-[25px]                   /* Fixed height for consistent thickness */
        px-4                       /* Horizontal padding for the pill stretch */
        rounded-full               /* Creates the semicircular ends */
        
        /* Layout & Typography */
        flex items-center justify-center
        text-[12px] font-bold border
        transition-all animate-in fade-in zoom-in duration-200
      '
      style={{
        backgroundColor: THEME.colors.primaryLight,
        color: THEME.colors.text,
        borderColor: THEME.colors.primary,
      }}
    >
      {part}
    </span>
  ))}
</div>
        </div>

        <div className='px-6 pb-10 pt-4'>
          <button
            disabled={loading}
            onClick={handleFinalSubmit}
            className='w-full py-5 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-3 transition-all'
            style={{
              backgroundColor: loading
                ? THEME.colors.neutral
                : THEME.colors.primary,
              color: THEME.colors.text,
            }}
          >
            {loading ? <Loader2 className='animate-spin' size={20} /> : null}
            <span>Continue to Journal</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className='min-h-[100dvh] flex flex-col'
      style={{ backgroundColor: THEME.colors.background }}
    >
      <div
        className='px-6 py-4 border-b flex items-center justify-between'
        style={{ borderColor: THEME.colors.neutral }}
      >
        <h1 className='text-xl font-bold'>
          {editId ? 'Edit Entry' : `Question ${currentQuestionIndex + 1} of 3`}
        </h1>
        <button onClick={() => navigate('/app')} className='p-2'>
          <X size={24} />
        </button>
      </div>

      <div className='flex-1 overflow-y-auto px-6 py-8'>
        <h2 className='text-2xl mb-8 font-bold leading-tight'>
          {currentQuestion?.question}
        </h2>
        <div className='space-y-4'>
          {currentQuestion?.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className='w-full py-5 px-5 rounded-2xl border-2 text-left flex items-center justify-between'
              style={{
                backgroundColor:
                  answers[currentQuestion.id] === option
                    ? THEME.colors.primaryLight
                    : THEME.colors.white,
                borderColor:
                  answers[currentQuestion.id] === option
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
              onChange={(e) => setCustomAnswer(e.target.value)}
              className='w-full py-4 px-5 rounded-2xl border-2 outline-none'
              style={{ borderColor: THEME.colors.primary }}
              placeholder='Tell us more...'
              autoFocus
            />
            <button
              onClick={handleCustomSubmit}
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
    </div>
  );
}
