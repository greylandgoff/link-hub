import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/contact-modal";
import { QRModal } from "@/components/qr-modal";
import { AppointmentModal } from "@/components/appointment-modal";
import { ReviewModal } from "@/components/review-modal";
import { useQuery } from "@tanstack/react-query";
import { Star, MessageCircle, QrCode, User, Calendar, DollarSign, Twitter, Users } from "lucide-react";
import { SiApple, SiCashapp } from "react-icons/si";
import profileImage from "@assets/IMG_2889_1751926461838.jpg";
import backgroundImage from "@assets/IMG_2862_1751936715707.jpg";

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Fetch approved reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['/api/reviews'],
    queryFn: async () => {
      const response = await fetch('/api/reviews');
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    }
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const socialLinks = [
    { name: "OnlyFans", url: "https://onlyfans.com/bobbyatx", icon: User, color: "from-pink-500 to-purple-500" },
    { name: "Rentmen", url: "https://rent.men/BobbyAtx", icon: Calendar, color: "from-orange-500 to-red-500" },
    { name: "Twitter", url: "https://twitter.com/bobbyatx", icon: Twitter, color: "from-blue-400 to-blue-600" },
    { name: "CashApp", url: "https://cash.app/$bobbyatx", icon: SiCashapp, color: "from-green-400 to-green-600" },
    { name: "Apple Cash", url: "https://apple.com/apple-pay", icon: SiApple, color: "from-gray-400 to-gray-600" }
  ];

  return (
    <div className="min-h-screen text-white" style={{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Dark overlay */}
      <div className="min-h-screen" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
        
        {/* Header */}
        <header className="py-6 px-4 relative z-10">
          <div className="max-w-md mx-auto">
            <nav className="flex justify-between items-center">
              <div className="text-xl font-bold text-white">
                rentbobby.com
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsQRModalOpen(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <QrCode className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </nav>
          </div>
        </header>

        {/* Profile Section */}
        <section className="py-8 px-4 relative z-10">
          <div className="max-w-md mx-auto text-center">
            <div className="relative mb-6">
              <img 
                src={profileImage} 
                alt="Bobby's Profile" 
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white/30 shadow-2xl"
              />
            </div>

            <h1 className="text-3xl font-bold mb-2 text-white">Bobby</h1>
            <h2 className="text-gray-200 leading-relaxed mb-8 max-w-sm mx-auto text-lg">
              Professional companion services based in Austin, TX. Available for domestic or international travel.
            </h2>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 mb-8 flex-wrap">
              <Button 
                onClick={() => setIsAppointmentModalOpen(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-full"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
              <Button 
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-full"
              >
                <Star className="w-4 h-4 mr-2" />
                Leave Review
              </Button>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {socialLinks.map((link) => (
                <Button
                  key={link.name}
                  onClick={() => window.open(link.url, "_blank")}
                  className={`bg-gradient-to-r ${link.color} hover:opacity-90 text-white p-4 rounded-xl flex items-center justify-center gap-2`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Button>
              ))}
            </div>

            {/* Reviews Section */}
            <div id="reviews-section" className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-white">Client Reviews</h3>
              {reviewsLoading ? (
                <div className="text-center text-gray-300">Loading reviews...</div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <div key={review.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-white">{review.name}</h4>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-200 mb-4">{review.additionalComments}</p>
                      <div className="flex flex-wrap gap-2">
                        {review.serviceTypes?.map((service: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-white/20 rounded-full text-sm text-white">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-300">No reviews yet. Be the first to leave one!</div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 text-center text-gray-300 relative z-10">
          <div className="max-w-md mx-auto">
            <p className="mb-4">© 2025 Bobby. All rights reserved.</p>
            <div className="flex justify-center gap-4 text-sm">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Support</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      <QRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
      <AppointmentModal isOpen={isAppointmentModalOpen} onClose={() => setIsAppointmentModalOpen(false)} />
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
    </div>
  );
}