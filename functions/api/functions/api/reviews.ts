// Cloudflare Pages Function for reviews API
import { PagesFunction } from '@cloudflare/workers-types';

export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  
  if (request.method === 'GET') {
    // Return mock reviews for now - you'll need to connect to your database
    const reviews = [];
    return new Response(JSON.stringify(reviews), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (request.method === 'POST') {
    try {
      const reviewData = await request.json();
      
      // Basic validation
      if (!reviewData.name || !reviewData.email) {
        return new Response(JSON.stringify({ error: 'Name and email are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Here you would save to your database
      // For now, just return success
      console.log('Review submitted:', reviewData);
      
      return new Response(JSON.stringify({ success: true, message: 'Review submitted successfully' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  return new Response('Method not allowed', { status: 405 });
};
