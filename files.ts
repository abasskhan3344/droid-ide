import { Router } from 'express';
import fs from 'fs-extra';
import path from 'path';

const router = Router();
const ROOT_DIR = process.cwd();

// Get file tree
router.get('/tree', async (req, res) => {
  const getTree = async (dir: string): Promise<any> => {
    const stats = await fs.lstat(dir);
    const info: any = {
      path: path.relative(ROOT_DIR, dir),
      name: path.basename(dir),
    };

    if (stats.isDirectory()) {
      info.type = 'directory';
      const children = await fs.readdir(dir);
      info.children = await Promise.all(
        children
          .filter(child => !['node_modules', '.git', 'dist'].includes(child))
          .map(child => getTree(path.join(dir, child)))
      );
    } else {
      info.type = 'file';
    }
    return info;
  };

  try {
    const tree = await getTree(ROOT_DIR);
    res.json(tree);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Read file content
router.get('/read', async (req, res) => {
  const filePath = req.query.path as string;
  if (!filePath) return res.status(400).send('Path is required');

  try {
    const fullPath = path.join(ROOT_DIR, filePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    res.json({ content });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Write file content
router.post('/write', async (req, res) => {
  const { path: filePath, content } = req.body;
  if (!filePath) return res.status(400).send('Path is required');

  try {
    const fullPath = path.join(ROOT_DIR, filePath);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, content, 'utf-8');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;