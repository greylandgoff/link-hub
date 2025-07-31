import { neon } from '@neondatabase/serverless';

export async function onRequest(context) {
  const { request, env } = context;
  
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
      const { password } = await request.json();
      
      // Check admin password
      if (password !== 'bobby2025admin') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
      
      if (!env.DATABASE_URL) {
        return new Response(JSON.stringify({ error: 'Database not configured' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
      
      const sql = neon(env.DATABASE_URL);
      const results = [];
      
      try {
        // First, check if the table exists
        const tableExists = await sql`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'appointments'
          ) as exists
        `;
        
        if (!tableExists[0].exists) {
          // Create the appointments table with correct column names
          await sql`
            CREATE TABLE appointments (
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
          results.push('Created appointments table with correct schema');
        } else {
          // Table exists, check columns
          const columns = await sql`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'appointments'
          `;
          
          const columnNames = columns.map(c => c.column_name);
          results.push(`Existing columns: ${columnNames.join(', ')}`);
          
          // Check if appointment_date column exists
          if (!columnNames.includes('appointment_date')) {
            // Check if there's a 'date' column that needs renaming
            if (columnNames.includes('date')) {
              await sql`ALTER TABLE appointments RENAME COLUMN date TO appointment_date`;
              results.push('Renamed date column to appointment_date');
            } else {
              await sql`ALTER TABLE appointments ADD COLUMN appointment_date TEXT NOT NULL DEFAULT 'TBD'`;
              results.push('Added appointment_date column');
            }
          }
          
          // Check if appointment_time column exists
          if (!columnNames.includes('appointment_time')) {
            if (columnNames.includes('time')) {
              await sql`ALTER TABLE appointments RENAME COLUMN time TO appointment_time`;
              results.push('Renamed time column to appointment_time');
            } else {
              await sql`ALTER TABLE appointments ADD COLUMN appointment_time TEXT NOT NULL DEFAULT 'TBD'`;
              results.push('Added appointment_time column');
            }
          }
          
          // Check if service_type column exists
          if (!columnNames.includes('service_type')) {
            if (columnNames.includes('service')) {
              await sql`ALTER TABLE appointments RENAME COLUMN service TO service_type`;
              results.push('Renamed service column to service_type');
            } else {
              await sql`ALTER TABLE appointments ADD COLUMN service_type TEXT NOT NULL DEFAULT 'Companion Services'`;
              results.push('Added service_type column');
            }
          }
          
          // Check if special_requests column exists
          if (!columnNames.includes('special_requests')) {
            if (columnNames.includes('message')) {
              await sql`ALTER TABLE appointments RENAME COLUMN message TO special_requests`;
              results.push('Renamed message column to special_requests');
            } else {
              await sql`ALTER TABLE appointments ADD COLUMN special_requests TEXT`;
              results.push('Added special_requests column');
            }
          }
        }
        
        // Get final count
        const count = await sql`SELECT COUNT(*) as count FROM appointments`;
        results.push(`Total appointments in table: ${count[0].count}`);
        
      } catch (error) {
        results.push(`Error: ${error.message}`);
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
        error: 'Fix failed',
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