# Holy Word Website

A beautiful website and API for daily Bible verses in English and Telugu.

## Project Structure

```
├── client/          # React frontend application
├── server/         # Express.js API server
└── README.md       # This file
```

## Features

### Frontend (Client)
- 📱 **Responsive Design**: Works on desktop and mobile
- 🌅 **Daily Verses**: Shows today's Bible verse automatically
- 🔄 **Auto Loop**: Cycles through all verses and starts over
- 🎨 **Beautiful UI**: Modern design with glass morphism effects
- 📖 **Bilingual**: English and Telugu verses side by side
- 🔗 **Developer Page**: API documentation and testing

### Backend (Server)
- 🚀 **REST API**: Clean JSON endpoints
- 🌐 **CORS Enabled**: Cross-origin requests supported
- 📅 **Daily Logic**: Automatic verse rotation based on date
- ❤️ **Free Use**: Open for non-commercial use

## Quick Start

### Frontend
```bash
cd client
npm install
npm start
```

### Backend
```bash
cd server
npm install
npm start
```

## API Endpoints

- `GET /api/daily-verse` - Today's verse
- `GET /api/verses` - All verses
- `GET /health` - Server status

## Deployment

### Frontend
Deploy the `client` folder to:
- Netlify
- Vercel
- GitHub Pages

### Backend
Deploy the `server` folder to:
- Railway
- Render
- Heroku
- Vercel

## License

**FREE USE ONLY - NOT FOR COMMERCIAL USE**

As it is written: "Freely you have received; freely give." - Matthew 10:8
