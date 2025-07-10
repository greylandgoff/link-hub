import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ContactModal } from "@/components/contact-modal";
import { QRModal } from "@/components/qr-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trackEvent } from "@/lib/analytics";

import { User, Calendar, MessageCircle, DollarSign, Twitter, Users, QrCode } from "lucide-react";
import { SiApple, SiCashapp } from "react-icons/si";
import profileImage from "@assets/IMG_2889_1751926502403.jpg";
import backgroundImage from "@assets/IMG_2862_1751936715707.jpg";

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Debug: Check if Google Analytics is loaded
    console.log('Google Analytics loaded:', !!window.gtag);
    console.log('Current URL:', window.location.href);
    
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
              Professional companion services in Austin, TX for authentic connections and meaningful experiences. Available for premium companion services and genuine moments.
            </h2>

            {/* Contact Card Button */}
            <div className="flex justify-center mb-8">
              <Button 
                onClick={handleSaveContact}
                className="glass-effect px-6 py-3 rounded-full font-medium hover-lift inline-flex items-center gap-2 bg-transparent border border-white/20 hover:bg-white/10"
              >
                <User className="w-4 h-4" />
                Save Contact
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
        <section className="py-16 px-4 relative overflow-hidden"
                 style={{transform: `translateY(${scrollY * 0.02}px)`}}>
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-white mb-12"
                style={{
                  opacity: Math.min(1, (scrollY - 800) / 300),
                  transform: `translateY(${Math.max(0, 50 - (scrollY - 800) / 10)}px)`
                }}>
              Client Reviews & Testimonials
            </h3>
            
            {/* Animated Review Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Sample Review Card 1 - Scrolls in from left */}
              <div className="glass-effect p-6 rounded-2xl border border-white/20 hover-lift"
                   style={{
                     opacity: Math.min(1, Math.max(0, (scrollY - 900) / 200)),
                     transform: `translateX(${Math.max(-100, -100 + (scrollY - 900) / 5)}px) scale(${Math.min(1, 0.8 + (scrollY - 900) / 1000)})`
                   }}>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-lg">
                    ★★★★★
                  </div>
                  <div className="ml-auto text-gray-500 text-xs">Coming Soon</div>
                </div>
                <p className="text-gray-300 text-sm mb-4 italic">
                  "Authentic testimonials from real clients will appear here once available. Building genuine connections takes time."
                </p>
                <div className="text-gray-400 text-xs">
                  - Real Client
                </div>
              </div>

              {/* Sample Review Card 2 - Fades in */}
              <div className="glass-effect p-6 rounded-2xl border border-white/20 hover-lift"
                   style={{
                     opacity: Math.min(1, Math.max(0, (scrollY - 1000) / 200)),
                     transform: `translateY(${Math.max(50, 50 - (scrollY - 1000) / 8)}px) scale(${Math.min(1, 0.8 + (scrollY - 1000) / 1000)})`
                   }}>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-lg">
                    ★★★★★
                  </div>
                  <div className="ml-auto text-gray-500 text-xs">Coming Soon</div>
                </div>
                <p className="text-gray-300 text-sm mb-4 italic">
                  "Professional reviews highlighting authentic experiences and meaningful connections will be featured here."
                </p>
                <div className="text-gray-400 text-xs">
                  - Real Client
                </div>
              </div>

              {/* Sample Review Card 3 - Scrolls in from right */}
              <div className="glass-effect p-6 rounded-2xl border border-white/20 hover-lift"
                   style={{
                     opacity: Math.min(1, Math.max(0, (scrollY - 1100) / 200)),
                     transform: `translateX(${Math.min(100, 100 - (scrollY - 1100) / 5)}px) scale(${Math.min(1, 0.8 + (scrollY - 1100) / 1000)})`
                   }}>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-lg">
                    ★★★★★
                  </div>
                  <div className="ml-auto text-gray-500 text-xs">Coming Soon</div>
                </div>
                <p className="text-gray-300 text-sm mb-4 italic">
                  "Client feedback about positive experiences, professionalism, and genuine care will be displayed here."
                </p>
                <div className="text-gray-400 text-xs">
                  - Real Client
                </div>
              </div>
            </div>

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
                  <h4 className="text-xl font-semibold text-white mb-4">Building Authentic Connections</h4>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    Quality over quantity. Every interaction is meaningful, every connection genuine. 
                    Real testimonials will showcase the authentic experiences I provide.
                  </p>
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white"
                           style={{
                             color: `hsl(${120 + scrollY * 0.1}, 70%, 60%)`,
                             textShadow: `0 0 10px hsla(${120 + scrollY * 0.1}, 70%, 60%, 0.5)`
                           }}>100%</div>
                      <div className="text-gray-400 text-sm">Authentic</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white"
                           style={{
                             color: `hsl(${160 + scrollY * 0.15}, 70%, 60%)`,
                             textShadow: `0 0 10px hsla(${160 + scrollY * 0.15}, 70%, 60%, 0.5)`
                           }}>✓</div>
                      <div className="text-gray-400 text-sm">Professional</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white"
                           style={{
                             color: `hsl(${180 + scrollY * 0.2}, 70%, 60%)`,
                             textShadow: `0 0 10px hsla(${180 + scrollY * 0.2}, 70%, 60%, 0.5)`
                           }}>∞</div>
                      <div className="text-gray-400 text-sm">Memorable</div>
                    </div>
                  </div>
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
                Professional companion Bobby offers engaging conversation, thoughtful companionship, and authentic connections in Austin, TX. Available for premium companion experiences tailored to your needs.
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
