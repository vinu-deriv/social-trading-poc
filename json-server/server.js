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

// Custom middleware to preserve original URLs and log image URLs
router.render = (req, res) => {
  const data = res.locals.data;

  // Log image URLs for debugging
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item.content && item.content.images) {
        console.log('[Image URLs]', item.content.images);
      }
    });
  } else if (data.content && data.content.images) {
    console.log('[Image URLs]', data.content.images);
  }

  // Return the data as-is without any URL transformation
  res.jsonp(data);
};

// In development, mount json-server router at root and /api
// This allows both localhost:3001/users and localhost:3001/api/users to work
app.use('/', router);
app.use('/api', router);

const port = process.env.PORT || 3001;
app.listen(port, '0.0.0.0', () => {
  console.log(`JSON Server is running on port ${port}`);
});
