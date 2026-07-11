import React from "react";
import { 
  ArrowRight, 
  Instagram, 
  Twitter, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  GlassWater, 
  Plane, 
  ShieldCheck, 
  ChevronDown, 
  Lock, 
  ChevronRight,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import "./_midnight_noir.css";

export function MidnightNoir() {
  return (
    <div className="midnight-noir-theme min-h-screen w-full font-sans-luxury overflow-x-hidden antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-[#050505]/90 to-transparent backdrop-blur-sm transition-all duration-300">
        <div className="font-serif-luxury text-2xl tracking-widest uppercase text-white/90">
          Bobby<span className="text-gold">.</span>
        </div>
        <Button 
          variant="outline" 
          className="rounded-none border-gold-subtle text-[#fafafa] bg-transparent hover:bg-gold-subtle hover:text-white uppercase tracking-widest text-xs h-10 px-6 transition-all duration-300"
        >
          Inquire
        </Button>
      </nav>

      {/* Hero Section */}
      <header className="relative w-full h-[100svh] flex items-end pb-24 md:pb-32 px-6 md:px-16 overflow-hidden bg-[#050505]">
        {/* Background Image with Heavy Gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]/50 z-10" />
          <img 
            src="/__mockup/images/bobby-profile.jpeg" 
            alt="Bobby - Austin Private Host"
            className="w-full h-full object-cover object-[center_20%] opacity-60 scale-105 transform hover:scale-100 transition-transform duration-[10s] ease-out"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-4xl mx-auto w-full flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <MapPin className="w-4 h-4 text-gold" />
            <span className="uppercase tracking-[0.2em] text-xs font-light text-white/70">Austin, Texas & Worldwide</span>
          </div>
          
          <h1 className="font-serif-luxury text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight">
            Curated <span className="italic text-white/80">Companionship</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 font-light max-w-2xl mb-12 leading-relaxed">
            Genuine connection, effortless conversation, and a true boyfriend experience. 
            Elevating your private time and travel with discretion and sophistication.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
            <Button className="rounded-none bg-[var(--accent-gold)] text-[#050505] hover:bg-[var(--accent-gold-light)] h-14 px-10 text-sm uppercase tracking-widest transition-all duration-300 w-full sm:w-auto font-medium">
              Request Appointment
            </Button>
            <Button variant="link" className="text-white/60 hover:text-white uppercase tracking-widest text-xs gap-2 group">
              View Services <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-pulse opacity-50">
          <ChevronDown className="w-5 h-5 text-gold" />
        </div>
      </header>

      {/* Philosophy / About Section */}
      <section className="py-24 md:py-32 px-6 bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative h-[600px] w-full group">
            <div className="absolute inset-0 border border-gold-subtle translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
            <img 
              src="/__mockup/images/bobby-shower.jpg" 
              alt="Bobby Lifestyle" 
              className="w-full h-full object-cover absolute inset-0 z-10 grayscale-[30%] contrast-125 brightness-90"
            />
          </div>
          
          <div className="order-1 md:order-2 flex flex-col space-y-8">
            <div className="w-12 h-[1px] bg-[var(--accent-gold)]"></div>
            <h2 className="font-serif-luxury text-3xl md:text-5xl text-white leading-tight">
              The Art of <br />
              <span className="italic text-white/70">Attention</span>
            </h2>
            <div className="space-y-6 text-white/60 font-light text-lg leading-relaxed">
              <p>
                In a rushed world, true luxury is undivided presence. I provide an authentic, 
                unhurried connection tailored to your desires—whether you're seeking a sophisticated plus-one, 
                a weekend getaway companion, or deeply personal private time.
              </p>
              <p>
                My approach is rooted in emotional intelligence, effortless charm, and absolute discretion. 
                Expect the warmth of a genuine boyfriend vibe with the polish of a private concierge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services / What to Expect */}
      <section className="py-24 md:py-32 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-gold-muted)] to-transparent opacity-50"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif-luxury text-3xl md:text-5xl text-white mb-6">Curated Experiences</h2>
            <p className="text-white/50 font-light uppercase tracking-widest text-sm">Tailored to your exact specifications</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {[
              {
                title: "Social Engagements",
                icon: <GlassWater className="w-8 h-8 mb-6 text-[var(--accent-gold)]" />,
                desc: "An articulate, impeccably dressed plus-one for galas, dinners, and corporate events. Seamlessly blending into your world."
              },
              {
                title: "Travel Companion",
                icon: <Plane className="w-8 h-8 mb-6 text-[var(--accent-gold)]" />,
                desc: "Elevating weekend getaways or international excursions. A knowledgeable, easygoing travel partner who enhances every destination."
              },
              {
                title: "Private Time",
                icon: <Lock className="w-8 h-8 mb-6 text-[var(--accent-gold)]" />,
                desc: "Undivided intimate attention in the comfort of your suite or home. Authentic connection and genuine boyfriend-vibe experiences."
              }
            ].map((service, i) => (
              <div key={i} className="bg-[var(--bg-surface-elevated)] p-10 border border-white/5 hover:border-[var(--accent-gold-muted)] transition-colors duration-300 group">
                <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                  {service.icon}
                </div>
                <h3 className="font-serif-luxury text-2xl text-white mb-4">{service.title}</h3>
                <p className="text-white/50 font-light leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-white/40 text-sm italic">Rates quoted privately following initial screening.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[var(--bg-surface)] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4 mb-16">
            <div className="h-[1px] w-12 bg-white/10"></div>
            <span className="uppercase tracking-[0.2em] text-xs font-light text-white/50">Client Experiences</span>
            <div className="h-[1px] w-12 bg-white/10"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                name: "Alex T.",
                quote: "Genuine, easygoing, and a total gentleman. From the moment we met at the hotel bar, the conversation flowed effortlessly. It truly felt like catching up with a partner.",
              },
              {
                name: "Michael R.",
                quote: "Impeccable style and even better company. Having him as my plus-one completely removed the stress of attending a high-profile event alone. Absolute perfection.",
              }
            ].map((review, i) => (
              <div key={i} className="relative">
                <div className="text-[var(--accent-gold)] text-6xl font-serif-luxury absolute -top-8 -left-4 opacity-20">"</div>
                <div className="relative z-10 pl-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[var(--accent-gold)] text-[var(--accent-gold)]" />)}
                  </div>
                  <p className="text-white/80 font-light text-lg italic leading-relaxed mb-6">
                    {review.quote}
                  </p>
                  <p className="font-serif-luxury text-white/60 tracking-wider">— {review.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screening & FAQ */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <ShieldCheck className="w-10 h-10 text-[var(--accent-gold)] mx-auto mb-6" />
            <h2 className="font-serif-luxury text-3xl md:text-4xl text-white mb-4">Discretion & Protocol</h2>
            <p className="text-white/50 font-light">Ensuring a safe, premium experience for both parties.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What does the screening process involve?",
                a: "To ensure mutual safety and compatibility, all new clients must provide verification (ID and/or provider references) prior to finalizing an appointment. All information is handled with strict confidentiality and destroyed post-verification."
              },
              {
                q: "Are you available for international travel?",
                a: "Yes. Travel arrangements can be accommodated with a minimum 48-hour notice. The client is responsible for all business/first-class flights and luxury accommodations in addition to the daily rate."
              },
              {
                q: "How is privacy maintained?",
                a: "Absolute discretion is the foundation of my service. I do not discuss clients, I respect non-disclosure agreements, and I operate with the understanding that our time together is completely private."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-[var(--bg-surface-elevated)] border border-white/5 p-6 md:p-8 hover:border-[var(--accent-gold-muted)] transition-colors">
                <h4 className="text-white font-medium mb-3 flex items-center justify-between">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-[var(--accent-gold)]" />
                </h4>
                <p className="text-white/50 font-light leading-relaxed text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect / Networks */}
      <section className="py-24 bg-[var(--bg-surface)] px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif-luxury text-2xl md:text-3xl text-white mb-12">Private Networks</h2>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {["OnlyFans", "Rentmen", "X / Twitter", "Hunqz", "CashApp", "Apple Cash"].map((platform, i) => (
              <a 
                key={i} 
                href="#" 
                className="px-6 py-3 border border-white/10 rounded-none text-white/60 hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold-muted)] transition-all uppercase tracking-widest text-xs"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="pt-32 pb-12 px-6 text-center relative">
        <div className="max-w-2xl mx-auto mb-24">
          <h2 className="font-serif-luxury text-4xl md:text-6xl text-white mb-8">Ready to Connect?</h2>
          <Button className="rounded-none bg-[var(--accent-gold)] text-[#050505] hover:bg-[var(--accent-gold-light)] h-14 px-12 text-sm uppercase tracking-widest transition-all duration-300 font-medium">
            Begin Screening
          </Button>
        </div>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/10">
          <div className="font-serif-luxury text-xl tracking-widest uppercase text-white/50">
            Bobby<span className="text-gold">.</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-xs text-white/40 uppercase tracking-wider">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>

          <div className="text-xs text-white/30 border border-white/10 px-3 py-1 uppercase tracking-widest">
            21+ Only
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MidnightNoir;