# Deployment Guide for AI Chatbot with Todo Application

## Important Note about GitHub Pages

**GitHub Pages cannot host this Next.js application** because:

1. GitHub Pages only serves static HTML/CSS/JS files
2. It does not support server-side rendering or API routes
3. Your Next.js app needs to communicate with the backend API
4. The application requires dynamic functionality that GitHub Pages cannot provide

## Recommended Deployment Options

### Option 1: Deploy to Vercel (Recommended)

Vercel is the creator of Next.js and provides the best deployment experience:

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project" and select your repository
4. Vercel will automatically detect it's a Next.js project
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g., `https://your-app-name.up.railway.app/api/v1`)
6. Click "Deploy"

### Option 2: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign in and click "Add new site"
3. Select "Deploy with GitHub"
4. Choose your repository
5. Set build settings:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/out`
6. Add environment variable: `NEXT_PUBLIC_API_URL`

### Option 3: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Import your repository
4. Railway will handle both frontend and backend deployment

## Backend Deployment Requirements

Your backend must be deployed separately and accessible via a public URL:

1. **Deploy the backend first** (using Railway, Render, or other platforms)
2. **Get the backend API URL** (e.g., `https://my-app-production.up.railway.app`)
3. **Update the frontend configuration** with the backend URL
4. **Deploy the frontend** using one of the methods above

## Environment Variables

For any deployment platform, you'll need to set:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
```

## Configuration for Different Deployment Platforms

### For Vercel
- Framework preset: Next.js
- Build command: `cd frontend && npm install && npm run build`
- Output directory: `frontend/out` (if using static export)

### For Netlify
- Build command: `cd frontend && npm install && npm run build`
- Publish directory: `frontend/out`

### For Static Deployment (if using static export)
If you want to deploy as static files (with limitations):
```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.com/api/v1',
  },
}
```

## Important Considerations

1. **CORS**: Your backend must allow requests from your frontend domain
2. **API URL**: Ensure your `NEXT_PUBLIC_API_URL` is correctly set
3. **Backend First**: Always deploy your backend before the frontend
4. **Testing**: Test the connection between frontend and backend after deployment

## Development vs Production

- **Development**: `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`
- **Production**: `NEXT_PUBLIC_API_URL=https://your-deployed-backend.com/api/v1`

## Example Deployment Commands

### Deploy Backend to Railway:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

### Deploy Frontend to Vercel:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

## Troubleshooting

1. **API calls failing**: Check CORS settings on your backend
2. **Environment variables not working**: Verify they're set correctly on your deployment platform
3. **Static build issues**: Consider using SSR deployment instead of static export
4. **Connection errors**: Ensure your backend is deployed and accessible

## Architecture Overview

```
┌─────────────┐    HTTP    ┌─────────────┐
│   Frontend  │ ─────────▶ │   Backend   │
│ (Vercel/    │            │ (Railway/   │
│  Netlify)   │ ◀──────── ┤  Render)    │
└─────────────┘   API      └─────────────┘
```

The frontend and backend must be deployed separately but configured to communicate with each other.