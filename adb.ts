import { Router } from 'express';
import { ADBService } from '../services/adb.service';

const router = Router();

router.get('/devices', async (req, res) => {
  try {
    const devices = await ADBService.listDevices();
    res.json(devices);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;