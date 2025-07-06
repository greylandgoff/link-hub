import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Palette, Shuffle, Play, Pause } from "lucide-react";

interface MoodPalette {
  name: string;
  colors: string[];
  description: string;
  particleCount: number;
  speed: number;
}

const MOOD_PALETTES: MoodPalette[] = [
  {
    name: "Neon Dreams",
    colors: ["#ff00ff", "#00ffff", "#ff0080", "#8000ff", "#0080ff"],
    description: "Vibrant neon energy",
    particleCount: 50,
    speed: 1.5
  },
  {
    name: "Sunset Vibes",
    colors: ["#ff6b35", "#f7931e", "#ffcd3c", "#ff5722", "#e65100"],
    description: "Warm and relaxing",
    particleCount: 30,
    speed: 0.8
  },
  {
    name: "Ocean Deep",
    colors: ["#0066cc", "#003d7a", "#1976d2", "#42a5f5", "#1565c0"],
    description: "Calm and mysterious",
    particleCount: 40,
    speed: 1.0
  },
  {
    name: "Forest Night",
    colors: ["#2e7d32", "#388e3c", "#43a047", "#66bb6a", "#1b5e20"],
    description: "Natural and grounding",
    particleCount: 35,
    speed: 0.6
  },
  {
    name: "Electric Storm",
    colors: ["#9c27b0", "#673ab7", "#3f51b5", "#e91e63", "#ff4081"],
    description: "High energy chaos",
    particleCount: 70,
    speed: 2.5
  },
  {
    name: "Midnight City",
    colors: ["#37474f", "#546e7a", "#78909c", "#90a4ae", "#263238"],
    description: "Urban and sophisticated",
    particleCount: 25,
    speed: 1.2
  }
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
}

interface BackgroundTextureGeneratorProps {
  onMoodChange?: (mood: MoodPalette) => void;
}

export function BackgroundTextureGenerator({ onMoodChange }: BackgroundTextureGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [currentMood, setCurrentMood] = useState(MOOD_PALETTES[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showControls, setShowControls] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseActive, setIsMouseActive] = useState(false);

  // Initialize particles
  const createParticles = (mood: MoodPalette) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < mood.particleCount; i++) {
      newParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * mood.speed,
        vy: (Math.random() - 0.5) * mood.speed,
        size: Math.random() * 3 + 1,
        color: mood.colors[Math.floor(Math.random() * mood.colors.length)],
        opacity: Math.random() * 0.7 + 0.1,
        life: Math.random() * 100 + 50
      });
    }
    return newParticles;
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    setParticles(prevParticles => {
      const updatedParticles = prevParticles.map(particle => {
        // Update position with mouse influence
        let vx = particle.vx;
        let vy = particle.vy;
        
        if (isMouseActive) {
          const dx = mousePos.x - particle.x;
          const dy = mousePos.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const force = (100 - distance) / 100;
            vx += (dx / distance) * force * 0.5;
            vy += (dy / distance) * force * 0.5;
          }
        }
        
        particle.x += vx;
        particle.y += vy;
        
        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Update life
        particle.life -= 0.5;
        particle.opacity = Math.max(0, particle.life / 100);
        
        return particle;
      }).filter(particle => particle.life > 0);

      // Add new particles if needed
      while (updatedParticles.length < currentMood.particleCount) {
        updatedParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * currentMood.speed,
          vy: (Math.random() - 0.5) * currentMood.speed,
          size: Math.random() * 3 + 1,
          color: currentMood.colors[Math.floor(Math.random() * currentMood.colors.length)],
          opacity: Math.random() * 0.7 + 0.1,
          life: Math.random() * 100 + 50
        });
      }

      // Draw particles with enhanced effects
      updatedParticles.forEach(particle => {
        ctx.globalAlpha = particle.opacity;
        
        // Create gradient for each particle
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.7, particle.color + '80'); // Add transparency
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Add core particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      return updatedParticles;
    });

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Handle canvas resize
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  // Change mood
  const changeMood = (mood: MoodPalette) => {
    setCurrentMood(mood);
    setParticles(createParticles(mood));
    onMoodChange?.(mood);
  };

  // Random mood
  const randomMood = () => {
    const randomIndex = Math.floor(Math.random() * MOOD_PALETTES.length);
    changeMood(MOOD_PALETTES[randomIndex]);
  };

  // Toggle animation
  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  // Mouse interaction handlers
  const handleMouseMove = (e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsMouseActive(true);
  };

  const handleMouseLeave = () => {
    setIsMouseActive(false);
  };

  // Initialize
  useEffect(() => {
    resizeCanvas();
    setParticles(createParticles(currentMood));
    
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Start/stop animation
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentMood]);

  return (
    <>
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />
      
      {/* Floating Controls */}
      <div className="fixed top-20 right-4 z-50">
        <Button
          onClick={() => setShowControls(!showControls)}
          size="sm"
          className="mb-2 bg-black/20 backdrop-blur-md border border-white/10 hover:bg-white/10"
        >
          <Palette className="w-4 h-4" />
        </Button>
        
        {showControls && (
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-4 max-w-xs mood-control-enter">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Button
                  onClick={toggleAnimation}
                  size="sm"
                  variant="ghost"
                  className="p-1 h-8 w-8 hover:bg-white/10"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={randomMood}
                  size="sm"
                  variant="ghost"
                  className="p-1 h-8 w-8 hover:bg-white/10"
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="text-xs text-white/70 mb-2">
                Current: {currentMood.name}
              </div>
              
              <div className="space-y-2">
                {MOOD_PALETTES.map((mood) => (
                  <button
                    key={mood.name}
                    onClick={() => changeMood(mood)}
                    className={`w-full text-left p-2 rounded text-xs hover:bg-white/10 transition-colors ${
                      currentMood.name === mood.name ? 'bg-white/20' : ''
                    }`}
                  >
                    <div className="font-medium text-white">{mood.name}</div>
                    <div className="text-white/60 text-xs">{mood.description}</div>
                    <div className="flex gap-1 mt-1">
                      {mood.colors.slice(0, 3).map((color, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}