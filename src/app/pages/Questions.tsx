import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { X } from 'lucide-react';
import { THEME } from '../utils/theme';
import { QUESTIONS } from '@/app/utils/moodConfig';
import { useQuestionnaire } from '@/app/hooks/useQuestionnaire';
import QuestionCard from '@/app/components/Questions/QuestionCard';
import BodyMapPage from '@/app/components/Questions/BodyMapPage';

export default function Questions() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const editId = state?.editId;

  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>(
    state?.existingBodyParts || [],
  );
  const [showBodyMap, setShowBodyMap] = useState(false);
  const [loading, setLoading] = useState(false);

  const questionnaire = useQuestionnaire(state?.existingAnswers || {});
  const { currentQuestion, currentQuestionIndex, answers } = questionnaire;

  const handleQuestionAnswered = (complete: boolean) => {
    if (complete) {
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

      const entryToSave = {
        id: editId,
        mood: state?.moodType || state?.existingMood || 'Mood',
        emotion: state?.moodSubtype || state?.existingEmotion || '',
        whatMadeYouFeel: answers.whatMadeYouFeel || '',
        whatDidYouDo: answers.whatDidYouDo || '',
        was_it_right: answers.was_it_right || 'Not sure',
        notice_emotions: answers.notice_emotions || '',
        affect_decisions: answers.affect_decisions || '',
        bodyParts: selectedBodyParts || [],
        date: savedDate,
        moodValue: state?.moodValue || 3,
        journalText: state?.existingJournal || '',
      };

      localStorage.setItem('currentMoodEntry', JSON.stringify(entryToSave));
      localStorage.removeItem('currentMoodDate');
      navigate('/app/journal');
    } catch (err) {
      console.error('Preparation failed', err);
    } finally {
      setLoading(false);
    }
  };

  if (showBodyMap) {
    return (
      <BodyMapPage
        selectedBodyParts={selectedBodyParts}
        onSelectBodyPart={(part) =>
          setSelectedBodyParts((prev) =>
            prev.includes(part)
              ? prev.filter((p) => p !== part)
              : [...prev, part],
          )
        }
        onSubmit={handleFinalSubmit}
        onClose={() => navigate('/app')}
        isLoading={loading}
      />
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
          {editId
            ? 'Edit Entry'
            : `Question ${currentQuestionIndex + 1} of ${QUESTIONS.length}`}
        </h1>
        <button onClick={() => navigate('/app')} className='p-2'>
          <X size={24} />
        </button>
      </div>

      {currentQuestion && (
        <QuestionCard
          questionIndex={currentQuestionIndex}
          question={currentQuestion}
          isOptionSelected={questionnaire.isOptionSelected}
          onAnswer={(answer) => {
            const complete = questionnaire.handleAnswer(answer);
            handleQuestionAnswered(complete);
          }}
          customAnswer={questionnaire.customAnswer}
          showCustomInput={questionnaire.showCustomInput}
          onCustomAnswerChange={questionnaire.setCustomAnswer}
          onCustomSubmit={() => {
            const complete = questionnaire.handleCustomSubmit();
            handleQuestionAnswered(complete);
          }}
        />
      )}
    </div>
  );
}