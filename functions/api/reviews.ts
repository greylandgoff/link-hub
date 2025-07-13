import type { PagesFunction } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { reviews, type Review, type InsertReview } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;
  
  // Initialize database connection
  const sql = neon(env.DATABASE_URL);
  const db = drizzle(sql, { schema: { reviews } });
  
  if (request.method === 'GET') {
    try {
      // Fetch approved reviews from database
      const approvedReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.isApproved, true))
        .orderBy(reviews.createdAt);
      
      return new Response(JSON.stringify(approvedReviews), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    } catch (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch reviews',
        details: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  if (request.method === 'POST') {
    try {
      const reviewData: InsertReview = await request.json();
      
      // Validate required fields
      if (!reviewData.name || !reviewData.email) {
        return new Response(JSON.stringify({ 
          error: 'Name and email are required' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Insert review into database
      const newReview = await db
        .insert(reviews)
        .values({
          ...reviewData,
          isApproved: false, // Reviews need approval
          createdAt: new Date()
        })
        .returning();
      
      // Send email notification if SendGrid is configured
      if (env.SENDGRID_API_KEY) {
        try {
          const avgRating = Math.round((reviewData.appearance + reviewData.punctuality + reviewData.communication + reviewData.professionalism + reviewData.chemistry + reviewData.discretion) / 6);
          
          const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: { email: 'bobby@rentbobby.com', name: 'RentBobby Notifications' },
              to: [{ email: 'bobby@rentbobby.com' }],
              subject: `⭐ New Review Submitted - ${avgRating}/5 Stars from ${reviewData.name}`,
              text: `New review submitted for approval:\n\nReviewer: ${reviewData.name}\nEmail: ${reviewData.email}\nOverall Rating: ${avgRating}/5 stars\n\nAdditional Comments: ${reviewData.additionalComments || 'None'}\n\nLogin to approve: https://rentbobby.com/admin`
            })
          });
          
          console.log('Email notification sent:', emailResponse.ok);
        } catch (emailError) {
          console.error('Email notification failed:', emailError);
        }
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Review submitted successfully',
        review: newReview[0]
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
  
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  return new Response('Method not allowed', { status: 405 });
};
