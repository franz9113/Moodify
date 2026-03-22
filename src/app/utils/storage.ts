import { supabase } from './supabaseClient'; // Make sure this path is correct
import { calculateOverallMood } from './moodConfig';

export interface MoodEntry {
  id?: string;
  user_id?: string;
  date: string;
  mood_type: string;
  emotion: string;
  note: string;
  created_at?: string;
  whatMadeYouFeel?: string;
  bodyParts?: string[];
}

const TEMP_USER_ID = '1';

export const saveMoodEntry = async (entry: Omit<MoodEntry, 'user_id'>) => {
  const { data, error } = await supabase
    .from('mood_entries')
    .insert([
      {
        ...entry,
        user_id: TEMP_USER_ID, // Overwrites if user_id was somehow in entry
      },
    ])
    .select(); // Add .select() to actually return the data back to your app

  return { data, error };
};

// 2. GET all entries for User 1
export const getMoodEntries = async (): Promise<MoodEntry[]> => {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', TEMP_USER_ID)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching:', error.message);
    return [];
  }
  return data || [];
};

// 3. GET entries for a specific date
export const getMoodEntriesByDate = async (
  date: string,
): Promise<MoodEntry[]> => {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', TEMP_USER_ID)
    .eq('date', date);

  return data || [];
};

// 4. OVERALL MOOD (Calculated from DB data)
export const getOverallMoodForDate = async (
  date: string,
): Promise<string | null> => {
  const entries = await getMoodEntriesByDate(date);
  if (entries.length === 0) return null;

  const moods = entries.map((entry) => entry.mood_type);
  return calculateOverallMood(moods);
};
