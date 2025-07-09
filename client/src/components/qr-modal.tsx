import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Share } from "lucide-react";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRModal({ isOpen, onClose }: QRModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !qrCodeUrl) {
      generateQRCode();
    }
  }, [isOpen]);

  const generateQRCode = async () => {
    setIsLoading(true);
    try {
      // Force the canonical URL without www
      const currentUrl = "https://rentbobby.com";
      const response = await fetch("/api/generate-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: currentUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate QR code");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setQrCodeUrl(url);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const a = document.createElement("a");
      a.href = qrCodeUrl;
      a.download = "bobby-qr-code.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const shareQRCode = async () => {
    if (navigator.share && qrCodeUrl) {
      try {
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], "bobby-qr-code.png", { type: "image/png" });
        
        await navigator.share({
          title: "Bobby's Profile",
          text: "Scan this QR code to visit Bobby's profile",
          files: [file],
        });
      } catch (error) {
        console.error("Error sharing QR code:", error);
        // Fallback to copying URL
        navigator.clipboard.writeText("https://rentbobby.com");
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText("https://rentbobby.com");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect bg-gray-900/95 border border-white/20 text-white max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 animate-neon-pulse" style={{color: 'hsl(320, 100%, 60%)'}} />
            Share Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="glass-effect p-4 rounded-2xl border border-white/20">
              {isLoading ? (
                <div className="w-48 h-48 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/20 border-t-white"></div>
                </div>
              ) : qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="w-48 h-48 rounded-lg"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-gray-400">
                  Failed to load QR code
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center">
            <p className="text-gray-300 text-sm mb-4">
              Scan this QR code with any camera to quickly visit Bobby's profile
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={downloadQRCode}
              disabled={!qrCodeUrl}
              className="flex-1 glass-effect bg-transparent border border-white/20 hover:bg-white/10 font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={shareQRCode}
              disabled={!qrCodeUrl}
              className="flex-1 glass-effect bg-transparent border border-white/20 hover:bg-white/10 font-medium"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}