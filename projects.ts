import { Router } from 'express';
import { TemplateService } from '../services/template.service';
import path from 'path';

const router = Router();

router.post('/new', async (req, res) => {
  const { name, packageName, template } = req.body;
  const projectPath = path.join(process.cwd(), 'projects', name);

  try {
    if (template === 'empty-activity') {
      await TemplateService.generateEmptyActivity(projectPath, packageName);
    }
    res.json({ success: true, path: projectPath });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;