// Simple JSON webhook SMS service for IFTTT

interface ContactData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function sendWebhookNotification(data: ContactData | any): Promise<boolean> {
  if (!process.env.SMS_WEBHOOK_URL) {
    console.log('No webhook URL configured');
    return false;
  }

  try {
    let jsonPayload;
    
    console.log('Webhook data received:', JSON.stringify(data, null, 2));
    
    // Pure Google Sheets logging format - no text messages
    if (data.sheetsData) {
      console.log('Using Google Sheets data logging format');
      jsonPayload = {
        occurred_at: new Date().toISOString(),
        event_name: "got_mail",
        value1: data.sheetsData.name,
        value2: data.sheetsData.email,
        value3: data.sheetsData.phone
      };
    } else {
      console.log('Using legacy format for reviews/contact forms');
      const contact = data.phone || data.email;
      const cleanMessage = data.message ? `${data.name} (${contact}): ${data.message}` : data.message;
      jsonPayload = {
        occurred_at: new Date().toISOString(),
        event_name: "got_mail",
        value1: cleanMessage || data.message,
        value2: "",
        value3: ""
      };
    }
    
    console.log('Final webhook payload:', JSON.stringify(jsonPayload, null, 2));

    const response = await fetch(process.env.SMS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonPayload)
    });

    const responseText = await response.text();
    console.log('Webhook response:', responseText);

    if (response.ok) {
      console.log('Webhook notification sent successfully');
      return true;
    } else {
      console.error('Webhook error:', response.status, responseText);
      return false;
    }
  } catch (error) {
    console.error('Webhook request failed:', error);
    return false;
  }
}

export function isWebhookConfigured(): boolean {
  return !!process.env.SMS_WEBHOOK_URL;
}