import twilio from "twilio";

function getClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) return null;
  return twilio(accountSid, authToken);
}

export function isTwilioConfigured(): boolean {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_NUMBER &&
    process.env.TWILIO_TO_NUMBER
  );
}

export async function sendSMS(body: string): Promise<boolean> {
  try {
    const client = getClient();
    if (!client) {
      console.log("Twilio not configured — SMS skipped");
      return false;
    }
    const from = process.env.TWILIO_FROM_NUMBER!;
    const to = process.env.TWILIO_TO_NUMBER!;
    const msg = await client.messages.create({ body, from, to });
    console.log("SMS sent:", msg.sid);
    return true;
  } catch (err) {
    console.error("Twilio SMS error:", err);
    return false;
  }
}

export async function sendAppointmentSMS(data: {
  name: string;
  email: string;
  phone?: string | null;
  date: string;
  duration: string;
  location: string;
  duo: boolean;
  travel: boolean;
  arrivalAirport?: string | null;
  hotelBooked?: string | null;
  notes?: string | null;
  interests?: string | null;
}): Promise<boolean> {
  const lines = [
    `NEW BOOKING REQUEST`,
    `---`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    `---`,
    `Date: ${data.date}`,
    `Duration: ${data.duration}`,
    `Location: ${data.location}`,
    data.duo ? `Duo session: Yes (with Nick)` : null,
    data.travel ? `Travel: Yes` : null,
    data.arrivalAirport ? `Airport: ${data.arrivalAirport}` : null,
    data.hotelBooked ? `Hotel: ${data.hotelBooked}` : null,
    data.notes ? `Notes: ${data.notes}` : null,
    data.interests ? `Interests: ${data.interests}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return sendSMS(lines);
}
