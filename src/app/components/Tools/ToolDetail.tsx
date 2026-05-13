import { X } from 'lucide-react';
import { TherapeuticTool } from '@/app/utils/toolsConfig';

interface ToolDetailProps {
  tool: TherapeuticTool;
  onClose: () => void;
}

export default function ToolDetail({ tool, onClose }: ToolDetailProps) {
  return (
    <div className='flex flex-col h-full pb-20'>
      <div className='px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
        <h1 className='text-xl'>{tool.content.title}</h1>
        <button onClick={onClose} className='p-2'>
          <X size={24} />
        </button>
      </div>

      <div className='flex-1 overflow-y-auto px-6 py-6'>
        <div className={`${tool.color} rounded-2xl p-6 mb-6 flex items-center justify-center`}>
          <tool.icon size={64} />
        </div>

        <h2 className='text-lg mb-4'>Follow these steps:</h2>
        <div className='space-y-4'>
          {tool.content.steps.map((step, index) => (
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
            <strong>Tip:</strong> Practice this technique regularly for the best
            results. Consistency is key to developing healthy emotional
            regulation habits.
          </p>
        </div>
      </div>
    </div>
  );
}
