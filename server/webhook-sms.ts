// Simple JSON webhook SMS service for IFTTT

interface ContactData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function sendWebhookNotification(contactData: ContactData): Promise<boolean> {
  if (!process.env.SMS_WEBHOOK_URL) {
    console.log('No webhook URL configured');
    return false;
  }

  try {
    const jsonPayload = {
      name: contactData.name,
      contact: contactData.phone || contactData.email,
      message: contactData.message,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

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