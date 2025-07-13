interface AppointmentData {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  duration?: string;
  service: string;
  location?: string;
  message?: string;
  timestamp: string;
  status: string;
  source: string;
}

interface MakeWebhookPayload {
  // Appointment details
  appointment_id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  
  // Scheduling
  appointment_date: string;
  appointment_time: string;
  duration: string;
  service_type: string;
  location: string;
  
  // Additional info
  special_requests?: string;
  booking_source: string;
  status: string;
  created_at: string;
  
  // Make.com metadata
  webhook_event: string;
  priority: string;
}

export async function sendToMakeWebhook(appointmentData: AppointmentData): Promise<boolean> {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('MAKE_WEBHOOK_URL not configured - appointment data will not be sent to Make.com');
    return false;
  }

  try {
    // Transform data to Make.com-friendly format
    const payload: MakeWebhookPayload = {
      // Generate unique appointment ID
      appointment_id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      
      // Client information
      client_name: appointmentData.name,
      client_email: appointmentData.email,
      client_phone: appointmentData.phone || "",
      
      // Scheduling details
      appointment_date: appointmentData.date,
      appointment_time: appointmentData.time,
      duration: appointmentData.duration || "2", // Default 2 hours
      service_type: appointmentData.service,
      location: appointmentData.location || "austin",
      
      // Additional information
      special_requests: appointmentData.message || "",
      booking_source: appointmentData.source,
      status: appointmentData.status,
      created_at: appointmentData.timestamp,
      
      // Make.com specific fields
      webhook_event: "appointment_booked",
      priority: "high"
    };

    console.log('Sending appointment data to Make.com webhook...', {
      appointment_id: payload.appointment_id,
      client_name: payload.client_name,
      appointment_date: payload.appointment_date,
      service_type: payload.service_type
    });

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'RentBobby-Website/1.0',
        'X-Webhook-Source': 'rentbobby.com'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Make.com webhook failed: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.text();
    console.log('Make.com webhook response:', responseData);

    return true;
  } catch (error) {
    console.error('Error sending to Make.com webhook:', error);
    return false;
  }
}

export function isMakeWebhookConfigured(): boolean {
  return !!process.env.MAKE_WEBHOOK_URL;
}

// Test function for webhook validation
export async function testMakeWebhook(): Promise<boolean> {
  const testData: AppointmentData = {
    name: "Test Client",
    email: "test@example.com",
    phone: "+1 (555) 123-4567",
    date: "2025-07-15",
    time: "14:00",
    duration: "2",
    service: "companion",
    location: "austin",
    message: "This is a test appointment booking from the website",
    timestamp: new Date().toISOString(),
    status: "test",
    source: "website_test"
  };

  return sendToMakeWebhook(testData);
}