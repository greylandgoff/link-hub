import { Resend } from 'resend';

const FROM = 'rentbobby@notaryafterdark.com';
const TO = 'notification@rentbobby.com';

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

// Generic send — used by the email contact form route
export async function sendEmail(params: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.error('RESEND_API_KEY not configured');
    return false;
  }
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    if (error) { console.error('Resend error:', error); return false; }
    console.log('Email sent via Resend:', params.subject);
    return true;
  } catch (err) {
    console.error('Resend error:', err);
    return false;
  }
}

// Quick Chat widget
export async function sendQuickChatEmail(params: {
  visitorName: string;
  visitorContact: string;
  message: string;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.error('RESEND_API_KEY not configured — Quick Chat not delivered');
    return false;
  }

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#1a1a2e;color:#fff;border-radius:12px;">
      <h2 style="color:#a78bfa;margin-top:0;">[RentBobby] Quick Chat Message</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#9ca3af;width:110px;">From</td><td style="color:#fff;font-weight:600;">${params.visitorName}</td></tr>
        <tr><td style="padding:6px 0;color:#9ca3af;">Contact</td><td style="color:#fff;">${params.visitorContact}</td></tr>
        <tr><td style="padding:6px 0;color:#9ca3af;vertical-align:top;">Message</td><td style="color:#fff;">${params.message}</td></tr>
      </table>
    </div>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject: `[RentBobby] Quick Chat from ${params.visitorName}`,
      text: `From: ${params.visitorName}\nContact: ${params.visitorContact}\nMessage: ${params.message}`,
      html,
    });
    if (error) { console.error('Resend quick chat error:', error); return false; }
    console.log('Quick Chat email sent via Resend');
    return true;
  } catch (err) {
    console.error('Resend quick chat error:', err);
    return false;
  }
}

// New appointment/booking request
export async function sendAppointmentEmail(params: {
  name: string;
  email: string;
  phone?: string | null;
  date: string;
  duration?: string | null;
  location?: string | null;
  duo?: boolean;
  travel?: boolean;
  arrivalAirport?: string | null;
  hotelBooked?: string | null;
  notes?: string | null;
  interests?: string | null;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.error('RESEND_API_KEY not configured — appointment email not delivered');
    return false;
  }

  const rows = [
    ['Name', params.name],
    ['Email', params.email],
    params.phone ? ['Phone', params.phone] : null,
    ['Date', params.date],
    params.duration ? ['Duration', params.duration] : null,
    params.location ? ['Location', params.location] : null,
    params.duo ? ['Duo session', 'Yes — with Nick'] : null,
    params.travel ? ['Travel', 'Yes'] : null,
    params.arrivalAirport ? ['Arrival airport', params.arrivalAirport] : null,
    params.hotelBooked ? ['Hotel booked', params.hotelBooked] : null,
    params.notes ? ['Notes', params.notes] : null,
    params.interests ? ['Interests / boundaries', params.interests] : null,
  ].filter(Boolean) as [string, string][];

  const htmlRows = rows.map(([label, val]) =>
    `<tr><td style="padding:6px 0;color:#9ca3af;width:160px;vertical-align:top;">${label}</td><td style="color:#fff;">${val}</td></tr>`
  ).join('');

  const textRows = rows.map(([label, val]) => `${label}: ${val}`).join('\n');

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#1a1a2e;color:#fff;border-radius:12px;">
      <h2 style="color:#c084fc;margin-top:0;">[RentBobby] New Appointment Request</h2>
      <table style="width:100%;border-collapse:collapse;">${htmlRows}</table>
      <p style="margin-top:20px;font-size:12px;color:#6b7280;">Check the admin panel to manage this request.</p>
    </div>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject: `[RentBobby] New Appointment Request — ${params.name} on ${params.date}`,
      text: `NEW APPOINTMENT REQUEST\n\n${textRows}`,
      html,
    });
    if (error) { console.error('Resend appointment email error:', error); return false; }
    console.log('Appointment email sent via Resend');
    return true;
  } catch (err) {
    console.error('Resend appointment email error:', err);
    return false;
  }
}

// New review submitted
export async function sendReviewEmail(params: {
  name: string;
  email: string;
  avgRating: number;
  ratings: Record<string, number>;
  serviceTypes: string[];
  wouldBookAgain: boolean;
  additionalComments?: string | null;
  reviewId: number | string;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.error('RESEND_API_KEY not configured — review email not delivered');
    return false;
  }

  const ratingRows = Object.entries(params.ratings)
    .map(([k, v]) => `<tr><td style="padding:4px 0;color:#9ca3af;width:160px;">${k}</td><td style="color:#fff;">${v}/5</td></tr>`)
    .join('');

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#1a1a2e;color:#fff;border-radius:12px;">
      <h2 style="color:#fbbf24;margin-top:0;">[RentBobby] New Review — ${params.avgRating}/5 Stars</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#9ca3af;width:160px;">Reviewer</td><td style="color:#fff;font-weight:600;">${params.name}</td></tr>
        <tr><td style="padding:6px 0;color:#9ca3af;">Email</td><td style="color:#fff;">${params.email}</td></tr>
        <tr><td style="padding:6px 0;color:#9ca3af;">Overall</td><td style="color:#fff;">${params.avgRating}/5 ⭐</td></tr>
        <tr><td style="padding:6px 0;color:#9ca3af;">Services</td><td style="color:#fff;">${params.serviceTypes.join(', ')}</td></tr>
        <tr><td style="padding:6px 0;color:#9ca3af;">Would book again</td><td style="color:#fff;">${params.wouldBookAgain ? 'Yes' : 'No'}</td></tr>
        ${params.additionalComments ? `<tr><td style="padding:6px 0;color:#9ca3af;vertical-align:top;">Comments</td><td style="color:#fff;">${params.additionalComments}</td></tr>` : ''}
      </table>
      <h3 style="color:#9ca3af;font-size:13px;margin-top:16px;">Individual ratings</h3>
      <table style="width:100%;border-collapse:collapse;">${ratingRows}</table>
      <p style="margin-top:20px;font-size:12px;color:#6b7280;">Review ID ${params.reviewId} — approve or reject in the admin panel.</p>
    </div>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject: `[RentBobby] New Review — ${params.avgRating}/5 from ${params.name}`,
      text: `NEW REVIEW\n\nFrom: ${params.name} (${params.email})\nRating: ${params.avgRating}/5\nServices: ${params.serviceTypes.join(', ')}\nWould book again: ${params.wouldBookAgain ? 'Yes' : 'No'}\n\nComments: ${params.additionalComments || 'None'}`,
      html,
    });
    if (error) { console.error('Resend review email error:', error); return false; }
    console.log('Review email sent via Resend');
    return true;
  } catch (err) {
    console.error('Resend review email error:', err);
    return false;
  }
}
