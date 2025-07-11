# Deploy rentbobby.com to Cloudflare Pages

Since you already own the rentbobby.com domain on Cloudflare, here's the simplified deployment process:

## Step 1: Login to Cloudflare
```bash
npx wrangler login
```

## Step 2: Create D1 Database
```bash
npx wrangler d1 create rentbobby-production
```
Copy the database ID from the output and update wrangler.toml

## Step 3: Build the App
```bash
npm run build
```

## Step 4: Deploy to Cloudflare Pages
```bash
npx wrangler pages deploy dist --project-name=rentbobby-com
```

## Step 5: Connect Your Domain
1. Go to Cloudflare Dashboard > Pages > rentbobby-com
2. Custom domains > Add custom domain
3. Add: rentbobby.com
4. DNS records will auto-configure since you own the domain

## Step 6: Set Environment Variables
In Cloudflare Dashboard > Pages > rentbobby-com > Settings > Environment Variables:

**Production Variables:**
- `DATABASE_URL` = (Your D1 database connection)
- `SENDGRID_API_KEY` = (Your SendGrid key)
- `VITE_GA_MEASUREMENT_ID` = G-Q6MS63ZPR4
- `WEBHOOK_URL` = (Your webhook URL)

## Step 7: Database Migration
Export your current reviews:
```bash
# Export current review data
curl https://your-replit-app.replit.dev/api/admin/reviews > reviews-backup.json
```

Then import to D1 database through the Cloudflare dashboard.

## That's it! 
Your app will be live at rentbobby.com with:
- Static files served from Cloudflare's global CDN
- Database powered by Cloudflare D1
- Automatic HTTPS and global performance
- 24/7 uptime