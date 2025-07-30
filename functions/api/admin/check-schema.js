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
      
      // Get column information for appointments table
      const columns = await sql`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'appointments'
        ORDER BY ordinal_position
      `;
      
      // Check if table exists
      const tableExists = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'appointments'
        ) as exists
      `;
      
      return new Response(JSON.stringify({
        tableExists: tableExists[0].exists,
        columns: columns,
        columnNames: columns.map(c => c.column_name)
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Schema check failed',
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