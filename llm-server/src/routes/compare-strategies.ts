import express from 'express';
import { strategyService } from '../services/strategy';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { strategies } = req.body;
    console.log('strategies.length', strategies.length);
    if (!Array.isArray(strategies) || strategies.length < 2 || strategies.length > 4) {
      return res.status(400).json({
        error: 'Must provide between 2 and 4 strategies to compare',
      });
    }

    const comparison = await strategyService.compareStrategies(strategies);
    res.json({ comparison });
  } catch (error) {
    console.error('[API] Error comparing strategies:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to compare strategies',
    });
  }
});

export default router;
