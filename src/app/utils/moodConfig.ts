import happyImg from '@/assets/0b7d324915261b4c2e7a5f1388466865cb752495.png';
import calmImg from '@/assets/d618fac3b35047c02da8a8af9d4fcfe8d3708382.png';
import exhaustedImg from '@/assets/6263d015ac38c48ef1975b353a514eadf070dce0.png';
import madImg from '@/assets/51a2d60599bb8d0a17c771eafbef67b6297d9869.png';
import sadImg from '@/assets/8d26e77f44ccb6deffe10ee1f8a7a098275a4cdd.png';


// Suggestions.tsx imports
export type MoodKey = 'Happy' | 'Mad' | 'Sad' | 'Calm' | 'Exhausted';

export const MOOD_CONTENT: Record<MoodKey, { title: string; descriptions: string[] }> = {
  Happy: {
    title: "Keep the momentum going!",
    descriptions: ["Your positive energy is wonderful. Consider sharing your joy with someone or documenting what made you happy today."],
  },
  Mad: {
    title: "It's like a storm, isn't it?",
    descriptions: [
      "Don't hold onto your anger for too long. Take a walk and find your inner peace.",
      "It's always a good thing to count slowly from 1-10 before reacting.",
      "Take a breather. Consider listening to music that calms you down.",
    ],
  },
  Sad: {
    title: "Everything is okay",
    descriptions: [
      "Don't let it bring you down. Try talking to someone you trust that could make you feel better.",
      "Your feelings are valid, and it's okay to feel this way. If you want a distraction, consider doing what you love.",
      "It's okay, don't keep it in. Journaling will help you express your feelings.",
    ],
  },
  Calm: {
    title: "Peace feels good, doesn’t it?",
    descriptions: [
      "A peaceful mind helps you make better choices.",
      "Stay present and grounded. You’re exactly where you need to be.",
      "Take this moment to appreciate the stillness and clarity you feel.",
    ],
  },
  Exhausted: {
    title: "It’s okay to just pause for a bit!",
    descriptions: [
      "Everything's gonna be fine! Put all the worries down and try doing something you love!",
      "It's okay to take a rest, a short nap might help!",
      "Take it slow, a little breather or rest could make you feel better.",
    ],
  },
};

export const MOOD_TOOLS: Record<MoodKey, string> = {
  Happy: 'Gratitude Journal',
  Calm: 'Mindfulness Meditation',
  Exhausted: 'Relaxation Techniques',
  Mad: 'Progressive Muscle Relaxation',
  Sad: 'Deep Breathing Exercise',
};

// end of Suggestions.tsx

// questions.tsx imports

export interface Question {
  id: 'whatMadeYouFeel' | 'whatDidYouDo' | 'was_it_right' | 'notice_emotions' | 'affect_decisions';
  question: string;
  options: string[];
}

export const QUESTIONS: Question[] = [
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
  {
    id: 'notice_emotions',
    question: 'Do you notice your emotions as they happen?',
    options: ['Yes', 'No', 'Maybe']
  },
  {
    id: 'affect_decisions',
    question: 'Did your feelings affect your ability to make decisions?',
    options: ['Yes', 'No', 'Maybe']
  },
];
// questions.tsx imports end

export const MOOD_CONFIG = {
  Happy: {
    name: 'Happy',
    image: happyImg,
    color: 'bg-yellow-300',
    value: 5,
  },
  Calm: {
    name: 'Calm',
    image: calmImg,
    color: 'bg-green-300',
    value: 4,
  },
  Exhausted: {
    name: 'Exhausted',
    image: exhaustedImg,
    color: 'bg-purple-300',
    value: 2,
  },
  Mad: {
    name: 'Mad',
    image: madImg,
    color: 'bg-red-300',
    value: 1,
  },
  Sad: {
    name: 'Sad',
    image: sadImg,
    color: 'bg-blue-300',
    value: 1,
  },
};

export const MOODS = Object.values(MOOD_CONFIG);

export const getMoodConfig = (moodName: string) => {
  return MOOD_CONFIG[moodName as keyof typeof MOOD_CONFIG] || MOOD_CONFIG.Calm;
};

export const getMoodColor = (moodName: string) => {
  return getMoodConfig(moodName).color;
};

export const getMoodImage = (moodName: string) => {
  return getMoodConfig(moodName).image;
};

export const getMoodValue = (moodName: string) => {
  return getMoodConfig(moodName).value;
};

export const getMoodBgColor = (mood: string) => {
  const m = mood?.toLowerCase();
  if (m === 'happy') return 'bg-[#FCD34D]'; // Soft Amber
  if (m === 'calm') return 'bg-[#6EE7B7]'; // Soft Emerald
  if (m === 'mad') return 'bg-[#FCA5A5]'; // Soft Rose
  if (m === 'exhausted') return 'bg-[#C4B5FD]'; // Soft Purple
  if (m === 'sad') return 'bg-[#22D3EE]'; // Soft Sky Blue
  return 'bg-[#F9FAFB]'; // Default Gray
};

// Calculate overall mood from multiple entries
export const calculateOverallMood = (moods: string[]): string => {
  if (moods.length === 0) return 'Calm';

  const totalValue = moods.reduce((sum, mood) => sum + getMoodValue(mood), 0);
  const avgValue = totalValue / moods.length;

  // Map average value to mood
  if (avgValue >= 4.5) return 'Happy';
  if (avgValue >= 3) return 'Calm';
  if (avgValue >= 2) return 'Exhausted';
  if (avgValue >= 1.5) return 'Sad';
  return 'Mad';
};
