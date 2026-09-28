"use client";
import React from 'react';
import ScrutinyWorkbench from '../../../views/ScrutinyWorkbench';
import { BookOpen } from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function ScrutinyDashboard() {
  const logout = () => { document.cookie = 'user_role=; path=/; max-age=0'; window.location.href = '/'; };
  return (
    <div className="flex h-screen overflow-hidden font-sans relative transition-colors duration-500" style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}>
      {/* ── BACKGROUND AURORA ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen" style={{ opacity: "var(--aurora-opacity)" }}>
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px] animate-pulse"
             style={{ background: 'radial-gradient(circle, rgba(255,153,51,0.15) 0%, transparent 70%)' }} />
        <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full blur-[100px] animate-pulse"
             style={{ background: 'radial-gradient(circle, rgba(0,82,163,0.15) 0%, transparent 70%)', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 flex items-center justify-between px-6 backdrop-blur-md border-b sticky top-0 z-50 transition-colors duration-500"
                style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>Ministry of Tribal Affairs</span>
              <span className="text-sm font-black tracking-tight flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <BookOpen size={16} style={{ color: "var(--accent-primary)" }}/> Scrutiny Officer Terminal
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <div className="h-6 w-[1px]" style={{ background: "var(--border-subtle)" }}></div>
            <button onClick={logout} className="text-xs font-bold transition-colors hover:opacity-80 px-3 py-1.5 rounded-lg border" style={{ color: "var(--accent-orange)", borderColor: "var(--border-subtle)", background: "var(--bg-main)" }}>Sign Out</button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-5">
          <div className="max-w-7xl mx-auto h-full">
            <ScrutinyWorkbench />
          </div>
        </main>
      </div>
    </div>
  );
}
