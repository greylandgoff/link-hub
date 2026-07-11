import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/contact-modal";
import { ScreeningForm } from "@/components/screening-form";
import { User, Calendar, MessageCircle, Star, Heart, Shield, Globe } from "lucide-react";

export default function SEOPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isScreeningFormOpen, setIsScreeningFormOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#DDD6B9' }}>
      {/* Soft background wash */}
      <div 
        className="fixed inset-0"
        style={{ backgroundColor: '#DDD6B9', zIndex: 1 }}
      />
      
      {/* Subtle tonal overlay */}
      <div 
        className="fixed inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(62, 95, 68, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(62, 95, 68, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(239, 233, 211, 0.4) 0%, transparent 50%)
          `,
          zIndex: 2
        }}
      />

      {/* Main content container */}
      <div className="relative" style={{ zIndex: 10 }}>
        {/* Header */}
        <header className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="sm-card p-8 mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center text-[#3E5F44]">
                Male Companion | RentBobby Digital Hub
              </h1>
              <p className="text-xl text-center text-[#6B7362] font-medium">
                <strong>Real connections. Real fun. All in one place.</strong>
              </p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="px-4 pb-12">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Welcome section */}
            <section className="sm-card p-8">
              <p className="text-lg leading-relaxed text-[#283A2C] mb-6">
                Welcome to the digital link hub of <strong className="text-[#3E5F44]">Bobby</strong>—your go-to <em className="text-[#3E5F44]">male companion</em> for good times, great company, and zero awkward small talk (unless you're into that). Whether you're planning a night out, a weekend getaway, or just want someone who shows up, vibes, and looks good doing it—you're in the right place.
              </p>

              <div className="rounded-2xl p-6" style={{ backgroundColor: '#EFE9D3' }}>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-[#3E5F44]">
                  <Star className="w-6 h-6" />
                  What's here?
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-[#283A2C]">
                    <Calendar className="w-5 h-5 text-[#3E5F44]" />
                    <strong>Booking info</strong> if you're ready to connect
                  </li>
                  <li className="flex items-center gap-3 text-[#283A2C]">
                    <MessageCircle className="w-5 h-5 text-[#3E5F44]" />
                    <strong>Socials & content links</strong> to keep things spicy
                  </li>
                  <li className="flex items-center gap-3 text-[#283A2C]">
                    <Globe className="w-5 h-5 text-[#3E5F44]" />
                    <strong>Brand updates</strong> in case you're the curious type
                  </li>
                </ul>
              </div>
            </section>

            {/* Why RentBobby section */}
            <section className="sm-card p-8">
              <h2 className="text-3xl font-bold mb-6 text-center text-[#3E5F44]">
                Why RentBobby?
              </h2>
              <p className="text-lg text-[#283A2C] mb-6 text-center">
                Not your average <em className="text-[#3E5F44]">twunk escort</em>. Think: charm meets cheek. Aesthetics meet attitude. And yes, the biceps are real.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: Shield, text: "Discreet companion service — discretion always comes standard" },
                  { icon: Heart, text: "LGBTQ-friendly, obviously — this is an open, affirming space" },
                  { icon: User, text: "Chill, confident energy — zero pressure, all vibe" },
                  { icon: Globe, text: "Flexible for travel or local hangs — from dinner dates to day trips" }
                ].map((item, index) => (
                  <div key={index} className="rounded-2xl p-4 hover-lift" style={{ backgroundColor: '#EFE9D3' }}>
                    <div className="flex items-start gap-3">
                      <item.icon className="w-6 h-6 mt-1 text-[#3E5F44]" />
                      <p className="text-[#283A2C]">
                        <strong className="text-[#3E5F44]">✦</strong> {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl p-4 text-center" style={{ backgroundColor: '#EFE9D3' }}>
                <p className="text-[#283A2C]">
                  <strong className="text-[#3E5F44]">Local or long-distance</strong> — yes, you can <em className="text-[#3E5F44]">rent a companion who travels</em>
                </p>
              </div>
            </section>

            {/* Who Books Bobby section */}
            <section className="sm-card p-8">
              <h2 className="text-3xl font-bold mb-6 text-center text-[#3E5F44]">
                Who Books Bobby?
              </h2>
              <p className="text-lg text-[#283A2C] mb-4 text-center">If you're:</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {[
                  "A gay man looking for genuinely good company",
                  "Looking for a gay companion that's actually personable",
                  "Interested in one-on-one time that feels natural, not transactional",
                  "Wanting someone who blends into a dinner party but can also, uh, stand out when needed"
                ].map((item, index) => (
                  <div key={index} className="rounded-2xl p-4" style={{ backgroundColor: '#EFE9D3' }}>
                    <p className="text-[#283A2C]">
                      <span className="text-[#3E5F44] font-bold">✓</span> {item}
                    </p>
                  </div>
                ))}
              </div>
              
              <p className="text-xl text-center font-medium text-[#3E5F44]">
                ...you're my kinda person.
              </p>
            </section>

            {/* Call to action section */}
            <section className="sm-card p-8 text-center">
              <h2 className="text-3xl font-bold mb-6 text-[#3E5F44]">
                Where to Click Next
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setIsScreeningFormOpen(true)}
                  className="sm-btn-primary h-16 text-lg font-semibold hover-lift"
                >
                  <Calendar className="w-6 h-6 mr-3" />
                  Book me here
                </Button>
                
                <Button
                  onClick={() => setIsContactModalOpen(true)}
                  className="sm-btn-secondary h-16 text-lg font-semibold hover-lift"
                >
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Follow on socials
                </Button>
                
                <Button
                  onClick={() => setIsContactModalOpen(true)}
                  className="sm-btn-secondary h-16 text-lg font-semibold hover-lift"
                >
                  <Heart className="w-6 h-6 mr-3" />
                  Get updates
                </Button>
              </div>
              
              <p className="text-sm text-[#6B7362] mt-6">
                Quick form, good times • Thirst traps, updates, and occasionally a meme • Low-commitment, high-reward
              </p>
            </section>
          </div>
        </main>

        {/* Floating particles effect */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full opacity-20"
              style={{
                background: ['#3E5F44', '#33503A', '#6B7362', '#3E5F44', '#33503A', '#6B7362'][i],
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
                filter: 'blur(1px)'
              }}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="sm-card p-6 text-center">
              <p className="text-[#6B7362]">
                &copy; 2025 RentBobby. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
      <ScreeningForm 
        isOpen={isScreeningFormOpen} 
        onClose={() => setIsScreeningFormOpen(false)} 
      />
    </div>
  );
}