import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import QRCode from "qrcode";
import { sendEmail, isEmailConfigured } from "./email-service";
import { sendSMS, isSMSConfigured } from "./sms-service";
import { sendSMSViaTextBelt, isTextBeltConfigured } from "./textbelt-service";
import { sendSMSViaSMSTo, sendSMSViaVonage, sendSMSViaWebhook, isSMSToConfigured, isVonageConfigured, isWebhookConfigured } from "./sms-alternative-services";
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
      const photoPath = path.join(__dirname, "..", "attached_assets", "IMG_1261_1751811219428.jpg");
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

      if (!name || !email || !message) {
        return res.status(400).json({ 
          message: "Name, email, and message are required" 
        });
      }

      console.log("Text contact request:", {
        from: `${name} <${email}>`,
        message: message,
        timestamp: new Date().toISOString()
      });

      // Try TextBelt first (simpler, no business verification needed)
      const smsText = `New contact from ${name} (${email}):\n\n${message}`;
      let smsSent = false;

      // Try SMS services in order of preference (FREE webhook first!)
      
      // 1. Try webhook service FIRST (FREE!)
      if (!smsSent && isWebhookConfigured()) {
        smsSent = await sendSMSViaWebhook({
          to: "+17372972747",
          message: smsText
        });
      }

      // 2. Try SMS.to if webhook fails
      if (!smsSent && isSMSToConfigured()) {
        smsSent = await sendSMSViaSMSTo({
          to: "+17372972747",
          message: smsText
        });
      }

      // 3. Try Vonage if SMS.to fails
      if (!smsSent && isVonageConfigured()) {
        smsSent = await sendSMSViaVonage({
          to: "+17372972747",
          message: smsText
        });
      }

      // 4. Try TextBelt (limited but free)
      if (!smsSent && isTextBeltConfigured()) {
        smsSent = await sendSMSViaTextBelt({
          to: "+17372972747",
          message: smsText
        });
      }

      // 5. Fallback to Twilio if all else fails
      if (!smsSent && isSMSConfigured()) {
        smsSent = await sendSMS({
          to: "+17372972747",
          message: smsText
        });
      }

      if (smsSent) {
        res.json({ 
          message: "Text message sent successfully",
          success: true 
        });
      } else {
        // Log message even if SMS fails
        console.log("SMS services not available, message logged only");
        res.json({ 
          message: "Message logged (SMS services unavailable)",
          success: true 
        });
      }
    } catch (error) {
      console.error("Error processing text contact:", error);
      res.status(500).json({ 
        message: "Failed to send text message" 
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

  const httpServer = createServer(app);
  return httpServer;
}
