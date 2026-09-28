"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Shield, BookOpen, Building2, User, UserCheck } from 'lucide-react';

const FRAME_COUNT = 221;


export default function PublicLanding() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Show UI immediately, don't wait for images!
  const [uiVisible, setUiVisible] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);

  useEffect(() => {
    // Show UI instantly
    const t = setTimeout(() => setUiVisible(true), 0);


    // Preload images silently in background without blocking the UI
    const images: HTMLImageElement[] = [];
    
    // Load frame 1 first so it shows up immediately
    const firstImg = new Image();
    firstImg.src = `/hero-sequence/ezgif-frame-001.png`;
    firstImg.onload = () => setFirstFrameLoaded(true);
    images[0] = firstImg;

    // Then lazily load the rest
    for (let i = 2; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, '0');
      img.src = `/hero-sequence/ezgif-frame-${frameNum}.png`;
      images[i - 1] = img;
    }
    
    imagesRef.current = images;
    
    return () => clearTimeout(t);
  }, []);

  // Scroll Scrubbing Logic with Lerp & Optimization
  useEffect(() => {
    if (!uiVisible || !canvasRef.current || !containerRef.current || imagesRef.current.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }); 
    if (!ctx) return;

    let targetFrame = 0;
    let currentFrame = 0;
    let lastDrawnFrame = -1; 
    let animationFrameId: number;

    const drawFrame = (index: number) => {
      // Ensure index is within bounds
      index = Math.max(0, Math.min(index, FRAME_COUNT - 1));
      
      if (index === lastDrawnFrame) return; 

      const img = imagesRef.current[index];
      // Only draw if the image has actually finished downloading
      if (img && img.complete && img.naturalWidth > 0) {
        lastDrawnFrame = index;
        
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
  }, [uiVisible, firstFrameLoaded]); // Re-run when first frame loads so it renders instantly

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

  return (
    <div ref={containerRef} className="relative bg-black text-[var(--text-primary)]" style={{ height: '250vh' }}>
      
      {/* Sticky Canvas */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-black" style={{ willChange: 'transform' }}>
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000"
          style={{ opacity: firstFrameLoaded ? 1 : 0 }}
        />

        {/* Scroll Instruction */}
        {uiVisible && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-10" style={{ opacity: "calc(1 - (scrollY / 300))" }}>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2 drop-shadow-md text-white/80">Scroll Down</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/80 to-transparent drop-shadow-md" />
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="absolute bottom-0 left-0 w-full min-h-screen flex items-center justify-center p-6 z-20 pointer-events-none">
        {/* Pointer events none on wrapper so scroll works everywhere, but auto on inner card */}
        <div className={`pointer-events-auto w-full max-w-4xl bg-black/50 backdrop-blur-3xl rounded-[2rem] p-10 border border-white/5 shadow-2xl transition-all duration-1000 ${uiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
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
