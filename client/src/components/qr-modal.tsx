import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Share, X } from "lucide-react";

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
      <DialogContent className="bg-[#FBF9F0] border border-[#3E5F44]/15 text-[#283A2C] max-w-sm mx-4">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-[#283A2C] flex items-center gap-2">
              <QrCode className="w-5 h-5" style={{color: '#3E5F44'}} />
              Share Profile
            </DialogTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-[#6B7362] hover:text-[#283A2C] h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-2xl border border-[#3E5F44]/15">
              {isLoading ? (
                <div className="w-48 h-48 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#3E5F44]/20 border-t-[#3E5F44]"></div>
                </div>
              ) : qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="QR code for Austin male companion Bobby's profile at rentbobby.com" 
                  className="w-48 h-48 rounded-lg"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-[#6B7362]">
                  Failed to load QR code
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center">
            <p className="text-[#6B7362] text-sm mb-4">
              Scan this QR code with any camera to quickly visit Bobby's profile
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={downloadQRCode}
              disabled={!qrCodeUrl}
              className="flex-1 rounded-full bg-[#EFE9D3] border-none text-[#3E5F44] hover:bg-[#E6DEC2] font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={shareQRCode}
              disabled={!qrCodeUrl}
              className="flex-1 rounded-full bg-[#3E5F44] text-[#FBF9F0] hover:bg-[#33503A] font-medium"
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