# 🚀 Deploy Server to Vercel

## Step-by-Step Guide to Deploy Holy Word API Server to Vercel

### Prerequisites
- GitHub account (your code is already on GitHub)
- Vercel account (sign up at https://vercel.com - FREE)

---

## 📋 **Deployment Steps:**

### **1. Login to Vercel**
1. Go to https://vercel.com
2. Click **"Sign Up"** or **"Login"**
3. Sign in with GitHub (recommended)

### **2. Create New Project**
1. Click **"Add New..."** → **"Project"**
2. Import your repository: `holywordappofficial/Holy-word-website`
3. Vercel will detect it's a Node.js project

### **3. Configure Build Settings**
In the project settings, configure:

**Root Directory:** `server`

**Build Command:** (leave empty or remove)

**Output Directory:** (leave empty)

**Install Command:** `npm install`

**Framework Preset:** Other

**Node.js Version:** 18.x or 20.x

### **4. Environment Variables**
No environment variables needed for basic setup, but you can add:
- `PORT` (optional, Vercel handles this automatically)

### **5. Deploy**
1. Click **"Deploy"**
2. Wait for deployment (1-2 minutes)
3. Your API will be live at: `https://your-project-name.vercel.app`

### **6. Get Your API URL**
After deployment, Vercel will show you a URL like:
- `https://holy-word-api.vercel.app`

**Your API endpoints will be:**
- `https://your-api.vercel.app/api/verses`
- `https://your-api.vercel.app/api/daily-verse`
- `https://your-api.vercel.app/health`

---

## 🔧 **Vercel Configuration File**

Create `vercel.json` in the `server` folder:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

---

## ✅ **Verify Deployment**

Test your API:
```bash
# Test health endpoint
curl https://your-api.vercel.app/health

# Test daily verse
curl https://your-api.vercel.app/api/daily-verse

# Test all verses
curl https://your-api.vercel.app/api/verses
```

---

## 📝 **Update Frontend After Deployment**

Once your server is deployed, update the frontend:

1. Go to **Netlify** → Your site → **Site settings** → **Environment variables**
2. Add new variable:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://your-api.vercel.app`
3. **Redeploy** your Netlify site

Or update `client/src/App.tsx` to use the new URL (already has environment variable support).

---

## 🎯 **Quick Checklist:**
- ✅ Server deployed to Vercel
- ✅ API URL obtained
- ✅ Frontend environment variable updated in Netlify
- ✅ Frontend redeployed with new API URL
- ✅ Tested both endpoints

---

## 💡 **Tips:**
- Vercel has a **free tier** with generous limits
- Auto-deploys on every git push
- Serverless functions scale automatically
- Perfect for API hosting!

🎉 **Your API server is now live on Vercel!**
