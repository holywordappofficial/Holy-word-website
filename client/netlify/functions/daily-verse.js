const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Read the verses JSON file from the functions directory
    const versesPath = path.join(__dirname, 'verses-data.json');
    const versesData = JSON.parse(fs.readFileSync(versesPath, 'utf8'));
    
    // Calculate days since a fixed start date (today is day 1)
    const startDate = new Date('2025-10-20'); // Fixed start date
    const today = new Date();
    const timeDiff = today.getTime() - startDate.getTime();
    const daysSinceStart = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1; // +1 to start from day 1
    
    // Use modulo to cycle through verses (loops back to start when all verses are shown)
    const verseIndex = (daysSinceStart - 1) % versesData.length;
    const dailyVerse = versesData[verseIndex];
    
    if (!dailyVerse) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'No verse found for today' }, null, 2)
      };
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
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify(formattedDailyVerse, null, 2)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Failed to fetch daily verse' }, null, 2)
    };
  }
};
