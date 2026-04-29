import React, { useState } from 'react';

export const AIChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, contextFiles: [] })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.text }]);
    } catch (err) {
      console.error('AI Error:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 border-l border-black">
      <div className="p-3 text-xs font-bold uppercase text-gray-500 border-b border-black">AI Assistant</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded ${m.role === 'user' ? 'bg-blue-900 text-white self-end' : 'bg-gray-700 text-gray-200'}`}>
             {m.content}
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-black flex">
        <input 
          className="flex-1 bg-gray-900 text-white rounded-l p-2 outline-none border border-gray-700 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask AI..."
        />
        <button onClick={sendMessage} className="bg-blue-600 px-3 rounded-r text-white hover:bg-blue-500">Send</button>
      </div>
    </div>
  );
};