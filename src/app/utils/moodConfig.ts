import happyImg from '@/assets/0b7d324915261b4c2e7a5f1388466865cb752495.png';
import calmImg from '@/assets/d618fac3b35047c02da8a8af9d4fcfe8d3708382.png';
import exhaustedImg from '@/assets/6263d015ac38c48ef1975b353a514eadf070dce0.png';
import madImg from '@/assets/51a2d60599bb8d0a17c771eafbef67b6297d9869.png';
import sadImg from '@/assets/8d26e77f44ccb6deffe10ee1f8a7a098275a4cdd.png';

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

export const getMoodBgColor = (moodType: string) => {
  const mood = moodType?.toLowerCase();

  switch (mood) {
    case 'happy':
      return 'bg-amber-400'; // Yellow
    case 'calm':
      return 'bg-emerald-300'; // Mint/Cyan
    case 'exhausted':
      return 'bg-purple-300'; // Lavender/Purple
    case 'mad':
      return 'bg-rose-400'; // Pink/Red
    case 'sad':
      return 'bg-cyan-400'; // Sky Blue
    default:
      return 'bg-gray-50';
  }
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
