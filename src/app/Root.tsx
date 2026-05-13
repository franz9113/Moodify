import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { BarChart3, Lightbulb, LogOut, Home } from 'lucide-react';
import { THEME } from '@/app/utils/theme';
import { supabase } from '@/app/utils/supabaseClient';
import LogoutConfirmDialog from '@/app/components/LogoutConfirmDialog';

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [initializing, setInitializing] = useState(true); 

useEffect(() => {
  const checkUser = async () => {
    // 1. Ask the browser: "Do we have a saved session?"
    const { data: { session } } = await supabase.auth.getSession();

    if (session && location.pathname === '/') {
      // 2. If YES, skip the landing page and go to the app
      navigate('/app', { replace: true });
    } else if (!session && location.pathname.startsWith('/app')) {
      // 3. If NO, kick them back to landing if they try to sneak into /app
      navigate('/', { replace: true });
    }
    setInitializing(false);
  };

  checkUser();
}, [navigate, location.pathname]);

  // Updated to include both /app and /app/
  const isNavVisible = [
    '/app',
    '/app/',
    '/app/statistics',
    '/app/tools',
  ].includes(location.pathname);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('viewMoodEntry');
    setShowLogoutConfirm(false);
    navigate('/', { replace: true });
  };

  const getNavStyle = (path: string) => {
    // Check if current path matches, handling the trailing slash for home
    const isActive =
      location.pathname === path ||
      (path === '/app' && location.pathname === '/app/');
    return {
      color: isActive ? THEME.colors.primary : '#9CA3AF',
    };
  };

  return (
    <div className='h-screen w-full max-w-md mx-auto bg-white flex flex-col relative overflow-hidden'>
      <LogoutConfirmDialog
        isOpen={showLogoutConfirm}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      <div className='flex-1 overflow-y-auto'>
        <Outlet />
      </div>

      {isNavVisible && (
        <nav className='fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-4 py-4 z-40'>
          <div className='flex justify-between items-center'>
            {/* 📊 STATS */}
            <button
              onClick={() => navigate('/app/statistics')}
              className='flex-1 flex flex-col items-center gap-1 transition-colors'
              style={getNavStyle('/app/statistics')}
            >
              <BarChart3 size={22} />
              <span className='text-[10px] font-bold uppercase'>Stats</span>
            </button>

            {/* 🏠 HOME */}
            <button
              onClick={() => navigate('/app')}
              className='flex-1 flex flex-col items-center gap-1 transition-colors'
              style={getNavStyle('/app')}
            >
              <Home size={22} />
              <span className='text-[10px] font-bold uppercase'>Home</span>
            </button>

            {/* 💡 TOOLS */}
            <button
              onClick={() => navigate('/app/tools')}
              className='flex-1 flex flex-col items-center gap-1 transition-colors'
              style={getNavStyle('/app/tools')}
            >
              <Lightbulb size={22} />
              <span className='text-[10px] font-bold uppercase'>Tools</span>
            </button>

            {/* 🚪 EXIT */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className='flex-1 flex flex-col items-center gap-1 text-gray-400 active:text-red-400 transition-colors'
            >
              <LogOut size={22} />
              <span className='text-[10px] font-bold uppercase'>Exit</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
