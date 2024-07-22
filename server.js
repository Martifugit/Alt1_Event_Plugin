const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Tracking requests
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Redirect any /public/public requests to /public
app.get('/public/*', (req, res, next) => {
  if (req.url.startsWith('/public/public')) {
    const newPath = req.url.replace('/public/public', '/public');
    console.log(`Redirecting to: ${newPath}`);
    res.redirect(newPath);
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
