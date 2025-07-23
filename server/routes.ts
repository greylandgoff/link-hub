import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import QRCode from "qrcode";
import { sendEmail, isEmailConfigured } from "./email-service";
import { sendGoogleSheetsWebhook, isGoogleSheetsConfigured } from "./webhook-sms";
// Webhooks disabled - import { sendToMakeWebhook, isMakeWebhookConfigured } from "./make-webhook";
// Webhooks disabled - import { sendIOSNotification, isIOSNotificationConfigured, parseLocationDetails } from "./ios-notifications";
import { insertAppointmentSchema } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact card generation endpoint
  app.get("/api/contact-card", (req, res) => {
    try {
      // Read and encode the profile photo
      const photoPath = path.join(__dirname, "..", "attached_assets", "IMG_2889_1751926502403.jpg");
      let photoBase64 = '';
      
      if (fs.existsSync(photoPath)) {
        const photoBuffer = fs.readFileSync(photoPath);
        photoBase64 = photoBuffer.toString('base64');
      }

      const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Bobby
ORG:Personal Companion
TITLE:Personal Companion
EMAIL:bobby@rentbobby.com
TEL:+17372972747
URL:https://rentbobby.com
NOTE:Genuine, laid-back companion for relaxed chats, thoughtful talks, or playful fun. Life's short—let's enjoy it.${photoBase64 ? `\nPHOTO;ENCODING=BASE64;TYPE=JPEG:${photoBase64}` : ''}
END:VCARD`;

      res.setHeader('Content-Type', 'text/vcard');
      res.setHeader('Content-Disposition', 'attachment; filename="bobby-contact.vcf"');
      res.send(vCardData);
    } catch (error) {
      console.error("Error generating contact card:", error);
      // Fallback without photo
      const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Bobby
ORG:Personal Companion
TITLE:Personal Companion
EMAIL:bobby@rentbobby.com
TEL:+17372972747
URL:https://rentbobby.com
NOTE:Genuine, laid-back companion for relaxed chats, thoughtful talks, or playful fun. Life's short—let's enjoy it.
END:VCARD`;

      res.setHeader('Content-Type', 'text/vcard');
      res.setHeader('Content-Disposition', 'attachment; filename="bobby-contact.vcf"');
      res.send(vCardData);
    }
  });

  // Email contact endpoint
  app.post("/api/contact/email", async (req, res) => {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ 
          message: "Name, email, and message are required" 
        });
      }

      console.log("Email contact request:", {
        from: `${name} <${email}>`,
        message: message,
        timestamp: new Date().toISOString()
      });

      // Try to send real email if SendGrid is configured
      if (isEmailConfigured()) {
        const emailSent = await sendEmail({
          from: "bobby@rentbobby.com", // Your verified SendGrid email
          to: "bobby@rentbobby.com", // Where you want to receive contact messages
          subject: `New Contact Form Message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nReply to: ${email}`
        });

        if (emailSent) {
          res.json({ 
            message: "Email sent successfully",
            success: true 
          });
        } else {
          res.status(500).json({ 
            message: "Failed to send email" 
          });
        }
      } else {
        // Fallback when SendGrid is not configured
        console.log("SendGrid not configured, email logged only");
        res.json({ 
          message: "Email logged (SendGrid not configured)",
          success: true 
        });
      }
    } catch (error) {
      console.error("Error processing email contact:", error);
      res.status(500).json({ 
        message: "Failed to send email" 
      });
    }
  });

  // Text message contact endpoint  
  app.post("/api/contact/text", async (req, res) => {
    try {
      const { name, email, message, phone } = req.body;

      if (!name || !message) {
        return res.status(400).json({ 
          message: "Name and message are required" 
        });
      }

      if (!email && !phone) {
        return res.status(400).json({ 
          message: "Either email or phone is required" 
        });
      }

      console.log("Text contact request:", {
        from: `${name} <${email}>`,
        phone: phone,
        message: message,
        timestamp: new Date().toISOString()
      });

      // Send contact data to Google Sheets
      let sheetsNotificationSent = false;
      try {
        if (isGoogleSheetsConfigured()) {
          console.log("Sending contact form data to Google Sheets...");
          
          const contactPayload = {
            occurred_at: new Date().toISOString(),
            event_name: "contact_form",
            value1: name,
            value2: email || "",
            value3: phone || "",
            message: message,
            contact_type: "text_request"
          };

          const response = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactPayload)
          });

          sheetsNotificationSent = response.ok;
          console.log("Contact form Google Sheets notification sent:", sheetsNotificationSent);
        }
      } catch (sheetsError) {
        console.error("Error sending contact form to Google Sheets:", sheetsError);
      }

      res.json({ 
        message: "Contact form submitted successfully",
        success: true,
        googleSheetsSent: sheetsNotificationSent
      });
    } catch (error) {
      console.error("Error processing text contact:", error);
      res.status(500).json({ 
        message: "Failed to send notification" 
      });
    }
  });

  // QR Code generation endpoint
  app.post("/api/generate-qr", async (req, res) => {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ 
          message: "URL is required" 
        });
      }

      // Generate QR code as PNG buffer
      const qrCodeBuffer = await QRCode.toBuffer(url, {
        type: 'png',
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'inline; filename="qr-code.png"');
      res.send(qrCodeBuffer);
    } catch (error) {
      console.error("Error generating QR code:", error);
      res.status(500).json({ 
        message: "Failed to generate QR code" 
      });
    }
  });

  // Review API endpoints
  app.get("/api/reviews", async (req, res) => {
    try {
      // Debug environment and database connection
      console.log('DATABASE_URL configured:', !!process.env.DATABASE_URL);
      console.log('Environment:', process.env.NODE_ENV || 'development');
      
      const reviews = await storage.getApprovedReviews();
      console.log('Serving reviews:', reviews.length);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      console.error("Database connection error details:", error.message);
      res.status(500).json({ 
        message: "Failed to fetch reviews",
        error: process.env.NODE_ENV === 'development' ? error.message : 'Database connection failed',
        hasDatabase: !!process.env.DATABASE_URL
      });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = req.body;
      
      if (!reviewData.name || !reviewData.email) {
        return res.status(400).json({ 
          message: "Name and email are required" 
        });
      }

      const review = await storage.createReview(reviewData);
      console.log('Review created:', review);

      // Send email notification about new review
      try {
        const avgRating = Math.round((review.appearance + review.punctuality + review.communication + review.professionalism + review.chemistry + review.discretion) / 6);
        
        const emailSubject = `⭐ New Review Submitted - ${avgRating}/5 Stars from ${review.name}`;
        const emailText = `
New review submitted for approval:

Reviewer: ${review.name}
Email: ${review.email}
Overall Rating: ${avgRating}/5 stars

Individual Ratings:
- Appearance: ${review.appearance}/5
- Punctuality: ${review.punctuality}/5  
- Communication: ${review.communication}/5
- Professionalism: ${review.professionalism}/5
- Chemistry: ${review.chemistry}/5
- Discretion: ${review.discretion}/5

Service Types: ${review.serviceTypes.join(', ')}

Would book again: ${review.wouldBookAgain ? 'Yes' : 'No'}
Booking process smooth: ${review.bookingProcessSmooth ? 'Yes' : 'No'}  
Matched description: ${review.matchedDescription ? 'Yes' : 'No'}

Additional Comments:
${review.additionalComments || 'None'}

Review ID: ${review.id}
Submitted: ${review.createdAt}

To approve/manage reviews, use the admin panel.
        `;

        const emailSent = await sendEmail({
          from: "bobby@rentbobby.com",
          to: "bobby@rentbobby.com",
          subject: emailSubject,
          text: emailText
        });

        if (emailSent) {
          console.log('Review notification email sent successfully');
        } else {
          console.log('Review notification email failed to send');
        }

        // Webhook notifications disabled for reviews
      } catch (emailError) {
        console.error('Error sending review notification email:', emailError);
      }

      res.json({ message: "Review submitted for approval", review });
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to submit review" });
    }
  });

  // Admin routes for review management
  app.get("/api/admin/reviews", async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching admin reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.patch("/api/admin/reviews/:id/approve", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const review = await storage.approveReview(reviewId);
      res.json(review);
    } catch (error) {
      console.error("Error approving review:", error);
      res.status(500).json({ message: "Failed to approve review" });
    }
  });

  app.delete("/api/admin/reviews/:id", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      await storage.deleteReview(reviewId);
      res.json({ message: "Review deleted" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  // Appointment booking endpoint
  app.post("/api/appointments", async (req, res) => {
    try {
      console.log("Appointment booking request received:", req.body);
      console.log("Request headers:", req.headers);

      // Check for required fields first
      if (!req.body.name || !req.body.email || !req.body.date || !req.body.time || !req.body.service) {
        console.log("Missing required fields:", {
          name: !!req.body.name,
          email: !!req.body.email,
          date: !!req.body.date,
          time: !!req.body.time,
          service: !!req.body.service
        });
        return res.status(400).json({
          message: "Missing required fields",
          required: ["name", "email", "date", "time", "service"],
          received: Object.keys(req.body)
        });
      }

      // Validate appointment data
      const appointmentData = insertAppointmentSchema.parse({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone || null,
        appointmentDate: req.body.date,
        appointmentTime: req.body.time,
        duration: req.body.duration || "2",
        serviceType: req.body.service,
        location: req.body.location || "austin",
        specialRequests: req.body.message || null,
        status: "pending",
        source: req.body.source || "website"
      });

      // Create appointment in database
      const appointment = await storage.createAppointment(appointmentData);
      console.log("Appointment created:", appointment);

      // Simple location details (webhook functionality disabled)
      const locationDetails = {
        isIncall: true,
        type: appointmentData.location?.toLowerCase().includes('outcall') ? 'Outcall' : 'Incall'
      };

      // Send email notification for new appointment
      let emailNotificationSent = false;
      try {
        console.log("Sending appointment email notification...");
        
        emailNotificationSent = await sendEmail({
          from: 'bobby@rentbobby.com',
          to: 'bobby@rentbobby.com',
          subject: `🗓️ New Appointment Request: ${appointmentData.name}`,
          text: `New appointment booking received:

Client: ${appointmentData.name}
Email: ${appointmentData.email}
Phone: ${appointmentData.phone || 'Not provided'}

Appointment Details:
Date: ${appointmentData.appointmentDate}
Time: ${appointmentData.appointmentTime}
Duration: ${appointmentData.duration}
Service: ${appointmentData.serviceType}
Location: ${appointmentData.location}

Special Requests: ${appointmentData.specialRequests || 'None'}

Calendly Link: ${process.env.CALENDLY_BOOKING_URL || 'https://calendly.com/bobby-rentbobby'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">🗓️ New Appointment Request</h2>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1e293b;">Client Information</h3>
                <p><strong>Name:</strong> ${appointmentData.name}</p>
                <p><strong>Email:</strong> ${appointmentData.email}</p>
                <p><strong>Phone:</strong> ${appointmentData.phone || 'Not provided'}</p>
              </div>
              
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1e293b;">Appointment Details</h3>
                <p><strong>Date:</strong> ${appointmentData.appointmentDate}</p>
                <p><strong>Time:</strong> ${appointmentData.appointmentTime}</p>
                <p><strong>Duration:</strong> ${appointmentData.duration}</p>
                <p><strong>Service:</strong> ${appointmentData.serviceType}</p>
                <p><strong>Location:</strong> ${appointmentData.location}</p>
              </div>
              
              ${appointmentData.specialRequests ? `
              <div style="background: #fef3f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1e293b;">Special Requests</h3>
                <p>${appointmentData.specialRequests}</p>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CALENDLY_BOOKING_URL || 'https://calendly.com/bobby-rentbobby'}" 
                   style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Schedule via Calendly
                </a>
              </div>
            </div>
          `
        });
        
        console.log("Email notification sent:", emailNotificationSent);
      } catch (emailError) {
        console.error("Error sending appointment email:", emailError);
      }

      // Send comprehensive appointment data to Google Sheets
      let sheetsNotificationSent = false;
      try {
        if (isGoogleSheetsConfigured()) {
          console.log("Sending appointment data to Google Sheets...");
          
          sheetsNotificationSent = await sendGoogleSheetsWebhook({
            name: appointmentData.name,
            email: appointmentData.email,
            phone: appointmentData.phone || "",
            appointmentDate: appointmentData.appointmentDate,
            appointmentTime: appointmentData.appointmentTime,
            duration: appointmentData.duration,
            serviceType: appointmentData.serviceType,
            location: appointmentData.location,
            specialRequests: appointmentData.specialRequests || "",
            source: appointmentData.source,
            status: appointmentData.status,
            createdAt: appointment.createdAt.toISOString()
          });
          
          console.log("Google Sheets notification sent:", sheetsNotificationSent);
        } else {
          console.log("Google Sheets webhook not configured");
        }
      } catch (sheetsError) {
        console.error("Error sending Google Sheets notification:", sheetsError);
      }

      console.log("Appointment stored in database successfully");

      // Update notification status in database
      const notificationStatus = sheetsNotificationSent 
        ? "Google Sheets: logged successfully" 
        : "Google Sheets: not configured or failed";
        
      await storage.updateAppointmentWebhookStatus(
        appointment.id, 
        sheetsNotificationSent, 
        notificationStatus
      );

      res.json({ 
        message: "Appointment request submitted successfully",
        appointment: {
          id: appointment.id,
          status: appointment.status,
          emailSent: emailNotificationSent,
          googleSheetsSent: sheetsNotificationSent,
          notificationStatus: notificationStatus,
          locationDetails
        }
      });

    } catch (error) {
      console.error("Error creating appointment:", error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Invalid appointment data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        message: "Failed to create appointment request" 
      });
    }
  });

  // Get appointments endpoint (admin use)
  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  // Update appointment status endpoint (admin use)
  app.patch("/api/appointments/:id/status", async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const appointment = await storage.updateAppointmentStatus(appointmentId, status);
      res.json(appointment);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      res.status(500).json({ message: "Failed to update appointment status" });
    }
  });

  // Webhook testing disabled
  app.post("/api/test-webhook", async (req, res) => {
    res.json({ 
      success: false,
      message: "Webhook functionality has been disabled" 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
