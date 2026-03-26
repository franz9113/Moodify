import { createBrowserRouter, Navigate } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute';
import Root from '@/app/Root';
import Home from './pages/Home';
import Landing from './pages/Landing';
import MoodEntry from '@/app/pages/MoodEntry';
import MoodSelection from '@/app/pages/MoodSelection';
import Questions from '@/app/pages/Questions';
import Journal from '@/app/pages/Journal';
import Suggestions from '@/app/pages/Suggestions';
import Statistics from '@/app/pages/Statistics';
import Tools from '@/app/pages/Tools';
import Login from './pages/Login';

export const router = createBrowserRouter([
  // 1. PUBLIC AREA (No login required)
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },

  // 2. PRIVATE AREA (The Gatekeeper is here)
  {
    path: '/app', // All private pages now start with /app
    element: <ProtectedRoute />,
    children: [
      {
        path: '', // This acts as the "Home" of the private area (/app)
        element: <Root />,
        children: [
          { index: true, element: <Home /> },
          { path: 'mood-entry', element: <MoodEntry /> },
          { path: 'mood-selection', element: <MoodSelection /> },
          { path: 'questions', element: <Questions /> },
          { path: 'journal', element: <Journal /> },
          { path: 'suggestions', element: <Suggestions /> },
          { path: 'statistics', element: <Statistics /> },
          { path: 'tools', element: <Tools /> },
        ],
      },
    ],
  },

  // 3. SAFETY NET
  {
    path: '*',
    element: <Navigate to='/' replace />,
  },
]);
