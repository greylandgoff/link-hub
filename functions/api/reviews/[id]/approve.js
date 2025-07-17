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
      const { approved } = await request.json();
      const reviewId = params.id;
      
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
        RETURNING id, name, is_approved
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
      
      return new Response(JSON.stringify({ 
        success: true,
        message: `Review ${approved ? 'approved' : 'hidden'} successfully`,
        review: result[0]
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