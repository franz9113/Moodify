// Mood weight configuration for overall mood calculation
export const MOOD_WEIGHTS: Record<string, number> = {
  Happy: 5,
  Calm: 4,
  Exhausted: 2.5,
  Sad: 2,
  Mad: 1,
};

// Helper to calculate mood name from a list of entries
export const calculateOverallMoodName = (entries: any[]): string | null => {
  if (!entries || entries.length === 0) return null;

  const totalScore = entries.reduce((sum, entry) => {
    return sum + (MOOD_WEIGHTS[entry.mood] || 3);
  }, 0);

  const averageScore = totalScore / entries.length;

  if (averageScore >= 4.5) return 'Happy';
  if (averageScore >= 3.5) return 'Calm';
  if (averageScore >= 2.2) return 'Exhausted';
  if (averageScore >= 1.5) return 'Sad';
  return 'Mad';
};

// Suggestions for each mood
export const getSuggestionsForMood = (mood: string | null): { title: string; description: string } => {
  if (!mood) {
    return { title: 'No entries', description: 'Log your first mood!' };
  }

  const suggestions = {
    Happy: {
      title: 'Keep the momentum going!',
      description: 'Your positive energy is wonderful. Consider sharing your joy with someone or documenting what made you happy today.',
    },
    Sad: {
      title: "It's okay to feel sad",
      description: 'Allow yourself to feel these emotions. Try reaching out to a friend or engaging in a comforting activity.',
    },
    Mad: {
      title: 'Channel your energy',
      description: 'Anger is a valid emotion. Consider physical activity or journaling to process these feelings constructively.',
    },
    Exhausted: {
      title: 'Rest and recharge',
      description: 'Your body and mind need rest. Take time to restore your energy through rest and self-care.',
    },
    Calm: {
      title: 'Embrace this peace',
      description: "You've found a state of balance. Consider what helped you reach this point and how you can maintain it.",
    },
  } as const;

  if (mood in suggestions) {
    return suggestions[mood as keyof typeof suggestions];
  }
  return suggestions.Calm;
};
