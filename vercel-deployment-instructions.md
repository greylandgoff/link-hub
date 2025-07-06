# Deploy to Vercel - Step by Step

## Prerequisites
- Vercel account (free at vercel.com)
- Your project files exported from Replit

## Deployment Steps

### 1. Export Your Project
- Download all project files from Replit
- Make sure you have: `vercel.json`, all source files, and `package.json`

### 2. Deploy to Vercel
**Option A - Via Web Interface:**
1. Go to vercel.com and sign up/login
2. Click "New Project"
3. Upload your project folder
4. Vercel auto-detects React + Node.js
5. Click "Deploy"

**Option B - Via GitHub (Recommended):**
1. Push your code to GitHub repository
2. Connect GitHub to Vercel
3. Import repository
4. Auto-deploy on every commit

### 3. Add Environment Variables
In Vercel dashboard → Settings → Environment Variables:
```
SENDGRID_API_KEY=your_sendgrid_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

### 4. Connect Custom Domain
1. Vercel dashboard → Settings → Domains
2. Add: `rentbobby.com`
3. Vercel provides DNS records

### 5. Update Cloudflare DNS
In Cloudflare dashboard:
1. DNS → Manage DNS
2. Add CNAME record: `rentbobby.com` → `cname.vercel-dns.com`
3. Or use A records Vercel provides

## Benefits
- ✅ Free hosting for your entire project
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Contact form works perfectly
- ✅ Easy custom domain setup

## Your Project is Ready!
All files configured for seamless Vercel deployment.