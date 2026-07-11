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
      const appointmentData = await request.json();
      
      // Handle field name variations from different forms
      const date = appointmentData.appointment_date || appointmentData.date || appointmentData.appointmentDate;
      const time = appointmentData.appointment_time || appointmentData.time || appointmentData.appointmentTime;
      const service = appointmentData.service_type || appointmentData.service || appointmentData.serviceType;
      const specialRequests = appointmentData.special_requests || appointmentData.specialRequests || appointmentData.message || appointmentData.notes;
      const duration = appointmentData.duration || appointmentData.length || '2 hours';
      const location = appointmentData.location || appointmentData.cityLocation || 'Not specified';
      
      if (!appointmentData.name || !appointmentData.email || !date || !time) {
        return new Response(JSON.stringify({ 
          error: 'Name, email, date, and time are required' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Insert appointment into database - THIS MUST SUCCEED
      if (!env.DATABASE_URL) {
        console.error('DATABASE_URL not configured for appointment submission');
        return new Response(JSON.stringify({ 
          error: 'Database not configured',
          details: 'Cannot save appointment without database connection'
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      let savedAppointment;
      try {
        const sql = neon(env.DATABASE_URL);
        
        // Insert appointment using raw SQL - adapted for production schema
        const newAppointment = await sql`
          INSERT INTO appointments (
            name, email, phone, appointment_date, appointment_time,
            duration, service_type, location, special_requests,
            status, created_at
          ) VALUES (
            ${appointmentData.name}, 
            ${appointmentData.email},
            ${appointmentData.phone || null},
            ${date},
            ${time},
            ${duration},
            ${service || 'Companion Services'},
            ${location},
            ${specialRequests || null},
            'pending',
            NOW()
          ) RETURNING id
        `;
        
        savedAppointment = newAppointment[0];
        console.log('Appointment saved to database with ID:', savedAppointment?.id);
        
        if (!savedAppointment?.id) {
          throw new Error('Database insertion returned no ID');
        }
      } catch (dbError) {
        console.error('Database insert failed:', dbError);
        return new Response(JSON.stringify({ 
          error: 'Failed to save appointment to database',
          details: dbError.message
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      // Send email notification via SendGrid
      if (env.SENDGRID_API_KEY) {
        try {
          const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: { email: 'bobby@rentbobby.com', name: 'RentBobby Appointments' },
              to: [{ email: 'bobby@rentbobby.com' }],
              subject: `📅 New Appointment Request - ${appointmentData.name}`,
              text: `New appointment request (ID: ${savedAppointment.id}):\n\nClient: ${appointmentData.name}\nEmail: ${appointmentData.email}\nPhone: ${appointmentData.phone || 'Not provided'}\nDate: ${date}\nTime: ${time}\nDuration: ${appointmentData.duration || 'Not specified'}\nService: ${service || 'Not specified'}\nLocation: ${appointmentData.location || 'Not specified'}\n\nMessage: ${specialRequests || 'None'}\n\nConfirm via Calendly: ${env.CALENDLY_BOOKING_URL || 'https://calendly.com/bobby-rentbobby'}`
            })
          });
          
          console.log('Email notification sent:', emailResponse.ok);
        } catch (emailError) {
          console.error('Email notification failed:', emailError);
        }
      }
      
      // Send SMS notification
      if (env.SMS_WEBHOOK_URL) {
        try {
          const smsResponse = await fetch(env.SMS_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              value1: `📅 New Appointment: ${appointmentData.name}`,
              value2: `${date} at ${time} - ${service || 'Service not specified'}`,
              value3: `Email: ${appointmentData.email}`
            })
          });
          
          console.log('SMS notification sent:', smsResponse.ok);
        } catch (smsError) {
          console.error('SMS notification failed:', smsError);
        }
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: `Appointment request submitted successfully! Appointment ID: ${savedAppointment.id}. You will receive email and SMS notifications.`,
        appointmentId: savedAppointment.id
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.error('Appointment submission error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to submit appointment request',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  return new Response('Method not allowed', { status: 405 });
}