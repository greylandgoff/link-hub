import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

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
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <div className="mb-8">
          <AlertTriangle className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Warning: Adult Content
          </h1>
          <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
            <p>
              This website contains adult-oriented content and services intended for mature audiences only.
            </p>
            <p>
              You must be <strong className="text-white">18+ years old</strong> (or <strong className="text-white">21+ where required by local law</strong>) to proceed.
            </p>
            <p>
              By clicking "I Am 18+/21+", you confirm that:
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-base">
              <li>• You are of legal age in your jurisdiction</li>
              <li>• You understand this site contains adult content</li>
              <li>• You consent to viewing such material</li>
              <li>• You will not share this content with minors</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleEnter}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg font-semibold"
            tabIndex={0}
          >
            I Am 18+/21+ - Enter Site
          </Button>
          <Button
            onClick={handleLeave}
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-500 px-8 py-4 text-lg font-semibold"
            tabIndex={0}
          >
            I Am Under 18/21 - Leave Site
          </Button>
        </div>
        
        <p className="text-gray-500 text-sm mt-8">
          This age verification is required by law and helps ensure responsible access to adult content.
        </p>
      </div>
    </div>
  );
}