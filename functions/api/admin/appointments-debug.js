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
          error: 'Database not configured',
          hasDbUrl: false
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      const sql = neon(env.DATABASE_URL);
      
      // Get all tables in the database
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;
      
      // Count appointments if table exists
      let appointmentCount = 0;
      let hasAppointmentsTable = false;
      
      if (tables.some(t => t.table_name === 'appointments')) {
        hasAppointmentsTable = true;
        const countResult = await sql`SELECT COUNT(*) as count FROM appointments`;
        appointmentCount = countResult[0].count;
      }
      
      return new Response(JSON.stringify({
        hasDbUrl: true,
        tables: tables.map(t => t.table_name),
        hasAppointmentsTable,
        appointmentCount,
        dbUrlPrefix: env.DATABASE_URL ? env.DATABASE_URL.substring(0, 50) + '...' : 'Not set'
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Debug query failed',
        details: error.message,
        stack: error.stack
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