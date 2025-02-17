import express, { Request, Response } from 'express';
import { LLMService } from '../services/llm';
import { DataService } from '../services/data';
import { MarketService } from '../services/market';

const router = express.Router();
const llmService = new LLMService();
const dataService = new DataService();

const marketService = new MarketService();

// Get AI insights for a symbol
router.get(
  '/ai-insights-for-symbol/:symbol',
  async (req: Request<{ symbol: string }>, res: Response) => {
    try {
      const { symbol } = req.params;

      // Get market data
      const [price, news] = await Promise.all([
        marketService.getSymbolPrice(symbol),
        marketService.getSymbolNews(symbol),
      ]);

      if (!price) {
        return res.status(404).json({ error: 'Symbol not found' });
      }

      // Generate insights
      const insight = await llmService.generateSymbolInsight({
        symbol,
        currentPrice: price,
        news,
      });

      if (!insight) {
        return res.status(404).json({ error: 'Failed to generate insight' });
      }

      res.json({ insight });
    } catch (error) {
      console.error('Error generating symbol insight:', error);
      res.status(500).json({
        error: 'Internal server error while generating symbol insight',
      });
    }
  }
);

router.get('/feed-insights/:userId', async (req: Request<{ userId: string }>, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await dataService.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const [posts, strategies] = await Promise.all([
      dataService.getUserPosts(),
      dataService.getUserStrategies(userId),
    ]);

    const insights = await llmService.generatePostInsights(posts, user, strategies);

    res.json({ insights });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({
      error: 'Internal server error while generating insights',
    });
  }
});

router.get(
  '/post-insight/:userId/:postId',
  async (req: Request<{ userId: string; postId: string }>, res: Response) => {
    try {
      const { userId, postId } = req.params;

      const [user, post] = await Promise.all([
        dataService.getUser(userId),
        dataService.getPost(postId),
      ]);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const strategies = await dataService.getUserStrategies(userId);
      const insight = await llmService.generatePostInsight(post, user, strategies);

      if (!insight) {
        return res.status(404).json({ error: 'Failed to generate insight' });
      }

      res.json({ insight });
    } catch (error) {
      console.error('Error generating insight:', error);
      res.status(500).json({
        error: 'Internal server error while generating insight',
      });
    }
  }
);

export default router;
