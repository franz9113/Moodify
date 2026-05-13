import { Heart, Brain, Wind, Activity, BookOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface TherapeuticTool {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  category: string;
  color: string;
  content: {
    title: string;
    steps: string[];
  };
}

export const THERAPEUTIC_TOOLS: TherapeuticTool[] = [
  {
    id: 'breathing',
    name: 'Deep Breathing Exercise',
    icon: Wind,
    description: 'Calm your mind and body with guided breathing',
    category: 'Relaxation',
    color: 'bg-blue-50 text-blue-600',
    content: {
      title: 'Deep Breathing Exercise',
      steps: [
        'Find a comfortable seated position',
        'Close your eyes or soften your gaze',
        'Breathe in slowly through your nose for 4 counts',
        'Hold your breath for 4 counts',
        'Exhale slowly through your mouth for 6 counts',
        'Repeat this cycle 5-10 times',
      ],
    },
  },
  {
    id: 'grounding',
    name: '5-4-3-2-1 Grounding Technique',
    icon: Activity,
    description: 'Ground yourself in the present moment',
    category: 'Anxiety Relief',
    color: 'bg-purple-50 text-purple-600',
    content: {
      title: '5-4-3-2-1 Grounding Technique',
      steps: [
        'Look around and name 5 things you can see',
        'Notice 4 things you can touch',
        'Listen for 3 things you can hear',
        'Identify 2 things you can smell',
        'Notice 1 thing you can taste',
        'Take a deep breath and return to the present',
      ],
    },
  },
  {
    id: 'progressive',
    name: 'Progressive Muscle Relaxation',
    icon: Heart,
    description: 'Release tension from your body',
    category: 'Stress Relief',
    color: 'bg-teal-50 text-teal-600',
    content: {
      title: 'Progressive Muscle Relaxation',
      steps: [
        'Lie down or sit in a comfortable position',
        'Start with your toes - tense them for 5 seconds, then release',
        'Move up to your calves, tense and release',
        'Continue with thighs, abdomen, chest, arms, and face',
        'Hold each tension for 5 seconds before releasing',
        'Notice the difference between tension and relaxation',
      ],
    },
  },
  {
    id: 'meditation',
    name: 'Mindfulness Meditation',
    icon: Brain,
    description: 'Practice present moment awareness',
    category: 'Mindfulness',
    color: 'bg-green-50 text-green-600',
    content: {
      title: 'Mindfulness Meditation',
      steps: [
        'Sit comfortably with your back straight',
        'Close your eyes and focus on your breath',
        'Notice thoughts as they arise without judgment',
        'Gently return your focus to your breath',
        'Continue for 5-10 minutes',
        'Open your eyes slowly when ready',
      ],
    },
  },
  {
    id: 'gratitude',
    name: 'Gratitude Journal',
    icon: BookOpen,
    description: 'Cultivate appreciation and positivity',
    category: 'Mood Boost',
    color: 'bg-yellow-50 text-yellow-600',
    content: {
      title: 'Gratitude Journal',
      steps: [
        'Find a quiet moment in your day',
        "Write down 3 things you're grateful for",
        "Be specific about why you're grateful",
        'Reflect on how these things make you feel',
        'Practice this daily for best results',
        'Review your entries when you need a boost',
      ],
    },
  },
];
