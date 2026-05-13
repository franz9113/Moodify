import { supabase } from '@/app/utils/supabaseClient';

/**
 * Maps entry data to the format expected by Questions page
 */
export const mapEntryForEdit = (entry: any) => {
  return {
    editId: entry.id,
    moodType: entry.mood,
    moodSubtype: entry.emotion,
    existingAnswers: {
      whatMadeYouFeel: entry.trigger,
      whatDidYouDo: entry.action,
      was_it_right: entry.was_it_right,
      notice_emotions: entry.notice_emotions,
      affect_decisions: entry.affect_decisions,
    },
    existingBodyParts: entry.body_parts || [],
    selectedDate: entry.date,
    existingJournal: entry.journal,
    moodValue: entry.mood_value,
  };
};

/**
 * Deletes a mood entry from Supabase
 */
export const deleteMoodEntry = async (entryId: string): Promise<void> => {
  const { error } = await supabase
    .from('mood_entries')
    .delete()
    .eq('id', entryId);

  if (error) {
    throw error;
  }
};
