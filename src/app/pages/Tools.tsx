import { useState } from 'react';
import {
  ChevronRight,
  Heart,
  Brain,
  Wind,
  Activity,
  BookOpen,
  X,
} from 'lucide-react';

const tools = [
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

export default function Tools() {
  const [selectedTool, setSelectedTool] = useState<(typeof tools)[0] | null>(
    null,
  );

  if (selectedTool) {
    return (
      <div className='flex flex-col h-full pb-20'>
        <div className='px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
          <h1 className='text-xl'>{selectedTool.content.title}</h1>
          <button onClick={() => setSelectedTool(null)} className='p-2'>
            <X size={24} />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto px-6 py-6'>
          <div
            className={`${selectedTool.color} rounded-2xl p-6 mb-6 flex items-center justify-center`}
          >
            <selectedTool.icon size={64} />
          </div>

          <h2 className='text-lg mb-4'>Follow these steps:</h2>
          <div className='space-y-4'>
            {selectedTool.content.steps.map((step, index) => (
              <div key={index} className='flex gap-4'>
                <div className='flex-shrink-0 w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-medium'>
                  {index + 1}
                </div>
                <p className='flex-1 pt-1'>{step}</p>
              </div>
            ))}
          </div>

          <div className='mt-8 p-4 bg-blue-50 rounded-lg'>
            <p className='text-sm text-blue-900'>
              <strong>Tip:</strong> Practice this technique regularly for the
              best results. Consistency is key to developing healthy emotional
              regulation habits.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full pb-10'>
      <div className='px-6 py-4 border-b border-gray-200'>
        <h1 className='text-2xl'>Tools & Techniques</h1>
        <p className='text-sm text-gray-600 mt-1'>
          Explore emotional regulation tools to help manage your moods
        </p>
      </div>

      <div className='flex-1 overflow-y-auto px-6 py-6'>
        <div className='space-y-3'>
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool)}
              className='w-full bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow'
            >
              <div className='flex items-start gap-4'>
                <div className={`${tool.color} rounded-lg p-3`}>
                  <tool.icon size={24} />
                </div>
                <div className='flex-1 text-left'>
                  <h3 className='font-medium mb-1'>{tool.name}</h3>
                  <p className='text-sm text-gray-600 mb-2'>
                    {tool.description}
                  </p>
                  <span className='text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600'>
                    {tool.category}
                  </span>
                </div>
                <ChevronRight
                  size={20}
                  className='text-gray-400 flex-shrink-0 mt-1'
                />
              </div>
            </button>
          ))}
        </div>

        <div className='mt-8 p-4 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl'>
          <h3 className='font-medium mb-2'>Need Help?</h3>
          <p className='text-sm text-gray-600'>
            If you're experiencing persistent or severe emotional distress,
            please consider reaching out to a mental health professional. These
            tools are meant to supplement, not replace, professional care.
          </p>
        </div>
      </div>
    </div>
  );
}
