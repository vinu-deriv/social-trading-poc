import { Router } from 'express';
import { getPeopleSuggestions } from '../services/peopleSuggestions';

const router = Router();

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const suggestions = await getPeopleSuggestions(userId);
    res.json(suggestions);
  } catch (error) {
    console.error('Error getting people suggestions:', error);
    res.status(500).json({ error: 'Failed to get people suggestions' });
  }
});

export default router;
