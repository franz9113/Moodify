import { Outlet, useLocation, useNavigate } from 'react-router';
import { BarChart3, Lightbulb, LogOut } from 'lucide-react'; // Added LogOut
import { THEME } from '@/app/utils/theme';

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();

  const isNavVisible = ['/', '/statistics', '/tools'].includes(
    location.pathname,
  );

  const handleLogout = () => {
    // Clear auth state
    localStorage.removeItem('isLoggedIn');
    // Clear any temporary view data
    localStorage.removeItem('viewMoodEntry');
    // Redirect to login
    navigate('/login', { replace: true });
  };

  const getNavStyle = (path: string) => ({
    color: location.pathname === path ? THEME.colors.primary : '#9CA3AF',
  });

  return (
    <div className='h-screen w-full max-w-md mx-auto bg-white flex flex-col relative overflow-hidden'>
      <div className='flex-1 overflow-y-auto pb-24'>
        {' '}
        {/* Added padding-bottom so content isn't hidden by nav */}
        <Outlet />
      </div>

      {isNavVisible && (
        <nav className='fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-4 py-4 z-40'>
          <div className='flex justify-between items-center'>
            {/* Statistics */}
            <button
              onClick={() => navigate('/statistics')}
              className='flex-1 flex flex-col items-center gap-1 transition-colors'
              style={getNavStyle('/statistics')}
            >
              <BarChart3 size={22} />
              <span className='text-[10px] font-bold uppercase'>Stats</span>
            </button>

            {/* Home */}
            <button
              onClick={() => navigate('/')}
              className='flex-1 flex flex-col items-center gap-1 transition-colors'
              style={getNavStyle('/')}
            >
              <svg
                width='22'
                height='22'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <circle cx='12' cy='12' r='2.5' />
                <ellipse cx='12' cy='6' rx='3' ry='4.5' />
                <ellipse
                  cx='16.5'
                  cy='8'
                  rx='3'
                  ry='4.5'
                  transform='rotate(72 16.5 8)'
                />
                <ellipse
                  cx='15'
                  cy='16'
                  rx='3'
                  ry='4.5'
                  transform='rotate(144 15 16)'
                />
                <ellipse
                  cx='9'
                  cy='16'
                  rx='3'
                  ry='4.5'
                  transform='rotate(-144 9 16)'
                />
                <ellipse
                  cx='7.5'
                  cy='8'
                  rx='3'
                  ry='4.5'
                  transform='rotate(-72 7.5 8)'
                />
              </svg>
              <span className='text-[10px] font-bold uppercase'>Home</span>
            </button>

            {/* Tools */}
            <button
              onClick={() => navigate('/tools')}
              className='flex-1 flex flex-col items-center gap-1 transition-colors'
              style={getNavStyle('/tools')}
            >
              <Lightbulb size={22} />
              <span className='text-[10px] font-bold uppercase'>Tools</span>
            </button>

            {/* Logout - Red accent for distinction */}
            <button
              onClick={handleLogout}
              className='flex-1 flex flex-col items-center gap-1 text-gray-400 hover:text-red-400 transition-colors'
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
