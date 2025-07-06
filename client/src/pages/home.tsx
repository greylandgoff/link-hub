import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/contact-modal";
import { QRModal } from "@/components/qr-modal";
import { User, Calendar, MessageCircle, DollarSign, Twitter, Users, QrCode } from "lucide-react";
import { SiApple, SiCashapp } from "react-icons/si";

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSaveContact = async () => {
    try {
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
    // Track analytics
    console.log(`Clicked: ${platform}`);
    window.open(url, "_blank");
  };

  const socialLinks = [
    {
      platform: "onlyfans",
      name: "OnlyFans", 
      description: "Exclusive content & behind the scenes",
      url: "https://onlyfans.com/username",
      icon: User,
      neonColor: "hsl(320, 100%, 60%)"
    },
    {
      platform: "rentmen",
      name: "Rentmen",
      description: "Professional services & bookings", 
      url: "https://rentmen.com/username",
      icon: Calendar,
      neonColor: "hsl(30, 100%, 50%)"
    },
    {
      platform: "twitter",
      name: "Twitter",
      description: "Daily updates & thoughts",
      url: "https://twitter.com/username", 
      icon: Twitter,
      neonColor: "hsl(200, 100%, 50%)"
    }
  ];

  const paymentLinks = [
    {
      platform: "cashapp",
      name: "CashApp",
      handle: "$alexmorgan",
      url: "https://cash.app/$alexmorgan",
      icon: SiCashapp,
      neonColor: "hsl(120, 100%, 50%)"
    },
    {
      platform: "apple-cash", 
      name: "Apple Cash",
      handle: "Quick payments",
      url: "tel:+1234567890",
      icon: SiApple,
      neonColor: "hsl(180, 100%, 50%)"
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Neon MSN Butterfly Background with Parallax */}
      <div className="fixed inset-0 opacity-40">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full mix-blend-screen filter blur-xl animate-butterfly"
             style={{
               background: 'radial-gradient(circle, hsl(320, 100%, 60%), hsl(280, 100%, 60%))',
               transform: `translateY(${scrollY * 0.2}px)`
             }}></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full mix-blend-screen filter blur-xl animate-butterfly" 
             style={{
               background: 'radial-gradient(circle, hsl(200, 100%, 50%), hsl(210, 100%, 60%))', 
               animationDelay: "1s",
               transform: `translateY(${scrollY * -0.1}px)`
             }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full mix-blend-screen filter blur-xl animate-butterfly" 
             style={{
               background: 'radial-gradient(circle, hsl(180, 100%, 50%), hsl(120, 100%, 50%))', 
               animationDelay: "2s",
               transform: `translateY(${scrollY * 0.15}px)`
             }}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full mix-blend-screen filter blur-xl animate-butterfly" 
             style={{
               background: 'radial-gradient(circle, hsl(30, 100%, 50%), hsl(330, 100%, 65%))', 
               animationDelay: "3s",
               transform: `translateY(${scrollY * -0.05}px)`
             }}></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10">
        {/* Header */}
        <header className="py-6 px-4">
          <div className="max-w-md mx-auto">
            <nav className="flex justify-between items-center">
              <div className="text-xl font-bold" 
                   style={{background: 'linear-gradient(45deg, hsl(320, 100%, 60%), hsl(200, 100%, 50%))', 
                           WebkitBackgroundClip: 'text', 
                           WebkitTextFillColor: 'transparent',
                           backgroundClip: 'text'}}>
                Digital Hub
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsQRModalOpen(true)}
                  className="glass-effect px-3 py-2 rounded-full text-sm font-medium hover-lift bg-transparent border border-white/20 hover:bg-white/10"
                >
                  <QrCode className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => setIsContactModalOpen(true)}
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
              <img 
                src="/attached_assets/IMG_9267_1751755763247.jpg" 
                alt="Profile Avatar" 
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white/20 shadow-2xl"
              />
            </div>

            {/* Profile Info */}
            <h1 className="text-3xl font-bold mb-2" 
                style={{background: 'linear-gradient(45deg, hsl(320, 100%, 60%), hsl(200, 100%, 50%), hsl(280, 100%, 60%))', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'}}>
              Bobby
            </h1>
            <p className="text-gray-200 leading-relaxed mb-8 max-w-sm mx-auto text-lg">
              Genuine, laid-back companion for relaxed chats, thoughtful talks, or playful fun. Life's short—let's enjoy it.
            </p>

            {/* Contact Card & QR Code Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Button 
                onClick={handleSaveContact}
                className="glass-effect px-6 py-3 rounded-full font-medium hover-lift inline-flex items-center gap-2 bg-transparent border border-white/20 hover:bg-white/10"
              >
                <User className="w-4 h-4" />
                Save Contact
              </Button>
              <Button 
                onClick={() => setIsQRModalOpen(true)}
                className="glass-effect px-6 py-3 rounded-full font-medium hover-lift inline-flex items-center gap-2 bg-transparent border border-white/20 hover:bg-white/10"
              >
                <QrCode className="w-4 h-4" style={{color: 'hsl(280, 100%, 60%)'}} />
                Share QR Code
              </Button>
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="py-8 px-4"
                 style={{transform: `translateY(${scrollY * 0.05}px)`}}>
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-200">Connect With Me</h2>
            
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
              <div className="grid grid-cols-2 gap-4 mt-8">
                {paymentLinks.map((payment) => {
                  const IconComponent = payment.icon;
                  return (
                    <button
                      key={payment.platform}
                      onClick={() => handleLinkClick(payment.platform, payment.url)}
                      className="block glass-effect p-4 rounded-2xl hover-lift group bg-transparent border border-white/20"
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
                             style={{background: `radial-gradient(circle, ${payment.neonColor}, ${payment.neonColor}80)`, 
                                     boxShadow: `0 0 20px ${payment.neonColor}60`}}>
                          <IconComponent className="text-white text-xl w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-white text-sm">{payment.name}</h3>
                        <p className="text-gray-300 text-xs">{payment.handle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Spacer for parallax effect */}
        <section className="py-16 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="glass-effect p-8 rounded-3xl border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Ready to Connect?</h3>
              <p className="text-gray-300 mb-6">
                Whether you're looking for engaging conversation, thoughtful companionship, or just someone to share good vibes with - I'm here for it all.
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

        {/* Footer */}
        <footer className="py-8 px-4 text-center"
                style={{transform: `translateY(${scrollY * -0.02}px)`}}>
          <div className="max-w-md mx-auto">
            <p className="text-gray-500 text-sm mb-4">
              © 2024 Bobby. All rights reserved.
            </p>
            <div className="flex justify-center gap-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
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
    </div>
  );
}
