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

import { User, Calendar, MessageCircle, DollarSign, Twitter, Users, QrCode, Shield, Heart, Globe, Video } from "lucide-react";
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
      url: "https://rent.men/bobbydtx",
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
      platform: "chaturbate",
      name: "Chaturbate",
      description: "Live cam shows",
      url: "https://chaturbate.com/bobbydfw/",
      icon: Video,
      neonColor: "hsl(45, 100%, 55%)"
    },
    {
      platform: "stripchat",
      name: "Stripchat",
      description: "Live cam & interactive shows",
      url: "https://stripchat.com/rentbobbydfw",
      icon: Globe,
      neonColor: "hsl(270, 100%, 65%)"
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
      {/* Sleek Modern Background */}
      <div 
        className="fixed inset-0"
        style={{
          background: `
            linear-gradient(135deg, hsl(220, 15%, 8%) 0%, hsl(0, 0%, 2%) 50%, hsl(230, 20%, 6%) 100%)
          `,
          zIndex: 1
        }}
      />
      
      {/* Subtle Geometric Pattern Overlay */}
      <div 
        className="fixed inset-0"
        style={{
          background: `
            radial-gradient(circle at 25% 25%, hsl(240, 50%, 15%) 0%, transparent 30%),
            radial-gradient(circle at 75% 75%, hsl(220, 40%, 12%) 0%, transparent 30%),
            linear-gradient(45deg, transparent 30%, hsl(210, 30%, 5%) 50%, transparent 70%)
          `,
          opacity: 0.6,
          zIndex: 2
        }}
      />
      
      {/* Animated Subtle Accent Lines */}
      <div className="fixed inset-0" style={{ zIndex: 3 }}>
        <div 
          className="absolute w-full h-px"
          style={{
            top: '30%',
            background: 'linear-gradient(90deg, transparent, hsl(240, 80%, 70%) 50%, transparent)',
            opacity: 0.1,
            transform: `translateX(${scrollY * -0.3}px)`
          }}
        />
        <div 
          className="absolute w-full h-px"
          style={{
            top: '70%',
            background: 'linear-gradient(90deg, transparent, hsl(280, 60%, 60%) 50%, transparent)',
            opacity: 0.08,
            transform: `translateX(${scrollY * 0.2}px)`
          }}
        />
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
                alt="Austin male companion Bobby LGBTQ-friendly professional services" 
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
              Discreet professional companion.
            </h2>
            <p className="text-gray-300 leading-relaxed mb-8 max-w-sm mx-auto text-base">
              Professional companion services specializing in authentic connections and boyfriend-style experiences. Available for dates, events, and getaways.
            </p>

            {/* Primary CTA */}
            <div className="flex justify-center mb-8">
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
            </div>
          </div>
        </section>

        {/* Connect Section - Moved to top */}
        <section className="py-8 px-4"
                 style={{transform: `translateY(${scrollY * 0.05}px)`}}>
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Connect</h2>
            
            {/* Liquid Glass Container */}
            <div 
              className="rounded-3xl p-6 backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div className="space-y-1">
                {socialLinks.map((link, index) => (
                  <button
                    key={link.platform}
                    onClick={() => {
                      triggerHaptic('light');
                      handleLinkClick(link.platform, link.url);
                    }}
                    className="group flex items-center w-full py-3 px-4 rounded-xl transition-all duration-300 hover:bg-white/5"
                  >
                    {/* Accent Line */}
                    <div 
                      className="w-0.5 h-5 rounded-full mr-4 transition-all duration-300 group-hover:h-6"
                      style={{
                        background: link.neonColor,
                        opacity: 0.4,
                        boxShadow: `0 0 8px ${link.neonColor}40`
                      }}
                    />
                    {/* Site Name */}
                    <span className="text-white/80 text-lg font-medium tracking-wide transition-all duration-300 group-hover:text-white group-hover:translate-x-1">
                      {link.name}
                    </span>
                    {/* Subtle Arrow */}
                    <span className="ml-auto text-white/20 text-sm transition-all duration-300 group-hover:text-white/50 group-hover:translate-x-1">
                      ›
                    </span>
                  </button>
                ))}

                {/* Divider */}
                <div className="my-4 border-t border-white/10" />
                
                {/* Payment - Same Style */}
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2 px-4">Tips</p>
                {paymentLinks.map((payment) => (
                  <button
                    key={payment.platform}
                    onClick={() => {
                      triggerHaptic('light');
                      handleLinkClick(payment.platform, payment.url);
                    }}
                    className="group flex items-center w-full py-3 px-4 rounded-xl transition-all duration-300 hover:bg-white/5"
                  >
                    <div 
                      className="w-0.5 h-5 rounded-full mr-4 transition-all duration-300 group-hover:h-6"
                      style={{
                        background: payment.neonColor,
                        opacity: 0.4,
                        boxShadow: `0 0 8px ${payment.neonColor}40`
                      }}
                    />
                    <span className="text-white/80 text-lg font-medium tracking-wide transition-all duration-300 group-hover:text-white group-hover:translate-x-1">
                      {payment.name}
                    </span>
                    <span className="ml-auto text-white/20 text-sm transition-all duration-300 group-hover:text-white/50 group-hover:translate-x-1">
                      ›
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Partner in Crime Section */}
        <section className="py-12 px-4"
                 style={{transform: `translateY(${scrollY * 0.045}px)`}}>
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Partner in Crime</h2>
            <div 
              className="rounded-3xl p-6 backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-white tracking-wide">Nick</h3>
                <p className="text-white/50 text-sm mt-1">Austin, TX</p>
              </div>
              <p className="text-white/60 text-sm leading-relaxed text-center mb-5">
                Rugged, American, dom, daddy for good time
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    trackEvent('partner_link', 'outbound', 'rentmen_nick');
                    window.open('https://rent.men/Nickbrodude', '_blank');
                  }}
                  className="group flex items-center w-full py-3 px-4 rounded-xl transition-all duration-300 hover:bg-white/5"
                >
                  <div 
                    className="w-0.5 h-5 rounded-full mr-4 transition-all duration-300 group-hover:h-6"
                    style={{
                      background: '#e74c3c',
                      opacity: 0.4,
                      boxShadow: '0 0 8px rgba(231,76,60,0.4)'
                    }}
                  />
                  <span className="text-white/80 text-lg font-medium tracking-wide transition-all duration-300 group-hover:text-white group-hover:translate-x-1">
                    Rentmen
                  </span>
                  <span className="ml-auto text-white/20 text-sm transition-all duration-300 group-hover:text-white/50 group-hover:translate-x-1">
                    ›
                  </span>
                </button>
              </div>
              <div className="mt-5 pt-4 border-t border-white/10 text-center">
                <p className="text-white/40 text-xs">Ask about duo sessions when booking</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Gallery Section */}
        <section className="py-12 px-4"
                 style={{transform: `translateY(${scrollY * 0.04}px)`}}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-white">Gallery</h2>
            <ImageGallery />
          </div>
        </section>

        {/* Live Chat Section */}
        <section className="py-12 px-4"
                 style={{transform: `translateY(${scrollY * 0.03}px)`}}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Chat</h2>
            <div 
              className="rounded-3xl overflow-hidden backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <iframe 
                src="https://cbxyz.com/in/?tour=SHBY&campaign=2KzrM&track=embed&room=bobbydfw"
                className="w-full rounded-3xl"
                style={{ height: '528px', border: 'none' }}
                title="Live Chat"
                allow="camera; microphone"
              />
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
                

                
                {reviews.map((review: any, index: number) => {
                  // Use public rating instead of calculated average
                  const publicRating = review.publicRating || review.publicrating || 5; // fallback for existing reviews
                  
                  return (
                    <div key={review.id} className="flex justify-center">
                      <div className="bg-black/70 backdrop-blur-md p-6 rounded-2xl border border-yellow-500/30 shadow-xl max-w-md w-full"
                           style={{
                             background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(20,20,20,0.9) 100%)',
                             boxShadow: '0 15px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
                             opacity: 1,
                             transform: `translateY(0px) scale(1)`,
                             animationDelay: `${index * 0.15}s`
                           }}>
                        
                        {/* Header with public rating */}
                        <div className="text-center mb-4">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="flex text-yellow-400 text-xl">
                              {"★".repeat(publicRating)}{"☆".repeat(5 - publicRating)}
                            </div>
                            <span className="text-yellow-300 font-semibold">{publicRating}/5</span>
                          </div>
                          <div className="bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full inline-block">
                            <span className="text-green-300 text-xs font-medium">✓ Verified</span>
                          </div>
                        </div>
                        
                        {/* Full Comment */}
                        <div className="mb-4">
                          <p className="text-white text-base leading-relaxed text-center italic">
                            "{review.additionalComments || review.publicComment || review.publiccomment || 'Great experience overall!'}"
                          </p>
                        </div>
                        
                        {/* Service Types */}
                        <div className="flex flex-wrap gap-2 mb-4 justify-center">
                          {review.serviceTypes?.slice(0, 2).map((serviceType: string, i: number) => (
                            <span key={i} className="bg-blue-500/20 border border-blue-500/30 px-2 py-1 rounded-full text-blue-300 text-xs">
                              {serviceType}
                            </span>
                          ))}
                        </div>
                        
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

        {/* FAQ Section - SEO Optimized */}
        <section className="py-16 px-4"
                 style={{transform: `translateY(${scrollY * 0.03}px)`}}>
          <div className="max-w-4xl mx-auto">
            <FAQAccordion />
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="glass-effect p-8 rounded-3xl border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Book Premium Companion Services</h3>
              <p className="text-gray-300 mb-6">
                Professional companion Bobby offers engaging conversation, thoughtful companionship, and authentic connections. Available for dates, events, and weekend getaways. Premium companion experiences tailored to your needs.
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
            alt="Discreet companion Bobby offering travel and social event services" 
            className="w-full h-auto rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
