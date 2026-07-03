import { Resend } from 'resend';

const OWNER_EMAIL = 'bobby@rentbobby.com';

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

interface EmailParams {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.error('RESEND_API_KEY not configured');
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: 'rentbobby.com <onboarding@resend.dev>',
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });

    if (error) {
      console.error('Resend email error:', error);
      return false;
    }

    console.log('Email sent successfully via Resend');
    return true;
  } catch (error) {
    console.error('Resend email error:', error);
    return false;
  }
}

export async function sendQuickChatEmail(params: {
  visitorName: string;
  visitorContact: string;
  message: string;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.error('RESEND_API_KEY not configured — Quick Chat message not delivered');
    return false;
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #1a1a2e; color: #fff; border-radius: 12px;">
      <h2 style="color: #a78bfa; margin-top: 0;">New Quick Chat Message</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #9ca3af; width: 120px;">From</td>
          <td style="padding: 8px 0; color: #fff; font-weight: 600;">${params.visitorName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9ca3af;">Contact</td>
          <td style="padding: 8px 0; color: #fff;">${params.visitorContact}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9ca3af; vertical-align: top;">Message</td>
          <td style="padding: 8px 0; color: #fff;">${params.message}</td>
        </tr>
      </table>
    </div>
  `;

  const text = `New Quick Chat Message\n\nFrom: ${params.visitorName}\nContact: ${params.visitorContact}\nMessage: ${params.message}`;

  try {
    const { error } = await resend.emails.send({
      from: 'rentbobby.com <onboarding@resend.dev>',
      to: OWNER_EMAIL,
      subject: `Quick Chat from ${params.visitorName}`,
      text,
      html,
    });

    if (error) {
      console.error('Resend quick chat error:', error);
      return false;
    }

    console.log('Quick chat email sent via Resend');
    return true;
  } catch (error) {
    console.error('Resend quick chat error:', error);
    return false;
  }
}

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}
