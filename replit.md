# Personal Landing Page

## Overview
A sophisticated personal landing page with Apple-inspired parallax scrolling and earth-tone design that serves as a central hub for directing visitors to various social media profiles and platforms.

## User Preferences
- Design: "Soft Minimal" light theme (approved via canvas mockup, July 2026)
- Colors: Sand #DDD6B9 background, cream #FBF9F0 cards, forest green #3E5F44 accents, ink #283A2C text, muted #6B7362
- Fonts: Unbounded (headlines) + Jost (body)
- Style: Sleek and stylish, minimal approach; soft rounded cards (32px radius), pill buttons
- Images: Prefer bleek/minimal imagery as stylistic choice

## Contact Info
- Phone (SMS/vCard): (737) 297-2747 — used in contact modal and /api/contact-card vCard
- Location-neutral branding: no Austin/Texas mentions anywhere on the site (July 2026) — copy uses "companion"/"escort" wording only; booking form uses "Incall (my place)" / "Outcall (your place)"

## Project Architecture
- Frontend: React with Vite
- Styling: Tailwind CSS + Soft Minimal utility classes in index.css (.sm-card, .sm-btn-primary, .sm-btn-secondary, .sm-logo)
- Effects: Subtle parallax translations on scroll
- Features:
  - Social media links (OnlyFans, Rentmen, Hunqz, Chaturbate, Stripchat, Twitter, CashApp)
  - Contact card sharing functionality
  - Contact form for text/email communication
  - Responsive design

## Recent Changes
- Initial project setup (July 5, 2025)
- Implemented parallax scrolling effects
- Enhanced with vibrant neon MSN butterfly aesthetic
- Created contact card sharing functionality
- Integrated social media links with actual Bobby's handles
- Updated branding to "Bobby" with laid-back companion messaging
- Added QR code generation for easy profile sharing (July 5, 2025)
- Fixed profile photo display with proper Vite asset imports (July 6, 2025)
- Updated font to Inter for Apple/NYC subway aesthetic (July 6, 2025)
- Removed "Digital Hub" text per user preference (July 6, 2025)
- Implemented dynamic background texture generator with mood-based palettes (July 6, 2025)
- Integrated real email functionality with SendGrid (bobby@rentbobby.com verified) (July 6, 2025)
- Completed SMS integration with Twilio (+17372972747) (July 6, 2025)
- Implemented FREE webhook SMS system as primary notification method (July 7, 2025)
- Cleaned up all legacy SMS services and streamlined to JSON webhook only (July 8, 2025)
- Fixed contact modal UI - removed duplicate close buttons (July 8, 2025)
- Added phone number field to contact form for flexible communication (July 8, 2025)
- Updated profile descriptions to be less repetitive and more engaging (July 8, 2025)
- Added comprehensive footer with Privacy Policy, Terms of Use, and Support sections (July 8, 2025)
- Replaced dynamic background with custom shower photo and parallax effects (July 8, 2025)
- Updated header to display "rentbobby.com" with frosted glass text effect (July 8, 2025)
- Optimized SMS webhook format for clean, readable notifications via IFTTT (July 8, 2025)
- Implemented complete appointment booking system with Make.com iOS push notifications (July 13, 2025)
- Created functional review modal with star ratings and comprehensive feedback forms (July 13, 2025)
- Integrated Calendly booking link for appointment confirmations (July 13, 2025)
- Fixed CORS configuration and API URLs for external device access (July 13, 2025)
- Created deployment instructions for Cloudflare environment variables (July 13, 2025)
- Added email and SMS notifications for new review submissions (July 13, 2025)
- Created admin review management panel for approving/managing reviews (July 13, 2025)
- Comprehensive system testing completed - all core functionality verified (July 13, 2025)
- Optimized Make.com iOS notification integration for 16promax device (July 13, 2025)
- Created complete Cloudflare deployment guide with iOS notification setup (July 13, 2025)
- Simplified notification system to email + SMS, removed complex Make.com setup (July 13, 2025)
- Fixed review display opacity issues for local development (July 13, 2025)
- Identified deployment issue: reviews work locally but not on live site due to missing DATABASE_URL (July 13, 2025)
- Created final deployment guide with actual Neon database URL and all environment variables (July 13, 2025)
- Cloudflare Pages environment variables successfully configured - all systems ready (July 13, 2025)
- Fixed critical Cloudflare Functions - replaced Express.js routes with proper Cloudflare Functions for database connectivity (July 13, 2025)
- Corrected schema mismatches in Cloudflare Functions - Alex Thompson review confirmed in database and ready for display (July 13, 2025)
- CRITICAL FIX: Identified and resolved complete review submission failure - replaced broken TypeScript functions with working JavaScript functions (July 13, 2025)
- SECURITY VULNERABILITY PATCHED: Removed exposed database credentials from deployment documentation (July 13, 2025)
- CLOUDFLARE FUNCTIONS COMPLETELY FIXED: Replaced mock data with real Neon database connections using proper HTTP driver (July 13, 2025)
- COMPREHENSIVE SYSTEM VERIFICATION: All API endpoints tested and confirmed working - ready for production deployment (July 13, 2025)
- PRODUCTION DATABASE IDENTIFIED: Confirmed correct production Neon database URL for Cloudflare deployment (July 14, 2025)
- PRODUCTION DATABASE SETUP COMPLETE: Created all tables and sample data in production database - reviews now displaying on live site (July 14, 2025)
- DEPLOYMENT BLACK SCREEN ISSUE FULLY RESOLVED: Fixed by moving images to client/public/images and correcting service_types field name mismatch - site now works perfectly in production (July 15, 2025)
- MAJOR SITE TRANSFORMATION: Updated to professional companion services platform with age gate, screening focus, and hidden rates (July 17, 2025)
- IMPLEMENTED AGE VERIFICATION: Added dismissible 21+ banner with localStorage persistence and configurable environment flags (July 17, 2025)
- NEW HERO COPY: Changed to "Austin private host + travel companion" with "Begin Screening" CTA replacing booking button (July 17, 2025)
- SCREENING-FOCUSED FORM: Replaced appointment modal with comprehensive screening form including travel and kink preferences (July 17, 2025)
- RATE HIDING SYSTEM: Implemented VITE_SHOW_RATES flag to hide explicit pricing, showing "quoted after screening" message (July 17, 2025)
- FAQ ACCORDION: Added collapsible FAQ for travel and kink-friendly questions using custom component (July 17, 2025)
- SEO OPTIMIZATION: Added comprehensive meta tags, Open Graph, Twitter Cards, and LocalBusiness structured data (July 17, 2025)
- OUTBOUND LINK TRACKING: Implemented analytics tracking for social media and directory links with category classification (July 17, 2025)
- PROFESSIONAL DIRECTORY INTEGRATION: Added Hunqz link with proper tracking for companion service directories (July 17, 2025)
- ENHANCED AGE GATE: Converted banner to full-page warning with comprehensive 18+/21+ verification and compliance messaging (July 17, 2025)
- REFINED USER EXPERIENCE: Changed "Begin Screening" to "Request Appointment" and moved FAQ to footer tabs for cleaner flow (July 17, 2025)
- RESTORED ORIGINAL DESCRIPTION: Returned to professional companion description emphasizing authentic connections and meaningful experiences (July 17, 2025)
- FIXED SCREENING FORM SUBMISSION: Corrected API field mapping - screening requests now properly submit to database with proper field names (July 17, 2025)
- APPOINTMENT SYSTEM FULLY TESTED: Verified complete form submission, validation, database storage, and SMS notifications working correctly (July 18, 2025)
- SMS NOTIFICATION FORMAT IMPROVED: Fixed truncated messages with clean structured format, removed emoji for cleaner notifications (July 20, 2025)
- GOOGLE SHEETS INTEGRATION: Replaced SMS notifications with automated Google Sheets logging via IFTTT webhook for clean appointment tracking (July 20, 2025)
- ALL EXTERNAL NOTIFICATIONS REMOVED: Completely eliminated SMS, webhook, and Google Sheets integrations - appointments now store cleanly in database only (July 22, 2025)
- ENHANCED GOOGLE SHEETS INTEGRATION: Implemented comprehensive appointment logging with full details including date, time, duration, service type, location, special requests, and metadata (July 23, 2025)
- SIMPLIFIED CONTACT MODAL: Streamlined to direct text messaging only - removed email functionality since users can include email in appointment requests (July 23, 2025)
- DISABLED ALL IFTTT WEBHOOKS: Completely removed Google Sheets and text message notifications - appointments and reviews now store in database only (July 23, 2025)
- CUSTOM 404 PAGE: Created stylized 404 page matching site aesthetic with neon effects, glass design, and parallax animations (July 23, 2025)
- COMPREHENSIVE CODE REVIEW COMPLETED: Fixed all TypeScript errors, resolved undefined environment variables, corrected error handling, and validated type safety across entire codebase (July 24, 2025)
- REVIEW FORM BIAS REMOVAL: Changed star rating defaults from 5 to 0 stars with validation to encourage honest feedback and remove positive bias from pre-selected ratings (July 28, 2025)
- ADMIN PANEL FIELD NAME MISMATCH COMPLETELY FIXED: Resolved JavaScript error by correcting all interface field names from snake_case to camelCase to match database schema - admin panel now loads without errors (July 28, 2025)
- PRODUCTION REVIEW SUBMISSION COMPLETELY FIXED: Corrected PostgreSQL array format issue in Cloudflare Functions - reviews now submit successfully on rentbobby.com with proper database storage (July 28, 2025)
- QR CODE GENERATION FIXED: Created missing Cloudflare Function for QR code generation using external QR API service - QR codes now load properly on live site (July 28, 2025)
- UX ENHANCEMENT IMPLEMENTATION: Added "Why Book" three-column section with key benefits above the fold, sticky floating "Book Now" button, standardized H2 headings, bullet lists for better scanning, and quick actions sidebar for desktop users (July 28, 2025)
- ADVANCED UX ROADMAP ACCELERATION: Implemented interactive image gallery with client testimonials overlay, quick chat widget with instant replies, form progress tracking, dual floating action buttons (Chat + Book), and enhanced mobile engagement features targeting 15-20% bounce rate reduction (July 28, 2025)
- APPOINTMENT SUBMISSION SYSTEM FULLY FIXED: Resolved database schema mismatch preventing screening form submissions from appearing in admin portal - changed appointmentDate from date to text type to handle flexible date inputs like "this weekend" (July 29, 2025)
- SUBTLE BOYFRIEND EXPERIENCE HINTS INTEGRATED: Added natural BFE references throughout site content including hero description, social media descriptions (Rentmen as "Boyfriend experience listings", Hunqz as "GFE/BFE profile"), travel section updated to "Weekend getaways & trips", "Plus-one for events", FAQ expanded with boyfriend vibe questions, and LGBTQ section mentioning "Natural chemistry preferred" and "Genuine boyfriend vibes" (July 29, 2025)
- ADMIN PANEL PRODUCTION FIX: Created missing Cloudflare Functions for admin panel endpoints (/api/admin/reviews, /api/admin/appointments) to enable admin functionality on production site rentbobby.com - fixed issue where admin panel worked locally but not on live site (July 30, 2025)
- APPOINTMENT DATABASE STORAGE FIX: Updated Cloudflare Function to actually save appointments to database before sending notifications - fixed issue where appointments only triggered notifications but weren't stored (July 30, 2025)
- HAPTIC FEEDBACK IMPLEMENTATION: Added mobile vibration feedback to all button interactions using Vibration API - different patterns for navigation (light), CTAs (medium), errors, and success confirmations (August 11, 2025)
- APPOINTMENT SUBMISSION ERROR 500 RESOLVED: Fixed production database schema mismatch causing submission failures - appointments now successfully save to production database with ID tracking (August 11, 2025)
- SYSTEM HEALTH CHECK COMPLETED: Verified all components working correctly - appointment submissions, reviews display, admin panel, database connectivity all operational. User confirmed satisfaction with text message notifications system (August 11, 2025)
- FORM-DATA DEPENDENCY SECURITY UPDATE VERIFIED: Confirmed app still works correctly after form-data package update - it's only a transitive dependency from Twilio/Axios, not directly used (August 18, 2025)
- ONLYFANS LINK UPDATED: Changed OnlyFans URL from https://onlyfans.com/bobbyatx to https://onlyfans.com/bobbyatx/c1 per user request (August 18, 2025)
- COMPREHENSIVE SEO OPTIMIZATION IMPLEMENTATION: Added keyword-rich meta tags, FAQ section with 8 long-tail search queries, enhanced LocalBusiness schema, created sitemap.xml and robots.txt, optimized all image alt text with natural keyword placement (October 2, 2025)
- REMOVED INTERNATIONAL TRAVEL REFERENCES: Updated site content to be more accessible by replacing international travel messaging with "dates, events, and getaways" (December 23, 2025)
- ENHANCED SCREENING FORM: Added phone number field to screening form, separated screening data into individual database fields (notes, travel_request, arrival_airport, hotel_booked, interests_boundaries) instead of combining into single message (December 23, 2025)
- IMPROVED ADMIN PANEL DISPLAY: Updated admin panel to show screening data in separate color-coded snippets instead of messy combined special requests field (December 23, 2025)
- SOFT MINIMAL REDESIGN GRADUATED: Replaced dark neon theme with approved "Soft Minimal" light theme (sand/cream/forest green, Unbounded + Jost fonts) across home page, 404, SEO page, and all modals/overlays; all functionality preserved and verified via e2e test (July 11, 2026)
- LOCATION-NEUTRAL REWORDING: Removed all Austin/Texas mentions from meta tags, structured data, hero copy, FAQ, gallery alt text, SEO page, screening form locations, and server notification helpers; phone number kept as (737) 297-2747 (July 11, 2026)

## Features
1. **Social Media Integration**: Links to OnlyFans, Rentmen, Hunqz, Chaturbate, Stripchat, Twitter, CashApp
2. **Contact Card Sharing**: Save contact information to phone
3. **Contact Form**: Send text or email through contact tab with phone field option
4. **QR Code Sharing**: Generate and share QR codes for easy profile access
5. **Soft Minimal Design**: Sand/cream palette with forest green accents, rounded cards, pill buttons
6. **Parallax Effects**: Subtle scroll-based translations
7. **Live Streams**: Chaturbate/Stripchat status polling with embedded players
8. **Reviews System**: Verified client reviews with star ratings and admin approval
9. **Comprehensive Footer**: Privacy Policy, Terms of Use, FAQ, and Support tabs