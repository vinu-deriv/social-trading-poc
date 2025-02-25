import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

import express, { NextFunction } from 'express';
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

// Validate required environment variables
const requiredEnvVars = ['ANTHROPIC_API_KEY', 'JSON_SERVER_URL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
}

// Custom CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');

  // Log request details
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// Debug logging middleware
app.use((req, res, next) => {
  console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not Set',
    JSON_SERVER_URL: process.env.JSON_SERVER_URL,
    PORT: process.env.PORT,
  });
  next();
});

app.use(express.json());

// Health check endpoint with detailed environment info
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV,
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    jsonServerUrl: process.env.JSON_SERVER_URL,
    port: process.env.PORT,
    missingEnvVars: missingEnvVars.length > 0 ? missingEnvVars : undefined,
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
        missingEnvVars: missingEnvVars.length > 0 ? missingEnvVars : undefined,
      },
    });

    // Send appropriate error response
    if (missingEnvVars.length > 0) {
      res.status(500).json({
        error: 'Server Configuration Error',
        message: 'Missing required environment variables',
      });
    } else {
      res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    }
  }
);

// Start server
app.listen(port, () => {
  console.log(`LLM Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`ANTHROPIC_API_KEY: ${process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not Set'}`);
  console.log(`JSON_SERVER_URL: ${process.env.JSON_SERVER_URL}`);
  if (missingEnvVars.length > 0) {
    console.error('Warning: Missing environment variables:', missingEnvVars);
  }
  console.log(`- LLM API: http://localhost:${port}/api/ai`);
  console.log(`- Market API: http://localhost:${port}/api/market`);
  console.log(`- Global AI API: http://localhost:${port}/api/global-ai`);
});

module.exports = app;
