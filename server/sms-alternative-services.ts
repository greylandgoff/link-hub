// Alternative SMS services that don't require business verification

interface SMSParams {
  to: string;
  message: string;
}

// SMS.to - Simple API, no business verification needed
export async function sendSMSViaSMSTo(params: SMSParams): Promise<boolean> {
  if (!process.env.SMS_TO_API_KEY) {
    return false;
  }

  try {
    const response = await fetch('https://api.sms.to/sms/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SMS_TO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: params.to,
        message: params.message,
        sender_id: 'RentBobby'
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('SMS sent successfully via SMS.to');
      return true;
    } else {
      console.error('SMS.to error:', result);
      return false;
    }
  } catch (error) {
    console.error('SMS.to request failed:', error);
    return false;
  }
}

// Vonage (Nexmo) - Personal accounts allowed, easier verification
export async function sendSMSViaVonage(params: SMSParams): Promise<boolean> {
  if (!process.env.VONAGE_API_KEY || !process.env.VONAGE_API_SECRET) {
    return false;
  }

  try {
    const response = await fetch('https://rest.nexmo.com/sms/json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        api_key: process.env.VONAGE_API_KEY,
        api_secret: process.env.VONAGE_API_SECRET,
        to: params.to,
        from: 'RentBobby',
        text: params.message
      })
    });

    const result = await response.json();
    
    if (result.messages && result.messages[0].status === '0') {
      console.log('SMS sent successfully via Vonage');
      return true;
    } else {
      console.error('Vonage SMS error:', result);
      return false;
    }
  } catch (error) {
    console.error('Vonage request failed:', error);
    return false;
  }
}

// Simple webhook-based SMS (for services like Zapier, Make.com)
export async function sendSMSViaWebhook(params: SMSParams): Promise<boolean> {
  if (!process.env.SMS_WEBHOOK_URL) {
    return false;
  }

  try {
    const response = await fetch(process.env.SMS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: params.to,
        message: params.message,
        timestamp: new Date().toISOString()
      })
    });

    if (response.ok) {
      console.log('SMS sent successfully via webhook');
      return true;
    } else {
      console.error('Webhook SMS error:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Webhook request failed:', error);
    return false;
  }
}

export function isSMSToConfigured(): boolean {
  return !!process.env.SMS_TO_API_KEY;
}

export function isVonageConfigured(): boolean {
  return !!(process.env.VONAGE_API_KEY && process.env.VONAGE_API_SECRET);
}

export function isWebhookConfigured(): boolean {
  return !!process.env.SMS_WEBHOOK_URL;
}