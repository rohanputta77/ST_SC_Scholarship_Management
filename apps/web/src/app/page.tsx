"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Shield, BookOpen, Building2, User, UserCheck } from 'lucide-react';

const FRAME_COUNT = 221;

const AshokaChakra = ({ className = "", style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} fill="none" stroke="currentColor">
    {/* Outer border */}
    <circle cx="50" cy="50" r="46" strokeWidth="4" />
    {/* Inner ring */}
    <circle cx="50" cy="50" r="38" strokeWidth="1" strokeDasharray="2 4" />
    {/* Hub */}
    <circle cx="50" cy="50" r="6" fill="currentColor" />
    {/* 24 Spokes */}
    {Array.from({ length: 24 }).map((_, i) => (
      <line
        key={i}
        x1="50"
        y1="50"
        x2="50"
        y2="5"
        strokeWidth="1.5"
        strokeLinecap="round"
        transform={`rotate(${i * 15} 50 50)`}
      />
    ))}
  </svg>
);

export default function PublicLanding() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Preload images
  useEffect(() => {
    let count = 0;
    const images: HTMLImageElement[] = [];
    
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, '0');
      img.src = `/hero-sequence/ezgif-frame-${frameNum}.png`;
      img.onload = () => {
        count++;
        setLoadedCount(count);
        if (count === FRAME_COUNT) {
          setLoaded(true);
        }
      };
      img.onerror = () => {
        count++;
        setLoadedCount(count);
        if (count === FRAME_COUNT) setLoaded(true);
      }
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  // Scroll Scrubbing Logic with Lerp & Optimization
  useEffect(() => {
    if (!loaded || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }); 
    if (!ctx) return;

    let targetFrame = 0;
    let currentFrame = 0;
    let lastDrawnFrame = -1; 
    let animationFrameId: number;

    const drawFrame = (index: number) => {
      if (index === lastDrawnFrame) return; 
      lastDrawnFrame = index;

      const img = imagesRef.current[index];
      if (img && img.complete && img.naturalWidth > 0) {
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > canvasRatio) {
          drawWidth = canvas.height * imgRatio;
          offsetX = (canvas.width - drawWidth) / 2;
        } else {
          drawHeight = canvas.width / imgRatio;
          offsetY = (canvas.height - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    };

    drawFrame(0);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));
      
      targetFrame = scrollFraction * (FRAME_COUNT - 1);
    };

    const renderLoop = () => {
      currentFrame += (targetFrame - currentFrame) * 0.12;
      drawFrame(Math.round(currentFrame));
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [loaded]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        window.dispatchEvent(new Event('scroll'));
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loginAs = (role: string) => {
    document.cookie = `user_role=${role}; path=/; max-age=3600`;
    window.location.reload();
  };

  const progressPct = Math.round((loadedCount / FRAME_COUNT) * 100);

  return (
    <div ref={containerRef} className="relative bg-black text-[var(--text-primary)]" style={{ height: '250vh' }}>
      
      {/* Sticky Canvas */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-black" style={{ willChange: 'transform' }}>
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Custom Ashoka Chakra Loading Overlay */}
        {!loaded && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0c0f14]">
            
            <div className="relative flex items-center justify-center mb-8">
              {/* Pulsing background glow */}
              <div className="absolute inset-0 rounded-full blur-2xl animate-pulse" style={{ background: "rgba(201,169,110,0.15)", transform: "scale(1.5)" }} />
              
              {/* Spinning Chakra */}
              <AshokaChakra className="w-24 h-24 animate-[spin_3s_linear_infinite]" style={{ color: "var(--accent-primary)" }} />
              
              {/* Percentage in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-black bg-[#0c0f14] px-2 py-0.5 rounded-full" style={{ color: "var(--accent-primary)" }}>
                  {progressPct}%
                </span>
              </div>
            </div>

            <div className="text-[var(--accent-primary)] text-xs font-mono tracking-widest animate-pulse opacity-80">
              SYNCHRONIZING SCHOLARSHIP PORTAL
            </div>
            
            {/* Minimalist progress track */}
            <div className="w-48 h-[2px] bg-white/10 mt-6 overflow-hidden rounded-full">
              <div 
                className="h-full transition-all duration-300" 
                style={{ width: `${progressPct}%`, background: "var(--accent-primary)" }}
              />
            </div>
          </div>
        )}

        {/* Scroll Instruction */}
        {loaded && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-10" style={{ opacity: "calc(1 - (scrollY / 300))" }}>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2 drop-shadow-md text-white/80">Scroll Down</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/80 to-transparent drop-shadow-md" />
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="absolute bottom-0 left-0 w-full min-h-screen flex items-center justify-center p-6 z-20 pointer-events-none">
        {/* Pointer events none on wrapper so scroll works everywhere, but auto on inner card */}
        <div className="pointer-events-auto w-full max-w-4xl bg-black/50 backdrop-blur-3xl rounded-[2rem] p-10 border border-white/5 shadow-2xl">
          
          <div className="mb-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl font-black mb-6 tracking-tight shadow-xl border border-white/10" style={{ background: "linear-gradient(135deg, var(--accent-primary), #a08040)", color: "#0c0f14" }}>
              ST
            </div>
            <h1 className="text-4xl font-black mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Scholarship Management</h1>
            <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto">Select your authorized role to enter the secure environment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <button onClick={() => loginAs('applicant')} className="flex flex-col items-center p-8 bg-[var(--bg-card-alt)]/40 hover:bg-[var(--accent-primary-bg)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] rounded-2xl transition-all duration-300 group">
              <User className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] mb-4 transition-colors duration-300" size={32} strokeWidth={1.5} />
              <h2 className="font-bold text-sm">Applicant</h2>
            </button>
            
            <button onClick={() => loginAs('ministry_admin')} className="flex flex-col items-center p-8 bg-[var(--bg-card-alt)]/40 hover:bg-[var(--accent-teal-bg)] border border-[var(--border-subtle)] hover:border-[var(--accent-teal)] rounded-2xl transition-all duration-300 group">
              <Shield className="text-[var(--text-muted)] group-hover:text-[var(--accent-teal)] mb-4 transition-colors duration-300" size={32} strokeWidth={1.5} />
              <h2 className="font-bold text-sm">Ministry Admin</h2>
            </button>
            
            <button onClick={() => loginAs('institute_nodal_officer')} className="flex flex-col items-center p-8 bg-[var(--bg-card-alt)]/40 hover:bg-[var(--accent-green-bg)] border border-[var(--border-subtle)] hover:border-[var(--accent-green)] rounded-2xl transition-all duration-300 group">
              <Building2 className="text-[var(--text-muted)] group-hover:text-[var(--accent-green)] mb-4 transition-colors duration-300" size={32} strokeWidth={1.5} />
              <h2 className="font-bold text-sm">Institute Nodal Officer</h2>
            </button>
            
            <button onClick={() => loginAs('scrutiny_officer')} className="flex flex-col items-center p-8 bg-[var(--bg-card-alt)]/40 hover:bg-[var(--accent-rose-bg)] border border-[var(--border-subtle)] hover:border-[var(--accent-rose)] rounded-2xl transition-all duration-300 group lg:col-start-1 lg:col-span-1">
              <BookOpen className="text-[var(--text-muted)] group-hover:text-[var(--accent-rose)] mb-4 transition-colors duration-300" size={32} strokeWidth={1.5} />
              <h2 className="font-bold text-sm">Scrutiny Officer</h2>
            </button>

            <button onClick={() => loginAs('selection_committee')} className="flex flex-col items-center p-8 bg-[var(--bg-card-alt)]/40 hover:bg-[var(--accent-orange-bg)] border border-[var(--border-subtle)] hover:border-[var(--accent-orange)] rounded-2xl transition-all duration-300 group md:col-span-2 lg:col-span-2">
              <UserCheck className="text-[var(--text-muted)] group-hover:text-[var(--accent-orange)] mb-4 transition-colors duration-300" size={32} strokeWidth={1.5} />
              <h2 className="font-bold text-sm">Selection Committee</h2>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
