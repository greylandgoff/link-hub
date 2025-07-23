import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ background: 'var(--pure-black)' }}>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Number with Neon Effect */}
          <div className="mb-8">
            <h1 
              className="text-9xl md:text-[12rem] font-black leading-none select-none"
              style={{
                background: 'linear-gradient(45deg, var(--neon-pink), var(--neon-purple), var(--neon-blue))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(255, 0, 255, 0.5))',
                transform: `translateY(${scrollY * 0.1}px)`,
              }}
            >
              404
            </h1>
          </div>

          {/* Glass Card Content */}
          <div 
            className="glass-effect p-8 rounded-2xl border border-white/20 backdrop-blur-sm"
            style={{
              background: 'var(--frosted-glass)',
              transform: `translateY(${-scrollY * 0.05}px)`,
            }}
          >
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Page Not Found
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Looks like you've wandered into uncharted territory. 
                <br className="hidden md:block" />
                The page you're looking for doesn't exist.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/">
                <Button className="w-full sm:w-auto glass-effect bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400/30 hover:from-purple-600/40 hover:to-pink-600/40 text-white font-medium px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                  <Home className="w-5 h-5 mr-2" />
                  Return Home
                </Button>
              </Link>

              <Button 
                onClick={() => window.history.back()}
                className="w-full sm:w-auto glass-effect bg-transparent border border-white/20 hover:bg-white/10 text-white font-medium px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm mb-4">
                Popular pages:
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-gray-300 hover:bg-white/20 transition-colors cursor-pointer">
                    Home
                  </span>
                </Link>
                <Link href="/#reviews">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-gray-300 hover:bg-white/20 transition-colors cursor-pointer">
                    Reviews
                  </span>
                </Link>
                <Link href="/#contact">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-gray-300 hover:bg-white/20 transition-colors cursor-pointer">
                    Contact
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-r from-neon-pink to-neon-purple rounded-full blur-xl opacity-30 animate-bounce" />
          <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full blur-xl opacity-30 animate-pulse" />
        </div>
      </div>

      {/* Frosted Header */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="glass-effect backdrop-blur-md border-b border-white/10 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <Link href="/">
              <h1 
                className="text-2xl font-bold text-center cursor-pointer transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(45deg, var(--neon-pink), var(--neon-purple))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 10px rgba(255, 0, 255, 0.3))',
                }}
              >
                rentbobby.com
              </h1>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
