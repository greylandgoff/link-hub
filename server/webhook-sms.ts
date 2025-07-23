// Enhanced Google Sheets webhook service for comprehensive appointment logging

interface AppointmentData {
  name: string;
  email: string;
  phone?: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: string;
  serviceType: string;
  location: string;
  specialRequests?: string;
  source: string;
  status: string;
  createdAt: string;
}

interface ContactData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function sendGoogleSheetsWebhook(appointmentData: AppointmentData): Promise<boolean> {
  if (!process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
    console.log('No Google Sheets webhook URL configured');
    return false;
  }

  try {
    // Enhanced Google Sheets payload with all appointment details
    const jsonPayload = {
      occurred_at: new Date().toISOString(),
      event_name: "new_appointment",
      // Client Information
      value1: appointmentData.name,
      value2: appointmentData.email,
      value3: appointmentData.phone || "",
      // Appointment Details
      appointment_date: appointmentData.appointmentDate,
      appointment_time: appointmentData.appointmentTime,
      duration: appointmentData.duration,
      service_type: appointmentData.serviceType,
      location: appointmentData.location,
      special_requests: appointmentData.specialRequests || "",
      // Metadata
      booking_source: appointmentData.source,
      status: appointmentData.status,
      submitted_at: appointmentData.createdAt,
      // Summary for quick view
      summary: `${appointmentData.name} - ${appointmentData.appointmentDate} at ${appointmentData.appointmentTime} (${appointmentData.duration})`
    };
    
    console.log('Sending enhanced appointment data to Google Sheets:', {
      name: appointmentData.name,
      date: appointmentData.appointmentDate,
      time: appointmentData.appointmentTime,
      service: appointmentData.serviceType
    });

    const response = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonPayload)
    });

    const responseText = await response.text();
    console.log('Google Sheets webhook response:', responseText);

    if (response.ok) {
      console.log('Appointment data sent to Google Sheets successfully');
      return true;
    } else {
      console.error('Google Sheets webhook error:', response.status, responseText);
      return false;
    }
  } catch (error) {
    console.error('Google Sheets webhook request failed:', error);
    return false;
  }
}

export async function sendContactWebhook(data: ContactData): Promise<boolean> {
  if (!process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
    console.log('No Google Sheets webhook URL configured');
    return false;
  }

  try {
    const jsonPayload = {
      occurred_at: new Date().toISOString(),
      event_name: "contact_form",
      value1: data.name,
      value2: data.email,
      value3: data.phone || "",
      message: data.message,
      type: "contact_inquiry"
    };

    const response = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonPayload)
    });

    return response.ok;
  } catch (error) {
    console.error('Contact webhook request failed:', error);
    return false;
  }
}

export function isGoogleSheetsConfigured(): boolean {
  return !!process.env.GOOGLE_SHEETS_WEBHOOK_URL;
}