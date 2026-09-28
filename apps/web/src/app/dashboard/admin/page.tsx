"use client";
import React, { useState } from "react";
import {
  Search, Bell, LayoutDashboard, FileText, Users, BookOpen, Shield, SettingsIcon,
} from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";


import MinistryDashboard from "../../../views/MinistryDashboard";
import ScrutinyWorkbench from "../../../views/ScrutinyWorkbench";
import InstituteQueue from "../../../views/InstituteQueue";
import SelectionCommittee from "../../../views/SelectionCommittee";
import SchemeStudio from "../../../views/SchemeStudio";
import WhatIfSimulator from "../../../views/WhatIfSimulator";

const TABS = [
  { id: "dashboard",  label: "Overview",            num: "01" },
  { id: "scrutiny",   label: "Scrutiny",            num: "02" },
  { id: "institute",  label: "Verification",        num: "03" },
  { id: "selection",  label: "Selection",            num: "04" },
  { id: "studio",     label: "Configuration",       num: "05" },
  { id: "whatif",     label: "Simulator",            num: "06" },
] as const;

const SIDEBAR_ICONS = [LayoutDashboard, Shield, Users, BookOpen, FileText, SettingsIcon];

type TabId = (typeof TABS)[number]["id"];

export default function Home() {
  const [active, setActive] = useState<TabId>("dashboard");
  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const handleLogout = () => {
    document.cookie = "user_role=; path=/; max-age=0";
    window.location.href = "/";
  };

  const renderView = () => {
    switch (active) {
      case "dashboard":  return <MinistryDashboard />;
      case "scrutiny":   return <ScrutinyWorkbench onAction={showToast} />;
      case "institute":  return <InstituteQueue onAction={showToast} />;
      case "selection":  return <SelectionCommittee onAction={showToast} />;
      case "studio":     return <SchemeStudio onAction={showToast} />;
      case "whatif":     return <WhatIfSimulator />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans relative transition-colors duration-500" style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}>
      
      {/* ── BACKGROUND AURORA (Matches Landing & Applicant) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen" style={{ opacity: "var(--aurora-opacity)" }}>
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px] animate-pulse"
             style={{ background: 'radial-gradient(circle, rgba(255,153,51,0.15) 0%, transparent 70%)' }} />
        <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full blur-[100px] animate-pulse"
             style={{ background: 'radial-gradient(circle, rgba(0,82,163,0.15) 0%, transparent 70%)', animationDelay: '2s' }} />
      </div>

      {/* ── Sidebar ── */}
      <aside className="relative z-20 w-[64px] shrink-0 flex flex-col items-center py-6 gap-3 backdrop-blur-md border-r shadow-[4px_0_24px_rgba(0,0,0,0.1)] transition-colors duration-500"
             style={{ background: "var(--bg-sidebar)", borderColor: "var(--border-subtle)" }}>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-[2px] shadow-sm mb-6">
          <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: "var(--bg-main)" }}>
            <span className="text-[12px] font-black tracking-tighter" style={{ color: "var(--text-primary)" }}>ST</span>
          </div>
        </div>
        {SIDEBAR_ICONS.map((Icon, i) => {
          const tabId = TABS[i]?.id;
          const isActive = active === tabId;
          return (
            <button
              key={i}
              onClick={() => tabId && setActive(tabId)}
              className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group"
              style={{
                background: isActive ? "var(--accent-primary-bg)" : "transparent",
                color: isActive ? "var(--accent-primary)" : "var(--text-muted)",
              }}
              title={TABS[i]?.label}
            >
              {isActive && (
                <div className="absolute inset-0 rounded-xl border shadow-lg" style={{ borderColor: "var(--accent-primary)" }}></div>
              )}
              <Icon size={22} strokeWidth={isActive ? 2 : 1.5} className="transition-colors group-hover:opacity-80" />
            </button>
          );
        })}
      </aside>

      {/* ── Main ── */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 shrink-0 flex items-center justify-between px-6 backdrop-blur-md border-b sticky top-0 z-50 transition-colors duration-500"
                style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
          {/* Left: title */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>Ministry of Tribal Affairs</span>
              <span className="text-sm font-black tracking-tight" style={{ color: "var(--text-primary)" }}>Official Dashboard Terminal</span>
            </div>
          </div>

          {/* Center: tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl border" style={{ background: "var(--bg-main)", borderColor: "var(--border-subtle)" }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300"
                style={{
                  background: active === t.id ? "var(--bg-card)" : "transparent",
                  color: active === t.id ? "var(--text-primary)" : "var(--text-muted)",
                  boxShadow: active === t.id ? "0 0 10px rgba(0,0,0,0.05)" : "none"
                }}
              >
                <span className="text-[10px] font-mono opacity-50 tracking-widest">{t.num}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Right: search & profile */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Lookup ID / Hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearching(true)}
                onBlur={() => setTimeout(() => setIsSearching(false), 200)}
                className={`h-9 pl-9 pr-4 rounded-full border transition-all duration-300 text-sm focus:outline-none focus:ring-1 font-mono ${
                  isSearching ? "w-64" : "w-48"
                }`}
                style={{ 
                  background: "var(--bg-main)", 
                  borderColor: isSearching ? "var(--accent-primary)" : "var(--border-subtle)",
                  color: "var(--text-primary)",
                  boxShadow: isSearching ? "0 0 0 1px var(--accent-primary)" : "none"
                }}
              />
              {isSearching && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full rounded-xl shadow-2xl border p-2 z-50 flex flex-col gap-1 backdrop-blur-xl"
                     style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
                    <div className="px-3 py-2 hover:bg-black/5 cursor-pointer rounded-lg text-[11px] font-medium transition-colors" onClick={() => showToast(`Searching applicants for '${searchQuery}'`)} style={{ color: "var(--text-primary)" }}>
                        <span style={{ color: "var(--accent-primary)" }}>Applicant:</span> {searchQuery}
                    </div>
                    <div className="px-3 py-2 hover:bg-black/5 cursor-pointer rounded-lg text-[11px] font-medium transition-colors" onClick={() => showToast(`Searching schemes for '${searchQuery}'`)} style={{ color: "var(--text-primary)" }}>
                        <span style={{ color: "var(--accent-green)" }}>Scheme:</span> Search in configurations
                    </div>
                </div>
              )}
            </div>
            
            <button className="relative p-2 transition-colors" style={{ color: "var(--text-muted)" }} onClick={() => showToast("No new notifications")}>
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]" style={{ background: "var(--accent-orange)" }}></span>
            </button>

            <div className="h-6 w-[1px]" style={{ background: "var(--border-subtle)" }}></div>

            <ThemeSwitcher />

            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                onBlur={() => setTimeout(() => setShowProfileMenu(false), 200)}
                className="w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold shadow-md hover:shadow-lg transition-all"
                style={{ background: "var(--accent-primary-bg)", borderColor: "var(--border-subtle)", color: "var(--accent-primary)" }}
              >
                MO
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 backdrop-blur-xl border rounded-xl shadow-2xl py-1 overflow-hidden animate-fadeIn z-50"
                     style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Ministry Admin</p>
                    <p className="text-[10px] font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>ID: GOV-992-X</p>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-bold transition-colors hover:opacity-80"
                          style={{ color: "var(--accent-orange)" }}>
                    Sign Out Terminal
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-auto relative z-10 p-6">
          <div className="max-w-7xl mx-auto h-full">
            {renderView()}
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="absolute bottom-6 right-6 bg-[#138808]/20 backdrop-blur-md border border-[#138808]/50 text-white px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(19,136,8,0.2)] flex items-center gap-3 animate-slideUp z-50">
          <CheckCircle2 className="text-[#138808]" size={20} />
          <span className="text-sm font-bold tracking-wide">{toast}</span>
        </div>
      )}
    </div>
  );
}
