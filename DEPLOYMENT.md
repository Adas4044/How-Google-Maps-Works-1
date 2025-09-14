# Vercel Deployment Guide

## Prerequisites
- Vercel account (free at [vercel.com](https://vercel.com))
- Node.js installed locally

## Quick Deploy

### Option 1: One-Click Local Deployment (Easiest)

**For Mac/Linux:**
```bash
./deploy-local.sh
```

**For Windows:**
```cmd
deploy-local.bat
```

These scripts will automatically:
- ✅ Check Node.js installation
- ✅ Install dependencies
- ✅ Build the project
- ✅ Install Vercel CLI if needed
- ✅ Deploy to production
- ✅ Give you the live URL

**Manual CLI Deployment:**

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Login to Vercel**
```bash
vercel login
```
This will open your browser to authenticate.

**Step 3: Deploy from Local Directory**
```bash
# Navigate to your project directory
cd /path/to/your/project

# Deploy to production
vercel --prod

# OR deploy for preview first
vercel
```

**Step 4: Follow CLI Prompts**
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N** (for first deploy)
- What's your project's name? Enter a name
- In which directory is your code located? **./** 
- Want to override settings? **N** (our vercel.json handles this)

Your app will be deployed and you'll get a live URL!

### Option 2: Deploy via GitHub

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect it's a Vite project

3. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-project-name.vercel.app`

### Option 3: Drag & Drop Deployment (Easiest)

1. **Build your project locally**
   ```bash
   npm run build
   ```

2. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"

3. **Drag & Drop**
   - Drag your `dist` folder directly to the upload area
   - OR click "Browse" and select your `dist` folder
   - Click "Deploy"

4. **Done!** Your app is live instantly.

### Option 4: ZIP File Upload

1. **Build and compress**
   ```bash
   npm run build
   cd dist
   zip -r ../my-app.zip .
   cd ..
   ```

2. **Upload to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select "Deploy from .zip"
   - Upload `my-app.zip`
   - Click "Deploy"

## Local Development & Testing

Before deploying, test your app locally:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (test this works!)
npm run build

# Preview production build locally
npm run preview
```

**Important**: Always run `npm run build` successfully before deploying!

## Deployment Methods Comparison

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| **Drag & Drop** | Easiest, no CLI needed | Manual process, no auto-updates | One-time deploys, beginners |
| **Vercel CLI** | Fast, can automate, preview deploys | Requires CLI installation | Developers, frequent updates |
| **GitHub** | Auto-deploys, version control | Requires Git/GitHub setup | Team projects, CI/CD |
| **ZIP Upload** | Simple, works anywhere | Manual, no auto-updates | Quick demos, sharing |

## Configuration

The project includes:
- ✅ `vercel.json` - Optimized configuration
- ✅ `.vercelignore` - Excludes unnecessary files
- ✅ `@vercel/analytics` - Integrated analytics
- ✅ Proper caching headers for assets
- ✅ SPA routing configuration
- ✅ Chunk splitting for better performance

## Environment Variables

If you need environment variables:
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add your variables

## Custom Domain

To use a custom domain:
1. Go to your Vercel project dashboard
2. Settings → Domains
3. Add your domain
4. Follow DNS configuration instructions

## Analytics

Vercel Analytics is already integrated! After deployment:
- View analytics in your Vercel dashboard
- Track page views, user sessions, and performance
- No additional configuration needed

## Automatic Deployments

Once connected to GitHub:
- Every push to `main` branch auto-deploys to production
- Pull requests create preview deployments
- Zero-downtime deployments

## Performance Optimizations

The deployment includes:
- Asset caching (1 year for static files)
- Video/image optimization headers
- Gzip compression
- CDN distribution worldwide

## Troubleshooting

**Build fails?**
- Check `npm run build` works locally
- Ensure all dependencies are in `package.json`

**Videos not loading?**
- Ensure video files are in `public/videos/`
- Check file sizes (Vercel has limits)

**Analytics not working?**
- Analytics may take 24-48 hours to show data
- Check Vercel dashboard for any errors

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel) 