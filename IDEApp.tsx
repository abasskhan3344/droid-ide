import React, { useState } from 'react';
import { CodeEditor } from '../Editor/CodeEditor';
import { FileTree } from '../Sidebar/FileTree';
import { useFileSystem } from '../../hooks/useFileSystem';
import { AIChat } from '../AIAssistant/AIChat';
import { Terminal } from '../Terminal/Terminal';
import { VisualDesigner } from '../LayoutEditor/VisualDesigner';

export const IDEApp: React.FC = () => {
  const { tree, readFile, writeFile } = useFileSystem();
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [code, setCode] = useState('// Select a file to start editing');
  const [viewMode, setViewMode] = useState<'code' | 'design'>('code');

  const handleFileClick = async (path: string) => {
    const content = await readFile(path);
    setActiveFile(path);
    setCode(content);
    if (path.endsWith('.xml')) setViewMode('design');
    else setViewMode('code');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-300 overflow-hidden font-sans">
      <div className="h-8 bg-gray-800 flex items-center px-4 border-b border-black">
        <div className="flex space-x-4 text-sm font-medium">
          <span className="cursor-pointer hover:text-white">File</span>
          <span className="cursor-pointer hover:text-white">Build</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-gray-800 border-r border-black flex flex-col">
           <FileTree tree={tree} onFileClick={handleFileClick} />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="h-9 bg-gray-800 flex items-center px-4 border-b border-black justify-between">
            <span className="text-xs text-blue-400">{activeFile || 'No file open'}</span>
            {activeFile?.endsWith('.xml') && (
              <div className="flex bg-gray-900 rounded p-0.5 text-xs">
                <button className={`px-2 py-1 ${viewMode === 'code' ? 'bg-gray-700 text-white' : ''}`} onClick={() => setViewMode('code')}>Code</button>
                <button className={`px-2 py-1 ${viewMode === 'design' ? 'bg-gray-700 text-white' : ''}`} onClick={() => setViewMode('design')}>Design</button>
              </div>
            )}
          </div>
          <div className="flex-1 relative">
             {viewMode === 'code' ? (
               <CodeEditor language="kotlin" value={code} onChange={v => setCode(v || '')} />
             ) : (
               <VisualDesigner />
             )}
          </div>
          <div className="h-48 border-t border-black">
             <Terminal />
          </div>
        </div>

        <div className="w-80">
          <AIChat />
        </div>
      </div>
    </div>
  );
};