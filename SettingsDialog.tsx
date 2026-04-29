import React, { useState } from 'react';

export const SettingsDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState('vs-dark');

  const save = () => {
    // Implementation for save would call backend API
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-96 rounded-lg shadow-xl border border-gray-700">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <span className="font-bold">IDE Settings</span>
          <button onClick={onClose} className="text-gray-500 hover:text-white">×</button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Editor Font Size</label>
            <input 
              type="number" 
              className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Theme</label>
            <select 
              className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="vs-dark">Darcula (Dark)</option>
              <option value="light">Light</option>
              <option value="hc-black">High Contrast</option>
            </select>
          </div>
        </div>
        <div className="p-4 border-t border-gray-700 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 text-sm hover:bg-gray-700 rounded">Cancel</button>
          <button onClick={save} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-500">Save Changes</button>
        </div>
      </div>
    </div>
  );
};