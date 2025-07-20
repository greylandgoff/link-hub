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
    
    // Use IFTTT Webhooks format for got_mail event
    if (data.text) {
      console.log('Using IFTTT webhooks format for appointment');
      jsonPayload = {
        event_name: "got_mail",
        occurred_at: new Date().toISOString(),
        value1: data.text,
        value2: "",
        value3: ""
      };
    } else if ('value1' in data) {
      console.log('Using structured IFTTT format');
      jsonPayload = {
        event_name: "got_mail", 
        occurred_at: new Date().toISOString(),
        value1: data.value1,
        value2: data.value2 || "",
        value3: data.value3 || ""
      };
    } else {
      console.log('Using legacy message format');
      const contact = data.phone || data.email;
      const cleanMessage = data.message ? `${data.name} (${contact}): ${data.message}` : data.message;
      jsonPayload = {
        event_name: "got_mail",
        occurred_at: new Date().toISOString(), 
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