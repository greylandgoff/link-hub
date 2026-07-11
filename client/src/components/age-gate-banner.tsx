import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function AgeGateBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const requireAgeGate = import.meta.env.VITE_REQUIRE_AGE_GATE === 'true';
  
  // Debug function to reset age gate (for testing)
  if (typeof window !== 'undefined') {
    (window as any).resetAgeGate = () => {
      localStorage.removeItem('rb_ack');
      console.log('Age gate reset - reload page to see age gate again');
    };
  }

  useEffect(() => {
    console.log('Age Gate Debug:', {
      VITE_REQUIRE_AGE_GATE: import.meta.env.VITE_REQUIRE_AGE_GATE,
      requireAgeGate,
      localStorage_rb_ack: localStorage.getItem('rb_ack')
    });
    
    if (!requireAgeGate) {
      console.log('Age gate disabled by environment variable');
      setIsVisible(false);
      return;
    }
    
    const ackKey = localStorage.getItem('rb_ack');
    console.log('Checking age gate acknowledgment:', ackKey);
    
    if (!ackKey) {
      console.log('No acknowledgment found, showing age gate');
      setIsVisible(true);
    } else {
      console.log('Age gate already acknowledged');
      setIsVisible(false);
    }
  }, [requireAgeGate]);

  const handleEnter = () => {
    console.log('Age gate accepted, setting localStorage');
    localStorage.setItem('rb_ack', '1');
    setIsVisible(false);
  };

  const handleLeave = () => {
    window.location.href = 'https://google.com';
  };

  if (!requireAgeGate) {
    console.log('Age gate disabled by environment variable');
    return null;
  }
  
  if (!isVisible) {
    console.log('Age gate not visible (already acknowledged)');
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#DDD6B9] flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto px-6 py-12 text-center bg-[#FBF9F0] rounded-3xl border border-[#3E5F44]/15 shadow-2xl">
        <div className="mb-8">
          <AlertTriangle className="w-20 h-20 text-[#3E5F44] mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-[#283A2C] mb-4">
            Warning: Adult Content
          </h1>
          <div className="space-y-4 text-[#6B7362] text-lg leading-relaxed">
            <p>
              This website contains adult-oriented content and services intended for mature audiences only.
            </p>
            <p>
              You must be <strong className="text-[#283A2C]">18+ years old</strong> (or <strong className="text-[#283A2C]">21+ where required by local law</strong>) to proceed.
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
            className="rounded-full bg-[#3E5F44] hover:bg-[#33503A] text-[#FBF9F0] px-8 py-4 text-lg font-semibold"
            tabIndex={0}
          >
            I Am 18+/21+ - Enter Site
          </Button>
          <Button
            onClick={handleLeave}
            variant="outline"
            className="rounded-full border-none bg-[#EFE9D3] text-[#6B7362] hover:bg-[#E6DEC2] hover:text-[#283A2C] px-8 py-4 text-lg font-semibold"
            tabIndex={0}
          >
            I Am Under 18/21 - Leave Site
          </Button>
        </div>
        
        <p className="text-[#6B7362] text-sm mt-8">
          This age verification is required by law and helps ensure responsible access to adult content.
        </p>
      </div>
    </div>
  );
}