import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import QRCode from "qrcode";
import { sendEmail, isEmailConfigured } from "./email-service";
import { sendWebhookNotification, isWebhookConfigured } from "./webhook-sms";
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
        message: message,
        timestamp: new Date().toISOString()
      });

      // Send JSON webhook notification
      let notificationSent = false;
      
      if (isWebhookConfigured()) {
        notificationSent = await sendWebhookNotification({
          name,
          email,
          phone,
          message
        });
      }

      if (notificationSent) {
        res.json({ 
          message: "Notification sent successfully",
          success: true 
        });
      } else {
        // Log message even if notification fails
        console.log("Webhook notification failed, message logged only");
        res.json({ 
          message: "Message logged (webhook unavailable)",
          success: true 
        });
      }
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
      const reviews = await storage.getApprovedReviews();
      console.log('Serving reviews:', reviews.length);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
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

  const httpServer = createServer(app);
  return httpServer;
}
