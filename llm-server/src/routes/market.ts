import express, { Request, Response } from 'express';
import { MarketService } from '../services/market';

const router = express.Router();
const marketService = new MarketService();

router.get('/trending-assets', async (req: Request, res: Response) => {
  try {
    const assets = await marketService.getTrendingAssets();
    res.json(assets);
  } catch (error) {
    console.error('Error fetching trending assets:', error);
    res.status(500).json({
      error: 'Internal server error while fetching trending assets',
    });
  }
});

export default router;
