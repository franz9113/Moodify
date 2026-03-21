import { calculateOverallMood } from "./moodConfig";

export interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  emotion: string;
  whatMadeYouFeel: string;
  whatDidYouDo: string;
  wasItRight: string;
  bodyParts: string[];
  journal: string;
  suggestion: string;
  timestamp: number;
}

const STORAGE_KEY = "moodEntries";

export const saveMoodEntry = (entry: MoodEntry) => {
  const entries = getMoodEntries();
  entries.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const getMoodEntries = (): MoodEntry[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getMoodEntriesByDate = (date: string): MoodEntry[] => {
  const entries = getMoodEntries();
  return entries.filter((entry) => entry.date === date);
};

export const getAllMoodsByDate = (): Record<string, MoodEntry[]> => {
  const entries = getMoodEntries();
  const grouped: Record<string, MoodEntry[]> = {};
  
  entries.forEach((entry) => {
    if (!grouped[entry.date]) {
      grouped[entry.date] = [];
    }
    grouped[entry.date].push(entry);
  });
  
  return grouped;
};

export const getOverallMoodForDate = (date: string): string | null => {
  const entries = getMoodEntriesByDate(date);
  if (entries.length === 0) return null;
  
  const moods = entries.map(entry => entry.mood);
  return calculateOverallMood(moods);
};