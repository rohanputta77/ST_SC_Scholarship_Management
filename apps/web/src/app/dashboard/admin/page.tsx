"use client";
import React, { useState } from "react";
import {
  Search, Bell, LayoutDashboard, FileText, Users, BookOpen, Shield, SettingsIcon,
} from "lucide-react";

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
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

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
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-main)" }}>
      {/* ── Sidebar ── */}
      <aside className="w-[52px] shrink-0 flex flex-col items-center py-5 gap-0.5 border-r" style={{ background: "var(--bg-sidebar)", borderColor: "var(--border-subtle)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold mb-8 tracking-tight" style={{ background: "linear-gradient(135deg, var(--accent-primary), #a08040)", color: "#0c0f14" }}>
          ST
        </div>
        {SIDEBAR_ICONS.map((Icon, i) => {
          const tabId = TABS[i]?.id;
          const isActive = active === tabId;
          return (
            <button
              key={i}
              onClick={() => tabId && setActive(tabId)}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 mb-0.5"
              style={{
                background: isActive ? "var(--accent-primary-bg)" : "transparent",
                color: isActive ? "var(--accent-primary)" : "var(--text-muted)",
              }}
              title={TABS[i]?.label}
            >
              <Icon size={17} strokeWidth={isActive ? 2.2 : 1.5} />
            </button>
          );
        })}
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-12 shrink-0 flex items-center justify-between px-5 border-b" style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
          {/* Left: title */}
          <h1 className="text-sm font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Scholarship Management
          </h1>

          {/* Center: tabs */}
          <div className="flex items-center gap-0.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200"
                style={{
                  background: active === t.id ? "var(--accent-primary-bg)" : "transparent",
                  color: active === t.id ? "var(--accent-primary)" : "var(--text-muted)",
                }}
              >
                <span className="text-[9px] font-mono opacity-50">{t.num}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search size={13} className="absolute left-2 top-[7px]" style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search…"
                className="pl-7 pr-3 py-1 rounded-md text-[11px] outline-none border w-36 transition-colors focus:border-[var(--accent-primary)]"
                style={{ background: "var(--bg-card-alt)", borderColor: "var(--border-card)", color: "var(--text-primary)" }}
              />
            </div>
            <button className="relative p-1 rounded-md" style={{ color: "var(--text-muted)" }}>
              <Bell size={15} />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent-rose)" }} />
            </button>
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ background: "var(--accent-primary-bg)", color: "var(--accent-primary)", border: "1px solid rgba(201,169,110,0.2)" }}>
              MO
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-5" style={{ background: "var(--bg-main)" }}>
          {renderView()}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-4 right-4 z-50 px-4 py-2.5 rounded-lg shadow-2xl text-[12px] font-medium flex items-center gap-2 border"
          style={{
            background: "var(--bg-card)",
            color: "var(--accent-teal)",
            borderColor: "rgba(90,173,168,0.3)",
            animation: "slideUp 0.3s ease-out",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent-teal)" }} />
          {toast}
        </div>
      )}
    </div>
  );
}
