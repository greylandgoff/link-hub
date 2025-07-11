# Files to Update for Structured Review System

## 1. Database Schema Changes
**File: `shared/schema.ts`**
- Completely replaced the old `reviews` table with structured fields
- Added 6 rating scales (appearance, punctuality, communication, professionalism, chemistry, discretion)
- Added 3 yes/no questions (wouldBookAgain, bookingProcessSmooth, matchedDescription)
- Added serviceTypes array and optional additionalComments
- Updated insertReviewSchema to match new fields

## 2. Frontend Review Form
**File: `client/src/components/review-modal.tsx`**
- Complete rewrite with structured form layout
- Star rating components for each category
- Checkbox questions for yes/no responses
- Service type checkboxes (Incall, Outcall, Dinner companion, etc.)
- 200-character limit comment field with live counter
- Form validation updated for new required fields

## 3. Homepage Changes
**File: `client/src/pages/home.tsx`**
- Added "Leave Review" button next to "Save Contact" button
- Purple/blue gradient styling to make it prominent
- Analytics tracking for review modal opens

## 4. Admin Interface Updates
**File: `client/src/pages/admin.tsx`**
- Updated Review interface to match new schema
- Displays rating breakdown for all 6 categories
- Shows yes/no responses with color coding
- Service type badges display
- Average rating calculation and display

## 5. Backend API Updates
**File: `server/routes.ts`**
- Updated POST /api/reviews to handle structured data
- Enhanced email notifications with detailed breakdown
- Average rating calculation for subject line
- All new fields properly destructured and saved

## 6. Database Migration Required
After updating the code, you'll need to run:
```bash
npm run db:push
```
This will update your database schema to match the new structure.

## 7. Key Features Added
- 6 detailed rating scales (1-5 stars each)
- 3 yes/no questions for quick feedback
- Service type selection (multiple choice)
- Optional 200-character comment field
- Structured admin interface for review management
- Enhanced email notifications with full breakdown
- Prominent "Leave Review" button on homepage

## Next Steps
1. Copy these updated files to your GitHub repository
2. Push changes to GitHub
3. Cloudflare Pages will automatically redeploy
4. Run database migration on your production database
5. Test the new review system on your live site

The new system allows clients to complete reviews in under 1 minute with simple clicks and checkboxes instead of writing lengthy text reviews.