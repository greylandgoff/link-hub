import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ContactModal } from "@/components/contact-modal";
import { QRModal } from "@/components/qr-modal";
import { ScreeningForm } from "@/components/screening-form";
import { ReviewModal } from "@/components/review-modal";
import { AgeGateBanner } from "@/components/age-gate-banner";
import { FAQAccordion } from "@/components/faq-accordion";
import { ImageGallery } from "@/components/image-gallery";
import { QuickChat } from "@/components/quick-chat";
import { QuickHelpTooltip } from "@/components/quick-help-tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHaptic } from "@/hooks/use-haptic";
// Analytics tracking with outbound link tracking
const trackEvent = (event: string, category: string, label?: string) => {
  console.log('Analytics:', event, category, label);
  // If Google Analytics is available, use it
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: category,
      event_label: label
    });
  }
};
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";

import { User, Calendar, MessageCircle, DollarSign, Twitter, Users, QrCode, Shield, Heart, Globe } from "lucide-react";
import { SiApple, SiCashapp } from "react-icons/si";
const profileImage = "/images/IMG_2876_1752841940506.jpeg";
const backgroundImage = "/images/IMG_2862_1751936715707.jpg";
// Note: ReviewModal component needs to be created

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isScreeningFormOpen, setIsScreeningFormOpen] = useState(false);
  const [isQuickChatOpen, setIsQuickChatOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  // Initialize haptic feedback
  const { triggerHaptic } = useHaptic();

  // Fetch approved reviews
  const { data: reviews = [], isLoading: reviewsLoading, error: reviewsError } = useQuery({
    queryKey: ['/api/reviews'],
    queryFn: async () => {
      // Determine correct API URL based on environment
      let apiUrl;
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Development: Use Express server
        apiUrl = '/api/reviews';
      } else if (window.location.hostname.includes('.pages.dev') || window.location.hostname.includes('rentbobby.com')) {
        // Production: Use Cloudflare Functions
        apiUrl = '/api/reviews';
      } else {
        // Fallback: Use relative URL
        apiUrl = '/api/reviews';
      }
        
      console.log('Fetching reviews from:', apiUrl, 'on hostname:', window.location.hostname);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Reviews API error:', response.status, response.statusText, errorData);
        throw new Error(`Failed to fetch reviews: ${response.status} - ${errorData.message || response.statusText || 'Unknown error'}`);
      }
      const data = await response.json();
      console.log('Reviews fetched successfully:', data); 
      console.log('Number of reviews found:', data.length);
      if (data.length > 0) {
        console.log('First review data:', data[0]);
      }
      return data;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Debug: Check if Google Analytics is loaded
    console.log('Google Analytics loaded:', !!window.gtag);
    console.log('Current URL:', window.location.href);
    
    // Handle direct links to reviews section
    if (window.location.hash === '#reviews') {
      setTimeout(() => {
        const reviewsSection = document.getElementById('reviews-section');
        if (reviewsSection) {
          reviewsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Small delay to ensure page is loaded
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSaveContact = async () => {
    try {
      // Track analytics event
      trackEvent('save_contact', 'engagement', 'contact_card');
      
      // Use absolute URL for external devices, relative for development
      const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? '/api/contact-card'
        : `${window.location.protocol}//${window.location.host}/api/contact-card`;
        
      const response = await fetch(apiUrl, {
        method: "GET",
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate contact card");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "bobby-contact.vcf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading contact card:", error);
      alert("Failed to download contact card. Please try again.");
    }
  };

  const handleLinkClick = (platform: string, url: string) => {
    // Track outbound link click with platform-specific categorization
    const category = ['hunqz', 'gaycities', 'chamber'].includes(platform) ? 'directory' : 'social_media';
    trackEvent('outbound_link', category, platform);
    console.log(`Clicked: ${platform}`);
    window.open(url, "_blank");
  };

  const socialLinks = [
    {
      platform: "onlyfans",
      name: "OnlyFans", 
      description: "Extra spicy content",
      url: "https://onlyfans.com/bobbyatx/c1",
      icon: User,
      neonColor: "hsl(320, 100%, 60%)"
    },
    {
      platform: "rentmen",
      name: "Rentmen",
      description: "Boyfriend experience listings", 
      url: "https://rent.men/BobbyAtx",
      icon: Calendar,
      neonColor: "hsl(30, 100%, 50%)"
    },
    {
      platform: "hunqz",
      name: "Hunqz",
      description: "GFE/BFE profile", 
      url: "https://hunqz.com/bobby-austin",
      icon: Users,
      neonColor: "hsl(160, 100%, 50%)"
    },
    {
      platform: "twitter",
      name: "X",
      description: "Mild spicy content, shower thoughts, and other nonsense",
      url: "https://twitter.com/graydoutx", 
      icon: Twitter,
      neonColor: "hsl(200, 100%, 50%)"
    }
  ];

  const paymentLinks = [
    {
      platform: "cashapp",
      name: "CashApp",
      handle: "@grey1and",
      url: "https://cash.app/$grey1and",
      icon: SiCashapp,
      neonColor: "hsl(120, 100%, 50%)"
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Age Gate Banner */}
      <AgeGateBanner />
      {/* Background Image with Frosted Effect */}
      <div 
        className="fixed bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          transform: `translateY(${scrollY * 0.2}px)`,
          top: '-50vh',
          left: 0,
          right: 0,
          height: '200vh',
          zIndex: 1,
          filter: 'blur(15px) brightness(0.7) saturate(1.3)',
          opacity: 0.8
        }}
      />
      
      {/* Subtle Dark Overlay with Gradient */}
      <div 
        className="fixed"
        style={{ 
          top: '-50vh',
          left: 0,
          right: 0,
          height: '200vh',
          zIndex: 2,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)'
        }}
      />
      
      {/* Light Frosted Glass Layer */}
      <div 
        className="fixed"
        style={{ 
          top: '-50vh',
          left: 0,
          right: 0,
          height: '200vh',
          zIndex: 3,
          backdropFilter: 'blur(8px) saturate(1.1)',
          background: 'rgba(0,0,0,0.1)'
        }}
      />
      
      {/* Subtle Color Accent Overlays */}
      <div className="fixed inset-0 opacity-15" style={{ zIndex: 4 }}>
        <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full mix-blend-soft-light filter blur-3xl"
             style={{
               background: 'radial-gradient(circle, hsl(320, 80%, 50%), transparent)',
               transform: `translateY(${scrollY * 0.1}px)`
             }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full mix-blend-soft-light filter blur-3xl" 
             style={{
               background: 'radial-gradient(circle, hsl(200, 80%, 40%), transparent)', 
               transform: `translateY(${scrollY * -0.08}px)`
             }}></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full mix-blend-overlay filter blur-3xl" 
             style={{
               background: 'radial-gradient(circle, hsl(280, 60%, 30%), transparent)', 
               transform: `translate(-50%, -50%) translateY(${scrollY * 0.05}px)`
             }}></div>
      </div>

      {/* Main Container */}
      <div className="relative" style={{ zIndex: 10 }}>
        {/* Header */}
        <header className="py-6 px-4">
          <div className="max-w-md mx-auto">
            <nav className="flex justify-between items-center">
              <div className="text-xl font-bold tracking-tight" 
                   style={{
                     color: 'rgba(255, 255, 255, 0.9)',
                     textShadow: '0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.2)',
                     backdropFilter: 'blur(1px)',
                     WebkitTextStroke: '1px rgba(255, 255, 255, 0.1)',
                     filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                   }}>
                rentbobby.com
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    triggerHaptic('light');
                    setIsQRModalOpen(true);
                  }}
                  className="glass-effect px-3 py-2 rounded-full text-sm font-medium hover-lift bg-transparent border border-white/20 hover:bg-white/10"
                >
                  <QrCode className="w-4 h-4" />
                </Button>
                <QuickHelpTooltip context="contact">
                  <Button 
                    onClick={() => {
                      triggerHaptic('light');
                      setIsContactModalOpen(true);
                    }}
                    className="glass-effect px-4 py-2 rounded-full text-sm font-medium hover-lift bg-transparent border border-white/20 hover:bg-white/10"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </QuickHelpTooltip>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-8 px-4" 
                 style={{transform: `translateY(${scrollY * 0.1}px)`}}>
          <div className="max-w-md mx-auto text-center">
            {/* Profile Avatar */}
            <div className="relative mb-6">
              <img 
                src={`${profileImage}?t=${Date.now()}`} 
                alt="Bobby's Profile" 
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white/20 shadow-2xl"
                key="profile-updated-2025-01-08"
              />
            </div>

            {/* Profile Info */}
            <h1 className="text-3xl font-bold mb-2 tracking-tight" 
                style={{background: 'linear-gradient(45deg, hsl(320, 100%, 60%), hsl(200, 100%, 50%), hsl(280, 100%, 60%))', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontWeight: '700'}}>
              Bobby
            </h1>
            <h2 className="text-gray-200 leading-relaxed mb-2 max-w-sm mx-auto text-xl font-medium">
              Discreet local Austin companion.
            </h2>
            <p className="text-gray-300 leading-relaxed mb-8 max-w-sm mx-auto text-base">
              Professional companion services based in Austin, TX. Available for domestic or international travel. Specializing in authentic connections and boyfriend-style experiences.
            </p>

            {/* Primary CTA */}
            <div className="flex justify-center mb-8">
              <QuickHelpTooltip context="booking">
                <Button 
                  onClick={() => {
                    triggerHaptic('medium');
                    trackEvent('appointment_request', 'engagement', 'hero_cta');
                    setIsScreeningFormOpen(true);
                  }}
                  className="glass-effect px-8 py-4 rounded-full font-semibold hover-lift inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400/50 hover:from-purple-600/40 hover:to-pink-600/40 text-lg"
                >
                  <Calendar className="w-5 h-5" />
                  Book Now
                </Button>
              </QuickHelpTooltip>
            </div>

            {/* Secondary Actions */}
            <div className="flex justify-center gap-3 mb-8 flex-wrap">
              <Button 
                onClick={() => {
                  triggerHaptic('light');
                  handleSaveContact();
                }}
                className="glass-effect px-6 py-3 rounded-full font-medium hover-lift inline-flex items-center gap-2 bg-transparent border border-white/20 hover:bg-white/10"
              >
                <User className="w-4 h-4" />
                Save Contact
              </Button>
              <QuickHelpTooltip context="review">
                <Button 
                  onClick={() => {
                    triggerHaptic('light');
                    trackEvent('review_modal_open', 'engagement', 'profile_review');
                    setIsReviewModalOpen(true);
                  }}
                  className="glass-effect px-6 py-3 rounded-full font-medium hover-lift inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/30 hover:from-purple-600/30 hover:to-blue-600/30"
                >
                  <Star className="w-4 h-4" />
                  Leave Review
                </Button>
              </QuickHelpTooltip>
            </div>
          </div>
        </section>

        {/* Connect Section - Moved to top */}
        <section className="py-8 px-4"
                 style={{transform: `translateY(${scrollY * 0.05}px)`}}>
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Connect</h2>
            
            <QuickHelpTooltip context="social">
              <div className="space-y-4">
              {socialLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <button
                    key={link.platform}
                    onClick={() => {
                      triggerHaptic('light');
                      handleLinkClick(link.platform, link.url);
                    }}
                    className="block w-full glass-effect p-4 rounded-2xl hover-lift group bg-transparent border border-white/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                           style={{background: `radial-gradient(circle, ${link.neonColor}, ${link.neonColor}80)`, 
                                   boxShadow: `0 0 20px ${link.neonColor}60`}}>
                        <IconComponent className="text-white text-xl w-6 h-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-white">{link.name}</h3>
                        <p className="text-gray-300 text-sm">{link.description}</p>
                      </div>
                      <div className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                           style={{color: link.neonColor}}>
                        →
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Payment Options */}
              <QuickHelpTooltip context="payment">
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-white mb-4 text-center">Support & Tips</h3>
                {paymentLinks.map((payment) => {
                  const IconComponent = payment.icon;
                  return (
                    <button
                      key={payment.platform}
                      onClick={() => {
                        triggerHaptic('light');
                        handleLinkClick(payment.platform, payment.url);
                      }}
                      className="block w-full glass-effect p-4 rounded-2xl hover-lift group bg-transparent border border-white/20 mb-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                             style={{background: `radial-gradient(circle, ${payment.neonColor}, ${payment.neonColor}80)`, 
                                     boxShadow: `0 0 20px ${payment.neonColor}60`}}>
                          <IconComponent className="text-white text-xl w-6 h-6" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-white">{payment.name}</h3>
                          <p className="text-gray-300 text-sm">{payment.handle}</p>
                        </div>
                        <div className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                             style={{color: payment.neonColor}}>
                          →
                        </div>
                      </div>
                    </button>
                  );
                })}
                <div className="text-center mt-4">
                  <p className="text-gray-400 text-xs">
                    Apple Cash available via text/contact form
                  </p>
                </div>
                </div>
              </QuickHelpTooltip>
              </div>
            </QuickHelpTooltip>
          </div>
        </section>

        {/* Interactive Gallery Section */}
        <section className="py-12 px-4"
                 style={{transform: `translateY(${scrollY * 0.04}px)`}}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-white">Gallery & Testimonials</h2>
            <QuickHelpTooltip context="gallery">
              <ImageGallery />
            </QuickHelpTooltip>
          </div>
        </section>

        {/* Why Book Section - Key Benefits Above the Fold */}
        <section className="py-12 px-4"
                 style={{transform: `translateY(${scrollY * 0.05}px)`}}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-white">Why Book</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Discreet & Professional */}
              <div className="glass-effect p-6 rounded-2xl hover-lift text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                     style={{background: 'radial-gradient(circle, hsl(280, 100%, 60%), hsl(280, 100%, 40%))'}}>
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white">Discreet Companion</h3>
                <ul className="text-gray-300 text-sm space-y-2 text-left">
                  <li>• Complete confidentiality at all times</li>
                  <li>• Clear, professional boundaries</li>
                  <li>• Courteous and respectful interactions</li>
                  <li>• Privacy and discretion prioritized</li>
                </ul>
              </div>

              {/* LGBTQ Friendly */}
              <div className="glass-effect p-6 rounded-2xl hover-lift text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                     style={{background: 'radial-gradient(circle, hsl(320, 100%, 60%), hsl(320, 100%, 40%))'}}>
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white">LGBTQ+ Friendly</h3>
                <ul className="text-gray-300 text-sm space-y-2 text-left">
                  <li>• Inclusive and welcoming environment</li>
                  <li>• Comfortable space with no judgment</li>
                  <li>• Genuine, personable connection</li>
                  <li>• Professional yet natural presence</li>
                </ul>
              </div>

              {/* Flexible & Available */}
              <div className="glass-effect p-6 rounded-2xl hover-lift text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                     style={{background: 'radial-gradient(circle, hsl(200, 100%, 50%), hsl(200, 100%, 40%))'}}>
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white">Travel & Local</h3>
                <ul className="text-gray-300 text-sm space-y-2 text-left">
                  <li>• Austin-based with flexible scheduling</li>
                  <li>• Available for travel and weekend engagements</li>
                  <li>• Professional plus-one for events or functions</li>
                  <li>• Comfortable, natural companionship</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="booking-section" className="py-12 px-4"
                 style={{transform: `translateY(${scrollY * 0.03}px)`}}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-white">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="glass-effect p-6 rounded-2xl text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
                <h3 className="font-semibold mb-2 text-white">Submit Request</h3>
                <p className="text-gray-300 text-sm">Quick screening form with your preferences</p>
              </div>
              
              <div className="glass-effect p-6 rounded-2xl text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
                <h3 className="font-semibold mb-2 text-white">Get Quote</h3>
                <p className="text-gray-300 text-sm">Rates quoted based on date & duration</p>
              </div>
              
              <div className="glass-effect p-6 rounded-2xl text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <h3 className="font-semibold mb-2 text-white">Confirm Details</h3>
                <p className="text-gray-300 text-sm">Finalize time, location & arrangements</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-300 mb-6 leading-relaxed">
                {import.meta.env.VITE_SHOW_RATES !== 'true' 
                  ? "Rates quoted by date / length after screening."
                  : "Contact for current rates and availability."
                }
              </p>
              <QuickHelpTooltip context="screening">
                <Button 
                  onClick={() => {
                    triggerHaptic('medium');
                    trackEvent('appointment_request', 'engagement', 'booking_section');
                    setIsScreeningFormOpen(true);
                  }}
                  className="glass-effect px-8 py-4 rounded-full font-semibold hover-lift inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400/50 hover:from-purple-600/40 hover:to-pink-600/40 text-lg"
                >
                  <Calendar className="w-5 h-5" />
                  Start Screening
                </Button>
              </QuickHelpTooltip>
            </div>
          </div>
        </section>

        {/* Reviews Section - Scroll-Triggered Showcase */}
        <section id="reviews-section" className="py-16 px-4 relative overflow-hidden"
                 style={{transform: `translateY(${scrollY * 0.02}px)`}}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-white mb-8"
                style={{
                  opacity: Math.min(1, (scrollY - 300) / 200),
                  transform: `translateY(${Math.max(0, 30 - (scrollY - 300) / 8)}px)`
                }}>
              Testimonials
            </h2>
            
            {/* Leave a Review Section - Above existing reviews */}
            <div className="flex justify-center mb-12">
              <div className="bg-black/80 backdrop-blur-md p-8 rounded-3xl border-2 border-yellow-500/30 shadow-2xl max-w-2xl w-full text-center"
                   style={{
                     background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(30,30,30,0.95) 100%)',
                     boxShadow: '0 25px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)'
                   }}>
                <div className="text-yellow-400 text-3xl mb-4">⭐⭐⭐⭐⭐</div>
                <h4 className="text-white text-xl font-bold mb-3">Share Your Experience</h4>
                <p className="text-gray-200 text-base mb-6 leading-relaxed">
                  Help others discover quality companion services by sharing your authentic experience locally and during travel.
                </p>
                <Button 
                  onClick={() => {
                    triggerHaptic('medium');
                    setIsReviewModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-none px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  ⭐ Leave Your Review
                </Button>
              </div>
            </div>
            
            {/* Dynamic Reviews from Database */}
            {reviewsLoading ? (
              <div className="flex justify-center mb-12">
                <div className="glass-effect p-8 rounded-2xl border border-white/20 max-w-2xl">
                  <div className="animate-pulse">
                    <div className="h-4 bg-white/20 rounded mb-4"></div>
                    <div className="h-20 bg-white/10 rounded mb-4"></div>
                    <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ) : reviews && reviews.length > 0 ? (
              <div className="space-y-6 mb-12">
                <div className="text-center mb-6">
                  <h3 className="text-white text-xl font-bold">Client Reviews ({reviews.length})</h3>
                  <p className="text-gray-300">Real experiences from verified clients</p>
                </div>
                

                
                {reviews.slice(0, 3).map((review: any, index: number) => {
                  // Calculate average rating from individual categories
                  const avgRating = Math.round((review.appearance + review.punctuality + review.communication + review.professionalism + review.chemistry + review.discretion) / 6);
                  
                  return (
                    <div key={review.id} className="flex justify-center">
                      <div className="bg-black/70 backdrop-blur-md p-10 rounded-3xl border-2 border-yellow-500/30 shadow-2xl max-w-3xl w-full"
                           style={{
                             background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(20,20,20,0.9) 100%)',
                             boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
                             opacity: 1, // Fixed opacity to always show reviews
                             transform: `translateY(0px) scale(1)`, // Simplified transform
                             animationDelay: `${index * 0.15}s`
                           }}>
                        
                        {/* Header with overall rating */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-yellow-500/20">
                          <div className="flex items-center gap-4">
                            <div className="flex text-yellow-400 text-2xl">
                              {"★".repeat(avgRating)}{"☆".repeat(5 - avgRating)}
                            </div>
                            <div className="text-yellow-300 font-semibold text-lg">{avgRating}/5 Overall</div>
                          </div>
                          <div className="bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-full">
                            <span className="text-green-300 text-sm font-medium">✓ Verified Review</span>
                          </div>
                        </div>
                        
                        {/* Rating Categories */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <h4 className="text-white font-semibold mb-3 text-base">Service Quality</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-200 text-sm">Appearance:</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-yellow-400 text-lg">{"★".repeat(review.appearance || 0)}{"☆".repeat(5 - (review.appearance || 0))}</span>
                                  <span className="text-white font-medium">{review.appearance || 0}/5</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-200 text-sm">Professionalism:</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-yellow-400 text-lg">{"★".repeat(review.professionalism || 0)}{"☆".repeat(5 - (review.professionalism || 0))}</span>
                                  <span className="text-white font-medium">{review.professionalism || 0}/5</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-200 text-sm">Chemistry:</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-yellow-400 text-lg">{"★".repeat(review.chemistry || 0)}{"☆".repeat(5 - (review.chemistry || 0))}</span>
                                  <span className="text-white font-medium">{review.chemistry || 0}/5</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <h4 className="text-white font-semibold mb-3 text-base">Experience</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-200 text-sm">Punctuality:</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-yellow-400 text-lg">{"★".repeat(review.punctuality || 0)}{"☆".repeat(5 - (review.punctuality || 0))}</span>
                                  <span className="text-white font-medium">{review.punctuality || 0}/5</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-200 text-sm">Communication:</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-yellow-400 text-lg">{"★".repeat(review.communication || 0)}{"☆".repeat(5 - (review.communication || 0))}</span>
                                  <span className="text-white font-medium">{review.communication || 0}/5</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-200 text-sm">Discretion:</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-yellow-400 text-lg">{"★".repeat(review.discretion || 0)}{"☆".repeat(5 - (review.discretion || 0))}</span>
                                  <span className="text-white font-medium">{review.discretion || 0}/5</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Yes/No Questions */}
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
                          <h4 className="text-white font-semibold mb-3 text-base">Quick Questions</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-xl font-bold ${review.wouldBookAgain === true ? 'text-green-400' : 'text-red-400'}`}>
                                {review.wouldBookAgain === true ? '✅' : '❌'}
                              </span>
                              <span className="text-gray-200 text-sm">Would book again</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xl font-bold ${review.bookingProcessSmooth === true ? 'text-green-400' : 'text-red-400'}`}>
                                {review.bookingProcessSmooth === true ? '✅' : '❌'}
                              </span>
                              <span className="text-gray-200 text-sm">Smooth booking</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xl font-bold ${review.matchedDescription === true ? 'text-green-400' : 'text-red-400'}`}>
                                {review.matchedDescription === true ? '✅' : '❌'}
                              </span>
                              <span className="text-gray-200 text-sm">Matched description</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Service Types */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {review.serviceTypes?.map((serviceType: string, i: number) => (
                            <span key={i} className="bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded-full text-blue-300 text-sm">
                              {serviceType}
                            </span>
                          ))}
                        </div>
                        
                        {/* Comments and Client Info */}
                        {review.additionalComments && (
                          <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
                            <h4 className="text-white font-semibold mb-2 text-base">Additional Comments</h4>
                            <p className="text-gray-200 italic text-base leading-relaxed">"{review.additionalComments}"</p>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                          <div className="text-white font-medium text-lg">{review.name}</div>
                          <div className="text-gray-400 text-sm">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center mb-12">
                <div className="glass-effect p-8 rounded-2xl border border-white/20 max-w-2xl text-center">
                  <h4 className="text-white text-lg font-semibold mb-4">No Reviews Yet</h4>
                  <p className="text-gray-300 mb-6">Be the first to share your experience!</p>
                  <Button 
                    onClick={() => setIsReviewModalOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-none px-6 py-3 rounded-full"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Leave First Review
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="glass-effect p-8 rounded-3xl border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Book Premium Companion Services</h3>
              <p className="text-gray-300 mb-6">
                Professional companion Bobby offers engaging conversation, thoughtful companionship, and authentic connections. Based in Austin, TX and available for domestic or international travel for premium companion experiences tailored to your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="glass-effect px-6 py-3 rounded-full font-medium hover-lift bg-transparent border border-white/20 hover:bg-white/10"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Get in Touch
                </Button>
                <Button 
                  onClick={() => setIsQRModalOpen(true)}
                  className="glass-effect px-6 py-3 rounded-full font-medium hover-lift bg-transparent border border-white/20 hover:bg-white/10"
                >
                  <QrCode className="w-4 h-4 mr-2" style={{color: 'hsl(280, 100%, 60%)'}} />
                  Share Profile
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Tabs */}
        <footer className="py-8 px-4 border-t border-white/10 mt-16"
                style={{transform: `translateY(${scrollY * -0.02}px)`}}>
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="privacy" className="w-full">
              <TabsList className="grid w-full grid-cols-4 glass-effect bg-white/10 border border-white/20">
                <TabsTrigger 
                  value="privacy" 
                  className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Privacy Policy
                </TabsTrigger>
                <TabsTrigger 
                  value="terms" 
                  className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Terms of Use
                </TabsTrigger>
                <TabsTrigger 
                  value="faq" 
                  className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  FAQ
                </TabsTrigger>
                <TabsTrigger 
                  value="support" 
                  className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Support
                </TabsTrigger>
              </TabsList>

              <TabsContent value="privacy" className="mt-6">
                <div className="glass-effect bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Privacy Policy</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    This site does not collect personal information or track users beyond essential, non-identifying functionality. External links may direct you to third-party content with their own privacy practices. By using this site, you acknowledge and accept those terms. Discretion is encouraged when viewing or sharing adult-oriented content.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="terms" className="mt-6">
                <div className="glass-effect bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Terms of Use</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    By accessing this site, you confirm that you are of legal age in your jurisdiction and understand that some content may be intended for mature audiences. All materials are for personal, non-commercial use only. Redistribution, impersonation, or harassment of any kind is strictly prohibited. Use at your own discretion.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="faq" className="mt-6">
                <div className="glass-effect bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Frequently Asked Questions</h3>
                  <FAQAccordion />
                </div>
              </TabsContent>

              <TabsContent value="support" className="mt-6">
                <div className="glass-effect bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    For general questions or link-related issues, you're welcome to reach out via the contact method provided. This site is independently maintained, so response times may vary — but respectful communication is always appreciated.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Copyright */}
            <div className="pt-8 text-center">
              <p className="text-gray-500 text-sm">
                © 2025 Bobby. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* Sticky Floating Action Buttons */}
        <div 
          className={`fixed bottom-6 right-6 z-50 flex flex-col gap-3 transition-all duration-300 ${
            scrollY > 400 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          {/* Quick Chat Button */}
          <Button 
            onClick={() => {
              triggerHaptic('light');
              trackEvent('quick_chat_open', 'engagement', 'floating_chat');
              setIsQuickChatOpen(true);
            }}
            className="glass-effect p-4 rounded-full font-semibold hover-lift inline-flex items-center justify-center bg-gradient-to-r from-blue-600/40 to-cyan-600/40 border border-blue-400/60 hover:from-blue-600/50 hover:to-cyan-600/50 text-white shadow-2xl group"
            style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.3)'
            }}
            title="Quick Chat"
          >
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </Button>

          {/* Book Now Button */}
          <Button 
            onClick={() => {
              triggerHaptic('medium');
              trackEvent('appointment_request', 'engagement', 'sticky_cta');
              setIsScreeningFormOpen(true);
            }}
            className="glass-effect px-6 py-4 rounded-full font-semibold hover-lift inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/40 to-pink-600/40 border border-purple-400/60 hover:from-purple-600/50 hover:to-pink-600/50 text-white shadow-2xl"
            style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(168, 85, 247, 0.3)'
            }}
          >
            <Calendar className="w-5 h-5" />
            Book Now
          </Button>
        </div>

        {/* Quick Actions Sidebar for Desktop */}
        <div 
          className={`fixed left-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block transition-all duration-300 ${
            scrollY > 200 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
          }`}
        >
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => {
                triggerHaptic('light');
                setIsQuickChatOpen(true);
              }}
              className="glass-effect p-3 rounded-full hover-lift bg-transparent border border-white/20 hover:bg-white/10 group"
              title="Quick Chat"
            >
              <MessageCircle className="w-5 h-5 text-gray-300 group-hover:text-white" />
            </Button>
            <Button 
              onClick={() => {
                triggerHaptic('light');
                setIsQRModalOpen(true);
              }}
              className="glass-effect p-3 rounded-full hover-lift bg-transparent border border-white/20 hover:bg-white/10 group"
              title="QR Code"
            >
              <QrCode className="w-5 h-5 text-gray-300 group-hover:text-white" />
            </Button>
            <Button 
              onClick={() => {
                triggerHaptic('light');
                setIsReviewModalOpen(true);
              }}
              className="glass-effect p-3 rounded-full hover-lift bg-transparent border border-white/20 hover:bg-white/10 group"
              title="Leave Review"
            >
              <Star className="w-5 h-5 text-gray-300 group-hover:text-white" />
            </Button>
          </div>
        </div>
      </div>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
      
      <QRModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
      />
      
      <ScreeningForm 
        isOpen={isScreeningFormOpen} 
        onClose={() => setIsScreeningFormOpen(false)} 
      />

      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
      />

      <QuickChat 
        isOpen={isQuickChatOpen} 
        onClose={() => setIsQuickChatOpen(false)} 
      />

      {/* Photo Modal */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent className="max-w-2xl bg-black/90 border border-white/20">
          <img 
            src={profileImage} 
            alt="Bobby - Professional Companion" 
            className="w-full h-auto rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
