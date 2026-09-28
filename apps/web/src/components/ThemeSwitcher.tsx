"use client";
import React, { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';

const THEMES = [
  { id: 'govtech', label: 'GovTech Secure (Dark)' },
  { id: 'classic', label: 'Official Classic (Light)' },
  { id: 'contrast', label: 'High Contrast (Accessibility)' },
  { id: 'indic', label: 'Indic Heritage (Warm)' },
  { id: 'indian', label: 'Indian Special (Soft)' },
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState('govtech');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('app-theme') || 'govtech';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    setOpen(false);
  };

  return (
    <div className="relative z-[100]">
      <button 
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all border shadow-lg hover:scale-105"
        style={{ 
          background: "var(--bg-card)", 
          borderColor: "var(--border-subtle)", 
          color: "var(--text-primary)" 
        }}
      >
        <Palette size={18} />
      </button>

      {open && (
        <div 
          className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border overflow-hidden backdrop-blur-xl animate-fadeIn"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
        >
          <div className="px-4 py-2 border-b text-xs font-bold uppercase tracking-widest" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
            Select Theme
          </div>
          <div className="p-1">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => changeTheme(t.id)}
                className="w-full text-left px-3 py-2 text-sm rounded-lg transition-colors font-medium flex items-center justify-between"
                style={{ 
                  background: theme === t.id ? "var(--accent-primary-bg)" : "transparent",
                  color: theme === t.id ? "var(--accent-primary)" : "var(--text-primary)"
                }}
              >
                {t.label}
                {theme === t.id && <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent-primary)" }}></div>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
