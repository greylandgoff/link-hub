import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/contact-modal";
import { User, Calendar, MessageCircle, DollarSign, Twitter, Users } from "lucide-react";
import { SiApple, SiCashapp } from "react-icons/si";

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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
      a.download = "alex-morgan-contact.vcf";
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
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      platform: "rentmen",
      name: "Rentmen",
      description: "Professional services & bookings", 
      url: "https://rentmen.com/username",
      icon: Calendar,
      gradient: "from-red-500 to-pink-500"
    },
    {
      platform: "twitter",
      name: "Twitter",
      description: "Daily updates & thoughts",
      url: "https://twitter.com/username", 
      icon: Twitter,
      gradient: "from-sky-400 to-blue-500"
    }
  ];

  const paymentLinks = [
    {
      platform: "cashapp",
      name: "CashApp",
      handle: "$alexmorgan",
      url: "https://cash.app/$alexmorgan",
      icon: SiCashapp,
      gradient: "from-green-400 to-emerald-500"
    },
    {
      platform: "apple-cash", 
      name: "Apple Cash",
      handle: "Quick payments",
      url: "tel:+1234567890",
      icon: SiApple,
      gradient: "from-gray-400 to-gray-600"
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: "1s"}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-red-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: "2s"}}></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10">
        {/* Header */}
        <header className="py-6 px-4">
          <div className="max-w-md mx-auto">
            <nav className="flex justify-between items-center">
              <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Digital Hub
              </div>
              <Button 
                onClick={() => setIsContactModalOpen(true)}
                className="glass-effect px-4 py-2 rounded-full text-sm font-medium hover-lift bg-transparent border border-white/20 hover:bg-white/10"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </nav>
          </div>
        </header>

        {/* Profile Section */}
        <section className="py-8 px-4">
          <div className="max-w-md mx-auto text-center">
            {/* Profile Avatar */}
            <div className="relative mb-6">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" 
                alt="Profile Avatar" 
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white/20 shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-gray-800 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse-slow"></div>
              </div>
            </div>

            {/* Profile Info */}
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Alex Morgan
            </h1>
            <p className="text-gray-400 mb-4 text-lg">
              Content Creator & Influencer
            </p>
            <p className="text-gray-300 leading-relaxed mb-8 max-w-sm mx-auto">
              Connecting with amazing people and sharing exclusive content. Follow me across platforms for updates and special offers.
            </p>

            {/* Contact Card Button */}
            <Button 
              onClick={handleSaveContact}
              className="glass-effect px-6 py-3 rounded-full font-medium hover-lift mb-8 inline-flex items-center gap-2 bg-transparent border border-white/20 hover:bg-white/10"
            >
              <User className="w-4 h-4" />
              Save Contact Card
            </Button>
          </div>
        </section>

        {/* Social Links */}
        <section className="py-8 px-4">
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
                      <div className={`w-12 h-12 bg-gradient-to-r ${link.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <IconComponent className="text-white text-xl w-6 h-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-white">{link.name}</h3>
                        <p className="text-gray-400 text-sm">{link.description}</p>
                      </div>
                      <div className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all">
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
                        <div className={`w-12 h-12 bg-gradient-to-r ${payment.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                          <IconComponent className="text-white text-xl w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-white text-sm">{payment.name}</h3>
                        <p className="text-gray-400 text-xs">{payment.handle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 text-center">
          <div className="max-w-md mx-auto">
            <p className="text-gray-500 text-sm mb-4">
              © 2024 Alex Morgan. All rights reserved.
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
    </div>
  );
}
