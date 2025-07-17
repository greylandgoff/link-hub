# RentBobby - Austin Private Host & Travel Companion

A professional companion services platform featuring an age-gated experience, screening-focused booking process, and comprehensive client management system.

## Features

- **Age Gate & Screening**: 21+ verification with dismissible banner and screening-focused booking flow
- **Professional Presentation**: Clean, modern design without explicit content on public pages
- **Travel Integration**: Built-in travel booking requests with airport and hotel coordination
- **Client Reviews**: Database-driven review system with admin management
- **SEO Optimized**: Structured data, meta tags, and social media integration
- **Analytics Tracking**: Outbound link tracking and engagement analytics

## Environment Variables

### Required for Production

```env
# Email notifications
SENDGRID_API_KEY=your_sendgrid_api_key

# SMS notifications  
SMS_WEBHOOK_URL=your_ifttt_webhook_url

# Analytics
VITE_GA_MEASUREMENT_ID=your_google_analytics_id

# Booking integration
CALENDLY_BOOKING_URL=your_calendly_link

# Feature flags
VITE_SHOW_RATES=false
VITE_REQUIRE_AGE_GATE=true
```

### Development Defaults

- `VITE_SHOW_RATES=false` - Hide rates, show "quoted after screening" message
- `VITE_REQUIRE_AGE_GATE=true` - Show age verification banner

## Architecture

- **Frontend**: React + TypeScript with Vite
- **Styling**: Tailwind CSS with custom neon MSN butterfly aesthetic
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Cloudflare Pages with serverless functions
- **Forms**: Screening-focused intake with travel and preference fields

## Key Components

### Age Gate System
- Sticky banner for 21+ verification
- LocalStorage persistence (`rb_ack` key)
- Configurable via `VITE_REQUIRE_AGE_GATE`

### Screening Form
- Name, email, location, dates (required)
- Travel booking toggle with airport/hotel fields
- Private interests/boundaries section
- Professional rate disclosure

### SEO & Analytics
- Structured data (LocalBusiness schema)
- Open Graph and Twitter Card meta tags
- Outbound link tracking for directories
- Google Analytics integration

## Installation

1. Clone repository
2. Install dependencies: `npm install`
3. Set environment variables in `.env`
4. Run development server: `npm run dev`
5. Deploy to Cloudflare Pages

## Database Setup

The app uses PostgreSQL with tables for:
- `reviews` - Client testimonials and ratings
- `appointments` - Screening requests and bookings
- `users` - Admin access (if needed)

Run `npm run db:push` to sync schema changes.

## Admin Access

Visit `/admin` with password `bobby2025admin` to:
- View all reviews (approved and pending)
- Approve/hide reviews
- Delete inappropriate content
- Manage client feedback

## SEO Features

- **Title**: "RentBobby – Austin Private Host & Travel Companion"
- **Description**: "Austin-based LGBTQ personal host. Discreet meetups, events, and travel by arrangement. Screening required."
- **Canonical URL**: https://rentbobby.com
- **Structured Data**: LocalBusiness with ReserveAction
- **Social Sharing**: Optimized Open Graph and Twitter Cards

## Deployment Notes

1. Set all environment variables in Cloudflare Pages
2. Ensure database URL is configured for production
3. Test age gate functionality
4. Verify structured data with Google Rich Results Test
5. Confirm outbound link tracking in Analytics

## Support

For technical issues or feature requests, contact through the site's contact form or admin panel.