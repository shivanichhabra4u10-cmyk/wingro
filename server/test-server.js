// Simple Express server test
const express = require('express');
const app = express();
const PORT = 3001;

// Root route handler
app.get('/', (req, res) => {
  res.send('Server is working correctly!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('Try accessing this URL in your browser');
});
