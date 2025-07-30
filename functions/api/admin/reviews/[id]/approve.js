import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

export async function onRequest(context) {
  const { request, env, params } = context;
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  if (request.method === 'PATCH') {
    try {
      const reviewId = params.id;
      const body = await request.json();
      const approved = body.approved;
      
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
      
      // Update review approval status
      const result = await sql`
        UPDATE reviews 
        SET is_approved = ${approved}
        WHERE id = ${reviewId}
        RETURNING *
      `;
      
      if (result.length === 0) {
        return new Response(JSON.stringify({ 
          error: 'Review not found' 
        }), {
          status: 404,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      // Transform the result to match expected format
      const review = result[0];
      const transformedReview = {
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
      };
      
      return new Response(JSON.stringify({ 
        success: true,
        message: `Review ${approved ? 'approved' : 'hidden'} successfully`,
        review: transformedReview
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.error('Review approval error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to update review',
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