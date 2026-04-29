import { Router } from 'express';
import { AIService } from '../services/ai.service';

const router = Router();

router.post('/chat', async (req, res) => {
  const { messages, contextFiles } = req.body;
  try {
    const response = await AIService.getChatCompletion(messages, contextFiles);
    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;