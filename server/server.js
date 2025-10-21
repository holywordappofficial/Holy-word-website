const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Read verses data
let versesData = [];
try {
  const versesPath = path.join(__dirname, 'daily verse.json');
  versesData = JSON.parse(fs.readFileSync(versesPath, 'utf8'));
  console.log(`Loaded ${versesData.length} verses`);
} catch (error) {
  console.error('Error loading verses:', error);
}

// API Route: Get all verses
app.get('/api/verses', (req, res) => {
  try {
    // Format verses for API response
    const formattedVerses = versesData.map(verse => ({
      id: verse.Count,
      english: verse["English verse"],
      englishReference: verse["English reference"],
      telugu: `${verse["Telugu verse part 1"]} ${verse["Telugu verse part 2"]}`,
      teluguReference: verse["Telugu reference"],
      backgroundImage: verse["image reference for background"]
    }));
    
    const response = {
      totalVerses: versesData.length,
      verses: formattedVerses,
      usage: {
        dailyVerse: '/api/daily-verse',
        allVerses: '/api/verses',
        documentation: 'This API provides free access to Bible verses in English and Telugu'
      }
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch verses' });
  }
});

// API Route: Get daily verse
app.get('/api/daily-verse', (req, res) => {
  try {
    // Calculate days since a fixed start date (today is day 1)
    const startDate = new Date('2025-10-20'); // Fixed start date
    const today = new Date();
    const timeDiff = today.getTime() - startDate.getTime();
    const daysSinceStart = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1; // +1 to start from day 1
    
    // Use modulo to cycle through verses (loops back to start when all verses are shown)
    const verseIndex = (daysSinceStart - 1) % versesData.length;
    const dailyVerse = versesData[verseIndex];
    
    if (!dailyVerse) {
      return res.status(404).json({ error: 'No verse found for today' });
    }

    // Format daily verse for API response
    const formattedDailyVerse = {
      id: dailyVerse.Count,
      english: dailyVerse["English verse"],
      englishReference: dailyVerse["English reference"],
      telugu: `${dailyVerse["Telugu verse part 1"]} ${dailyVerse["Telugu verse part 2"]}`,
      teluguReference: dailyVerse["Telugu reference"],
      backgroundImage: dailyVerse["image reference for background"],
      dayNumber: daysSinceStart,
      totalVerses: versesData.length
    };
    
    res.json(formattedDailyVerse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch daily verse' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    versesLoaded: versesData.length 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Holy Word API Server running on port ${PORT}`);
  console.log(`API Endpoints:`);
  console.log(`  GET /api/verses - Get all verses`);
  console.log(`  GET /api/daily-verse - Get today's verse`);
  console.log(`  GET /health - Health check`);
});
