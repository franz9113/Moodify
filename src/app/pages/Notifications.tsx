import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Bell, CheckCircle2, Trash2 } from 'lucide-react';
import { supabase } from '@/app/utils/supabaseClient';
import { THEME } from '@/app/utils/theme';
import { format } from 'date-fns';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) setNotifications(data || []);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, is_read: true } : n
    ));
  };

  const deleteNotification = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: THEME.colors.background }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center bg-white shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold ml-2" style={{ color: THEME.colors.text }}>
          Notifications
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center py-20 opacity-50">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <Bell size={48} className="mb-4" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id}
              className={`relative p-4 rounded-2xl border-2 transition-all bg-white shadow-sm ${!n.is_read ? 'border-mint-500' : 'border-transparent'}`}
              style={{ borderColor: !n.is_read ? '#A7F3D0' : '#F3F4F6' }}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold opacity-40">
                  {format(new Date(n.created_at), 'MMM d, h:mm a')}
                </span>
                <div className="flex gap-2">
                  {!n.is_read && (
                    <button onClick={() => markAsRead(n.id)} className="text-mint-600">
                      <CheckCircle2 size={18} />
                    </button>
                  )}
                  <button onClick={() => deleteNotification(n.id)} className="text-red-400">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="font-medium pr-8" style={{ color: THEME.colors.text }}>
                {n.message}
              </p>
              {!n.is_read && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}