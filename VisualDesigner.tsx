import React, { useState } from 'react';

interface Component {
  id: string;
  type: string;
  text: string;
  x: number;
  y: number;
}

export const VisualDesigner: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addComponent = (type: string) => {
    const newComp = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      text: type === 'TextView' ? 'Hello World' : 'Button',
      x: 50,
      y: 50
    };
    setComponents([...components, newComp]);
  };

  return (
    <div className="flex h-full bg-gray-700">
      {/* Palette */}
      <div className="w-48 bg-gray-800 border-r border-black p-2">
        <div className="text-xs font-bold text-gray-500 mb-2 uppercase">Palette</div>
        <div className="space-y-2">
          {['TextView', 'Button', 'ImageView', 'Switch'].map(type => (
            <div 
              key={type} 
              className="bg-gray-700 p-2 rounded cursor-pointer hover:bg-gray-600 text-sm"
              onClick={() => addComponent(type)}
            >
              {type}
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden bg-white m-4 shadow-2xl rounded" style={{ width: '360px', height: '640px', maxWidth: '360px' }}>
        {components.map(c => (
          <div 
            key={c.id}
            className={`absolute p-2 cursor-move ${selectedId === c.id ? 'outline outline-2 outline-blue-500' : ''}`}
            style={{ left: c.x, top: c.y }}
            onClick={() => setSelectedId(c.id)}
          >
            {c.type === 'Button' ? (
              <button className="bg-blue-600 text-white px-4 py-2 rounded shadow">{c.text}</button>
            ) : (
              <span className="text-black">{c.text}</span>
            )}
          </div>
        ))}
      </div>

      {/* Attributes */}
      <div className="w-64 bg-gray-800 border-l border-black p-2">
        <div className="text-xs font-bold text-gray-500 mb-2 uppercase">Attributes</div>
        {selectedId ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs block text-gray-400">Text Value</label>
              <input 
                className="w-full bg-gray-900 border border-gray-700 p-1 text-sm"
                value={components.find(c => c.id === selectedId)?.text || ''}
                onChange={(e) => {
                  setComponents(components.map(c => c.id === selectedId ? { ...c, text: e.target.value } : c));
                }}
              />
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-600 italic">Select a component to edit</div>
        )}
      </div>
    </div>
  );
};