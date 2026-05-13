import { supabase } from '@/app/utils/supabaseClient';

export interface MoodEntryPayload {
  user_id: string;
  mood: string;
  emotion: string;
  mood_value: number;
  date: string;
  body_parts: string[];
  trigger: string;
  action: string;
  was_it_right: string;
  notice_emotions: string;
  affect_decisions: string;
  journal: string;
}

/**
 * Maps raw entry data to the database payload format
 */
export const mapEntryToPayload = (data: any, userId: string): MoodEntryPayload => {
  return {
    user_id: userId,
    mood: data.mood || 'Neutral',
    emotion: data.emotion || '',
    mood_value: data.moodValue || 0,
    date: data.date || new Date().toISOString().split('T')[0],
    body_parts: data.bodyParts || [],
    trigger: data.whatMadeYouFeel || data.trigger || '',
    action: data.whatDidYouDo || data.action || '',
    was_it_right: data.was_it_right ?? 'Not sure',
    notice_emotions: data.notice_emotions || '',
    affect_decisions: data.affect_decisions || '',
    journal: data.journalText || data.journal || '',
  };
};

/**
 * Saves or updates a mood entry in Supabase
 */
export const saveMoodEntry = async (data: any): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Authentication required');
  }

  const payload = mapEntryToPayload(data, session.user.id);

  const { error: dbError } = data.id
    ? await supabase.from('mood_entries').update(payload).eq('id', data.id)
    : await supabase.from('mood_entries').insert([payload]);

  if (dbError) {
    throw dbError;
  }

  // Clean up storage after successful save
  localStorage.removeItem('currentMoodEntry');
};
