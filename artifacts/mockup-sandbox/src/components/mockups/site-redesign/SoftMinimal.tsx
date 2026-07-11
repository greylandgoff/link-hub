import React from "react";
import { ArrowRight, Star, ChevronDown, Check, Shield, Lock, MapPin, Heart } from "lucide-react";
import "./_softminimal.css";

export function SoftMinimal() {
  return (
    <div className="soft-minimal-wrapper w-full flex flex-col items-center">
      {/* Sticky Nav */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-xl bg-[#DDD6B9]/80 border-b border-[#3E5F44]/10">
        <div className="font-['Outfit'] font-bold text-xl tracking-tight">Bobby.</div>
        <button className="sm-btn-primary px-5 py-2.5 text-sm font-medium flex items-center gap-2">
          Request Booking
        </button>
      </nav>

      <main className="w-full max-w-4xl px-4 md:px-8 pt-32 pb-24 flex flex-col gap-12 md:gap-24">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/50">
            <img 
              src="/__mockup/images/bobby-profile.jpeg" 
              alt="Bobby Portrait" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#283A2C] leading-tight">
              Genuine connection.<br/>No pretenses.
            </h1>
            <p className="text-xl md:text-2xl text-[#3E5F44] font-medium">
              Austin private host & travel companion.
            </p>
            <p className="text-lg text-[#4A574A] max-w-xl mx-auto pt-4 leading-relaxed">
              I specialize in creating authentic, boyfriend-vibe experiences that feel completely natural. Whether we're exploring Austin or jet-setting for a weekend, my goal is to make every moment unforgettable.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="sm-btn-primary px-8 py-4 text-lg font-medium flex items-center justify-center gap-2">
              Request Appointment <ArrowRight className="w-5 h-5" />
            </button>
            <button className="sm-btn-secondary px-8 py-4 text-lg font-medium">
              Learn More
            </button>
          </div>
        </section>

        {/* Connect Section */}
        <section className="sm-card p-10 md:p-14 text-center">
          <h2 className="text-2xl font-semibold mb-8">Connect & Verify</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["OnlyFans", "Rentmen", "X / Twitter", "Hunqz", "CashApp", "Apple Cash"].map((link) => (
              <a key={link} href="#" className="px-6 py-3 rounded-full bg-[#3E5F44]/10 hover:bg-[#3E5F44]/20 transition-colors font-medium text-[#3E5F44]">
                {link}
              </a>
            ))}
          </div>
        </section>

        {/* What to Expect */}
        <section className="sm-card p-10 md:p-14">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What to expect</h2>
            <p className="text-[#6B7362] text-lg">Curated experiences tailored to you.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <ServiceCard 
              icon={<Heart className="w-6 h-6" />}
              title="Dates & Plus-One"
              desc="Need a charming plus-one for an event, or just want a perfect dinner date? I bring the charm, conversation, and the right energy."
            />
            <ServiceCard 
              icon={<MapPin className="w-6 h-6" />}
              title="Weekend Getaways"
              desc="A couple of days out of town to recharge. You pick the destination, I bring the company and the good vibes."
            />
            <ServiceCard 
              icon={<Lock className="w-6 h-6" />}
              title="Private Time"
              desc="Quiet evenings in, movie nights, or just relaxing. Unstructured, genuine downtime together."
            />
            <ServiceCard 
              icon={<Shield className="w-6 h-6" />}
              title="Discreet & Professional"
              desc="Your privacy is paramount. I operate with absolute discretion and professionalism from start to finish."
            />
          </div>
          <div className="mt-12 text-center">
            <p className="text-sm text-[#6B7362]">Rates quoted privately after screening.</p>
          </div>
        </section>

        {/* Gallery */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="col-span-2 md:col-span-2 sm-card overflow-hidden aspect-[4/3]">
            <img src="/__mockup/images/bobby-shower.jpg" className="w-full h-full object-cover" alt="Lifestyle" />
          </div>
          <div className="sm-card overflow-hidden aspect-square md:aspect-auto">
             <img src="/__mockup/images/bobby-profile.jpeg" className="w-full h-full object-cover" alt="Portrait" />
          </div>
          <div className="sm-card aspect-square flex items-center justify-center" style={{ backgroundColor: "#EFE9D3" }}>
            <span className="text-[#6B7362] font-medium">Private Gallery</span>
          </div>
        </section>

        {/* Reviews */}
        <section className="sm-card p-10 md:p-14">
          <h2 className="text-3xl font-bold text-center mb-12">Client Experiences</h2>
          <div className="space-y-8">
            <Review 
              name="Alex T." 
              text="Genuine, easygoing, and a total gentleman. Bobby made me feel completely at ease from the moment we met. The weekend flew by way too fast."
            />
            <div className="w-full h-px bg-[#3E5F44]/10" />
            <Review 
              name="Michael R." 
              text="I was a bit nervous since it was my first time arranging something like this, but Bobby was incredibly professional while still feeling like a close friend. Highly recommend."
            />
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-2xl mx-auto w-full">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <FAQItem 
              q="What is the screening process?" 
              a="For the safety and comfort of both of us, a brief screening is required for all new clients. This typically involves verifying identity via ID and/or references."
            />
            <FAQItem 
              q="Do you travel outside of Austin?" 
              a="Yes, I am available for domestic and international travel with advanced notice. Travel expenses and accommodations are handled by the client."
            />
            <FAQItem 
              q="How is my privacy handled?" 
              a="100% discretion is guaranteed. Your information is never shared, and I maintain a strictly professional boundary regarding our arrangements."
            />
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#3E5F44]/15 bg-[#3E5F44] py-12 px-6 mt-auto text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <div className="flex gap-6 text-sm text-[#DDD6B9]/80 font-medium">
            <a href="#" className="hover:text-[#FBF9F0] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#FBF9F0] transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-[#FBF9F0] transition-colors">Support</a>
          </div>
          <div className="px-4 py-2 bg-[#DDD6B9]/15 text-[#DDD6B9] rounded-lg text-xs font-bold tracking-widest uppercase">
            Must be 21+
          </div>
          <p className="text-xs text-[#DDD6B9]/60">© {new Date().getFullYear()} Bobby. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="w-12 h-12 rounded-2xl bg-[#3E5F44]/10 flex items-center justify-center text-[#3E5F44]">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-[#6B7362] leading-relaxed">{desc}</p>
    </div>
  );
}

function Review({ name, text }: { name: string, text: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex text-[#3E5F44]">
        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
      </div>
      <p className="text-lg text-[#33443A] leading-relaxed italic">"{text}"</p>
      <span className="font-semibold text-[#283A2C]">— {name}</span>
    </div>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="sm-card px-6 py-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg">{q}</h4>
        <ChevronDown className={`w-5 h-5 text-[#3E5F44] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <p className="text-[#6B7362] mt-4 leading-relaxed animate-in fade-in duration-300">
          {a}
        </p>
      )}
    </div>
  );
}
