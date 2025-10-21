const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Read the verses JSON file from the functions directory
    const versesPath = path.join(__dirname, 'verses-data.json');
    const versesData = JSON.parse(fs.readFileSync(versesPath, 'utf8'));
    
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
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify(response, null, 2)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Failed to fetch verses' }, null, 2)
    };
  }
};
