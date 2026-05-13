import { ChevronRight } from 'lucide-react';
import type { TherapeuticTool } from '@/app/utils/toolsConfig';

interface ToolsListProps {
  tools: TherapeuticTool[];
  onSelectTool: (tool: TherapeuticTool) => void;
}

export default function ToolsList({ tools, onSelectTool }: ToolsListProps) {
  return (
    <div className='flex-1 overflow-y-auto px-6 py-6'>
      <div className='space-y-3'>
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool)}
            className='w-full bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow'
          >
            <div className='flex items-start gap-4'>
              <div className={`${tool.color} rounded-lg p-3`}>
                <tool.icon size={24} />
              </div>
              <div className='flex-1 text-left'>
                <h3 className='font-medium mb-1'>{tool.name}</h3>
                <p className='text-sm text-gray-600 mb-2'>{tool.description}</p>
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
          If you're experiencing persistent or severe emotional distress, please
          consider reaching out to a mental health professional. These tools are
          meant to supplement, not replace, professional care.
        </p>
      </div>
    </div>
  );
}
