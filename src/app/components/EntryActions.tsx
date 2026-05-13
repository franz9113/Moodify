import { Edit2, Trash2, Loader2 } from 'lucide-react';
import { THEME } from '@/app/utils/theme';

interface EntryActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export default function EntryActions({
  onEdit,
  onDelete,
  isDeleting = false,
}: EntryActionsProps) {
  return (
    <div className='pt-6 space-y-3'>
      <button
        onClick={onEdit}
        className='w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 shadow-lg bg-white'
        style={{ borderColor: THEME.colors.primary, color: THEME.colors.text }}
      >
        <Edit2 size={18} /> Edit This Entry
      </button>
      <button
        onClick={onDelete}
        disabled={isDeleting}
        className='w-full py-4 flex items-center justify-center gap-2 text-red-500 font-bold text-sm disabled:opacity-50'
      >
        {isDeleting ? (
          <>
            <Loader2 size={18} className='animate-spin' /> Deleting...
          </>
        ) : (
          <>
            <Trash2 size={18} /> Delete Entry
          </>
        )}
      </button>
    </div>
  );
}
