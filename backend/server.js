const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '../client')));

// Routes
app.use('/api', apiRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
        console.warn('\n\n⚠️ Warning: No Gemini/Google API key detected.\nPlease set GEMINI_API_KEY (or GOOGLE_API_KEY) in your environment or in a .env file in the backend/ directory.\n\n');
    }
});
