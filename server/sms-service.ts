import twilio from 'twilio';

let twilioClient: twilio.Twilio | null = null;

// Initialize Twilio if credentials are available
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

interface SMSParams {
  to: string;
  message: string;
}

export async function sendSMS(params: SMSParams): Promise<boolean> {
  if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
    console.error('Twilio not configured properly');
    return false;
  }

  try {
    await twilioClient.messages.create({
      body: params.message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: params.to
    });
    
    console.log('SMS sent successfully via Twilio');
    return true;
  } catch (error) {
    console.error('Twilio SMS error:', error);
    return false;
  }
}

export function isSMSConfigured(): boolean {
  return !!(process.env.TWILIO_ACCOUNT_SID && 
           process.env.TWILIO_AUTH_TOKEN && 
           process.env.TWILIO_PHONE_NUMBER);
}