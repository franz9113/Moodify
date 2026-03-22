import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { X, ChevronRight } from 'lucide-react';

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
    id: 'wasItRight',
    question: 'Did you think what you were feeling was right?',
    options: ['Yes', 'No', 'Not sure'],
  },
];

export default function Questions() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([]);
  const [showBodyMap, setShowBodyMap] = useState(false);
  const [customAnswer, setCustomAnswer] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

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
    if (!currentQuestion) return; // added this to avoid returning undefined variable
    if (customAnswer.trim()) {
      const newAnswers = { ...answers, [currentQuestion.id]: customAnswer };
      setAnswers(newAnswers);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowCustomInput(false);
        setCustomAnswer('');
      } else {
        setShowBodyMap(true);
      }
    }
  };

  const handleBodyPartClick = (part: string) => {
    if (selectedBodyParts.includes(part)) {
      setSelectedBodyParts(selectedBodyParts.filter((p) => p !== part));
    } else {
      setSelectedBodyParts([...selectedBodyParts, part]);
    }
  };

  const handleContinue = () => {
    const existingData = JSON.parse(
      localStorage.getItem('currentMoodEntry') || '{}',
    );
    const updatedData = {
      ...existingData,
      ...answers,
      bodyParts: selectedBodyParts,
    };
    localStorage.setItem('currentMoodEntry', JSON.stringify(updatedData));
    navigate('/journal');
  };

  if (showBodyMap) {
    return (
      <div className='h-full flex flex-col bg-white'>
        <div className='px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
          <h1 className='text-xl'>Where did you feel that emotion?</h1>
          <button onClick={() => navigate('/')} className='p-2'>
            <X size={24} />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto px-6 py-6'>
          <p className='text-gray-600 mb-6'>
            Tap on the body parts where you felt the emotion
          </p>

          <div className='relative max-w-xs mx-auto'>
            <svg viewBox='0 0 200 400' className='w-full'>
              {/* Head */}
              <ellipse
                cx='100'
                cy='50'
                rx='40'
                ry='50'
                className={`cursor-pointer transition-all ${
                  selectedBodyParts.includes('head')
                    ? 'fill-cyan-300'
                    : 'fill-gray-200'
                } hover:fill-cyan-200`}
                onClick={() => handleBodyPartClick('head')}
              />

              {/* Chest */}
              <rect
                x='60'
                y='100'
                width='80'
                height='80'
                rx='10'
                className={`cursor-pointer transition-all ${
                  selectedBodyParts.includes('chest')
                    ? 'fill-cyan-300'
                    : 'fill-gray-200'
                } hover:fill-cyan-200`}
                onClick={() => handleBodyPartClick('chest')}
              />

              {/* Stomach */}
              <rect
                x='65'
                y='180'
                width='70'
                height='60'
                rx='10'
                className={`cursor-pointer transition-all ${
                  selectedBodyParts.includes('stomach')
                    ? 'fill-cyan-300'
                    : 'fill-gray-200'
                } hover:fill-cyan-200`}
                onClick={() => handleBodyPartClick('stomach')}
              />

              {/* Arms */}
              <rect
                x='20'
                y='100'
                width='30'
                height='100'
                rx='15'
                className={`cursor-pointer transition-all ${
                  selectedBodyParts.includes('left-arm')
                    ? 'fill-cyan-300'
                    : 'fill-gray-200'
                } hover:fill-cyan-200`}
                onClick={() => handleBodyPartClick('left-arm')}
              />
              <rect
                x='150'
                y='100'
                width='30'
                height='100'
                rx='15'
                className={`cursor-pointer transition-all ${
                  selectedBodyParts.includes('right-arm')
                    ? 'fill-cyan-300'
                    : 'fill-gray-200'
                } hover:fill-cyan-200`}
                onClick={() => handleBodyPartClick('right-arm')}
              />

              {/* Legs */}
              <rect
                x='70'
                y='240'
                width='25'
                height='120'
                rx='12'
                className={`cursor-pointer transition-all ${
                  selectedBodyParts.includes('left-leg')
                    ? 'fill-cyan-300'
                    : 'fill-gray-200'
                } hover:fill-cyan-200`}
                onClick={() => handleBodyPartClick('left-leg')}
              />
              <rect
                x='105'
                y='240'
                width='25'
                height='120'
                rx='12'
                className={`cursor-pointer transition-all ${
                  selectedBodyParts.includes('right-leg')
                    ? 'fill-cyan-300'
                    : 'fill-gray-200'
                } hover:fill-cyan-200`}
                onClick={() => handleBodyPartClick('right-leg')}
              />
            </svg>
          </div>

          {selectedBodyParts.length > 0 && (
            <div className='mt-6'>
              <p className='text-sm text-gray-600 mb-2'>Selected areas:</p>
              <div className='flex flex-wrap gap-2'>
                {selectedBodyParts.map((part) => (
                  <span
                    key={part}
                    className='px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm'
                  >
                    {part.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className='px-6 py-4 border-t border-gray-200'>
          <button
            onClick={handleContinue}
            className='w-full py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors'
          >
            Continue to Journal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col bg-white'>
      <div className='px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
        <h1 className='text-xl'>
          Question {currentQuestionIndex + 1} of {questions.length}
        </h1>
        <button onClick={() => navigate('/')} className='p-2'>
          <X size={24} />
        </button>
      </div>

      <div className='flex-1 overflow-y-auto px-6 py-6'>
        {currentQuestion && (
          <>
            <h2 className='text-2xl mb-6'>{currentQuestion.question}</h2>

            <div className='space-y-3'>
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className='w-full py-4 px-4 rounded-lg border-2 border-gray-200 bg-white hover:border-cyan-300 hover:bg-cyan-50 transition-all text-left flex items-center justify-between'
                >
                  <span>{option}</span>
                  <ChevronRight size={20} className='text-gray-400' />
                </button>
              ))}
            </div>
          </>
        )}

        {showCustomInput && (
          <div className='mt-6'>
            <input
              type='text'
              value={customAnswer}
              onChange={(e) => setCustomAnswer(e.target.value)}
              className='w-full py-4 px-4 rounded-lg border-2 border-gray-200 bg-white hover:border-cyan-300 hover:bg-cyan-50 transition-all text-left'
              placeholder='Enter your answer'
            />
            <button
              onClick={handleCustomSubmit}
              className='w-full py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors mt-2'
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
