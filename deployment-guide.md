# Cloudflare Deployment Guide

## Option 1: Static Frontend Only (Simplest)

### Deploy React App to Cloudflare Pages:
1. Build the frontend: `npm run build`
2. Upload the `dist` folder to Cloudflare Pages
3. Set custom domain to `rentbobby.com`

**Limitation**: Contact form won't work (no backend)

## Option 2: Full-Stack with Cloudflare Workers (Recommended)

### Frontend (Cloudflare Pages):
1. Build React app: `npm run build`
2. Deploy `dist` folder to Cloudflare Pages
3. Connect to `rentbobby.com`

### Backend (Cloudflare Workers):
1. Convert Express API to Cloudflare Workers
2. Handle contact form submissions
3. Use Cloudflare Workers environment variables for secrets

### Database:
- Switch from memory storage to Cloudflare D1 (SQLite)
- Or use external service like PlanetScale/Neon

## Option 3: Alternative - Vercel (Easier for Full-Stack)

If Cloudflare Workers seems complex:
1. Deploy entire project to Vercel
2. Point `rentbobby.com` DNS to Vercel
3. Works with existing Express backend

## Current Project Status:
- ✅ Frontend: React + Vite (ready for static deployment)
- ⚠️ Backend: Express (needs conversion for Cloudflare Workers)
- ⚠️ Storage: In-memory (needs persistent database for production)
- ✅ Assets: All images included
- ✅ Environment: SendGrid + Twilio configured

## Recommendation:
Start with **Vercel** for easiest deployment, then migrate to Cloudflare Workers later if desired.