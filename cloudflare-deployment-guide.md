# Complete Cloudflare Pages Deployment Guide with iOS Notifications

## Environment Variables Setup

After deploying to Cloudflare Pages, add these environment variables in your project settings:

### Required Environment Variables

1. **DATABASE_URL** (Secret)
   - Your Neon PostgreSQL database connection string
   - Value: `postgresql://neondb_owner:npg_fcW8p5lvIBCs@ep-little-moon-afi3eyzo-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - **Critical**: Without this, reviews and appointments won't work

2. **SENDGRID_API_KEY** (Secret)
   - Your SendGrid API key for email functionality
   - Used for contact form and review notifications to bobby@rentbobby.com

3. **MAKE_WEBHOOK_URL** (Secret)
   - Your Make.com webhook URL for iOS push notifications
   - Format: `https://hook.us1.make.com/[your-webhook-id]`
   - **This triggers iOS notifications to your 16promax device**

4. **SMS_WEBHOOK_URL** (Secret)
   - Your IFTTT webhook URL for SMS notifications
   - Format: `https://maker.ifttt.com/trigger/[event]/with/key/[key]`

5. **VITE_GA_MEASUREMENT_ID** (Text)
   - Your Google Analytics measurement ID
   - Format: `G-XXXXXXXXXX`

6. **CALENDLY_BOOKING_URL** (Text)
   - Your Calendly scheduling URL
   - Example: `https://calendly.com/bobby-rentbobby`

## Deployment Steps

1. **Connect Repository**
   - Go to Cloudflare Pages dashboard
   - Connect your GitHub repository
   - Select the main/master branch

2. **Build Settings**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Root directory: `/` (leave empty)

3. **Environment Variables**
   - In Cloudflare Pages settings, go to "Environment variables"
   - Add all variables listed above
   - Mark secrets as "Secret" type, others as "Text"

4. **Deploy**
   - Click "Save and Deploy"
   - Wait for build to complete

## iOS Notification Configuration

### Make.com Scenario Setup
Your Make.com scenario should have:

1. **Webhook Module (Trigger)**
   - URL: Copy this to MAKE_WEBHOOK_URL environment variable
   - Method: POST
   - Response: JSON

2. **Apple iOS Module**
   - Device: 16promax
   - Title: `{{title}}` (from webhook data)
   - Body: `{{body}}` (from webhook data)  
   - Priority: "Deliver immediately"
   - Action: "Default"

### Expected iOS Notification Format
When an appointment is booked, you'll receive:

**Title:** 📅 New Appointment: [Client Name]

**Body:**
```
[Date] at [Time] ([Duration])
[Service] - [Incall/Outcall]
📍 [Location]
📧 [Email]
📱 [Phone]
💬 [Special Requests]
```

## Testing Checklist

After deployment:

### ✅ Basic Functionality
- [ ] Website loads at your Cloudflare domain
- [ ] All sections scroll properly (parallax effects)
- [ ] Contact form sends emails
- [ ] QR code generation works
- [ ] Contact card download works

### ✅ Review System
- [ ] Review modal opens and accepts submissions
- [ ] Email notifications sent for new reviews
- [ ] Admin panel accessible at `/admin-review-checker.html`
- [ ] Review approval/deletion works
- [ ] Approved reviews display on main site

### ✅ Appointment System
- [ ] Appointment modal opens and accepts bookings
- [ ] Appointment data saves to database
- [ ] Make.com webhook receives data
- [ ] iOS notification appears on your device
- [ ] Notification contains all appointment details

### ✅ Admin Tools
- [ ] Review admin panel functional
- [ ] Database operations working
- [ ] All APIs responding correctly

## Troubleshooting

### Common Issues

**Reviews not saving:**
- Check DATABASE_URL is correctly set
- Verify PostgreSQL database is accessible

**No email notifications:**
- Verify SENDGRID_API_KEY is valid
- Check bobby@rentbobby.com is verified sender

**No iOS notifications:**
- Confirm MAKE_WEBHOOK_URL is correct webhook endpoint
- Test Make.com scenario manually
- Check iOS device notification settings

**Appointment errors:**
- Verify all form fields are filled
- Check browser console for detailed errors
- Ensure API endpoints are accessible

## Environment Variable Template

Copy this for your Cloudflare Pages settings:

```
DATABASE_URL=postgresql://username:password@host:port/database
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAKE_WEBHOOK_URL=https://hook.us1.make.com/xxxxxxxxxxxxxxxxx
SMS_WEBHOOK_URL=https://maker.ifttt.com/trigger/event/with/key/xxxxxxx
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
CALENDLY_BOOKING_URL=https://calendly.com/bobby-rentbobby
```

## Success Confirmation

You'll know everything is working when:
1. Website loads without errors on your live domain
2. Test appointment booking triggers iOS notification on your 16promax
3. Review submissions send email notifications
4. All admin functions work properly

Your professional companion services platform is now fully deployed with comprehensive iOS notification integration!