import type { PagesFunction } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { appointments, type Appointment, type InsertAppointment } from '../../shared/schema';

export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;
  
  // Initialize database connection
  const sql = neon(env.DATABASE_URL);
  const db = drizzle(sql, { schema: { appointments } });
  
  if (request.method === 'POST') {
    try {
      const appointmentData: InsertAppointment = await request.json();
      
      // Validate required fields
      if (!appointmentData.name || !appointmentData.email || !appointmentData.date || !appointmentData.time) {
        return new Response(JSON.stringify({ 
          error: 'Name, email, date, and time are required' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Insert appointment into database with correct schema mapping
      const newAppointment = await db
        .insert(appointments)
        .values({
          name: appointmentData.name,
          email: appointmentData.email,
          phone: appointmentData.phone,
          appointmentDate: appointmentData.date,
          appointmentTime: appointmentData.time,
          duration: appointmentData.duration,
          serviceType: appointmentData.service,
          location: appointmentData.location,
          specialRequests: appointmentData.message,
          status: 'pending',
          source: 'website'
        })
        .returning();
      
      // Send email notification if SendGrid is configured
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
              text: `New appointment request:\n\nClient: ${appointmentData.name}\nEmail: ${appointmentData.email}\nPhone: ${appointmentData.phone || 'Not provided'}\nDate: ${appointmentData.date}\nTime: ${appointmentData.time}\nDuration: ${appointmentData.duration}\nService: ${appointmentData.service}\nLocation: ${appointmentData.location}\n\nMessage: ${appointmentData.message || 'None'}\n\nConfirm via Calendly: ${env.CALENDLY_BOOKING_URL || 'https://calendly.com/bobby-rentbobby'}`
            })
          });
          
          console.log('Email notification sent:', emailResponse.ok);
        } catch (emailError) {
          console.error('Email notification failed:', emailError);
        }
      }
      
      // Send SMS notification if webhook is configured
      if (env.SMS_WEBHOOK_URL) {
        try {
          const smsResponse = await fetch(env.SMS_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              value1: `📅 New Appointment: ${appointmentData.name}`,
              value2: `${appointmentData.date} at ${appointmentData.time} - ${appointmentData.service}`,
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
        message: 'Appointment request submitted successfully',
        appointment: newAppointment[0]
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
  
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  return new Response('Method not allowed', { status: 405 });
};