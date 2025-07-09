import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { initGA } from '@/lib/analytics';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookie-consent');
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    // Initialize Google Analytics after consent
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      initGA();
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
    // Optionally disable analytics here if declined
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass-effect p-6 rounded-2xl border border-white/20 bg-black/80 backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">Cookie Notice</h3>
              <p className="text-gray-300 text-sm mb-4">
                This website uses cookies and analytics to improve your experience and understand how you interact with our content. 
                By clicking "Accept", you consent to our use of cookies and analytics tracking.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleAccept}
                  className="px-6 py-2 bg-white text-black hover:bg-gray-100 rounded-full text-sm font-medium"
                >
                  Accept
                </Button>
                <Button
                  onClick={handleDecline}
                  variant="outline"
                  className="px-6 py-2 border-white/20 text-white hover:bg-white/10 rounded-full text-sm font-medium"
                >
                  Decline
                </Button>
              </div>
            </div>
            <Button
              onClick={() => setShowBanner(false)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}