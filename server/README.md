# Holy Word API Server

This is the backend API server for the Holy Word application, providing Bible verses in English and Telugu.

## Features

- **Daily Verse API**: Get today's Bible verse based on a fixed start date
- **All Verses API**: Get all available Bible verses
- **CORS Enabled**: Cross-origin requests supported
- **Health Check**: Monitor server status

## API Endpoints

### GET /api/daily-verse
Returns today's Bible verse in both English and Telugu.

**Response:**
```json
{
  "id": 1,
  "english": "Jesus answered, \"I am the way and the truth and the life. No one comes to the Father except through me.\"",
  "englishReference": "John 14:6",
  "telugu": "యేసు–నేనే మార్గమును, సత్యమును, జీవమును; నా ద్వారానే తప్ప యెవడును తండ్రియొద్దకు రాడు.",
  "teluguReference": "యోహాను 14:6",
  "backgroundImage": "a straight path leading to a bright light",
  "dayNumber": 1,
  "totalVerses": 1000
}
```

### GET /api/verses
Returns all available Bible verses.

**Response:**
```json
{
  "totalVerses": 1000,
  "verses": [...],
  "usage": {
    "dailyVerse": "/api/daily-verse",
    "allVerses": "/api/verses",
    "documentation": "This API provides free access to Bible verses in English and Telugu"
  }
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-21T10:52:00.000Z",
  "versesLoaded": 1000
}
```

## Installation

```bash
npm install
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will run on port 3001 by default, or the PORT environment variable.

## Daily Verse Logic

- Starts from October 20, 2025 (fixed start date)
- Each day gets the next verse in sequence
- When all verses are shown, it loops back to the beginning
- Uses modulo arithmetic to ensure continuous cycling

## License

This API is provided for **FREE USE ONLY** - **NOT FOR COMMERCIAL USE**

As it is written: "Freely you have received; freely give." - Matthew 10:8
