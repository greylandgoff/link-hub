import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import QRCode from "qrcode";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact card generation endpoint
  app.get("/api/contact-card", (req, res) => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Bobby
ORG:Personal Companion
TITLE:Companion
EMAIL:bobby@contact.com
TEL:+1-555-0123
URL:https://bobby.com
NOTE:Genuine, laid-back companion for relaxed chats, thoughtful talks, or playful fun. Life's short—let's enjoy it.
END:VCARD`;

    res.setHeader('Content-Type', 'text/vcard');
    res.setHeader('Content-Disposition', 'attachment; filename="bobby-contact.vcf"');
    res.send(vCardData);
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

      // In a real application, you would use a service like Nodemailer
      // to send the actual email. For now, we'll log it and return success.
      console.log("Email contact request:", {
        from: `${name} <${email}>`,
        message: message,
        timestamp: new Date().toISOString()
      });

      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));

      res.json({ 
        message: "Email sent successfully",
        success: true 
      });
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
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ 
          message: "Name, email, and message are required" 
        });
      }

      // In a real application, you would use a service like Twilio
      // to send the actual SMS. For now, we'll log it and return success.
      console.log("Text contact request:", {
        from: `${name} <${email}>`,
        message: message,
        timestamp: new Date().toISOString()
      });

      // Simulate SMS sending
      await new Promise(resolve => setTimeout(resolve, 1000));

      res.json({ 
        message: "Text message sent successfully",
        success: true 
      });
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
