import { Router } from 'express';

const router = Router();

// Mock Plugin Registry
const PLUGINS = [
  { id: 'firebase-assistant', name: 'Firebase Assistant', description: 'Easily add Firebase to your Android project.', version: '1.0.0' },
  { id: 'json-to-kotlin', name: 'JSON to Kotlin Class', description: 'Convert JSON strings to Kotlin Data Classes.', version: '1.2.0' },
  { id: 'material-icons', name: 'Material Icon Browser', description: 'Browse and insert Material Design icons.', version: '2.1.0' }
];

router.get('/marketplace', (req, res) => {
  res.json(PLUGINS);
});

export default router;