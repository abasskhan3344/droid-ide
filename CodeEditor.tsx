import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange?: (value: string | undefined) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ language, value, onChange }) => {
  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      theme="vs-dark"
      value={value}
      onChange={onChange}
      options={{
        minimap: { enabled: true },
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        renderWhitespace: 'all',
        bracketPairColorization: { enabled: true },
        stickyScroll: { enabled: true },
      }}
    />
  );
};