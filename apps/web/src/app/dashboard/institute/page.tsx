"use client";
import React from 'react';
import InstituteQueue from '../../../views/InstituteQueue';
import { Building2 } from 'lucide-react';

export default function InstituteDashboard() {
  const logout = () => { document.cookie = 'user_role=; path=/; max-age=0'; window.location.href = '/'; };
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)]">
      <header className="h-12 shrink-0 flex items-center justify-between px-5 border-b bg-[var(--bg-card)] border-[var(--border-subtle)]">
        <h1 className="text-sm font-bold flex items-center gap-2 text-[var(--accent-green)]"><Building2 size={16}/> Institute Nodal Officer Portal</h1>
        <button onClick={logout} className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--accent-rose)] transition-colors">Sign Out</button>
      </header>
      <main className="flex-1 overflow-auto p-5">
        <InstituteQueue />
      </main>
    </div>
  );
}
