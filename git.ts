import { Router } from 'express';
import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';

const router = Router();
const ROOT_DIR = process.cwd();

// Git Status
router.get('/status', async (req, res) => {
  const projectPath = req.query.path as string || ROOT_DIR;
  try {
    const status = await git.statusMatrix({ fs, dir: projectPath });
    res.json(status.map(row => ({
      filepath: row[0],
      status: row.slice(1).join('')
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Git Commit
router.post('/commit', async (req, res) => {
  const { path: projectPath, message, author } = req.body;
  try {
    const sha = await git.commit({
      fs,
      dir: projectPath || ROOT_DIR,
      message,
      author: { name: author || 'User', email: 'user@example.com' }
    });
    res.json({ success: true, sha });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;