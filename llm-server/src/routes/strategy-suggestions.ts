import express from 'express';
import { getStrategySuggestions } from '../services/strategySuggestions';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId as string | undefined;
    const recommendations = await getStrategySuggestions(userId);
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting strategy suggestions:', error);
    res.status(500).json({ error: 'Failed to get strategy suggestions' });
  }
});

export default router;
