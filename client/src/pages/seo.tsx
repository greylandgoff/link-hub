import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/contact-modal";
import { ScreeningForm } from "@/components/screening-form";
import { User, Calendar, MessageCircle, Star, Heart, Shield, Globe } from "lucide-react";

const backgroundImage = "/images/IMG_2862_1751936715707.jpg";

export default function SEOPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isScreeningFormOpen, setIsScreeningFormOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with parallax effect */}
      <div 
        className="fixed inset-0 bg-black"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'brightness(0.3) contrast(1.2)',
          zIndex: 1
        }}
      />
      
      {/* Animated gradient overlay */}
      <div 
        className="fixed inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, hsla(320, 100%, 60%, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, hsla(200, 100%, 50%, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, hsla(280, 100%, 60%, 0.1) 0%, transparent 50%)
          `,
          zIndex: 2
        }}
      />

      {/* Main content container */}
      <div className="relative" style={{ zIndex: 10 }}>
        {/* Header */}
        <header className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-effect rounded-3xl p-8 mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center"
                  style={{
                    background: 'linear-gradient(135deg, var(--neon-pink), var(--neon-blue), var(--neon-purple))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
                    animation: 'gradient 6s ease infinite',
                    backgroundSize: '400% 400%'
                  }}>
                Austin Male Companion | RentBobby Digital Hub
              </h1>
              <p className="text-xl text-center text-gray-300 font-medium">
                <strong>Real connections. Real fun. All in one place.</strong>
              </p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="px-4 pb-12">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Welcome section */}
            <section className="glass-effect rounded-3xl p-8">
              <p className="text-lg leading-relaxed text-gray-200 mb-6">
                Welcome to the digital link hub of <strong className="text-white neon-glow">Bobby</strong>—your go-to <em className="text-pink-400">Austin male companion</em> for good times, great company, and zero awkward small talk (unless you're into that). Whether you're planning a night out, a weekend getaway, or just want someone who shows up, vibes, and looks good doing it—you're in the right place.
              </p>

              <div className="glass-effect rounded-2xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"
                    style={{ color: 'var(--neon-cyan)' }}>
                  <Star className="w-6 h-6" />
                  What's here?
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-5 h-5 text-orange-400" />
                    <strong>Booking info</strong> if you're ready to connect
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                    <strong>Socials & content links</strong> to keep things spicy
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <Globe className="w-5 h-5 text-purple-400" />
                    <strong>Brand updates</strong> in case you're the curious type
                  </li>
                </ul>
              </div>
            </section>

            {/* Why RentBobby section */}
            <section className="glass-effect rounded-3xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-center"
                  style={{ 
                    color: 'var(--neon-pink)',
                    textShadow: '0 0 20px var(--neon-pink)'
                  }}>
                Why RentBobby?
              </h2>
              <p className="text-lg text-gray-200 mb-6 text-center">
                Not your average <em className="text-cyan-400">twunk escort in Austin</em>. Think: charm meets cheek. Aesthetics meet attitude. And yes, the biceps are real.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: Shield, text: "Discreet companion service — discretion always comes standard", color: "text-green-400" },
                  { icon: Heart, text: "LGBTQ-friendly, obviously — this is an open, affirming space", color: "text-pink-400" },
                  { icon: User, text: "Chill, confident energy — zero pressure, all vibe", color: "text-blue-400" },
                  { icon: Globe, text: "Flexible for travel or local hangs — from dinner dates to day trips", color: "text-purple-400" }
                ].map((item, index) => (
                  <div key={index} className="glass-effect rounded-2xl p-4 border border-white/10 hover-lift">
                    <div className="flex items-start gap-3">
                      <item.icon className={`w-6 h-6 mt-1 ${item.color} neon-glow`} />
                      <p className="text-gray-300">
                        <strong className="text-white">✦</strong> {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 glass-effect rounded-2xl p-4 border border-white/10 text-center">
                <p className="text-gray-300">
                  <strong className="text-orange-400">Austin-based, Texas-ready</strong> — yes, you can <em className="text-cyan-400">rent a companion in Texas</em>
                </p>
              </div>
            </section>

            {/* Who Books Bobby section */}
            <section className="glass-effect rounded-3xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-center"
                  style={{ 
                    color: 'var(--neon-blue)',
                    textShadow: '0 0 20px var(--neon-blue)'
                  }}>
                Who Books Bobby?
              </h2>
              <p className="text-lg text-gray-200 mb-4 text-center">If you're:</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {[
                  "A gay man in or passing through Austin",
                  "Looking for a gay companion Austin that's actually personable",
                  "Interested in one-on-one time that feels natural, not transactional",
                  "Wanting someone who blends into a dinner party but can also, uh, stand out when needed"
                ].map((item, index) => (
                  <div key={index} className="glass-effect rounded-2xl p-4 border border-white/10">
                    <p className="text-gray-300">
                      <span className="text-pink-400 font-bold">✓</span> {item}
                    </p>
                  </div>
                ))}
              </div>
              
              <p className="text-xl text-center font-medium text-white neon-glow">
                ...you're my kinda person.
              </p>
            </section>

            {/* Call to action section */}
            <section className="glass-effect rounded-3xl p-8 text-center">
              <h2 className="text-3xl font-bold mb-6"
                  style={{ 
                    color: 'var(--neon-purple)',
                    textShadow: '0 0 20px var(--neon-purple)'
                  }}>
                Where to Click Next
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setIsScreeningFormOpen(true)}
                  className="glass-effect h-16 text-lg font-semibold hover-lift bg-transparent border border-white/20 hover:bg-white/10"
                  style={{ color: 'var(--neon-pink)' }}
                >
                  <Calendar className="w-6 h-6 mr-3" />
                  Book me here
                </Button>
                
                <Button
                  onClick={() => setIsContactModalOpen(true)}
                  className="glass-effect h-16 text-lg font-semibold hover-lift bg-transparent border border-white/20 hover:bg-white/10"
                  style={{ color: 'var(--neon-blue)' }}
                >
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Follow on socials
                </Button>
                
                <Button
                  onClick={() => setIsContactModalOpen(true)}
                  className="glass-effect h-16 text-lg font-semibold hover-lift bg-transparent border border-white/20 hover:bg-white/10"
                  style={{ color: 'var(--neon-cyan)' }}
                >
                  <Heart className="w-6 h-6 mr-3" />
                  Get updates
                </Button>
              </div>
              
              <p className="text-sm text-gray-400 mt-6">
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
                background: ['var(--neon-pink)', 'var(--neon-blue)', 'var(--neon-purple)', 'var(--neon-cyan)', 'var(--neon-green)', 'var(--neon-orange)'][i],
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
            <div className="glass-effect rounded-2xl p-6 text-center">
              <p className="text-gray-400">
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