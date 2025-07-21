import React from 'react';
import { 
  Square, 
  Image as ImageIcon, 
  Type, 
  CheckSquare, 
  BarChart3,
  Layers,
  ChevronDown,
  Menu
} from 'lucide-react';

interface Component {
  id: string;
  name: string;
  icon: React.ReactNode;
  category?: string;
}

interface SidebarProps {
  onAddComponent: (componentType: string) => void;
}

const components: Component[] = [
  { id: 'button', name: 'Button', icon: <Square className="w-4 h-4" /> },
  { id: 'chart', name: 'Chart', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'checkboxes', name: 'Checkboxes', icon: <CheckSquare className="w-4 h-4" /> },
  { id: 'container', name: 'Container', icon: <Layers className="w-4 h-4" /> },
  { id: 'image', name: 'Image', icon: <ImageIcon className="w-4 h-4" /> },
  { id: 'input', name: 'Input', icon: <Type className="w-4 h-4" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ onAddComponent }) => {
  return (
    <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Menu className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">maks-warehouse-funnel / screen_16</span>
        </div>
        
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm text-gray-300 bg-gray-800 rounded">
            Screens
          </button>
          <button className="px-3 py-1.5 text-sm text-white bg-cyan-600 rounded">
            Add Element
          </button>
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 p-4">
        <div className="space-y-1">
          {components.map((component) => (
            <button
              key={component.id}
              onClick={() => onAddComponent(component.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded hover:bg-gray-800 transition-colors ${
                component.id === 'image' ? 'bg-gray-700 text-white' : 'text-gray-300'
              }`}
            >
              {component.icon}
              <span>{component.name}</span>
              <Menu className="w-3 h-3 ml-auto text-gray-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};