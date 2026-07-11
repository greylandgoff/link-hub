import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import QRCode from "qrcode";
import { sendEmail, sendQuickChatEmail, sendAppointmentEmail, sendReviewEmail, isEmailConfigured } from "./email-service";
import { sendGoogleSheetsWebhook, isGoogleSheetsConfigured } from "./webhook-sms";
import { sendAppointmentSMS, isTwilioConfigured } from "./twilio-sms";
import { insertAppointmentSchema, insertReviewSchema } from "@shared/schema";
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

      const emailSent = await sendEmail({
        to: "notification@rentbobby.com",
        subject: `[RentBobby] Contact Form — ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nReply to: ${email}`,
      });

      if (emailSent) {
        res.json({ message: "Email sent successfully", success: true });
      } else {
        res.status(500).json({ message: "Failed to send email — please try the contact form or book an appointment." });
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
        return res.status(400).json({ message: "Name and message are required" });
      }

      if (!email && !phone) {
        return res.status(400).json({ message: "Either email or phone is required" });
      }

      const visitorContact = email || phone || "";

      console.log("Quick chat contact request:", {
        from: name,
        contact: visitorContact,
        message,
        timestamp: new Date().toISOString()
      });

      const emailSent = await sendQuickChatEmail({
        visitorName: name,
        visitorContact,
        message,
      });

      res.json({
        message: "Contact form submitted successfully",
        success: true,
        emailSent,
      });
    } catch (error) {
      console.error("Error processing text contact:", error);
      res.status(500).json({ message: "Failed to send notification" });
    }
  });

  // Stripchat live status check (server-side to avoid CORS)
  app.get("/api/stripchat-status", async (req, res) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(
        "https://stripchat.com/api/front/v2/models/by-username/rentbobbydfw",
        { signal: controller.signal, headers: { "Accept": "application/json" } }
      );
      clearTimeout(timeout);
      if (!response.ok) {
        return res.json({ live: false, source: "api_error" });
      }
      const data = await response.json() as { user?: { isLive?: boolean; streamId?: string | null } };
      const live = !!(data?.user?.isLive || data?.user?.streamId);
      res.json({ live, source: "stripchat_api" });
    } catch {
      res.json({ live: false, source: "timeout" });
    }
  });

  // Chaturbate live status check (server-side to avoid CORS)
  app.get("/api/chaturbate-status", async (req, res) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(
        "https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=&client_ip=0.0.0.0&rooms=bobbydfw",
        { signal: controller.signal }
      );
      clearTimeout(timeout);
      if (!response.ok) {
        return res.json({ live: false, source: "api_error" });
      }
      const data = await response.json() as { count?: number; results?: unknown[] };
      const live = (data.count ?? 0) > 0;
      res.json({ live, source: "chaturbate_api" });
    } catch {
      res.json({ live: false, source: "timeout" });
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Database connection error details:", errorMessage);
      res.status(500).json({ 
        message: "Failed to fetch reviews",
        error: process.env.NODE_ENV === 'development' ? errorMessage : 'Database connection failed',
        hasDatabase: !!process.env.DATABASE_URL
      });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      if (!req.body.name || !req.body.email) {
        return res.status(400).json({ 
          message: "Name and email are required" 
        });
      }

      const reviewData = insertReviewSchema.parse(req.body);

      const review = await storage.createReview(reviewData);
      console.log('Review created:', review);

      // Send email notification about new review
      try {
        const avgRating = Math.round((review.appearance + review.punctuality + review.communication + review.professionalism + review.chemistry + review.discretion) / 6);
        await sendReviewEmail({
          name: review.name,
          email: review.email,
          avgRating,
          ratings: {
            Appearance: review.appearance,
            Punctuality: review.punctuality,
            Communication: review.communication,
            Professionalism: review.professionalism,
            Chemistry: review.chemistry,
            Discretion: review.discretion,
          },
          serviceTypes: review.serviceTypes,
          wouldBookAgain: review.wouldBookAgain,
          additionalComments: review.additionalComments,
          reviewId: review.id,
        });
      } catch (emailError) {
        console.error('Error sending review notification email:', emailError);
      }

      res.json({ message: "Review submitted for approval", review });
    } catch (error) {
      console.error("Error creating review:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid data", errors: (error as any).errors });
      }
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

  // Admin route for appointment management
  app.get("/api/admin/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching admin appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
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
      const b = req.body;

      if (!b.name || !b.email || !b.date) {
        return res.status(400).json({
          message: "Name, email, and date are required",
        });
      }

      const appointmentData = insertAppointmentSchema.parse({
        name: b.name,
        email: b.email,
        phone: b.phone || null,
        appointmentDate: b.date,
        appointmentTime: b.time || "TBD",
        duration: b.duration || null,
        serviceType: b.service || "Companion Services",
        location: b.location || null,
        specialRequests: null,
        notes: b.notes || null,
        travelRequest: b.travel_request || false,
        arrivalAirport: b.arrival_airport || null,
        hotelBooked: b.hotel_booked || null,
        interestsBoundaries: b.interests_boundaries || null,
        status: "pending",
        source: b.source || "website",
      });

      const appointment = await storage.createAppointment(appointmentData);
      console.log("Appointment saved to database, id:", appointment.id);

      // Primary notification — Resend email
      let emailSent = false;
      try {
        emailSent = await sendAppointmentEmail({
          name: appointmentData.name,
          email: appointmentData.email,
          phone: appointmentData.phone,
          date: appointmentData.appointmentDate,
          duration: appointmentData.duration,
          location: appointmentData.location,
          duo: !!(b.duo),
          travel: !!(appointmentData.travelRequest),
          arrivalAirport: appointmentData.arrivalAirport,
          hotelBooked: appointmentData.hotelBooked,
          notes: appointmentData.notes,
          interests: appointmentData.interestsBoundaries,
        });
        console.log("Appointment email sent:", emailSent);
      } catch (emailError) {
        console.error("Appointment email error:", emailError);
      }

      // Secondary notification — Twilio SMS (non-blocking, best-effort)
      let smsSent = false;
      try {
        if (isTwilioConfigured()) {
          smsSent = await sendAppointmentSMS({
            name: appointmentData.name,
            email: appointmentData.email,
            phone: appointmentData.phone,
            date: appointmentData.appointmentDate,
            duration: appointmentData.duration || "Not specified",
            location: appointmentData.location || "Not specified",
            duo: !!(b.duo),
            travel: !!(appointmentData.travelRequest),
            arrivalAirport: appointmentData.arrivalAirport,
            hotelBooked: appointmentData.hotelBooked,
            notes: appointmentData.notes,
            interests: appointmentData.interestsBoundaries,
          });
          console.log("Twilio SMS sent:", smsSent);
        }
      } catch (smsError) {
        console.error("Twilio SMS error:", smsError);
      }

      await storage.updateAppointmentWebhookStatus(
        appointment.id,
        emailSent || smsSent,
        emailSent ? "Resend email sent" : smsSent ? "Twilio SMS sent" : "All notifications failed"
      );

      res.json({
        message: "Appointment request submitted successfully",
        appointment: { id: appointment.id, status: appointment.status, emailSent, smsSent },
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid data", errors: (error as any).errors });
      }
      res.status(500).json({ message: "Failed to create appointment request" });
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
