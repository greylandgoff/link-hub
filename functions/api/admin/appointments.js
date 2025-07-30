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
      
      // First, check if the appointments table exists and has data
      let tableCheck;
      try {
        tableCheck = await sql`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'appointments'
          ) as table_exists
        `;
        console.log('Table existence check:', tableCheck);
      } catch (checkError) {
        console.error('Table check error:', checkError);
      }
      
      // Fetch all appointments
      const appointments = await sql`
        SELECT * FROM appointments 
        ORDER BY created_at DESC
      `;
      
      // Transform the data to match the expected format
      const transformedAppointments = appointments.map(appointment => ({
        id: appointment.id,
        name: appointment.name,
        email: appointment.email,
        phone: appointment.phone || '',
        appointmentDate: appointment.appointment_date || appointment.date || '',
        appointmentTime: appointment.appointment_time || appointment.time || '',
        duration: appointment.duration || '',
        serviceType: appointment.service_type || appointment.service || '',
        location: appointment.location || '',
        specialRequests: appointment.special_requests || appointment.message || '',
        status: appointment.status || 'pending',
        source: appointment.source || 'website',
        createdAt: appointment.created_at
      }));
      
      console.log(`Admin: fetched ${transformedAppointments.length} appointments`);
      
      return new Response(JSON.stringify(transformedAppointments), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.error('Database query error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch appointments',
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