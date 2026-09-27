"use client";
import React from 'react';
import { User, FileText, Activity } from 'lucide-react';

export default function ApplicantDashboard() {
  const logout = () => {
    document.cookie = 'user_role=; path=/; max-age=0';
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen p-6 bg-[var(--bg-main)] text-[var(--text-primary)]">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[var(--accent-primary)]"><User /> Applicant Portal</h1>
          <button onClick={logout} className="text-sm font-bold bg-[var(--bg-card)] border border-[var(--border-card)] px-3 py-1.5 rounded-lg hover:bg-[var(--accent-rose-bg)] hover:text-[var(--accent-rose)] transition-colors">Sign Out</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-card)]">
            <h2 className="text-sm font-bold flex items-center gap-2 mb-4 text-[var(--accent-teal)]"><Activity size={18}/> Application Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Current Stage</span>
                <span className="font-bold bg-[var(--accent-orange-bg)] text-[var(--accent-orange)] px-2 py-0.5 rounded">Institute Verification</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Application ID</span>
                <span className="font-mono">NFST-2026-9912</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-card)]">
            <h2 className="text-sm font-bold flex items-center gap-2 mb-4 text-[var(--accent-primary)]"><FileText size={18}/> My Documents</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between bg-[var(--bg-card-alt)] p-2 rounded border border-[var(--border-subtle)]">
                <span>ST Certificate</span><span className="text-[var(--accent-green)] font-bold">Verified</span>
              </div>
              <div className="flex items-center justify-between bg-[var(--bg-card-alt)] p-2 rounded border border-[var(--border-subtle)]">
                <span>Income Certificate</span><span className="text-[var(--accent-orange)] font-bold">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
