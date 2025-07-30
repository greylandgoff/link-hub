import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

export async function onRequest(context) {
  const { request, env } = context;
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  if (request.method === 'GET') {
    try {
      if (!env.DATABASE_URL) {
        return new Response(JSON.stringify({ 
          error: 'Database not configured' 
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      const sql = neon(env.DATABASE_URL);
      
      // Fetch all reviews (not just approved ones)
      const reviews = await sql`
        SELECT * FROM reviews 
        ORDER BY created_at DESC
      `;
      
      // Transform the data to match the expected format
      const transformedReviews = reviews.map(review => ({
        id: review.id,
        name: review.name,
        email: review.email,
        appearance: review.appearance,
        punctuality: review.punctuality,
        communication: review.communication,
        professionalism: review.professionalism,
        chemistry: review.chemistry,
        discretion: review.discretion,
        wouldBookAgain: review.would_book_again,
        bookingProcessSmooth: review.booking_process_smooth,
        matchedDescription: review.matched_description,
        serviceTypes: review.service_types || [],
        additionalComments: review.additional_comments,
        isApproved: review.is_approved,
        createdAt: review.created_at
      }));
      
      console.log(`Admin: fetched ${transformedReviews.length} reviews`);
      
      return new Response(JSON.stringify(transformedReviews), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.error('Database query error:', error);
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
  
  return new Response('Method not allowed', { status: 405 });
}