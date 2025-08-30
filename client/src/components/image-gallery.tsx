import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryImage {
  src: string;
  alt: string;
  quote?: string;
  author?: string;
}

const galleryImages: GalleryImage[] = [
  {
    src: "/images/IMG_2862_1751936715707.jpg",
    alt: "Professional companion photo",
    quote: "Exceptional companion with genuine conversation skills and professional discretion.",
    author: "Austin Business Executive"
  },
  {
    src: "/images/IMG_2876_1752841940506.jpeg", 
    alt: "Travel companion photo",
    quote: "Perfect travel companion - engaging, adaptable, and completely professional.",
    author: "Frequent Business Traveler"
  },
  {
    src: "/images/IMG_2889_1751926461838.jpg",
    alt: "Social companion photo", 
    quote: "Made my business event so much more enjoyable. Natural social skills.",
    author: "Corporate Event Attendee"
  },
  {
    src: "/images/new_photo_1756580037.jpeg",
    alt: "Professional companion photo",
    quote: "Outstanding companion with authentic charm and impeccable professionalism.",
    author: "Satisfied Client"
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
      <div className="relative h-96 rounded-2xl overflow-hidden">
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="w-full h-full object-cover transition-all duration-500"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Quote Overlay */}
        {currentImage.quote && (
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="glass-effect bg-black/60 backdrop-blur-lg p-6 rounded-xl border border-white/20">
              <Quote className="w-8 h-8 text-purple-400 mb-3" />
              <blockquote className="text-white text-lg mb-3 italic">
                "{currentImage.quote}"
              </blockquote>
              <cite className="text-gray-300 text-sm">
                — {currentImage.author}
              </cite>
            </div>
          </div>
        )}

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
                ? 'bg-purple-500 scale-125'
                : 'bg-gray-500 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="text-center mt-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          {isAutoPlaying ? '⏸ Pause slideshow' : '▶ Resume slideshow'}
        </button>
      </div>
    </div>
  );
}