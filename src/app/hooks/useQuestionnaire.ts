import { useState } from 'react';
import { QUESTIONS } from '@/app/utils/moodConfig';

export const useQuestionnaire = (initialAnswers: Record<string, any> = {}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>(initialAnswers);
  const [customAnswer, setCustomAnswer] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const isAnswered = answers[currentQuestion?.id] !== undefined;
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;

  const isOptionSelected = (option: string): boolean => {
    if (!currentQuestion) return false;
    const savedAnswer = answers[currentQuestion.id];
    if (savedAnswer === undefined || savedAnswer === null) return false;
    return savedAnswer.toString().toLowerCase() === option.toLowerCase();
  };

  const handleAnswer = (answer: string): boolean => {
    if (!currentQuestion) return false;

    if (answer === 'Other') {
      setShowCustomInput(true);
      return false;
    }

    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);
    setCustomAnswer('');
    setShowCustomInput(false);

    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      return false;
    }

    return true; // Signals that all questions are answered
  };

  const handleCustomSubmit = (): boolean => {
    if (!currentQuestion || !customAnswer.trim()) return false;

    const newAnswers = { ...answers, [currentQuestion.id]: customAnswer };
    setAnswers(newAnswers);
    setCustomAnswer('');
    setShowCustomInput(false);

    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      return false;
    }

    return true; // Signals that all questions are answered
  };

  const goBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowCustomInput(false);
      setCustomAnswer('');
    }
  };

  return {
    currentQuestion,
    currentQuestionIndex,
    answers,
    customAnswer,
    showCustomInput,
    isAnswered,
    isLastQuestion,
    isOptionSelected,
    setCustomAnswer,
    setShowCustomInput,
    handleAnswer,
    handleCustomSubmit,
    goBack,
  };
};
