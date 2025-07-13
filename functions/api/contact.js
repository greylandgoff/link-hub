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
      const contactData = await request.json();
      
      // Validate required fields
      if (!contactData.name || !contactData.email || !contactData.message) {
        return new Response(JSON.stringify({ 
          error: 'Name, email, and message are required' 
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
              from: { email: 'bobby@rentbobby.com', name: 'RentBobby Contact' },
              to: [{ email: 'bobby@rentbobby.com' }],
              subject: `💬 New Contact Message from ${contactData.name}`,
              text: `New contact form message:\n\nName: ${contactData.name}\nEmail: ${contactData.email}\nPhone: ${contactData.phone || 'Not provided'}\n\nMessage:\n${contactData.message}`
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
              value1: `💬 New Contact: ${contactData.name}`,
              value2: contactData.message,
              value3: `Email: ${contactData.email}`
            })
          });
          
          console.log('SMS notification sent:', smsResponse.ok);
        } catch (smsError) {
          console.error('SMS notification failed:', smsError);
        }
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Message sent successfully! You will receive email and SMS notifications.' 
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.error('Contact form error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to send message',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  return new Response('Method not allowed', { status: 405 });
}