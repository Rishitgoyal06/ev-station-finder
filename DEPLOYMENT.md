# Vercel Deployment Guide - Frontend Only

## Quick Deploy Steps

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Deploy frontend to Vercel"
git remote add origin https://github.com/YOUR_USERNAME/ev-station-finder.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

**Option A: Via Dashboard (Easiest)**

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Click "Deploy" (Next.js is auto-detected)
5. Done! Your site is live

**Option B: Via CLI**

```bash
npm i -g vercel
vercel login
vercel --prod
```

### 3. Important Note

⚠️ **Backend Services**: The chatbot and EV backend will NOT work on the deployed site since they run on localhost. The deployed site will show:
- ✅ All pages and UI
- ✅ Animations and interactions
- ❌ Chatbot (needs backend on localhost:5555)
- ❌ EV Station Finder (needs backend on localhost:8000)

**For Full Functionality**: Keep backends running locally or deploy them separately later.

### 4. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS as instructed

## Troubleshooting

**Build fails?**
- Check build logs in Vercel dashboard
- Run `npm run build` locally first

**404 errors?**
- Ensure all files are committed to git
- Check Vercel build logs

## Success! 🎉

Your frontend is now live on Vercel!

**Deployment URL**: `https://your-project.vercel.app`
