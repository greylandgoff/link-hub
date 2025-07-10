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

  // Add review routes
  const { db } = await import("./db");
  const { reviews, insertReviewSchema } = await import("@shared/schema");
  const { eq, desc } = await import("drizzle-orm");

  // Submit a new review
  app.post("/api/reviews", async (req, res) => {
    try {
      const result = insertReviewSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid review data",
          errors: result.error.errors 
        });
      }

      const { name, email, rating, message } = result.data;

      // Insert review into database (not approved by default)
      const [newReview] = await db.insert(reviews).values({
        name,
        email,
        rating,
        message,
        isApproved: false
      }).returning();

      // Send email notification
      if (isEmailConfigured()) {
        await sendEmail({
          from: "bobby@rentbobby.com",
          to: "bobby@rentbobby.com",
          subject: `New Review Submitted - ${rating} stars from ${name}`,
          text: `New review submitted for approval:

Name: ${name}
Email: ${email}
Rating: ${rating}/5 stars
Message: ${message}

Review ID: ${newReview.id}
Submitted: ${new Date().toLocaleString()}

To approve this review, you'll need to update it in your review management system.`,
          html: `
            <h2>New Review Submitted</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Rating:</strong> ${rating}/5 ⭐</p>
            <p><strong>Message:</strong></p>
            <blockquote>${message}</blockquote>
            <hr>
            <p><small>Review ID: ${newReview.id} | Submitted: ${new Date().toLocaleString()}</small></p>
          `
        });
      }

      res.json({ 
        message: "Review submitted successfully! It will be reviewed before appearing on the site.",
        success: true 
      });

    } catch (error) {
      console.error("Error submitting review:", error);
      res.status(500).json({ 
        message: "Failed to submit review" 
      });
    }
  });

  // Get approved reviews
  app.get("/api/reviews", async (req, res) => {
    try {
      const approvedReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.isApproved, true))
        .orderBy(desc(reviews.createdAt));

      res.json(approvedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ 
        message: "Failed to fetch reviews" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
