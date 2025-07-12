import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ContactModal } from "@/components/contact-modal";
import { QRModal } from "@/components/qr-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trackEvent } from "@/lib/analytics";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";

import { User, Calendar, MessageCircle, DollarSign, Twitter, Users, QrCode } from "lucide-react";
import { SiApple, SiCashapp } from "react-icons/si";
import profileImage from "@assets/IMG_2889_1751926502403.jpg";
import backgroundImage from "@assets/IMG_2862_1751936715707.jpg";
import { ReviewModal } from "@/components/review-modal";

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Fetch approved reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['/api/reviews'],
    queryFn: async () => {
      const response = await fetch('/api/reviews');
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      return response.json();
    },
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
      
      const response = await fetch("/api/contact-card", {
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
    // Track analytics event
    trackEvent('social_link_click', 'engagement', platform);
    console.log(`Clicked: ${platform}`);
    window.open(url, "_blank");
  };

  const socialLinks = [
    {
      platform: "onlyfans",
      name: "OnlyFans", 
      description: "Extra spicy content",
      url: "https://onlyfans.com/bobbyatx",
      icon: User,
      neonColor: "hsl(320, 100%, 60%)"
    },
    {
      platform: "rentmen",
      name: "Rentmen",
      description: "Companion services", 
      url: "https://rent.men/BobbyAtx",
      icon: Calendar,
      neonColor: "hsl(30, 100%, 50%)"
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
      {/* Background Image with Parallax - Extended Height */}
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
          zIndex: 1
        }}
      />
      
      {/* Subtle Dark Overlay - Extended */}
      <div 
        className="fixed bg-black/30"
        style={{ 
          top: '-50vh',
          left: 0,
          right: 0,
          height: '200vh',
          zIndex: 2 
        }}
      />
      
      {/* Subtle Accent Overlays */}
      <div className="fixed inset-0 opacity-20" style={{ zIndex: 3 }}>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full mix-blend-soft-light filter blur-2xl"
             style={{
               background: 'radial-gradient(circle, hsl(320, 100%, 60%), transparent)',
               transform: `translateY(${scrollY * 0.1}px)`
             }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full mix-blend-soft-light filter blur-2xl" 
             style={{
               background: 'radial-gradient(circle, hsl(200, 100%, 50%), transparent)', 
               transform: `translateY(${scrollY * -0.08}px)`
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
                    trackEvent('qr_modal_open', 'engagement', 'header_qr');
                    setIsQRModalOpen(true);
                  }}
                  className="glass-effect px-3 py-2 rounded-full text-sm font-medium hover-lift bg-transparent border border-white/20 hover:bg-white/10"
                >
                  <QrCode className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => {
                    trackEvent('contact_modal_open', 'engagement', 'header_contact');
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

        {/* Profile Section */}
        <section className="py-8 px-4" 
                 style={{transform: `translateY(${scrollY * 0.1}px)`}}>
          <div className="max-w-md mx-auto text-center">
            {/* Profile Avatar */}
            <div className="relative mb-6">
              <button
                onClick={() => setIsPhotoModalOpen(true)}
                className="block mx-auto group"
              >
                <img 
                  src={`${profileImage}?t=${Date.now()}`} 
                  alt="Bobby - Professional Companion Austin TX - Premium companion services" 
                  className="w-40 h-40 rounded-full object-cover border-4 border-white/20 shadow-2xl group-hover:scale-105 transition-transform cursor-pointer"
                  key="profile-updated-2025-01-08"
                />
                <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">View Photo</span>
                </div>
              </button>
            </div>

            {/* Profile Info */}
            <h1 className="text-5xl font-black mb-4 tracking-widest relative overflow-hidden" 
                style={{
                  background: `linear-gradient(${45 + scrollY * 0.5}deg, 
                    hsl(${120 + scrollY * 0.1}, 100%, ${50 + Math.sin(scrollY * 0.01) * 10}%), 
                    hsl(${160 + scrollY * 0.15}, 100%, ${40 + Math.cos(scrollY * 0.008) * 15}%), 
                    hsl(${180 + scrollY * 0.2}, 100%, ${45 + Math.sin(scrollY * 0.012) * 12}%))`,
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: '900',
                  textShadow: `0 0 ${15 + Math.sin(scrollY * 0.01) * 5}px rgba(0, 255, 127, 0.4)`,
                  transform: `perspective(500px) rotateY(${Math.sin(scrollY * 0.005) * 3}deg) scale(${1 + Math.sin(scrollY * 0.008) * 0.05})`,
                  filter: `brightness(${1.1 + Math.sin(scrollY * 0.01) * 0.2}) saturate(${1.2 + Math.cos(scrollY * 0.007) * 0.3})`,
                  letterSpacing: `${0.15 + Math.sin(scrollY * 0.006) * 0.05}em`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
              Bobby
              {/* Shimmer overlay effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 opacity-0 animate-pulse"
                style={{
                  animation: `shimmer 3s ease-in-out infinite`,
                  animationDelay: `${scrollY * 0.01}s`,
                  transform: `translateX(${-100 + (scrollY * 0.5) % 200}px) skewX(-12deg)`
                }}
              />
            </h1>
            <h2 className="text-gray-200 leading-relaxed mb-8 max-w-sm mx-auto text-lg font-normal">
              Professional companion services based in Austin, TX. Available for domestic or international travel for authentic connections and meaningful experiences.
            </h2>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 mb-8">
              <Button 
                onClick={handleSaveContact}
                className="glass-effect px-6 py-3 rounded-full font-medium hover-lift inline-flex items-center gap-2 bg-transparent border border-white/20 hover:bg-white/10"
              >
                <User className="w-4 h-4" />
                Save Contact
              </Button>
              <Button 
                onClick={() => {
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

        {/* Social Links */}
        <section className="py-8 px-4"
                 style={{transform: `translateY(${scrollY * 0.05}px)`}}>
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-6 text-center text-gray-200">Premium Companion Services & Platforms</h3>
            
            <div className="space-y-4">
              {socialLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <button
                    key={link.platform}
                    onClick={() => handleLinkClick(link.platform, link.url)}
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
                        <p className="text-gray-400 text-xs opacity-80">{link.description}</p>
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
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-200 mb-4 text-center">Payment Options & Tips</h4>
                {paymentLinks.map((payment) => {
                  const IconComponent = payment.icon;
                  return (
                    <button
                      key={payment.platform}
                      onClick={() => handleLinkClick(payment.platform, payment.url)}
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
            </div>
          </div>
        </section>

        {/* Reviews Section - Scroll-Triggered Showcase */}
        <section id="reviews-section" className="py-16 px-4 relative overflow-hidden"
                 style={{transform: `translateY(${scrollY * 0.02}px)`}}>
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-white mb-8"
                style={{
                  opacity: Math.min(1, (scrollY - 800) / 300),
                  transform: `translateY(${Math.max(0, 50 - (scrollY - 800) / 10)}px)`
                }}>
              Client Reviews & Testimonials
            </h3>
            
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
                  Help others discover quality companion services by sharing your authentic experience.
                </p>
                <Button 
                  onClick={() => setIsReviewModalOpen(true)}
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
            ) : reviews.length > 0 ? (
              <div className="space-y-6 mb-12">
                {reviews.slice(0, 3).map((review: any, index: number) => {
                  // Calculate average rating from individual categories
                  const avgRating = Math.round((review.appearance + review.punctuality + review.communication + review.professionalism + review.chemistry + review.discretion) / 6);
                  
                  return (
                    <div key={review.id} className="flex justify-center">
                      <div className="bg-black/70 backdrop-blur-md p-10 rounded-3xl border-2 border-yellow-500/30 shadow-2xl max-w-3xl w-full"
                           style={{
                             background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(20,20,20,0.9) 100%)',
                             boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
                             opacity: Math.min(1, Math.max(0, (scrollY - 900 - index * 100) / 200)),
                             transform: `translateY(${Math.max(50, 50 - (scrollY - 900 - index * 100) / 8)}px) scale(${Math.min(1, 0.8 + (scrollY - 900 - index * 100) / 1000)})`,
                             animationDelay: `${index * 0.2}s`
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
                                  <span className="text-yellow-400 text-lg">{"★".repeat(review.appearance)}</span>
                                  <span className="text-white font-medium">{review.appearance}</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-200 text-sm">Professionalism:</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-yellow-400 text-lg">{"★".repeat(review.professionalism)}</span>
                                  <span className="text-white font-medium">{review.professionalism}</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-200 text-sm">Chemistry:</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-yellow-400 text-lg">{"★".repeat(review.chemistry)}</span>
                                  <span className="text-white font-medium">{review.chemistry}</span>
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
                                  <span className="text-yellow-400 text-lg">{"★".repeat(review.punctuality)}</span>
                                  <span className="text-white font-medium">{review.punctuality}</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-200 text-sm">Communication:</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-yellow-400 text-lg">{"★".repeat(review.communication)}</span>
                                  <span className="text-white font-medium">{review.communication}</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-200 text-sm">Discretion:</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-yellow-400 text-lg">{"★".repeat(review.discretion)}</span>
                                  <span className="text-white font-medium">{review.discretion}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Service Types */}
                        <div className="mb-6">
                          <h4 className="text-white font-semibold mb-3 text-base">Services</h4>
                          <div className="flex flex-wrap gap-3">
                            {review.serviceTypes.map((service: string, idx: number) => (
                              <span key={idx} className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-200 text-sm font-medium">
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Additional Comments */}
                        {review.additionalComments && (
                          <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-xl mb-6">
                            <h4 className="text-yellow-300 font-semibold mb-3 text-base">Client Feedback</h4>
                            <p className="text-white text-lg leading-relaxed italic">
                              "{review.additionalComments}"
                            </p>
                          </div>
                        )}
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="text-white font-semibold text-base">
                            {review.name}
                          </div>
                          <div className="text-gray-300 text-sm">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center mb-12">
                <div className="bg-black/80 backdrop-blur-md p-12 rounded-3xl border-2 border-yellow-500/30 shadow-2xl max-w-3xl w-full text-center"
                     style={{
                       background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(30,30,30,0.95) 100%)',
                       boxShadow: '0 25px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)'
                     }}>
                  <div className="text-yellow-400 text-4xl mb-6">⭐⭐⭐⭐⭐</div>
                  <h3 className="text-white text-2xl font-bold mb-4">Be the First to Review</h3>
                  <p className="text-gray-200 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
                    Share your experience with Bobby's professional companion services. 
                    Your authentic feedback helps others discover quality connections and memorable experiences.
                  </p>
                  <Button 
                    onClick={() => setIsReviewModalOpen(true)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-none px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    ⭐ Write Your Review
                  </Button>
                </div>
              </div>
            )}

            {/* Floating Stats Section */}
            <div className="text-center">
              <div className="glass-effect p-8 rounded-3xl border border-white/20 inline-block relative"
                   style={{
                     opacity: Math.min(1, Math.max(0, (scrollY - 1200) / 300)),
                     transform: `translateY(${Math.max(20, 20 - (scrollY - 1200) / 15)}px) scale(${Math.min(1.05, 0.9 + (scrollY - 1200) / 2000)})`,
                     filter: `brightness(${1 + Math.sin(scrollY * 0.01) * 0.1})`,
                   }}>
                <div className="absolute inset-0 rounded-3xl"
                     style={{
                       background: `linear-gradient(45deg, 
                         hsla(${120 + scrollY * 0.1}, 50%, 20%, 0.1), 
                         hsla(${180 + scrollY * 0.15}, 50%, 20%, 0.1))`,
                       animation: 'pulse 4s ease-in-out infinite'
                     }}></div>
                <div className="relative z-10">
                  <h4 className="text-xl font-semibold text-white mb-4">Authentic Client Testimonials</h4>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    Real experiences from satisfied clients. Quality connections built on professionalism, 
                    genuine conversation, and memorable experiences.
                  </p>
                  <div className="flex justify-center mb-4">
                    <Button 
                      onClick={() => {
                        const reviewsUrl = `${window.location.origin}/#reviews`;
                        navigator.clipboard.writeText(reviewsUrl);
                        
                        // Track analytics event
                        trackEvent('share_reviews', 'engagement', 'reviews_link');
                        
                        // Show a brief feedback
                        const btn = event?.target as HTMLButtonElement;
                        const originalText = btn.textContent;
                        btn.textContent = '✓ Link Copied!';
                        setTimeout(() => {
                          btn.textContent = originalText;
                        }, 2000);
                      }}
                      className="glass-effect px-6 py-3 rounded-full font-medium hover-lift bg-transparent border border-white/20 hover:bg-white/10 text-white"
                    >
                      🔗 Share Reviews
                    </Button>
                  </div>
                  
                  {/* Stats section temporarily disabled - will be enabled once more reviews are collected */}
                  {/* 
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">100%</div>
                      <div className="text-gray-400 text-sm">Authentic</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">✓</div>
                      <div className="text-gray-400 text-sm">Professional</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">∞</div>
                      <div className="text-gray-400 text-sm">Memorable</div>
                    </div>
                  </div>
                  */}
                </div>
              </div>
            </div>

            {/* Floating Particles Effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full opacity-30"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + Math.sin(scrollY * 0.01 + i) * 20}%`,
                    background: `hsl(${120 + i * 30 + scrollY * 0.1}, 70%, 60%)`,
                    boxShadow: `0 0 ${8 + Math.sin(scrollY * 0.008 + i) * 4}px currentColor`,
                    transform: `translateY(${Math.sin(scrollY * 0.005 + i * 0.5) * 10}px) scale(${1 + Math.sin(scrollY * 0.01 + i) * 0.3})`,
                    animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
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
              <TabsList className="grid w-full grid-cols-3 glass-effect bg-white/10 border border-white/20">
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
      </div>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
      
      <QRModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
      />

      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
      />
      
      {/* Photo Modal */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent className="glass-effect bg-gray-900/95 border border-white/20 text-white max-w-2xl mx-4 p-0">
          <div className="relative">
            <img 
              src={`${profileImage}?t=${Date.now()}`} 
              alt="Bobby's Profile - Full Size" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
