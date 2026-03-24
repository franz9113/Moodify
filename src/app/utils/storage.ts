import { supabase } from './supabaseClient';

export interface MoodEntry {
  id?: string;
  user_id?: string;
  date: string;
  mood_type: string;
  emotion: string;
  note: string;
  created_at?: string;
}

const TEMP_USER_ID = '1';

export const saveMoodEntry = async (entry: Omit<MoodEntry, 'user_id'>) => {
  const { data, error } = await supabase
    .from('mood_entries')
    .insert([{ ...entry, user_id: TEMP_USER_ID }])
    .select();
  return { data, error };
};

export const getMoodEntriesByDate = async (
  date: string,
): Promise<MoodEntry[]> => {
  const { data } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', TEMP_USER_ID)
    .eq('date', date)
    .order('created_at', { ascending: false });

  return data || [];
};

export const getAllMoodEntries = async (): Promise<MoodEntry[]> => {
  const { data } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', TEMP_USER_ID);
  return data || [];
};

// --- ADD THESE TWO FOR THE HOME PAGE ---
export const getOverallMoodForDate = (entries: MoodEntry[]) => {
  return entries[0]?.mood_type || null;
};

export const formatMoodsByDate = (allEntries: MoodEntry[]) => {
  return allEntries.reduce(
    (acc, entry) => {
      acc[entry.date] = entry.mood_type;
      return acc;
    },
    {} as Record<string, string>,
  );
};
