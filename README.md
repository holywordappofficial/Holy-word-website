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

### 🚀 **Quick Deploy Guide**

Both **Client** and **Server** can be deployed separately from this same repository!

**📖 Full Deployment Guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Frontend (Client)
Deploy the `client/` folder to:
- **Netlify** (Recommended) - Auto-configured with `netlify.toml`
- **Vercel** - Auto-configured with `vercel.json`
- GitHub Pages

### Backend (Server)
Deploy the `server/` folder to:
- **Railway** (Recommended) - Auto-configured with `railway.json`
- **Render** - Auto-configured with `render.yaml`
- **Heroku** - Auto-configured with `Procfile`

### ⚙️ **Environment Variables**

**Frontend:** Set `REACT_APP_API_URL` to your server URL
**Backend:** Auto-configured, no env vars needed

### 📝 **Example URLs After Deployment**
- Frontend: `https://holy-word.netlify.app`
- Backend: `https://holy-word-api.railway.app`

## License

**FREE USE ONLY - NOT FOR COMMERCIAL USE**

As it is written: "Freely you have received; freely give." - Matthew 10:8
