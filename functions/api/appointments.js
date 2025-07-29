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
      
      // Validate required fields - handle both snake_case and expected field names
      const date = appointmentData.appointment_date || appointmentData.date;
      const time = appointmentData.appointment_time || appointmentData.time;
      const service = appointmentData.service_type || appointmentData.service;
      const specialRequests = appointmentData.special_requests || appointmentData.specialRequests || appointmentData.message;
      
      if (!appointmentData.name || !appointmentData.email || !date || !time) {
        return new Response(JSON.stringify({ 
          error: 'Name, email, date, and time are required' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
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
              text: `New appointment request:\n\nClient: ${appointmentData.name}\nEmail: ${appointmentData.email}\nPhone: ${appointmentData.phone || 'Not provided'}\nDate: ${date}\nTime: ${time}\nDuration: ${appointmentData.duration || 'Not specified'}\nService: ${service || 'Not specified'}\nLocation: ${appointmentData.location || 'Not specified'}\n\nMessage: ${specialRequests || 'None'}\n\nConfirm via Calendly: ${env.CALENDLY_BOOKING_URL || 'https://calendly.com/bobby-rentbobby'}`
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
        message: 'Appointment request submitted successfully! You will receive email and SMS notifications.'
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