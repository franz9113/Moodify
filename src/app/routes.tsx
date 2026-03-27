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
import ResetPassword from './pages/ResetPassword'; // 1. Add this import
import RequestReset from './pages/RequestReset';

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
  {
    path: '/reset-password', // 2. Add this route for the email link
    element: <ResetPassword />,
  },
  {
  path: '/request-reset',
  element: <RequestReset />,
},

  // 2. PRIVATE AREA (The Gatekeeper is here)
  {
    path: '/app', 
    element: <ProtectedRoute />,
    children: [
      {
        path: '', 
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