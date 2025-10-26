# 🚀 Deploy Frontend to Netlify

## Step-by-Step Guide to Deploy Holy Word Frontend to Netlify

### Prerequisites
- GitHub account (your code is already on GitHub)
- Netlify account (sign up at https://netlify.com - FREE)

---

## 📋 **Deployment Steps:**

### **1. Login to Netlify**
1. Go to https://netlify.com
2. Click **"Sign up"** or **"Log in"**
3. Sign in with GitHub (recommended)

### **2. Add New Site**
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"GitHub"** as your Git provider
3. Select repository: `holywordappofficial/Holy-word-website`

### **3. Configure Build Settings**
In the **"Build settings"** section:

**Base directory:** `client`

**Build command:** `npm run build`

**Publish directory:** `client/build`

**Branch to deploy:** `main`

### **4. Environment Variables** ⚠️ **IMPORTANT**
Click **"Show advanced"** → **"New variable"**:

**Key:** `REACT_APP_API_URL`

**Value:** `https://your-api-server.vercel.app`

*(Update this after you deploy your server to Vercel)*

### **5. Deploy**
1. Click **"Deploy site"**
2. Wait for build (2-3 minutes)
3. Your site will be live at: `https://your-site-name.netlify.app`

### **6. Custom Domain (Optional)**
- Go to **Site settings** → **Domain management**
- Add your custom domain
- Follow DNS configuration instructions

---

## 🔄 **Update API URL After Server Deployment**

Once your **server is deployed to Vercel**, update the frontend:

1. Go to Netlify Dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Edit `REACT_APP_API_URL`:
   - Change value to: `https://your-vercel-api.vercel.app`
5. Go to **Deploys** → **Trigger deploy** → **Deploy site**

---

## ✅ **Verify Deployment**

Test your frontend:
1. Visit `https://your-site.netlify.app`
2. Check if daily verse loads correctly
3. Test the "For Developers" page
4. Click "Try API" buttons

---

## 🎯 **Quick Checklist:**
- ✅ Frontend deployed to Netlify
- ✅ Environment variable `REACT_APP_API_URL` set
- ✅ Build completed successfully
- ✅ Site is live and accessible
- ✅ Daily verse loads from API
- ✅ (After server deployment) Updated API URL

---

## 💡 **Tips:**
- Netlify has a **free tier** with unlimited requests
- Auto-deploys on every git push to `main`
- Free SSL certificate included
- Fast CDN worldwide
- Perfect for React apps!

🎉 **Your frontend is now live on Netlify!**
