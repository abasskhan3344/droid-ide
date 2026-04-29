import { useState, useEffect } from 'react';

export const useFileSystem = () => {
  const [tree, setTree] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchTree = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/files/tree');
      const data = await res.json();
      setTree(data);
    } catch (err) {
      console.error('Failed to fetch file tree:', err);
    } finally {
      setLoading(false);
    }
  };

  const readFile = async (path: string) => {
    const res = await fetch(`/api/files/read?path=${encodeURIComponent(path)}`);
    const data = await res.json();
    return data.content;
  };

  const writeFile = async (path: string, content: string) => {
    await fetch('/api/files/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content }),
    });
  };

  useEffect(() => {
    fetchTree();
  }, []);

  return { tree, loading, fetchTree, readFile, writeFile };
};