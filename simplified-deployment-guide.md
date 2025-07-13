# Simplified Cloudflare Deployment Guide

## Required Environment Variables

Add these 4 essential environment variables in your Cloudflare Pages settings:

### 1. DATABASE_URL (Secret) - CRITICAL FOR REVIEWS
Your Neon PostgreSQL connection string - **This is why reviews don't show on your live site**
```
postgresql://neondb_owner:npg_fcW8p5lvIBCs@ep-little-moon-afi3eyzo-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```
**Without this variable, reviews and appointments won't work on the deployed site**

### 2. SENDGRID_API_KEY (Secret)  
Your SendGrid API key for email notifications
```
SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. SMS_WEBHOOK_URL (Secret)
Your IFTTT webhook URL for SMS notifications
```
https://maker.ifttt.com/trigger/message_received/json/with/key/de4K7-_D7YhlgPVyvXdyyE-wy85_dl3mhk3WYKknWm-
```

### 4. CALENDLY_BOOKING_URL (Text)
Your Calendly scheduling URL
```
https://calendly.com/bobby-rentbobby
```

### Optional (only if you want website analytics):
**VITE_GA_MEASUREMENT_ID** (Text) - Skip this if you don't need analytics
```
G-Q6MS63ZPR4
```

## How It Works

### Email Notifications
When someone books an appointment, you'll receive a professional email at bobby@rentbobby.com with:
- Client information (name, email, phone)
- Appointment details (date, time, duration, service, location)
- Special requests
- Direct link to your Calendly for scheduling

### SMS Notifications via IFTTT
You'll also receive an SMS text message with:
- Client name and contact info
- Appointment summary
- Date, time, and service type
- Incall/Outcall location type

## Deployment Steps

1. **Add Environment Variables**
   - Go to Cloudflare Pages dashboard
   - Settings > Environment Variables
   - Add the 4 variables above (mark secrets as "Secret" type)

2. **Deploy**
   - Cloudflare will automatically redeploy with new variables
   - Your site will be fully functional

## What You'll Receive

When someone books an appointment:

**Email Example:**
```
Subject: 🗓️ New Appointment Request: Sarah Johnson

Client: Sarah Johnson
Email: sarah@example.com
Phone: +1 (555) 123-4567

Date: 2025-07-25
Time: 18:00
Duration: 3 hours
Service: Companion Services
Location: Downtown Austin

Special Requests: Dinner and conversation
```

**SMS Example:**
```
📅 APPOINTMENT: Sarah Johnson - 2025-07-25 at 18:00 (3 hours) - Companion Services - Outcall - sarah@example.com - +1 (555) 123-4567
```

## Testing
After deployment:
1. Book a test appointment from your live site
2. Check your email for the detailed notification
3. Check your phone for the SMS alert
4. Verify all information is correct

This simplified system removes all the complex webhook configurations and gives you reliable email + SMS notifications for every appointment booking.