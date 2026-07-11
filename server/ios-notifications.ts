interface AppointmentNotification {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  duration: string;
  service: string;
  location: string;
  isIncall: boolean;
  address?: string;
  area?: string;
  message?: string;
  calendlyLink?: string;
}

interface PushoverPayload {
  token: string;
  user: string;
  message: string;
  title: string;
  url?: string;
  url_title?: string;
  priority: number;
  sound?: string;
}

interface IFTTTWebhookPayload {
  value1: string; // Title
  value2: string; // Message
  value3: string; // URL/Link
}

interface MakeIOSNotificationPayload {
  client_name: string;
  client_email: string;
  client_phone: string;
  appointment_date: string;
  appointment_time: string;
  duration_hours: string;
  service_type: string;
  location_type: string;
  location_details: string;
  notification_title: string;
  notification_body: string;
  notification_url?: string;
  notification_badge: number;
  notification_sound: string;
  notification_category: string;
  special_requests: string;
  booking_source: string;
  timestamp: string;
  priority: string;
}

export async function sendIOSNotification(appointment: AppointmentNotification): Promise<boolean> {
  // Try the Make.com webhook for iOS notifications
  return await sendMakeIOSNotification(appointment);
}

async function sendMakeIOSNotification(appointment: AppointmentNotification): Promise<boolean> {
  const makeIOSWebhook = process.env.MAKE_IOS_NOTIFICATION_WEBHOOK;

  if (!makeIOSWebhook) {
    console.log('Make.com iOS notification webhook not configured');
    return false;
  }

  try {
    const locationDetails = appointment.isIncall 
      ? "My place (incall)" 
      : appointment.address || appointment.area || "Client specified location";

    const calendlyUrl = appointment.calendlyLink || process.env.CALENDLY_BOOKING_URL;

    // Format notification for iOS
    const notificationTitle = `New Appointment: ${appointment.name}`;
    const notificationBody = `${appointment.date} at ${appointment.time} (${appointment.duration}h) - ${appointment.service} - ${appointment.isIncall ? 'Incall' : 'Outcall'}`;

    const payload: MakeIOSNotificationPayload = {
      // Client details
      client_name: appointment.name,
      client_email: appointment.email,
      client_phone: appointment.phone || "",
      
      // Appointment details
      appointment_date: appointment.date,
      appointment_time: appointment.time,
      duration_hours: appointment.duration,
      service_type: appointment.service,
      
      // Location info
      location_type: appointment.isIncall ? "incall" : "outcall",
      location_details: locationDetails,
      
      // iOS Push Notification fields for Make.com Apple Push Notifications module
      notification_title: notificationTitle,
      notification_body: notificationBody,
      notification_url: calendlyUrl,
      notification_badge: 1,
      notification_sound: "default",
      notification_category: "appointment",
      
      // Additional data
      special_requests: appointment.message || "",
      booking_source: "website",
      timestamp: new Date().toISOString(),
      priority: "high"
    };

    console.log('Sending iOS notification via Make.com:', {
      title: notificationTitle,
      body: notificationBody,
      url: calendlyUrl
    });

    const response = await fetch(makeIOSWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'RentBobby-Appointments/1.0'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Make.com iOS webhook error: ${response.status} - ${errorText}`);
    }

    const responseData = await response.text();
    console.log('Make.com iOS notification sent successfully:', responseData);
    return true;

  } catch (error) {
    console.error('Make.com iOS notification failed:', error);
    return false;
  }
}

export function isIOSNotificationConfigured(): boolean {
  return !!(process.env.MAKE_IOS_NOTIFICATION_WEBHOOK);
}

// Helper function to determine if location is incall/outcall
export function parseLocationDetails(location: string, message: string): {
  isIncall: boolean;
  address?: string;
  area?: string;
} {
  const locationLower = location.toLowerCase();
  const messageLower = message.toLowerCase();
  
  // Check for incall indicators
  if (locationLower.includes('incall') || 
      locationLower.includes('my place') ||
      messageLower.includes('incall')) {
    return { isIncall: true };
  }
  
  // Extract address or area from message for outcalls
  const addressMatch = message.match(/address[:\s]+([^\n\r,\.]+)/i);
  const areaMatch = message.match(/area[:\s]+([^\n\r,\.]+)/i) || 
                   message.match(/location[:\s]+([^\n\r,\.]+)/i);
  
  return {
    isIncall: false,
    address: addressMatch ? addressMatch[1].trim() : undefined,
    area: areaMatch ? areaMatch[1].trim() : undefined
  };
}