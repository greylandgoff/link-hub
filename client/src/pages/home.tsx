import { useState, useEffect, type ReactNode } from "react";
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
import { Star, ArrowRight, Heart, MapPin, Lock } from "lucide-react";

import { User, Calendar, MessageCircle, QrCode, Shield, Radio } from "lucide-react";
const profileImage = "/images/IMG_2876_1752841940506.jpeg";

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isScreeningFormOpen, setIsScreeningFormOpen] = useState(false);
  const [isQuickChatOpen, setIsQuickChatOpen] = useState(false);
  const [showChaturbateEmbed, setShowChaturbateEmbed] = useState(false);
  const [showStripchatEmbed, setShowStripchatEmbed] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Initialize haptic feedback
  const { triggerHaptic } = useHaptic();

  // Fetch approved reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['/api/reviews'],
    queryFn: async () => {
      const apiUrl = '/api/reviews';
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Reviews API error:', response.status, response.statusText, errorData);
        throw new Error(`Failed to fetch reviews: ${response.status} - ${errorData.message || response.statusText || 'Unknown error'}`);
      }
      return response.json();
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: chaturbateStatus } = useQuery({
    queryKey: ['/api/chaturbate-status'],
    queryFn: async () => {
      const res = await fetch('/api/chaturbate-status');
      return res.json() as Promise<{ live: boolean }>;
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const { data: stripchatStatus } = useQuery({
    queryKey: ['/api/stripchat-status'],
    queryFn: async () => {
      const res = await fetch('/api/stripchat-status');
      return res.json() as Promise<{ live: boolean }>;
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const chaturbateIsLive = chaturbateStatus?.live ?? false;
  const stripchatIsLive = stripchatStatus?.live ?? false;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // Handle direct links to reviews section
    if (window.location.hash === '#reviews') {
      setTimeout(() => {
        const reviewsSection = document.getElementById('reviews-section');
        if (reviewsSection) {
          reviewsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSaveContact = async () => {
    try {
      trackEvent('save_contact', 'engagement', 'contact_card');

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
    const category = ['hunqz', 'gaycities', 'chamber'].includes(platform) ? 'directory' : 'social_media';
    trackEvent('outbound_link', category, platform);
    window.open(url, "_blank");
  };

  const socialLinks = [
    { platform: "onlyfans", name: "OnlyFans", url: "https://onlyfans.com/bobbyatx/c1" },
    { platform: "rentmen", name: "Rentmen", url: "https://rent.men/bobbydtx" },
    { platform: "hunqz", name: "Hunqz", url: "https://hunqz.com/bobby-austin" },
    { platform: "chaturbate", name: "Chaturbate", url: "https://chaturbate.com/bobbydfw/" },
    { platform: "stripchat", name: "Stripchat", url: "https://stripchat.com/rentbobbydfw" },
    { platform: "twitter", name: "X / Twitter", url: "https://twitter.com/graydoutx" },
    { platform: "cashapp", name: "CashApp", url: "https://cash.app/$grey1and" },
  ];

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#DDD6B9' }}>
      {/* Age Gate Banner */}
      <AgeGateBanner />

      {/* Sticky Nav */}
      <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4 flex justify-between items-center backdrop-blur-xl border-b"
           style={{ backgroundColor: 'rgba(221, 214, 185, 0.8)', borderColor: 'rgba(62, 95, 68, 0.1)' }}>
        <div className="sm-logo text-xl tracking-tight text-[#283A2C]">Bobby.</div>
        <div className="flex gap-2 items-center">
          <Button
            onClick={() => {
              triggerHaptic('light');
              setIsQRModalOpen(true);
            }}
            variant="ghost"
            className="rounded-full p-2.5 text-[#3E5F44] hover:bg-[#3E5F44]/10 bg-transparent"
            title="Share QR Code"
          >
            <QrCode className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => {
              triggerHaptic('light');
              setIsContactModalOpen(true);
            }}
            variant="ghost"
            className="rounded-full px-4 py-2 text-sm font-medium text-[#3E5F44] hover:bg-[#3E5F44]/10 bg-transparent"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact
          </Button>
          <Button
            onClick={() => {
              triggerHaptic('medium');
              trackEvent('appointment_request', 'engagement', 'nav_cta');
              setIsScreeningFormOpen(true);
            }}
            className="sm-btn-primary px-5 py-2.5 text-sm font-medium border-none"
          >
            Book Now
          </Button>
        </div>
      </nav>

      <main className="w-full max-w-4xl mx-auto px-4 md:px-8 pt-32 pb-24 flex flex-col gap-16 md:gap-24">

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8"
                 style={{ transform: `translateY(${scrollY * 0.03}px)` }}>
          <button
            onClick={() => setIsPhotoModalOpen(true)}
            className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/50 hover-lift"
            aria-label="View profile photo"
          >
            <img
              src={profileImage}
              alt="Male companion Bobby LGBTQ-friendly professional services"
              className="w-full h-full object-cover object-center"
            />
          </button>
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#283A2C] leading-tight">
              Genuine connection.<br />No pretenses.
            </h1>
            <p className="text-xl md:text-2xl text-[#3E5F44] font-medium">
              Private host & travel companion.
            </p>
            <p className="text-lg text-[#4A574A] max-w-xl mx-auto pt-4 leading-relaxed">
              Professional companion services specializing in authentic connections and boyfriend-style experiences. Available for dates, events, and getaways.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={() => {
                triggerHaptic('medium');
                trackEvent('appointment_request', 'engagement', 'hero_cta');
                setIsScreeningFormOpen(true);
              }}
              className="sm-btn-primary px-8 py-6 text-lg font-medium flex items-center justify-center gap-2 border-none h-auto"
            >
              Request Appointment <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => {
                triggerHaptic('light');
                handleSaveContact();
              }}
              className="sm-btn-secondary px-8 py-6 text-lg font-medium border-none h-auto"
            >
              <User className="w-5 h-5 mr-2" />
              Save Contact
            </Button>
          </div>
        </section>

        {/* Connect Section */}
        <section className="sm-card p-8 md:p-14 text-center"
                 style={{ transform: `translateY(${scrollY * 0.02}px)` }}>
          <h2 className="text-2xl font-semibold mb-8 text-[#283A2C]">Connect</h2>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {socialLinks.map((link) => (
              <button
                key={link.platform}
                onClick={() => {
                  triggerHaptic('light');
                  handleLinkClick(link.platform, link.url);
                }}
                className="px-6 py-3 rounded-full bg-[#3E5F44]/10 hover:bg-[#3E5F44]/20 transition-colors font-medium text-[#3E5F44]"
              >
                {link.name}
              </button>
            ))}
          </div>
        </section>

        {/* What to Expect */}
        <section className="sm-card p-8 md:p-14">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#283A2C]">What to expect</h2>
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

        {/* Partner in Crime Section */}
        <section className="sm-card p-8 md:p-12 text-center">
          <h2 className="text-2xl font-semibold mb-2 text-[#283A2C]">Partner in Crime</h2>
          <h3 className="text-xl font-bold text-[#3E5F44] mt-6">Nick</h3>
          <p className="text-[#6B7362] text-sm mt-1">Companion & duo partner</p>
          <p className="text-[#4A574A] leading-relaxed mt-4 mb-6 max-w-md mx-auto">
            Rugged, American, dom, daddy for good time
          </p>
          <button
            onClick={() => {
              triggerHaptic('light');
              trackEvent('partner_link', 'outbound', 'rentmen_nick');
              window.open('https://rent.men/Nickbrodude', '_blank');
            }}
            className="px-6 py-3 rounded-full bg-[#3E5F44]/10 hover:bg-[#3E5F44]/20 transition-colors font-medium text-[#3E5F44]"
          >
            Nick on Rentmen
          </button>
          <p className="text-[#6B7362] text-xs mt-6 pt-4 border-t border-[#3E5F44]/10">
            Ask about duo sessions when booking
          </p>
        </section>

        {/* Gallery */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8 text-[#283A2C]">Gallery</h2>
          <ImageGallery />
        </section>

        {/* Live Streams Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8 text-[#283A2C]">Live Streams</h2>
          <Tabs defaultValue="chaturbate" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 h-auto p-1 rounded-full bg-[#3E5F44]/10 border-none">
              <TabsTrigger value="chaturbate"
                className="rounded-full py-2.5 text-[#6B7362] data-[state=active]:bg-[#FBF9F0] data-[state=active]:text-[#3E5F44] flex items-center justify-center gap-2 transition-all">
                {chaturbateIsLive && <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse shrink-0" />}
                <span>Chaturbate</span>
              </TabsTrigger>
              <TabsTrigger value="stripchat"
                className="rounded-full py-2.5 text-[#6B7362] data-[state=active]:bg-[#FBF9F0] data-[state=active]:text-[#3E5F44] flex items-center justify-center gap-2 transition-all">
                {stripchatIsLive && <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse shrink-0" />}
                <span>Stripchat</span>
              </TabsTrigger>
            </TabsList>

            {/* Chaturbate tab */}
            <TabsContent value="chaturbate">
              {(chaturbateIsLive || showChaturbateEmbed) ? (
                <div className="sm-card overflow-hidden">
                  <iframe
                    src="https://cbxyz.com/in/?tour=SHBY&campaign=2KzrM&track=embed&room=bobbydfw"
                    className="w-full"
                    style={{ height: '500px', border: 'none' }}
                    title="Live on Chaturbate"
                    allow="camera; microphone"
                  />
                </div>
              ) : (
                <div className="sm-card p-8 text-center">
                  <Radio className="w-10 h-10 text-[#6B7362] mx-auto mb-4" />
                  <p className="text-[#283A2C] font-semibold mb-1">Currently offline on Chaturbate</p>
                  <p className="text-[#6B7362] text-sm mb-6">Follow me to get notified when I go live</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => setShowChaturbateEmbed(true)}
                      className="sm-btn-primary border-none"
                    >
                      Watch Live
                    </Button>
                    <a
                      href="https://chaturbate.com/bobbydfw/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm text-[#3E5F44] bg-[#EFE9D3] hover:bg-[#E6DEC2] transition-colors font-medium"
                    >
                      View Profile ↗
                    </a>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Stripchat tab */}
            <TabsContent value="stripchat">
              {(stripchatIsLive || showStripchatEmbed) ? (
                <div className="sm-card overflow-hidden">
                  <iframe
                    src="https://stripchat.com/embed/rentbobbydfw"
                    className="w-full"
                    style={{ height: '500px', border: 'none' }}
                    title="Live on Stripchat"
                    allow="camera; microphone"
                  />
                </div>
              ) : (
                <div className="sm-card p-8 text-center">
                  <Radio className="w-10 h-10 text-[#6B7362] mx-auto mb-4" />
                  <p className="text-[#283A2C] font-semibold mb-1">Currently offline on Stripchat</p>
                  <p className="text-[#6B7362] text-sm mb-6">Follow me to get notified when I go live</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => setShowStripchatEmbed(true)}
                      className="sm-btn-primary border-none"
                    >
                      Watch Live
                    </Button>
                    <a
                      href="https://stripchat.com/rentbobbydfw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm text-[#3E5F44] bg-[#EFE9D3] hover:bg-[#E6DEC2] transition-colors font-medium"
                    >
                      View Profile ↗
                    </a>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>

        {/* Reviews Section */}
        <section id="reviews-section" className="sm-card p-8 md:p-14">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#283A2C]">Client Experiences</h2>
          <p className="text-[#6B7362] text-center mb-12">Real experiences from verified clients</p>

          {reviewsLoading ? (
            <div className="animate-pulse space-y-4 max-w-xl mx-auto">
              <div className="h-4 bg-[#3E5F44]/10 rounded"></div>
              <div className="h-20 bg-[#3E5F44]/5 rounded"></div>
              <div className="h-4 bg-[#3E5F44]/10 rounded w-1/2"></div>
            </div>
          ) : reviews && reviews.length > 0 ? (
            <div className="space-y-8 max-w-2xl mx-auto">
              {reviews.map((review: any, index: number) => {
                const publicRating = review.publicRating || review.publicrating || 5;
                return (
                  <div key={review.id}>
                    {index > 0 && <div className="w-full h-px bg-[#3E5F44]/10 mb-8" />}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex text-[#3E5F44]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < publicRating ? 'fill-current' : 'opacity-25'}`} />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-[#3E5F44] bg-[#3E5F44]/10 px-2.5 py-0.5 rounded-full">
                          ✓ Verified
                        </span>
                      </div>
                      <p className="text-lg text-[#33443A] leading-relaxed italic">
                        "{review.publicComment || review.publiccomment || 'Great experience overall!'}"
                      </p>
                      {review.serviceTypes && review.serviceTypes.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {review.serviceTypes.slice(0, 2).map((serviceType: string, i: number) => (
                            <span key={i} className="bg-[#EFE9D3] px-2.5 py-1 rounded-full text-[#3E5F44] text-xs font-medium">
                              {serviceType}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[#283A2C]">— {review.name}</span>
                        <span className="text-[#6B7362] text-sm">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-[#6B7362] mb-4">No reviews yet — be the first to share your experience.</p>
          )}

          <div className="mt-12 text-center">
            <Button
              onClick={() => {
                triggerHaptic('medium');
                trackEvent('review_modal_open', 'engagement', 'reviews_section');
                setIsReviewModalOpen(true);
              }}
              className="sm-btn-secondary px-8 py-3 font-medium border-none h-auto"
            >
              <Star className="w-4 h-4 mr-2" />
              Share Your Experience
            </Button>
          </div>
        </section>

        {/* FAQ Section - SEO Optimized */}
        <section>
          <FAQAccordion />
        </section>

        {/* Call to Action */}
        <section className="sm-card p-8 md:p-14 text-center" style={{ backgroundColor: '#3E5F44' }}>
          <h2 className="text-2xl md:text-3xl font-bold text-[#FBF9F0] mb-4">Ready when you are.</h2>
          <p className="text-[#DDD6B9] mb-8 max-w-xl mx-auto leading-relaxed">
            Professional companion Bobby offers engaging conversation, thoughtful companionship, and authentic connections. Available for dates, events, and weekend getaways.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => {
                triggerHaptic('medium');
                trackEvent('appointment_request', 'engagement', 'footer_cta');
                setIsScreeningFormOpen(true);
              }}
              className="px-8 py-6 rounded-full font-medium text-lg bg-[#FBF9F0] text-[#3E5F44] hover:bg-[#EFE9D3] border-none h-auto"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Request Appointment
            </Button>
            <Button
              onClick={() => {
                triggerHaptic('light');
                setIsContactModalOpen(true);
              }}
              className="px-8 py-6 rounded-full font-medium text-lg bg-transparent text-[#DDD6B9] hover:bg-white/10 border border-[#DDD6B9]/40 h-auto"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Get in Touch
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-12 px-4 md:px-6 text-center" style={{ backgroundColor: '#3E5F44', borderColor: 'rgba(62, 95, 68, 0.15)' }}>
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="privacy" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1 rounded-full bg-[#DDD6B9]/15 border-none">
              <TabsTrigger
                value="privacy"
                className="rounded-full py-2 text-xs sm:text-sm text-[#DDD6B9] data-[state=active]:bg-[#FBF9F0] data-[state=active]:text-[#3E5F44]"
              >
                Privacy
              </TabsTrigger>
              <TabsTrigger
                value="terms"
                className="rounded-full py-2 text-xs sm:text-sm text-[#DDD6B9] data-[state=active]:bg-[#FBF9F0] data-[state=active]:text-[#3E5F44]"
              >
                Terms
              </TabsTrigger>
              <TabsTrigger
                value="faq"
                className="rounded-full py-2 text-xs sm:text-sm text-[#DDD6B9] data-[state=active]:bg-[#FBF9F0] data-[state=active]:text-[#3E5F44]"
              >
                FAQ
              </TabsTrigger>
              <TabsTrigger
                value="support"
                className="rounded-full py-2 text-xs sm:text-sm text-[#DDD6B9] data-[state=active]:bg-[#FBF9F0] data-[state=active]:text-[#3E5F44]"
              >
                Support
              </TabsTrigger>
            </TabsList>

            <TabsContent value="privacy" className="mt-6">
              <div className="rounded-3xl p-6 text-left" style={{ backgroundColor: 'rgba(251, 249, 240, 0.08)' }}>
                <h3 className="text-lg font-semibold text-[#FBF9F0] mb-4">Privacy Policy</h3>
                <p className="text-[#DDD6B9] text-sm leading-relaxed">
                  This site does not collect personal information or track users beyond essential, non-identifying functionality. External links may direct you to third-party content with their own privacy practices. By using this site, you acknowledge and accept those terms. Discretion is encouraged when viewing or sharing adult-oriented content.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="terms" className="mt-6">
              <div className="rounded-3xl p-6 text-left" style={{ backgroundColor: 'rgba(251, 249, 240, 0.08)' }}>
                <h3 className="text-lg font-semibold text-[#FBF9F0] mb-4">Terms of Use</h3>
                <p className="text-[#DDD6B9] text-sm leading-relaxed">
                  By accessing this site, you confirm that you are of legal age in your jurisdiction and understand that some content may be intended for mature audiences. All materials are for personal, non-commercial use only. Redistribution, impersonation, or harassment of any kind is strictly prohibited. Use at your own discretion.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="mt-6">
              <div className="rounded-3xl p-6 text-left bg-[#FBF9F0]">
                <FAQAccordion />
              </div>
            </TabsContent>

            <TabsContent value="support" className="mt-6">
              <div className="rounded-3xl p-6 text-left" style={{ backgroundColor: 'rgba(251, 249, 240, 0.08)' }}>
                <h3 className="text-lg font-semibold text-[#FBF9F0] mb-4">Support</h3>
                <p className="text-[#DDD6B9] text-sm leading-relaxed">
                  For general questions or link-related issues, you're welcome to reach out via the contact method provided. This site is independently maintained, so response times may vary — but respectful communication is always appreciated.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase" style={{ backgroundColor: 'rgba(221, 214, 185, 0.15)', color: '#DDD6B9' }}>
              Must be 21+
            </div>
            <p className="text-xs" style={{ color: 'rgba(221, 214, 185, 0.6)' }}>
              © {new Date().getFullYear()} Bobby. All rights reserved.
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
        <Button
          onClick={() => {
            triggerHaptic('light');
            trackEvent('quick_chat_open', 'engagement', 'floating_chat');
            setIsQuickChatOpen(true);
          }}
          className="p-4 rounded-full inline-flex items-center justify-center bg-[#FBF9F0] text-[#3E5F44] hover:bg-[#EFE9D3] shadow-xl border border-[#3E5F44]/15 h-auto"
          title="Quick Chat"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>

        <Button
          onClick={() => {
            triggerHaptic('medium');
            trackEvent('appointment_request', 'engagement', 'sticky_cta');
            setIsScreeningFormOpen(true);
          }}
          className="sm-btn-primary px-6 py-4 font-semibold inline-flex items-center gap-2 shadow-xl border-none h-auto"
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
            className="p-3 rounded-full bg-[#FBF9F0] text-[#3E5F44] hover:bg-[#EFE9D3] shadow-lg border border-[#3E5F44]/15 h-auto"
            title="Quick Chat"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => {
              triggerHaptic('light');
              setIsQRModalOpen(true);
            }}
            className="p-3 rounded-full bg-[#FBF9F0] text-[#3E5F44] hover:bg-[#EFE9D3] shadow-lg border border-[#3E5F44]/15 h-auto"
            title="QR Code"
          >
            <QrCode className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => {
              triggerHaptic('light');
              setIsReviewModalOpen(true);
            }}
            className="p-3 rounded-full bg-[#FBF9F0] text-[#3E5F44] hover:bg-[#EFE9D3] shadow-lg border border-[#3E5F44]/15 h-auto"
            title="Leave Review"
          >
            <Star className="w-5 h-5" />
          </Button>
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
        <DialogContent className="max-w-2xl bg-[#FBF9F0] border border-[#3E5F44]/15">
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

function ServiceCard({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="w-12 h-12 rounded-2xl bg-[#3E5F44]/10 flex items-center justify-center text-[#3E5F44]">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#283A2C]">{title}</h3>
      <p className="text-[#6B7362] leading-relaxed">{desc}</p>
    </div>
  );
}
