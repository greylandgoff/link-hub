import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryImage {
  src: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  {
    src: "/images/IMG_2862_1751936715707.jpg",
    alt: "Male companion Bobby in professional attire"
  },
  {
    src: "/images/IMG_2876_1752841940506.jpeg", 
    alt: "LGBTQ-friendly companion for dates and weekend getaways"
  },
  {
    src: "/images/IMG_2889_1751926461838.jpg",
    alt: "Discreet male escort services for social events"
  },
  {
    src: "/images/new_photo_1756580037.jpeg",
    alt: "Professional twunk companion Bobby available for booking"
  }
];

export function ImageGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const currentImage = galleryImages[currentIndex];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Image Container */}
      <div className="relative h-96 rounded-[32px] overflow-hidden shadow-lg border border-[#3E5F44]/10">
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="w-full h-full object-cover transition-all duration-500"
        />
        
        {/* Subtle overlay for better navigation visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Navigation Buttons */}
        <Button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 border border-white/20"
          size="sm"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </Button>
        
        <Button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 border border-white/20"
          size="sm"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center mt-6 gap-2">
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-[#3E5F44] scale-125'
                : 'bg-[#3E5F44]/30 hover:bg-[#3E5F44]/50'
            }`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="text-center mt-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-xs text-[#6B7362] hover:text-[#3E5F44] transition-colors"
        >
          {isAutoPlaying ? '⏸ Pause slideshow' : '▶ Resume slideshow'}
        </button>
      </div>
    </div>
  );
}