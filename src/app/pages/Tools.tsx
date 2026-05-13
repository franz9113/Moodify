import { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { tools } from '@/app/utils/toolsConfig';
import ToolsList from '@/app/components/Tools/ToolsList';
import ToolDetail from '@/app/components/Tools/ToolDetail';

export default function Tools() {
  const [selectedTool, setSelectedTool] = useState<(typeof tools)[0] | null>(
    null,
  );

  if (selectedTool) {
    return <ToolDetail tool={selectedTool} onClose={() => setSelectedTool(null)} />;
  }

  return <ToolsList tools={tools} onSelectTool={setSelectedTool} />;
}
