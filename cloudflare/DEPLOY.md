# Cloudflare Deployment Guide

This guide will help you deploy your Private Chat Application to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account (free tier works)
2. GitHub repository with your code
3. Node.js installed locally (for building)

## Deployment Steps

### Option 1: Deploy via Cloudflare Dashboard (Recommended)

1. **Build the React app locally:**
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Go to Cloudflare Dashboard:**
   - Visit https://dash.cloudflare.com
   - Navigate to **Pages** in the sidebar
   - Click **Create a project**

3. **Connect your repository:**
   - Choose **Connect to Git**
   - Select your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Cloudflare to access your repositories
   - Select your repository

4. **Configure build settings:**
   - **Project name:** `private-chat-app` (or your preferred name)
   - **Production branch:** `main` (or `master`)
   - **Build command:** `cd client && npm install && npm run build`
   - **Build output directory:** `client/build`
   - **Root directory:** `/` (leave empty or set to root)

5. **Set Environment Variables:**
   - Click on your project → **Settings** → **Environment Variables**
   - Add `REACT_APP_SOCKET_URL` with your backend WebSocket URL
   - Add `NODE_ENV` = `production`

6. **Deploy:**
   - Click **Save and Deploy**
   - Wait for the build to complete
   - Your app will be live at `https://your-project.pages.dev`

### Option 2: Deploy via Wrangler CLI

1. **Install Wrangler:**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare:**
   ```bash
   wrangler login
   ```

3. **Build the app:**
   ```bash
   cd client
   npm install
   npm run build
   ```

4. **Deploy:**
   ```bash
   wrangler pages deploy build --project-name=private-chat-app
   ```

## Backend Deployment

**Important:** Cloudflare Pages only hosts static files. For your Socket.io backend, you need to deploy it separately:

### Recommended Backend Hosting Options:

1. **Railway** (Easy, supports WebSockets)
   - Visit https://railway.app
   - Connect your GitHub repo
   - Select the `server` folder
   - Deploy automatically

2. **Render** (Free tier available)
   - Visit https://render.com
   - Create a new Web Service
   - Connect your repo
   - Set root directory to `server`

3. **Fly.io** (Good for Node.js)
   - Visit https://fly.io
   - Follow their Node.js deployment guide

4. **Cloudflare Workers with Durable Objects** (Advanced)
   - Requires rewriting backend for Cloudflare Workers
   - Supports WebSockets via Durable Objects

## Environment Variables

### Frontend (Cloudflare Pages):
- `REACT_APP_SOCKET_URL` - Your backend WebSocket URL (e.g., `https://your-backend.railway.app`)

### Backend (Separate hosting):
- `PORT` - Server port (usually auto-assigned)
- `DATABASE_URL` - If using external database (Supabase, etc.)

## Post-Deployment

1. **Update Socket URL:**
   - After deploying backend, update `REACT_APP_SOCKET_URL` in Cloudflare Pages settings
   - Redeploy frontend if needed

2. **Test the connection:**
   - Open your deployed app
   - Check browser console for connection status
   - Try sending a message

3. **Custom Domain (Optional):**
   - In Cloudflare Pages, go to **Custom domains**
   - Add your domain
   - Update DNS records as instructed

## Troubleshooting

### Build fails:
- Check build logs in Cloudflare Dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### WebSocket connection fails:
- Ensure backend is deployed and running
- Check CORS settings on backend
- Verify `REACT_APP_SOCKET_URL` is set correctly
- Check browser console for errors

### Static files not loading:
- Verify `_redirects` and `_headers` files are in `client/public`
- Check build output directory is correct
- Ensure all assets are in the build folder

## Notes

- Cloudflare Pages provides free SSL certificates
- CDN is automatically enabled for fast global delivery
- Builds are triggered automatically on git push (if connected to Git)
- Preview deployments are created for pull requests

