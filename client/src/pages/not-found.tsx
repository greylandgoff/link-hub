import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ backgroundColor: '#DDD6B9' }}>
      {/* Frosted Header */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="backdrop-blur-xl border-b py-4"
             style={{ backgroundColor: 'rgba(221, 214, 185, 0.8)', borderColor: 'rgba(62, 95, 68, 0.1)' }}>
          <div className="max-w-7xl mx-auto px-4">
            <Link href="/">
              <h1 className="sm-logo text-2xl text-center cursor-pointer text-[#283A2C] transition-all duration-300 hover:scale-105">
                Bobby.
              </h1>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[12rem] font-black leading-none select-none text-[#3E5F44]">
              404
            </h1>
          </div>

          {/* Card Content */}
          <div className="sm-card p-8 md:p-12">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#283A2C] mb-3">
                Page Not Found
              </h2>
              <p className="text-[#6B7362] text-lg leading-relaxed">
                Looks like you've wandered into uncharted territory.
                <br className="hidden md:block" />
                The page you're looking for doesn't exist.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/">
                <Button className="w-full sm:w-auto sm-btn-primary font-medium px-8 py-3 border-none h-auto">
                  <Home className="w-5 h-5 mr-2" />
                  Return Home
                </Button>
              </Link>

              <Button
                onClick={() => window.history.back()}
                className="w-full sm:w-auto sm-btn-secondary font-medium px-8 py-3 border-none h-auto"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="mt-8 pt-6 border-t border-[#3E5F44]/10">
              <p className="text-[#6B7362] text-sm mb-4">
                Popular pages:
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#3E5F44]/10 text-[#3E5F44] hover:bg-[#3E5F44]/20 transition-colors cursor-pointer font-medium">
                    Home
                  </span>
                </Link>
                <Link href="/#reviews">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#3E5F44]/10 text-[#3E5F44] hover:bg-[#3E5F44]/20 transition-colors cursor-pointer font-medium">
                    Reviews
                  </span>
                </Link>
                <Link href="/#contact">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#3E5F44]/10 text-[#3E5F44] hover:bg-[#3E5F44]/20 transition-colors cursor-pointer font-medium">
                    Contact
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
