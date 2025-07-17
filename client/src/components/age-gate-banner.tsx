import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function AgeGateBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const requireAgeGate = import.meta.env.VITE_REQUIRE_AGE_GATE === 'true';

  useEffect(() => {
    if (!requireAgeGate) return;
    
    const ackKey = localStorage.getItem('rb_ack');
    if (!ackKey) {
      setIsVisible(true);
    }
  }, [requireAgeGate]);

  const handleEnter = () => {
    localStorage.setItem('rb_ack', '1');
    setIsVisible(false);
  };

  const handleLeave = () => {
    window.location.href = 'https://google.com';
  };

  if (!requireAgeGate || !isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-purple-500/20">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-white text-center font-medium">
              Personal hosting for adults 21+. Screening required. Continue?
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleEnter}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6"
              tabIndex={0}
            >
              Enter
            </Button>
            <Button
              onClick={handleLeave}
              variant="outline"
              className="border-purple-500/30 text-white hover:bg-purple-500/20 px-6"
              tabIndex={0}
            >
              Leave
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}