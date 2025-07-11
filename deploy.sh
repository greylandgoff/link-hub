#!/bin/bash

echo "🚀 Deploying rentbobby.com to Cloudflare Pages..."

# Step 1: Build the frontend
echo "📦 Building frontend..."
npm run build

# Step 2: Create D1 database (if not exists)
echo "🗄️ Creating D1 database..."
npx wrangler d1 create rentbobby-production

# Step 3: Deploy to Cloudflare Pages
echo "🌐 Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name=rentbobby-com

echo "✅ Deployment complete!"
echo "📋 Next steps:"
echo "1. Go to Cloudflare Dashboard > Pages > rentbobby-com"
echo "2. Add custom domain: rentbobby.com"
echo "3. Set environment variables"
echo "4. Migrate database data"