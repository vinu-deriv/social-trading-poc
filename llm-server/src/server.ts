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

// CORS configuration
const corsOptions = {
  origin: true, // reflects the request origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not Set',
    JSON_SERVER_URL: process.env.JSON_SERVER_URL,
  });
  next();
});

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV,
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    jsonServerUrl: process.env.JSON_SERVER_URL,
  });
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

// Error handling middleware with detailed logging
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      headers: req.headers,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
        jsonServerUrl: process.env.JSON_SERVER_URL,
      },
    });

    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
);

// Start server
app.listen(port, () => {
  console.log(`LLM Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`ANTHROPIC_API_KEY: ${process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not Set'}`);
  console.log(`JSON_SERVER_URL: ${process.env.JSON_SERVER_URL}`);
  console.log(`- LLM API: http://localhost:${port}/api/ai`);
  console.log(`- Market API: http://localhost:${port}/api/market`);
  console.log(`- Global AI API: http://localhost:${port}/api/global-ai`);
});

module.exports = app;
