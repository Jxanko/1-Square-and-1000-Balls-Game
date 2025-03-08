const express = require('express');
const path = require('path');
const morgan = require('morgan');
const app = express();
const port = 3000;

// Enable logging middleware
app.use(morgan('dev'));

// Serve static files from the public directory
app.use(express.static('public'));

// Route for the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Log server startup
app.listen(port, () => {
    console.clear();
    console.log('\x1b[36m%s\x1b[0m', '🚀 Server Status:');
    console.log('\x1b[32m%s\x1b[0m', '✓ Server is running');
    console.log('\x1b[32m%s\x1b[0m', `✓ Port: ${port}`);
    console.log('\x1b[32m%s\x1b[0m', `✓ URL: http://localhost:${port}`);
    console.log('\x1b[36m%s\x1b[0m', '\n📝 Server Logs:');
}); 