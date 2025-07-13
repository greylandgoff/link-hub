# Cloudflare Deployment Instructions

## Required Environment Variables

Add these environment variables in your Cloudflare Pages settings:

### Database Connection
```
DATABASE_URL=your_neon_database_connection_string
```

### Email Service (SendGrid)
```
SENDGRID_API_KEY=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
```

### SMS Notifications (IFTTT Webhook)
```
SMS_WEBHOOK_URL=https://maker.ifttt.com/trigger/message_received/json/with/key/de4K7-_D7YhlgPVyvXdyyE-wy85_dl3mhk3WYKknWm-
```

### Analytics
```
VITE_GA_MEASUREMENT_ID=G-Q6MS63ZPR4
```

### Calendly Integration
```
CALENDLY_BOOKING_URL=https://calendly.com/bobby-rentbobby
```

### iOS Notifications (Make.com) - Optional
```
MAKE_IOS_NOTIFICATION_WEBHOOK=your_make_webhook_url_here
PUSHOVER_APP_TOKEN=your_pushover_app_token_here
PUSHOVER_USER_KEY=your_pushover_user_key_here
IFTTT_WEBHOOK_KEY=your_ifttt_key_here
```

## Setup Steps

1. **Add Environment Variables in Cloudflare:**
   - Go to your Cloudflare Pages dashboard
   - Navigate to Settings > Environment Variables
   - Add all the variables listed above
   - Deploy the changes

2. **Database Connection:**
   - The most critical variable is `DATABASE_URL`
   - This connects your app to the Neon PostgreSQL database
   - Without this, reviews and appointments won't work

3. **Git Commit & Deploy:**
   - Commit the CORS and API URL fixes to your repository
   - Cloudflare will automatically redeploy with the new environment variables

## Troubleshooting

If reviews still don't appear after adding `DATABASE_URL`:
1. Check Cloudflare Functions logs for database connection errors
2. Verify the DATABASE_URL format is correct
3. Ensure the Neon database is accessible from Cloudflare's network

## Features Status After Deployment

✅ **Working Features:**
- CORS configuration for external device access
- Dynamic API URLs for production deployment
- Review submission and display system
- Appointment booking with Make.com integration
- Contact forms with email/SMS notifications
- QR code generation and contact card sharing

✅ **Database Features:**
- Review storage and approval system
- Appointment tracking and management
- User data persistence

The main issue preventing reviews from showing on your live site is the missing `DATABASE_URL` environment variable in Cloudflare.