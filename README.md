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

### 🚀 **Recommended Setup**

- **Frontend (Client)**: Deploy to **Netlify** (Already hosted ✅)
- **Backend (Server)**: Deploy to **Vercel** (Recommended for Node.js APIs)

### 📋 **Step-by-Step Deployment**

#### **1. Deploy Server to Vercel** 🆕

**📖 Detailed Guide:** See [server/VERCEL_DEPLOYMENT.md](./server/VERCEL_DEPLOYMENT.md)

**Quick Steps:**
1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"**
3. Import repository: `holywordappofficial/Holy-word-website`
4. Configure:
   - **Root Directory:** `server`
   - **Framework Preset:** Other
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)
5. Click **"Deploy"**
6. Copy your API URL (e.g., `https://holy-word-api.vercel.app`)

#### **2. Update Frontend on Netlify** 🔄

**📖 Detailed Guide:** See [client/NETLIFY_DEPLOYMENT.md](./client/NETLIFY_DEPLOYMENT.md)

**Quick Steps:**
1. Go to Netlify Dashboard → Your site
2. **Site settings** → **Environment variables**
3. Add/Update:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://your-vercel-api.vercel.app` (from step 1)
4. **Deploys** → **Trigger deploy** → **Deploy site**

### ⚙️ **Environment Variables**

**Frontend (Netlify):**
- `REACT_APP_API_URL` = Your Vercel API URL

**Backend (Vercel):**
- No environment variables needed (auto-configured)

### 📝 **Example URLs After Deployment**
- Frontend: `https://holyword.netlify.app` ✅ (Already live)
- Backend: `https://holy-word-api.vercel.app` (After Vercel deployment)

## License

**FREE USE ONLY - NOT FOR COMMERCIAL USE**

As it is written: "Freely you have received; freely give." - Matthew 10:8
