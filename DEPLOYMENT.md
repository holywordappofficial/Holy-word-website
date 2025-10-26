# 🚀 Deployment Guide - Holy Word Website

This guide explains how to deploy the **Client** (Frontend) and **Server** (Backend) separately from the same repository.

---

## 📋 **Table of Contents**
1. [Overview](#overview)
2. [Deploy Frontend (Client)](#deploy-frontend-client)
3. [Deploy Backend (Server)](#deploy-backend-server)
4. [Configure Connection](#configure-connection)
5. [Testing After Deployment](#testing-after-deployment)

---

## 🎯 **Overview**

You have **2 separate applications** in this repository:
- **`client/`** - React frontend (deploy to Netlify/Vercel)
- **`server/`** - Express.js API (deploy to Railway/Render)

Both can be deployed from the **same GitHub repository** but to **different platforms**.

---

## 🌐 **Deploy Frontend (Client)**

### **Option 1: Deploy to Netlify** (Recommended - FREE)

1. **Go to [Netlify](https://www.netlify.com)** and sign in
2. **Click "Add new site" → "Import an existing project"**
3. **Connect your GitHub repository**:
   - Select: `holywordappofficial/Holy-word-website`
4. **Configure build settings**:
   ```
   Base directory: client
   Build command: npm run build
   Publish directory: client/build
   ```
5. **Add Environment Variable**:
   - Click "Site settings" → "Environment variables"
   - Add: `REACT_APP_API_URL` = `https://your-server-url.railway.app`
   - (You'll get the server URL after deploying the backend)
6. **Deploy!** Click "Deploy site"

**Your frontend will be live at:** `https://your-site.netlify.app`

---

### **Option 2: Deploy to Vercel** (FREE)

1. **Go to [Vercel](https://vercel.com)** and sign in
2. **Click "Add New Project"**
3. **Import your GitHub repository**:
   - Select: `holywordappofficial/Holy-word-website`
4. **Configure project**:
   ```
   Root Directory: client
   Framework Preset: Create React App
   Build Command: npm run build
   Output Directory: build
   ```
5. **Add Environment Variable**:
   - In project settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-server-url.railway.app`
6. **Deploy!**

**Your frontend will be live at:** `https://your-site.vercel.app`

---

## 🖥️ **Deploy Backend (Server)**

### **Option 1: Deploy to Railway** (Recommended - FREE)

1. **Go to [Railway](https://railway.app)** and sign in with GitHub
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose your repository:** `holywordappofficial/Holy-word-website`
5. **Configure deployment**:
   - Railway will auto-detect Node.js
   - If it doesn't detect correctly:
     - Click on the service → Settings
     - Set **Root Directory** to: `server`
     - Set **Start Command** to: `npm start`
6. **Deploy!** Railway will automatically deploy
7. **Get your server URL**:
   - Click on the service → Settings → Domains
   - Copy the generated URL (e.g., `holy-word-api.railway.app`)

**Your API will be live at:** `https://your-api.railway.app`

---

### **Option 2: Deploy to Render** (FREE)

1. **Go to [Render](https://render.com)** and sign in
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**:
   - Select: `holywordappofficial/Holy-word-website`
4. **Configure settings**:
   ```
   Name: holy-word-api
   Root Directory: server
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```
5. **Deploy!** Render will build and deploy
6. **Get your server URL**:
   - Copy the URL from the dashboard (e.g., `holy-word-api.onrender.com`)

**Your API will be live at:** `https://your-api.onrender.com`

---

### **Option 3: Deploy to Heroku** (FREE Tier Available)

1. **Install Heroku CLI** and login:
   ```bash
   heroku login
   ```

2. **Create a Heroku app**:
   ```bash
   cd server
   heroku create holy-word-api
   ```

3. **Set buildpack**:
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

4. **Deploy**:
   ```bash
   git subtree push --prefix server heroku main
   ```

**Your API will be live at:** `https://holy-word-api.herokuapp.com`

---

## 🔗 **Configure Connection**

After deploying both, you need to connect them:

### **1. Get Your Server URL**
- From Railway/Render/Heroku dashboard, copy your API URL
- Example: `https://holy-word-api.railway.app`

### **2. Update Frontend Environment Variable**

**In Netlify:**
1. Go to your site → Site settings → Environment variables
2. Add/Update: `REACT_APP_API_URL` = `https://your-server-url.railway.app`
3. Redeploy the site

**In Vercel:**
1. Go to your project → Settings → Environment Variables
2. Add/Update: `REACT_APP_API_URL` = `https://your-server-url.railway.app`
3. Redeploy

### **3. Verify Connection**

Test these URLs:
- Frontend: `https://your-site.netlify.app`
- API Daily Verse: `https://your-api.railway.app/api/daily-verse`
- API All Verses: `https://your-api.railway.app/api/verses`

---

## ✅ **Testing After Deployment**

### **Test Frontend:**
1. Visit your frontend URL
2. Check if daily verse loads
3. Test "For Developers" page → Click "Try API" buttons

### **Test Backend:**
1. Visit: `https://your-api.railway.app/api/daily-verse`
2. Should return JSON with today's verse
3. Visit: `https://your-api.railway.app/api/verses`
4. Should return all verses

### **Common Issues:**

**❌ CORS Error:**
- Check if server has CORS enabled (already in code ✅)

**❌ Frontend shows error:**
- Check if `REACT_APP_API_URL` is set correctly
- Make sure server URL has `https://` not `http://`

**❌ API returns 404:**
- Make sure you deployed the `server` folder, not root
- Check server logs in Railway/Render dashboard

---

## 📝 **Quick Reference**

| Component | Folder | Platform | URL Pattern |
|-----------|--------|----------|-------------|
| Frontend | `client/` | Netlify | `*.netlify.app` |
| Frontend | `client/` | Vercel | `*.vercel.app` |
| Backend | `server/` | Railway | `*.railway.app` |
| Backend | `server/` | Render | `*.onrender.com` |
| Backend | `server/` | Heroku | `*.herokuapp.com` |

---

## 🎉 **You're Done!**

Once both are deployed and connected:
- ✅ Frontend shows daily verses
- ✅ API endpoints work
- ✅ Developers can use your API
- ✅ Everything is FREE! 🎊

---

**Need Help?** Check the logs in your deployment platform's dashboard.

