import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

export async function onRequest(context) {
  const { request, env, params } = context;
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  if (request.method === 'DELETE') {
    try {
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
      
      // Delete review
      const result = await sql`
        DELETE FROM reviews 
        WHERE id = ${reviewId}
        RETURNING id, name
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
        message: `Review deleted successfully`,
        review: result[0]
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.error('Review deletion error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to delete review',
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