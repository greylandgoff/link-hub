import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, desc } from 'drizzle-orm';

// Define the reviews table inline to avoid import issues
import { pgTable, text, serial, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  appearance: integer("appearance").notNull(),
  punctuality: integer("punctuality").notNull(),
  communication: integer("communication").notNull(),
  professionalism: integer("professionalism").notNull(),
  chemistry: integer("chemistry").notNull(),
  discretion: integer("discretion").notNull(),
  wouldBookAgain: boolean("would_book_again").notNull(),
  bookingProcessSmooth: boolean("booking_process_smooth").notNull(),
  matchedDescription: boolean("matched_description").notNull(),
  serviceTypes: text("service_types").array().notNull(),
  additionalComments: text("additional_comments"),
  isApproved: boolean("is_approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export async function onRequest(context) {
  const { request, env } = context;
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  if (request.method === 'GET') {
    try {
      if (!env.DATABASE_URL) {
        console.error('DATABASE_URL not configured');
        return new Response(JSON.stringify({ 
          error: 'Database not configured',
          details: 'DATABASE_URL environment variable missing'
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // Connect to database using proper Neon HTTP driver
      const sql = neon(env.DATABASE_URL);
      const db = drizzle(sql);
      
      // Check if this is an admin request (you can add more sophisticated auth later)
      const url = new URL(request.url);
      const isAdmin = url.searchParams.get('admin') === 'true';
      
      let reviewsData;
      if (isAdmin) {
        // Return all reviews for admin
        reviewsData = await db.select().from(reviews).orderBy(desc(reviews.createdAt));
        console.log(`Admin query successful: Found ${reviewsData.length} total reviews`);
      } else {
        // Return only approved reviews for public
        reviewsData = await db.select().from(reviews).where(eq(reviews.isApproved, true)).orderBy(desc(reviews.createdAt));
        console.log(`Public query successful: Found ${reviewsData.length} approved reviews`);
      }
      
      return new Response(JSON.stringify(reviewsData), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch reviews',
        details: error.message 
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
  
  if (request.method === 'POST') {
    try {
      const reviewData = await request.json();
      
      // Validate required fields
      if (!reviewData.name || !reviewData.email) {
        return new Response(JSON.stringify({ 
          error: 'Name and email are required' 
        }), {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // Insert review into database using Drizzle ORM
      if (!env.DATABASE_URL) {
        console.error('DATABASE_URL not configured for review submission');
        return new Response(JSON.stringify({ 
          error: 'Database not configured',
          details: 'Cannot save review without database connection'
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      let savedReview;
      try {
        const sql = neon(env.DATABASE_URL);
        const db = drizzle(sql);
        
        // Insert review using Drizzle ORM
        const insertResult = await db.insert(reviews).values({
          name: reviewData.name,
          email: reviewData.email,
          appearance: reviewData.appearance || 5,
          punctuality: reviewData.punctuality || 5,
          communication: reviewData.communication || 5,
          professionalism: reviewData.professionalism || 5,
          chemistry: reviewData.chemistry || 5,
          discretion: reviewData.discretion || 5,
          wouldBookAgain: reviewData.wouldBookAgain || false,
          bookingProcessSmooth: reviewData.bookingProcessSmooth || false,
          matchedDescription: reviewData.matchedDescription || false,
          serviceTypes: reviewData.serviceTypes || [],
          additionalComments: reviewData.additionalComments || '',
          isApproved: false
        }).returning({ id: reviews.id });
        
        savedReview = insertResult[0];
        console.log('Review saved to database with ID:', savedReview?.id);
        
        if (!savedReview?.id) {
          throw new Error('Database insertion returned no ID');
        }
      } catch (dbError) {
        console.error('Database insert failed:', dbError);
        return new Response(JSON.stringify({ 
          error: 'Failed to save review to database',
          details: dbError.message
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      // Send email notification via SendGrid
      if (env.SENDGRID_API_KEY) {
        try {
          const avgRating = Math.round((
            (reviewData.appearance || 5) + 
            (reviewData.punctuality || 5) + 
            (reviewData.communication || 5) + 
            (reviewData.professionalism || 5) + 
            (reviewData.chemistry || 5) + 
            (reviewData.discretion || 5)
          ) / 6);
          
          const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: { email: 'bobby@rentbobby.com', name: 'RentBobby Reviews' },
              to: [{ email: 'bobby@rentbobby.com' }],
              subject: `⭐ New Review Submitted - ${avgRating}/5 Stars from ${reviewData.name}`,
              text: `New review submitted:\n\nReviewer: ${reviewData.name}\nEmail: ${reviewData.email}\nOverall Rating: ${avgRating}/5 stars\n\nRatings:\n- Appearance: ${reviewData.appearance || 5}/5\n- Punctuality: ${reviewData.punctuality || 5}/5\n- Communication: ${reviewData.communication || 5}/5\n- Professionalism: ${reviewData.professionalism || 5}/5\n- Chemistry: ${reviewData.chemistry || 5}/5\n- Discretion: ${reviewData.discretion || 5}/5\n\nServices: ${(reviewData.serviceTypes || []).join(', ')}\n\nComments: ${reviewData.additionalComments || 'None'}\n\nWould book again: ${reviewData.wouldBookAgain ? 'Yes' : 'No'}\nBooking process smooth: ${reviewData.bookingProcessSmooth ? 'Yes' : 'No'}\nMatched description: ${reviewData.matchedDescription ? 'Yes' : 'No'}`
            })
          });
          
          console.log('Email notification sent:', emailResponse.ok);
        } catch (emailError) {
          console.error('Email notification failed:', emailError);
        }
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: `Review submitted successfully! Review ID: ${savedReview.id}`,
        reviewId: savedReview.id
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.error('Review submission error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to submit review',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  return new Response('Method not allowed', { status: 405 });
}