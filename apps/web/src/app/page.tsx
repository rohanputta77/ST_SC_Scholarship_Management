"use client";
import React, { useState, useEffect } from 'react';
import { Shield, BookOpen, Building2, User, UserCheck } from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';


const AshokaChakra = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} fill="none" stroke="currentColor">
    <circle cx="50" cy="50" r="46" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="38" strokeWidth="0.5" strokeDasharray="1 3" opacity="0.6" />
    <circle cx="50" cy="50" r="6" fill="currentColor" />
    {Array.from({ length: 24 }).map((_, i) => (
      <line key={i} x1="50" y1="50" x2="50" y2="6" strokeWidth="1.2" strokeLinecap="round" transform={`rotate(${i * 15} 50 50)`} />
    ))}
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 15 * Math.PI) / 180;
      const cx = 50 + 38 * Math.sin(angle);
      const cy = 50 - 38 * Math.cos(angle);
      return <circle key={`dot-${i}`} cx={cx} cy={cy} r="1.5" fill="currentColor" opacity="0.8" />;
    })}
  </svg>
);

const ROLES = [
  { role: 'applicant',             label: 'Applicant',             icon: User,      accent: '#0052A3' /* Chakra Blue */ },
  { role: 'ministry_admin',        label: 'Ministry Admin',        icon: Shield,    accent: '#FF9933' /* Saffron */ },
  { role: 'institute_nodal_officer',label: 'Institute Nodal',       icon: Building2, accent: '#138808' /* Green */ },
  { role: 'scrutiny_officer',      label: 'Scrutiny Officer',      icon: BookOpen,  accent: '#A855F7' /* Purple */ },
  { role: 'selection_committee',   label: 'Selection Committee',   icon: UserCheck, accent: '#EAB308' /* Gold */ },
];

export default function PublicLanding() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loginAs = (role: string) => {
    document.cookie = `user_role=${role}; path=/; max-age=3600`;
    window.location.reload();
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans flex items-center justify-center transition-colors duration-500" style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}>
      
      {/* Theme Switcher in top right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeSwitcher />
      </div>

      {/* ── AMBIENT INDIAN FLAG AURORA BACKGROUND ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen" style={{ opacity: "var(--aurora-opacity)" }}>
        {/* Saffron Glow */}
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full blur-[120px] animate-blob"
             style={{ background: 'radial-gradient(circle, rgba(255,153,51,0.25) 0%, transparent 70%)', animationDelay: '0s' }} />
        {/* Green Glow */}
        <div className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full blur-[120px] animate-blob"
             style={{ background: 'radial-gradient(circle, rgba(19,136,8,0.25) 0%, transparent 70%)', animationDelay: '4s' }} />
        {/* Chakra Blue Core */}
        <div className="absolute top-[20%] left-[20%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] animate-blob"
             style={{ background: 'radial-gradient(circle, rgba(0,82,163,0.15) 0%, transparent 70%)', animationDelay: '2s' }} />
      </div>

      {/* ── GIANT BACKGROUND CHAKRA ── */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <AshokaChakra 
          className="w-[150vh] h-[150vh] opacity-[0.03] text-white animate-spin-slow" 
          style={{ animationDuration: '120s' }} 
        />
      </div>

      {/* ── NOISE TEXTURE OVERLAY ── */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className={`relative z-10 w-full max-w-6xl mx-auto px-6 py-12 transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          
          {/* Floating Logo Badge */}
          <div className="relative inline-flex items-center justify-center mb-8 group">
            <div className="absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-700 animate-pulse-slow" style={{ background: "linear-gradient(to right, var(--accent-orange), white, var(--accent-green))" }}></div>
            <div className="relative border rounded-full p-4 flex items-center justify-center shadow-2xl transition-colors duration-500" style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
              <AshokaChakra className="w-12 h-12 animate-spin-slow" style={{ animationDuration: '20s', color: "var(--accent-primary)" }} />
            </div>
          </div>

          {/* Subtitle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-12" style={{ background: "linear-gradient(to right, transparent, var(--accent-orange))" }}></div>
            <span className="uppercase tracking-[0.4em] text-[10px] font-bold transition-colors duration-500" style={{ color: "var(--text-muted)" }}>Ministry of Tribal Affairs</span>
            <div className="h-[1px] w-12" style={{ background: "linear-gradient(to left, transparent, var(--accent-green))" }}></div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter drop-shadow-sm transition-colors duration-500" style={{ color: "var(--text-primary)" }}>
            National Fellowship
          </h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto tracking-wide transition-colors duration-500" style={{ color: "var(--text-muted)" }}>
            Next-Generation Scholarship Management System. 
            <br className="hidden md:block"/> Deterministic. Auditable. Secure.
          </p>
        </div>

        {/* ── ROLE SELECTION GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {ROLES.map(({ role, label, icon: Icon, accent }, i) => (
            <button
              key={role}
              onClick={() => loginAs(role)}
              className="group relative h-48 md:h-56 rounded-3xl overflow-hidden border backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              style={{ 
                background: "var(--bg-card)",
                borderColor: "var(--border-subtle)",
                animation: mounted ? `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s forwards` : 'none',
                opacity: 0,
                boxShadow: `0 0 0 0 ${accent}00` 
              }}
            >
              {/* Dynamic Hover Glow Background */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
                style={{ background: `radial-gradient(circle at 50% 100%, ${accent}, transparent 70%)` }}
              />

              {/* Animated Border Sweep */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none before:absolute before:inset-0 before:p-[1px] before:rounded-3xl before:bg-gradient-to-b before:from-transparent before:via-[var(--accent)] before:to-transparent before:-mask-composite-exclude before:mask-border"
                style={{ '--accent': accent } as React.CSSProperties}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--accent)] opacity-10 blur-md"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border group-hover:scale-110 transition-all duration-500 shadow-lg"
                  style={{ background: "var(--bg-main)", borderColor: "var(--border-subtle)", color: "var(--text-muted)", ...({'--hover-color': accent} as any) }}
                >
                  <Icon size={26} strokeWidth={1.5} className="group-hover:text-[var(--hover-color)] transition-colors duration-500" />
                </div>
                <h2 className="font-bold text-sm transition-colors duration-300" style={{ color: "var(--text-primary)" }}>
                  {label}
                </h2>
              </div>
              
              {/* Bottom Accent Line */}
              <div 
                className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 ease-out"
                style={{ background: accent }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── CUSTOM CSS KEYFRAMES ── */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 15s infinite ease-in-out alternate;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow linear infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mask-border {
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
      `}</style>
    </div>
  );
}
