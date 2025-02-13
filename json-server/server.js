const express = require('express');
const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');

const app = express();
const router = jsonServer.router(path.join(__dirname, 'data', 'db.json'));
const middlewares = jsonServer.defaults();

// Enable CORS for all routes
app.use(cors());

// Use json-server defaults (logger, static, etc)
app.use(middlewares);

// In development, mount json-server router at root and /api
// This allows both localhost:3001/users and localhost:3001/api/users to work
app.use('/', router);
app.use('/api', router);

const port = process.env.PORT || 3001;
app.listen(port, '0.0.0.0', () => {
  console.log(`JSON Server is running on port ${port}`);
});
