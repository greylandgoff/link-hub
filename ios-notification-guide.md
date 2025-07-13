# iOS Notification Setup Guide with Make.com

## Overview
Your appointment booking system is configured to send data to Make.com, which then triggers native iOS push notifications to your device (16promax).

## Current Configuration

### 1. Make.com Webhook Integration
- **Webhook URL**: Set via `MAKE_WEBHOOK_URL` environment variable
- **Trigger**: Fires when new appointments are booked
- **Data Format**: Optimized for Make.com iOS notification module

### 2. iOS Notification Payload Structure
The webhook sends these key fields to Make.com:

```json
{
  "title": "📅 New Appointment: [Client Name]",
  "body": "[Date] at [Time] ([Duration])\n[Service] - [Incall/Outcall]\n📍 [Location]\n📧 [Email]\n📱 [Phone]\n💬 [Message]",
  "appointment_id": "apt_[timestamp]_[random]",
  "client_name": "[Name]",
  "client_email": "[Email]",
  "client_phone": "[Phone]",
  "appointment_date": "[YYYY-MM-DD]",
  "appointment_time": "[HH:MM]",
  "duration": "[X hours]",
  "service_type": "[Service]",
  "location": "[Location]",
  "special_requests": "[Message]",
  "webhook_event": "appointment_booked",
  "priority": "high"
}
```

### 3. Make.com Scenario Setup
In your Make.com scenario:
1. **Webhook** - Receives appointment data from your website
2. **Apple iOS** - Sends push notification to your device
   - Device: 16promax
   - Title: Use `{{title}}` from webhook
   - Body: Use `{{body}}` from webhook  
   - Priority: "Deliver immediately"

### 4. Environment Variables Needed
For Cloudflare deployment, add these environment variables:

```
MAKE_WEBHOOK_URL=https://hook.us1.make.com/[your-webhook-id]
CALENDLY_BOOKING_URL=https://calendly.com/bobby-rentbobby
DATABASE_URL=[your-postgres-connection-string]
SENDGRID_API_KEY=[your-sendgrid-key]
SMS_WEBHOOK_URL=[your-sms-webhook-url]
```

### 5. Notification Content Example
When someone books an appointment, you'll receive an iOS notification like:

**Title:** 📅 New Appointment: Sarah Johnson

**Body:** 
```
2025-07-25 at 18:00 (3 hours)
Companion Services - Outcall
📍 Downtown Austin
📧 sarah.johnson@email.com
📱 +1 (555) 123-4567
💬 Looking forward to dinner and conversation
```

### 6. Testing
- Test appointments trigger webhook to Make.com
- Make.com processes data and sends iOS notification
- Notification appears on your iPhone with all appointment details
- Rich formatting with emojis and structured information

### 7. Priority Settings
- **High Priority**: Delivers immediately, bypasses Do Not Disturb
- **Default**: Respects device notification settings
- Current setting: "Deliver immediately" for urgent appointment notifications

## Next Steps
1. Deploy code to Cloudflare with environment variables
2. Test appointment booking from live site
3. Verify iOS notifications are received on your device
4. Adjust notification content/format if needed