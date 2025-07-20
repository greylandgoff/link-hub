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
    
    // Check if it's the new structured format (has value1, value2, value3)
    if ('value1' in data) {
      console.log('Using structured IFTTT format');
      // Use only structured format for IFTTT - no legacy message field
      jsonPayload = {
        value1: data.value1,
        value2: data.value2,
        value3: data.value3
      };
    } else {
      console.log('Using single clean message format');
      // For contact forms, send a single clean message
      const contact = data.phone || data.email;
      const cleanMessage = `${data.name} (${contact}): ${data.message}`;
      jsonPayload = {
        value1: cleanMessage,
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