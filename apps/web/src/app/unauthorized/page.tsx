"use client";
import React from 'react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-main)] text-[var(--text-primary)]">
      <div className="w-full max-w-md bg-[var(--bg-card)] rounded-2xl p-8 border border-[var(--border-card)] text-center shadow-2xl">
        <h1 className="text-4xl font-black text-[var(--accent-rose)] mb-2">403</h1>
        <h2 className="text-xl font-bold mb-4">Access Denied</h2>
        <p className="text-[var(--text-muted)] text-sm mb-6">
          You do not have the required permissions to view this dashboard.
        </p>
        <button 
          onClick={() => {
            document.cookie = 'user_role=; path=/; max-age=0';
            window.location.href = '/';
          }}
          className="bg-[var(--bg-card-alt)] hover:bg-[var(--accent-rose-bg)] text-[var(--text-primary)] hover:text-[var(--accent-rose)] border border-[var(--border-card)] px-4 py-2 rounded-lg text-sm font-bold transition-all"
        >
          Sign Out & Return Home
        </button>
      </div>
    </div>
  );
}
