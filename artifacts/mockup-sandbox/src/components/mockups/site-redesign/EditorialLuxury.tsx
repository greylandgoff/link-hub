import React from "react";
import "./_editorial-luxury.css";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Instagram, Twitter } from "lucide-react";

export function EditorialLuxury() {
  return (
    <div className="editorial-theme w-full flex flex-col items-center">
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* HEADER / NAVIGATION */}
        <header className="flex justify-between items-center py-8 thin-rule-bottom">
          <div className="font-serif text-2xl tracking-wide font-medium">B.</div>
          <nav className="hidden md:flex gap-8 small-caps-label">
            <a href="#about" className="hover:text-black transition-colors">About</a>
            <a href="#services" className="hover:text-black transition-colors">Services</a>
            <a href="#connect" className="hover:text-black transition-colors">Connect</a>
          </nav>
          <Button variant="outline" className="rounded-none border-black hover:bg-black hover:text-white transition-colors uppercase tracking-widest text-xs h-10 px-6">
            Request Appointment
          </Button>
        </header>

        {/* HERO SECTION */}
        <section className="py-20 md:py-32 flex flex-col md:flex-row gap-16 md:gap-24 items-center">
          <div className="w-full md:w-5/12 order-2 md:order-1 flex flex-col">
            <span className="small-caps-label mb-6">No. 01 — The Introduction</span>
            <h1 className="font-serif text-6xl md:text-8xl leading-[0.95] tracking-tight mb-8">
              Bobby
            </h1>
            <p className="text-xl md:text-2xl text-[#555] font-light leading-relaxed mb-10 max-w-md">
              Austin private host & travel companion. Cultivating authentic connections and genuine experiences.
            </p>
            <div className="flex items-center gap-6">
              <Button className="rounded-none bg-[#111] hover:bg-[#333] text-white uppercase tracking-widest text-xs h-14 px-8">
                Request Screening
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-7/12 order-1 md:order-2">
            <div className="aspect-[3/4] md:aspect-[4/5] overflow-hidden relative">
              <img 
                src="/__mockup/images/bobby-profile.jpeg" 
                alt="Bobby portrait" 
                className="object-cover w-full h-full object-center grayscale-[20%] contrast-105"
              />
              <div className="absolute bottom-6 right-6 small-caps-label text-white mix-blend-difference">
                Austin, Texas
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES / WHAT TO EXPECT */}
        <section id="services" className="py-20 thin-rule">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1">
              <span className="small-caps-label">No. 02 — Engagements</span>
            </div>
            <div className="col-span-1 md:col-span-3">
              <h2 className="font-serif text-4xl mb-12 max-w-2xl">
                A refined approach to companionship, tailored for those who appreciate discretion and depth.
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                <div>
                  <h3 className="font-serif text-2xl mb-4">Dates & Events</h3>
                  <p className="text-[#555] font-light">Whether it's a charity gala, a dinner reservation at that impossible-to-book spot, or simply a plus-one who knows how to work a room, I provide engaging, effortless company.</p>
                </div>
                <div>
                  <h3 className="font-serif text-2xl mb-4">Travel Companion</h3>
                  <p className="text-[#555] font-light">From weekend getaways to extended international trips. A genuine boyfriend-vibe experience that turns a solo journey into a shared memory.</p>
                </div>
                <div>
                  <h3 className="font-serif text-2xl mb-4">Private Time</h3>
                  <p className="text-[#555] font-light">Unrushed, undivided attention in a comfortable setting. Discretion is paramount, and every interaction is rooted in mutual respect.</p>
                </div>
                <div>
                  <h3 className="font-serif text-2xl mb-4">Rates</h3>
                  <p className="text-[#555] font-light">Because each engagement is highly tailored, exact rates are quoted only after an initial screening and consultation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY / MOOD */}
        <section className="py-20 thin-rule">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1">
              <span className="small-caps-label">No. 03 — The Aesthetic</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 aspect-[4/3] overflow-hidden">
              <img src="/__mockup/images/bobby-shower.jpg" alt="Moody lifestyle" className="w-full h-full object-cover grayscale-[30%]" />
            </div>
            <div className="col-span-1 aspect-[3/4] overflow-hidden hidden md:block">
              <img src="/__mockup/images/editorial-gallery-1.png" alt="Detail" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-1 aspect-square overflow-hidden hidden md:block">
               <img src="/__mockup/images/editorial-gallery-2.png" alt="Lifestyle" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 thin-rule">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1">
              <span className="small-caps-label">No. 04 — Words</span>
            </div>
            <div className="col-span-1 md:col-span-3">
              <div className="flex flex-col gap-16">
                
                <blockquote className="max-w-3xl">
                  <p className="font-serif text-3xl md:text-4xl leading-snug mb-8">
                    "Genuine, easygoing, and a total gentleman. The conversation flowed effortlessly from the moment we met. It felt like catching up with an old friend, but better."
                  </p>
                  <footer className="small-caps-label">— Alex T. / ★★★★★</footer>
                </blockquote>

                <blockquote className="max-w-3xl md:pl-24">
                  <p className="font-serif text-3xl md:text-4xl leading-snug mb-8">
                    "I was incredibly nervous for my first time booking a companion, but Bobby immediately put me at ease. Utterly professional yet deeply warm."
                  </p>
                  <footer className="small-caps-label">— Marcus D. / ★★★★★</footer>
                </blockquote>

              </div>
            </div>
          </div>
        </section>

        {/* FAQ & CONNECT */}
        <section id="connect" className="py-24 thin-rule grid grid-cols-1 md:grid-cols-2 gap-24">
          
          <div>
            <span className="small-caps-label block mb-12">No. 05 — Inquiries</span>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-[rgba(17,17,17,0.15)] py-2">
                <AccordionTrigger className="font-serif text-xl hover:no-underline">How does the screening process work?</AccordionTrigger>
                <AccordionContent className="text-[#555] font-light text-base leading-relaxed">
                  Safety and discretion are top priorities for both of us. The screening process requires a brief verification of identity and employment before we confirm our first meeting. All information is kept strictly confidential.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-b border-[rgba(17,17,17,0.15)] py-2">
                <AccordionTrigger className="font-serif text-xl hover:no-underline">Are you available for travel?</AccordionTrigger>
                <AccordionContent className="text-[#555] font-light text-base leading-relaxed">
                  Yes. I frequently travel for both domestic and international engagements. Travel expenses and accommodations are handled separately from my daily rate.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-b border-[rgba(17,17,17,0.15)] py-2">
                <AccordionTrigger className="font-serif text-xl hover:no-underline">What level of discretion can I expect?</AccordionTrigger>
                <AccordionContent className="text-[#555] font-light text-base leading-relaxed">
                  Absolute. I understand the nuances of high-profile or closeted clients. I am extremely mindful of boundaries, public appearances, and digital privacy.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <span className="small-caps-label block mb-12">No. 06 — Connect</span>
            <div className="flex flex-col gap-6">
              <a href="#" className="flex justify-between items-center group py-4 border-b border-[rgba(17,17,17,0.15)] hover:border-black transition-colors">
                <span className="font-serif text-2xl group-hover:italic transition-all">Rentmen</span>
                <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </a>
              <a href="#" className="flex justify-between items-center group py-4 border-b border-[rgba(17,17,17,0.15)] hover:border-black transition-colors">
                <span className="font-serif text-2xl group-hover:italic transition-all">OnlyFans</span>
                <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </a>
              <a href="#" className="flex justify-between items-center group py-4 border-b border-[rgba(17,17,17,0.15)] hover:border-black transition-colors">
                <span className="font-serif text-2xl group-hover:italic transition-all">Hunqz</span>
                <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </a>
              <a href="#" className="flex justify-between items-center group py-4 border-b border-[rgba(17,17,17,0.15)] hover:border-black transition-colors">
                <span className="font-serif text-2xl group-hover:italic transition-all">X / Twitter</span>
                <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </a>
              
              <div className="mt-8 flex gap-4">
                <Button variant="outline" className="rounded-none border-[#111] hover:bg-[#111] hover:text-white uppercase tracking-widest text-[10px] h-8 px-4">
                  CashApp
                </Button>
                <Button variant="outline" className="rounded-none border-[#111] hover:bg-[#111] hover:text-white uppercase tracking-widest text-[10px] h-8 px-4">
                  Apple Cash
                </Button>
              </div>
            </div>
          </div>

        </section>

        {/* FOOTER */}
        <footer className="py-12 flex flex-col md:flex-row justify-between items-center gap-6 thin-rule text-sm text-[#555] font-light">
          <div>© {new Date().getFullYear()} Bobby. All rights reserved.</div>
          <div className="flex gap-6 small-caps-label text-[10px]">
            <a href="#" className="hover:text-black">Privacy Policy</a>
            <a href="#" className="hover:text-black">Terms of Use</a>
            <a href="#" className="hover:text-black">Support</a>
          </div>
          <div className="small-caps-label text-[10px] border border-[#555] px-3 py-1">21+ Only</div>
        </footer>

      </div>
    </div>
  );
}
