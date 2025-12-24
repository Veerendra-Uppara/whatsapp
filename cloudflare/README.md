# Cloudflare Deployment Guide

This folder contains configuration files for deploying the Private Chat Application to Cloudflare.

## Deployment Options

### Option 1: Cloudflare Pages (Frontend Only)

For the React frontend, you can deploy to Cloudflare Pages:

1. **Build the React app:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy via Cloudflare Dashboard:**
   - Go to Cloudflare Dashboard > Pages
   - Create a new project
   - Connect your GitHub repository
   - Set build command: `cd client && npm install && npm run build`
   - Set build output directory: `client/build`
   - Set root directory: `/`

3. **Or deploy via Wrangler CLI:**
   ```bash
   npm install -g wrangler
   wrangler pages deploy client/build --project-name=private-chat-app
   ```

### Option 2: Cloudflare Workers (Backend API)

For the Node.js backend with Socket.io, you'll need to:

1. **Note:** Socket.io requires WebSocket support, which Cloudflare Workers supports via Durable Objects or Cloudflare Stream.

2. **Alternative:** Deploy backend separately (e.g., Railway, Render, Fly.io) and connect frontend to it.

### Option 3: Full-Stack with Cloudflare Pages + Functions

1. Deploy frontend to Cloudflare Pages
2. Use Cloudflare Functions for API endpoints
3. For WebSocket/Socket.io, use external service or Cloudflare Durable Objects

## Environment Variables

Set these in Cloudflare Dashboard > Pages > Settings > Environment Variables:

- `REACT_APP_SOCKET_URL` - Your backend WebSocket URL
- `NODE_ENV` - Set to `production`

## Recommended Architecture

For a Socket.io chat app:
- **Frontend:** Cloudflare Pages (free, fast CDN)
- **Backend:** Deploy separately to:
  - Railway (easy, supports WebSockets)
  - Render (free tier available)
  - Fly.io (good for Node.js apps)
  - Or use Cloudflare Durable Objects for WebSocket support

## Quick Deploy Script

```bash
# Build frontend
cd client
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy build --project-name=private-chat-app
```

## Configuration Files

- `wrangler.toml` - Wrangler CLI configuration
- `_redirects` - URL rewrite rules for SPA
- `_headers` - Security headers configuration

