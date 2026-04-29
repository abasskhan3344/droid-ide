import React from 'react';

interface FileNodeProps {
  node: any;
  onFileClick: (path: string) => void;
}

const FileNode: React.FC<FileNodeProps> = ({ node, onFileClick }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (node.type === 'file') {
    return (
      <div 
        className="pl-4 py-0.5 hover:bg-gray-700 cursor-pointer text-gray-300 flex items-center"
        onClick={() => onFileClick(node.path)}
      >
        <span className="mr-2 text-xs">📄</span>
        {node.name}
      </div>
    );
  }

  return (
    <div>
      <div 
        className="pl-2 py-0.5 hover:bg-gray-700 cursor-pointer text-gray-200 flex items-center font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-2 text-xs text-gray-500">{isOpen ? '▼' : '▶'}</span>
        <span className="mr-2 text-xs">📁</span>
        {node.name}
      </div>
      {isOpen && node.children && (
        <div className="border-l border-gray-700 ml-3">
          {node.children.map((child: any) => (
            <FileNode key={child.path} node={child} onFileClick={onFileClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileTree: React.FC<{ tree: any; onFileClick: (path: string) => void }> = ({ tree, onFileClick }) => {
  if (!tree) return <div className="p-4 text-xs text-gray-500">Loading project...</div>;
  return (
    <div className="py-2 select-none overflow-x-auto">
      <FileNode node={tree} onFileClick={onFileClick} />
    </div>
  );
};