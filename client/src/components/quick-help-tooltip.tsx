import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickHelpTooltipProps {
  context: 'booking' | 'review' | 'social' | 'contact' | 'payment' | 'screening' | 'gallery';
  children: React.ReactNode;
  forceShow?: boolean;
}

const helpContent = {
  booking: {
    title: "Ready to Book?",
    tips: [
      "All appointments require screening for safety",
      "Rates are quoted after initial consultation",
      "Same-day bookings may be available",
      "Deposits required for new clients"
    ],
    suggestion: "Click 'Book Now' to start the screening process"
  },
  review: {
    title: "Share Your Experience",
    tips: [
      "Honest feedback helps others",
      "All reviews are verified",
      "Your privacy is protected",
      "Reviews help improve services"
    ],
    suggestion: "Take a moment to leave a review if you've booked before"
  },
  social: {
    title: "Connect & Explore",
    tips: [
      "OnlyFans has exclusive content",
      "Rentmen shows availability calendar",
      "Twitter for updates and thoughts",
      "All platforms are regularly updated"
    ],
    suggestion: "Follow on multiple platforms for different content"
  },
  contact: {
    title: "Get in Touch",
    tips: [
      "Text is the fastest response method",
      "Include your preferred dates/times",
      "Mention if you're visiting Austin",
      "Be respectful and professional"
    ],
    suggestion: "Save contact info for easy communication"
  },
  payment: {
    title: "Payment Options",
    tips: [
      "CashApp is preferred for deposits",
      "Apple Cash available via text",
      "Tips are always appreciated",
      "Payment info verified before booking"
    ],
    suggestion: "Have payment method ready before booking"
  },
  screening: {
    title: "Screening Process",
    tips: [
      "Required for all new clients",
      "Usually takes 24-48 hours",
      "LinkedIn or references help",
      "All information kept confidential"
    ],
    suggestion: "Provide complete info for faster approval"
  },
  gallery: {
    title: "Gallery Tips",
    tips: [
      "Click images to view full size",
      "Recent photos are marked",
      "Professional photos available",
      "More content on OnlyFans"
    ],
    suggestion: "Check OnlyFans for exclusive gallery content"
  }
};

export function QuickHelpTooltip({ context, children, forceShow = false }: QuickHelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const content = helpContent[context];

  useEffect(() => {
    // Check if this tooltip has been shown before
    const shownKey = `quickHelp_${context}_shown`;
    const hasShown = localStorage.getItem(shownKey);
    
    if (!hasShown && !hasBeenShown) {
      // Show tooltip automatically after a delay for first-time visitors
      timeoutRef.current = setTimeout(() => {
        if (!forceShow) {
          setIsVisible(true);
          setHasBeenShown(true);
          localStorage.setItem(shownKey, 'true');
          
          // Auto-hide after 8 seconds
          setTimeout(() => {
            setIsVisible(false);
          }, 8000);
        }
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [context, hasBeenShown, forceShow]);

  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
    }
  }, [forceShow]);

  const handleToggle = () => {
    setIsVisible(!isVisible);
    if (!isVisible) {
      // Calculate position relative to container
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setPosition({
          x: rect.width / 2,
          y: -10
        });
      }
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(`quickHelp_${context}_dismissed`, 'true');
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {children}
      
      {/* Help Icon Button */}
      <button
        onClick={handleToggle}
        className="absolute -top-2 -right-2 z-20 w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg animate-pulse"
        aria-label="Quick help"
      >
        <HelpCircle className="w-4 h-4 text-white" />
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="absolute z-50 w-72 -top-4 left-1/2 transform -translate-x-1/2 -translate-y-full"
            style={{
              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))'
            }}
          >
            <div className="relative bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-xl rounded-2xl p-4 border border-purple-400/30">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {/* AI Sparkle Icon */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm">{content.title}</h3>
              </div>

              {/* Tips */}
              <ul className="space-y-2 mb-3">
                {content.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-300 text-xs mt-0.5">•</span>
                    <span className="text-gray-200 text-xs leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>

              {/* Suggestion */}
              <div className="pt-3 border-t border-white/10">
                <p className="text-yellow-300 text-xs font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {content.suggestion}
                </p>
              </div>

              {/* Arrow pointing down */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-purple-900/95"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}