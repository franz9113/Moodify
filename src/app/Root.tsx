import { Outlet, useLocation, useNavigate } from 'react-router';
import { BarChart3, Lightbulb } from 'lucide-react';

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();

  const isNavVisible = ['/', '/statistics', '/tools'].includes(
    location.pathname,
  );

  return (
    <div className='h-screen w-full max-w-md mx-auto bg-white flex flex-col relative overflow-hidden'>
      <div className='flex-1 overflow-y-auto'>
        <Outlet />
      </div>

      {isNavVisible && (
        <nav className='fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-6 py-4 z-40'>
          <div className='flex justify-around items-center'>
            <button
              onClick={() => navigate('/statistics')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                location.pathname === '/statistics'
                  ? 'text-cyan-500'
                  : 'text-gray-400'
              }`}
            >
              <BarChart3 size={24} />
              <span className='text-xs'>Stats</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                location.pathname === '/' ? 'text-cyan-500' : 'text-gray-400'
              }`}
            >
              <svg
                width='24'
                height='24'
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
              <span className='text-xs'>Home</span>
            </button>

            <button
              onClick={() => navigate('/tools')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                location.pathname === '/tools'
                  ? 'text-cyan-500'
                  : 'text-gray-400'
              }`}
            >
              <Lightbulb size={24} />
              <span className='text-xs'>Tools</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
