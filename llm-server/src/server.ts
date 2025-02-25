import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

import express, { NextFunction } from 'express';
import cors from 'cors';
import insightsRouter from './routes/insights';
import translationRouter from './routes/translation';
import marketRouter from './routes/market';
import compareStrategiesRouter from './routes/compare-strategies';
import chatRouter from './routes/chat';
import leaderSuggestionsRouter from './routes/leaderSuggestions';
import globalAIRouter from './routes/globalAI';
import peopleSuggestionsRouter from './routes/people-suggestions';
import strategySuggestionsRouter from './routes/strategy-suggestions';

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = [
  'https://social-trading-poc-sooty.vercel.app',
  'https://social-trading-poc-git-main-vinuderivs-projects.vercel.app',
];

// CORS configuration
const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Add CORS headers to all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
});

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mount routes
app.use('/api/ai', insightsRouter);
app.use('/api/translation', translationRouter);
app.use('/api/market', marketRouter);
app.use('/api/compare-strategies', compareStrategiesRouter);
app.use('/api/', chatRouter);
app.use('/api/leader-suggestions', leaderSuggestionsRouter);
app.use('/api/global-ai', globalAIRouter);
app.use('/api/people-suggestions', peopleSuggestionsRouter);
app.use('/api/strategy-suggestions', strategySuggestionsRouter);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
);

// Start server
app.listen(port, () => {
  console.log(`LLM Server running on port ${port}`);
  console.log(`- LLM API: http://localhost:${port}/api/ai`);
  console.log(`- Market API: http://localhost:${port}/api/market`);
  console.log(`- Global AI API: http://localhost:${port}/api/global-ai`);
});

module.exports = app;
