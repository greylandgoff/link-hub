// TextBelt SMS Service - Simple SMS API without business verification
interface SMSParams {
  to: string;
  message: string;
}

export async function sendSMSViaTextBelt(params: SMSParams): Promise<boolean> {
  try {
    const response = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: params.to,
        message: params.message,
        key: process.env.TEXTBELT_KEY || 'textbelt' // 'textbelt' gives 1 free text per day per IP
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('SMS sent successfully via TextBelt');
      return true;
    } else {
      console.error('TextBelt SMS error:', result.error);
      return false;
    }
  } catch (error) {
    console.error('TextBelt request failed:', error);
    return false;
  }
}

export function isTextBeltConfigured(): boolean {
  return true; // TextBelt works without API key (1 free per day) or with paid key
}