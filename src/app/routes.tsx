import { createBrowserRouter } from 'react-router';
import Root from '@/app/Root';
import Home from '@/app/pages/Home';
import MoodEntry from '@/app/pages/MoodEntry';
import MoodSelection from '@/app/pages/MoodSelection';
import Questions from '@/app/pages/Questions';
import Journal from '@/app/pages/Journal';
import Suggestions from '@/app/pages/Suggestions';
import Statistics from '@/app/pages/Statistics';
import Tools from '@/app/pages/Tools';
import Landing from '@/app/pages/Landing';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />, // Changed from Component
    children: [
      { index: true, element: <Home /> }, // Changed from Component
      { path: 'mood-entry', element: <MoodEntry /> },
      { path: 'mood-selection', element: <MoodSelection /> },
      { path: 'questions', element: <Questions /> },
      { path: 'journal', element: <Journal /> },
      { path: 'suggestions', element: <Suggestions /> },
      { path: 'statistics', element: <Statistics /> },
      { path: 'tools', element: <Tools /> },
    ],
  },
]);
