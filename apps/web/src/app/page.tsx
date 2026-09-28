"use client";
import React, { useState, useEffect } from 'react';
import { Shield, BookOpen, Building2, User, UserCheck } from 'lucide-react';

const AshokaChakra = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} fill="none" stroke="currentColor">
    <circle cx="50" cy="50" r="46" strokeWidth="3" />
    <circle cx="50" cy="50" r="36" strokeWidth="0.8" strokeDasharray="2 5" opacity="0.6" />
    <circle cx="50" cy="50" r="24" strokeWidth="0.8" strokeDasharray="1 4" opacity="0.4" />
    <circle cx="50" cy="50" r="5" fill="currentColor" />
    {Array.from({ length: 24 }).map((_, i) => (
      <line key={i} x1="50" y1="50" x2="50" y2="6"
        strokeWidth="1.2" strokeLinecap="round"
        transform={`rotate(${i * 15} 50 50)`} />
    ))}
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 15 * Math.PI) / 180;
      const cx = 50 + 36 * Math.sin(angle);
      const cy = 50 - 36 * Math.cos(angle);
      return <circle key={`dot-${i}`} cx={cx} cy={cy} r="1.5" fill="currentColor" opacity="0.8" />;
    })}
  </svg>
);

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 5,
  opacity: Math.random() * 0.5 + 0.1,
}));

const ROLES = [
  { role: 'applicant',             label: 'Applicant',             icon: User,      accent: 'var(--accent-primary)', bg: 'var(--accent-primary-bg)', border: 'var(--accent-primary)' },
  { role: 'ministry_admin',        label: 'Ministry Admin',         icon: Shield,    accent: 'var(--accent-teal)',    bg: 'var(--accent-teal-bg)',    border: 'var(--accent-teal)' },
  { role: 'institute_nodal_officer',label: 'Institute Nodal Officer',icon: Building2, accent: 'var(--accent-green)',   bg: 'var(--accent-green-bg)',   border: 'var(--accent-green)' },
  { role: 'scrutiny_officer',      label: 'Scrutiny Officer',       icon: BookOpen,  accent: 'var(--accent-rose)',    bg: 'var(--accent-rose-bg)',    border: 'var(--accent-rose)' },
  { role: 'selection_committee',   label: 'Selection Committee',    icon: UserCheck, accent: 'var(--accent-orange)',  bg: 'var(--accent-orange-bg)',  border: 'var(--accent-orange)' },
];

export default function PublicLanding() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Brief 800ms intro shimmer then reveal
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  const loginAs = (role: string) => {
    document.cookie = `user_role=${role}; path=/; max-age=3600`;
    window.location.reload();
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-[#0c0f14]">

      {/* ── Aurora gradient background ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #c9a96e 0%, transparent 70%)', animation: 'float1 12s ease-in-out infinite' }} />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #5aada8 0%, transparent 70%)', animation: 'float2 16s ease-in-out infinite' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(ellipse, #6b8cce 0%, transparent 70%)', animation: 'float3 20s ease-in-out infinite' }} />
      </div>

      {/* ── Animated particles ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {PARTICLES.map(p => (
          <div key={p.id} className="absolute rounded-full bg-white"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: `${p.size}px`, height: `${p.size}px`,
              opacity: p.opacity,
              animation: `particleDrift ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            }} />
        ))}
      </div>

      {/* ── Dual spinning Ashoka Chakras (background) ── */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        {/* Outer slow spin */}
        <AshokaChakra
          className="absolute w-[600px] h-[600px] opacity-[0.04]"
          style={{ color: '#c9a96e', animation: 'spin 60s linear infinite' }}
        />
        {/* Inner counter-spin */}
        <AshokaChakra
          className="absolute w-[380px] h-[380px] opacity-[0.06]"
          style={{ color: '#5aada8', animation: 'spin 35s linear infinite reverse' }}
        />
        {/* Innermost fast spin */}
        <AshokaChakra
          className="absolute w-[200px] h-[200px] opacity-[0.10]"
          style={{ color: '#c9a96e', animation: 'spin 15s linear infinite' }}
        />
      </div>

      {/* ── Grid overlay ── */}
      <div className="absolute inset-0 z-0 opacity-[0.025]"
        style={{ backgroundImage: 'linear-gradient(#c9a96e 1px, transparent 1px), linear-gradient(90deg, #c9a96e 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* ── Loading shimmer (first 800ms) ── */}
      {!visible && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0c0f14]">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute w-36 h-36 rounded-full blur-2xl animate-pulse"
              style={{ background: 'rgba(201,169,110,0.2)' }} />
            <AshokaChakra className="w-24 h-24" style={{ color: '#c9a96e', animation: 'spin 2s linear infinite' }} />
          </div>
          <p className="text-[10px] font-mono tracking-[0.3em] animate-pulse" style={{ color: '#c9a96e' }}>
            INITIALIZING PORTAL
          </p>
          <div className="w-40 h-[2px] bg-white/10 mt-4 rounded-full overflow-hidden">
            <div className="h-full w-full rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, #c9a96e, transparent)', animation: 'shimmer 1.2s ease-in-out infinite' }} />
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className={`relative z-10 w-full max-w-4xl mx-auto px-6 py-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Logo + Title */}
        <div className="text-center mb-12">
          {/* Spinning chakra as logo */}
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full blur-xl opacity-40"
              style={{ background: '#c9a96e', animation: 'pulse 3s ease-in-out infinite' }} />
            <AshokaChakra className="w-20 h-20" style={{ color: '#c9a96e', animation: 'spin 8s linear infinite' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] font-black text-[#0c0f14] bg-[#c9a96e] w-7 h-7 rounded-full flex items-center justify-center">ST</span>
            </div>
          </div>

          <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border"
            style={{ background: 'rgba(201,169,110,0.1)', borderColor: 'rgba(201,169,110,0.3)', color: '#c9a96e' }}>
            Ministry of Tribal Affairs · NFST · NOS-ST
          </div>

          <h1 className="text-5xl font-black mb-3 tracking-tight" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #c9a96e 50%, #5aada8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Scholarship Management
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(240,237,232,0.5)' }}>
            AI-enabled, deterministic, auditable. Select your authorized role to enter.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLES.map(({ role, label, icon: Icon, accent, bg, border }, i) => (
            <button key={role} onClick={() => loginAs(role)}
              className={`group flex flex-col items-center p-8 rounded-2xl border transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${i === 4 ? 'md:col-span-2 lg:col-span-2' : ''}`}
              style={{
                background: 'rgba(255,255,255,0.02)',
                borderColor: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                animationDelay: `${i * 0.1 + 0.8}s`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = bg;
                (e.currentTarget as HTMLElement).style.borderColor = border;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                <Icon size={24} strokeWidth={1.5} style={{ color: 'rgba(240,237,232,0.5)', transition: 'color 0.3s' }} />
              </div>
              <h2 className="font-bold text-sm text-white/80">{label}</h2>
            </button>
          ))}
        </div>

      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes float1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(60px,40px) scale(1.1)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-50px,-30px) scale(1.15)} }
        @keyframes float3 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.2)} }
        @keyframes particleDrift { 0%{transform:translate(0,0)} 100%{transform:translate(20px,-30px)} }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
      `}</style>
    </div>
  );
}
