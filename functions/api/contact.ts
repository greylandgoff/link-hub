// Cloudflare Pages Function for contact API
import { PagesFunction } from '@cloudflare/workers-types';

export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  
  if (request.method === 'POST') {
    try {
      const contactData = await request.json();
      
      // Basic validation
      if (!contactData.name || !contactData.email || !contactData.message) {
        return new Response(JSON.stringify({ error: 'Name, email, and message are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Here you would send email or SMS notification
      // For now, just log and return success
      console.log('Contact form submitted:', contactData);
      
      return new Response(JSON.stringify({ success: true, message: 'Message sent successfully' }), {
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
