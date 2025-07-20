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
    
    // Check if it's the new structured format (has value1, value2, value3)
    if ('value1' in data) {
      // Use structured format for IFTTT
      jsonPayload = {
        value1: data.value1,
        value2: data.value2,
        value3: data.value3
      };
    } else {
      // Legacy contact form format
      const contact = data.phone || data.email;
      const simpleMessage = `New message from ${data.name} (${contact}): ${data.message}`;
      jsonPayload = {
        message: simpleMessage
      };
    }

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