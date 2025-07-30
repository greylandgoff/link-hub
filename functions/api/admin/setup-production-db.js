import { neon } from '@neondatabase/serverless';

export async function onRequest(context) {
  const { request, env } = context;
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  if (request.method === 'POST') {
    try {
      // Check for admin password
      const { password } = await request.json();
      if (password !== 'bobby2025admin') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
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
      const results = [];
      
      // Create appointments table if it doesn't exist
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS appointments (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            appointment_date TEXT NOT NULL,
            appointment_time TEXT NOT NULL,
            duration TEXT,
            service_type TEXT NOT NULL,
            location TEXT,
            special_requests TEXT,
            status TEXT DEFAULT 'pending' NOT NULL,
            make_webhook_sent BOOLEAN DEFAULT false NOT NULL,
            make_webhook_response TEXT,
            source TEXT DEFAULT 'website' NOT NULL,
            created_at TIMESTAMP DEFAULT NOW() NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW() NOT NULL
          )
        `;
        results.push('Appointments table created or already exists');
      } catch (error) {
        results.push(`Appointments table error: ${error.message}`);
      }
      
      // Create reviews table if it doesn't exist
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            appearance INTEGER NOT NULL,
            punctuality INTEGER NOT NULL,
            communication INTEGER NOT NULL,
            professionalism INTEGER NOT NULL,
            chemistry INTEGER NOT NULL,
            discretion INTEGER NOT NULL,
            would_book_again BOOLEAN NOT NULL,
            booking_process_smooth BOOLEAN NOT NULL,
            matched_description BOOLEAN NOT NULL,
            service_types TEXT[] NOT NULL,
            additional_comments TEXT,
            is_approved BOOLEAN DEFAULT false NOT NULL,
            created_at TIMESTAMP DEFAULT NOW() NOT NULL
          )
        `;
        results.push('Reviews table created or already exists');
      } catch (error) {
        results.push(`Reviews table error: ${error.message}`);
      }
      
      // Check current data counts
      try {
        const appointmentCount = await sql`SELECT COUNT(*) as count FROM appointments`;
        const reviewCount = await sql`SELECT COUNT(*) as count FROM reviews`;
        
        results.push(`Current appointments: ${appointmentCount[0].count}`);
        results.push(`Current reviews: ${reviewCount[0].count}`);
      } catch (error) {
        results.push(`Count error: ${error.message}`);
      }
      
      return new Response(JSON.stringify({
        success: true,
        results
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Setup failed',
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