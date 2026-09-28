"use client";
import React, { useState } from 'react';
import { User, FileText, CloudDownload, Send, CheckCircle, Info, Camera, LogOut, Activity, Clock, ChevronRight } from 'lucide-react';

const REQUIRED_DOCS = [
  { label: 'ST Certificate', desc: 'Digitally signed or issued by Tehsildar / SDM', num: '①' },
  { label: 'Income Certificate', desc: 'Family income proof (latest financial year)', num: '②' },
  { label: "Master's Degree Marksheet", desc: 'Minimum 55% aggregate required', num: '③' },
  { label: 'NET / CSIR-NET Score Card', desc: 'For merit calculation (50% weightage)', num: '④' },
  { label: 'Aadhaar Card', desc: 'For identity verification (stored as masked token only)', num: '⑤' },
];

const MOCK_DIGI_DOCS = [
  { name: 'ST_Certificate.pdf', status: 'Verified' },
  { name: 'Income_Certificate.pdf', status: 'Verified' },
  { name: 'Marksheet_MSc.pdf', status: 'Verified' },
];

const STATUS_STAGES = [
  { label: 'Submitted', done: true, date: '22 Sep 2026' },
  { label: 'AI Verification', done: true, date: '22 Sep 2026', note: '✓ Auto-cleared' },
  { label: 'Institute Verification', done: false, date: 'In Progress', current: true },
  { label: 'Ministry Scrutiny', done: false, date: 'Pending' },
  { label: 'Selection Committee', done: false, date: 'Pending' },
  { label: 'Awarded', done: false, date: 'Pending' },
];

export default function ApplicantDashboard() {
  const [formData, setFormData] = useState({ fullName: '', dob: '', course: '', university: '' });
  const [digiDocs, setDigiDocs] = useState<typeof MOCK_DIGI_DOCS>([]);
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fetchingDigi, setFetchingDigi] = useState(false);
  const [activeTab, setActiveTab] = useState<'apply' | 'track'>('apply');

  const logout = () => {
    document.cookie = 'user_role=; path=/; max-age=0';
    window.location.href = '/';
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setDraftSaved(false);
    setTimeout(() => setDraftSaved(true), 800);
  };

  const fetchDigiLocker = () => {
    setFetchingDigi(true);
    setTimeout(() => {
      setDigiDocs(MOCK_DIGI_DOCS);
      setFetchingDigi(false);
    }, 1500);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] p-12 rounded-3xl text-center max-w-lg shadow-2xl">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">Application Submitted!</h2>
          <p className="text-[var(--text-muted)] mb-6">Your NFST application has been received. The AI engine is now verifying your documents automatically.</p>
          <div className="bg-[var(--bg-card-alt)] border border-[var(--border-subtle)] p-4 rounded-xl text-sm text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Application ID</span>
              <span className="font-mono font-bold text-[var(--accent-primary)]">APP-NFST-00127</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Status</span>
              <span className="font-semibold text-[var(--accent-orange)]">AI Verification In Progress</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Scheme</span>
              <span className="font-semibold text-[var(--text-primary)]">NFST 2025-26</span>
            </div>
          </div>
          <button onClick={logout} className="mt-6 text-sm text-[var(--text-muted)] hover:text-[var(--accent-rose)] transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <header className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2 text-[var(--accent-primary)]">
              <User size={22} /> Applicant Portal
            </h1>
            <p className="text-[var(--text-muted)] text-sm mt-0.5">NFST Fellowship Application — 2025-26</p>
          </div>
          <div className="flex items-center gap-3">
            {draftSaved && (
              <span className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full">✓ Draft saved</span>
            )}
            <button onClick={logout} className="flex items-center gap-1.5 text-sm font-bold bg-[var(--bg-card)] border border-[var(--border-card)] px-3 py-1.5 rounded-lg hover:bg-[var(--accent-rose-bg)] hover:text-[var(--accent-rose)] transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </header>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-[var(--bg-card)] border border-[var(--border-card)] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('apply')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'apply' ? 'bg-[var(--accent-primary-bg)] text-[var(--accent-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
          >
            <FileText size={15} /> Apply for Fellowship
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'track' ? 'bg-[var(--accent-teal-bg)] text-[var(--accent-teal)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
          >
            <Activity size={15} /> Track Application
          </button>
        </div>

        {/* Status Tracker */}
        {activeTab === 'track' && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] p-6 rounded-2xl space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-base font-bold text-[var(--accent-teal)] flex items-center gap-2"><Clock size={16}/> Application Status</h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Application ID: <span className="font-mono font-bold text-[var(--accent-primary)]">NFST-2026-9912</span></p>
              </div>
              <span className="text-xs bg-[var(--accent-orange-bg)] text-[var(--accent-orange)] border border-orange-500/20 px-3 py-1 rounded-full font-bold">Institute Verification</span>
            </div>

            <div className="relative">
              {STATUS_STAGES.map((stage, i) => (
                <div key={i} className="flex items-start gap-4 mb-4 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border-2 ${stage.done ? 'bg-[var(--accent-green)] border-[var(--accent-green)] text-white' : (stage as any).current ? 'bg-[var(--accent-orange-bg)] border-[var(--accent-orange)] text-[var(--accent-orange)]' : 'bg-[var(--bg-card-alt)] border-[var(--border-subtle)] text-[var(--text-muted)]'}`}>
                      {stage.done ? '✓' : (stage as any).current ? '●' : i + 1}
                    </div>
                    {i < STATUS_STAGES.length - 1 && (
                      <div className={`w-0.5 h-8 mt-1 ${stage.done ? 'bg-[var(--accent-green)]' : 'bg-[var(--border-subtle)]'}`} />
                    )}
                  </div>
                  <div className="pt-1 flex-1">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-bold ${stage.done ? 'text-[var(--accent-green)]' : (stage as any).current ? 'text-[var(--accent-orange)]' : 'text-[var(--text-muted)]'}`}>{stage.label}</span>
                      <span className="text-xs text-[var(--text-muted)] font-mono">{stage.date}</span>
                    </div>
                    {(stage as any).note && <p className="text-xs text-[var(--accent-green)] mt-0.5">{(stage as any).note}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[var(--bg-card-alt)] border border-[var(--border-subtle)] p-4 rounded-xl text-sm space-y-2">
              <p className="font-semibold text-[var(--text-secondary)]">📋 Verified Documents</p>
              {MOCK_DIGI_DOCS.map((d, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-[var(--text-muted)]">{d.name}</span>
                  <span className="text-green-400 font-bold">✓ {d.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Application form — only show when on apply tab */}
        {activeTab === 'apply' && <>

        {/* Step 1: Required Documents */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold flex items-center gap-2 text-[var(--accent-teal)]">
              <Info size={18} /> Required Documents Checklist
            </h2>
            <span className="text-xs bg-blue-500/15 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full font-semibold">NFST Scheme</span>
          </div>
          <div className="bg-[var(--bg-card-alt)] border border-[var(--border-subtle)] p-5 rounded-xl space-y-3">
            <p className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Please keep the following documents ready before you apply:</p>
            <ul className="space-y-2.5">
              {REQUIRED_DOCS.map((doc) => (
                <li key={doc.num} className="flex items-start gap-3 text-sm">
                  <span className="text-[var(--accent-primary)] font-bold mt-0.5 shrink-0">{doc.num}</span>
                  <span>
                    <strong className="text-[var(--text-primary)]">{doc.label}</strong>
                    <span className="text-[var(--text-muted)]"> — {doc.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm flex items-start gap-2">
              <span className="text-lg leading-tight">⚡</span>
              <span><strong>Pro Tip:</strong> Click "Fetch from DigiLocker" below to auto-import your verified documents and skip manual upload entirely.</span>
            </div>
          </div>
        </div>

        {/* Step 2: Personal Details */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] p-6 rounded-2xl">
          <h2 className="text-base font-bold flex items-center gap-2 mb-4 text-[var(--accent-primary)]">
            <User size={18} /> Personal Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">Full Name (as per Aadhaar)</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="e.g. Rahul Munda"
                className="w-full bg-[var(--bg-card-alt)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent-primary)] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                className="w-full bg-[var(--bg-card-alt)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">Course Enrolled</label>
              <select
                value={formData.course}
                onChange={(e) => handleChange('course', e.target.value)}
                className="w-full bg-[var(--bg-card-alt)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] transition-colors"
              >
                <option value="">Select course</option>
                <option value="mphil">M.Phil</option>
                <option value="phd">Ph.D</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">University / Institution</label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => handleChange('university', e.target.value)}
                placeholder="e.g. JNU, New Delhi"
                className="w-full bg-[var(--bg-card-alt)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent-primary)] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Upload Documents */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] p-6 rounded-2xl">
          <h2 className="text-base font-bold flex items-center gap-2 mb-4 text-[var(--accent-orange)]">
            <FileText size={18} /> Upload Documents
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <button
              onClick={fetchDigiLocker}
              disabled={fetchingDigi || digiDocs.length > 0}
              className="flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-500/60 text-blue-400 font-bold p-4 rounded-xl transition-all disabled:opacity-50"
            >
              <CloudDownload size={18} />
              {fetchingDigi ? 'Fetching...' : digiDocs.length > 0 ? 'Fetched ✓' : 'Fetch from DigiLocker'}
            </button>
            <label className="flex items-center justify-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/60 text-purple-400 font-bold p-4 rounded-xl transition-all cursor-pointer">
              <Camera size={18} /> Camera Capture
              <input type="file" accept="image/*" capture="environment" className="hidden" />
            </label>
          </div>

          {fetchingDigi && (
            <div className="text-sm text-[var(--text-muted)] animate-pulse text-center py-2">
              Connecting to DigiLocker...
            </div>
          )}

          {digiDocs.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-green-400 mb-2">✓ Documents fetched from DigiLocker — auto-verified:</p>
              {digiDocs.map((doc, i) => (
                <div key={i} className="flex items-center justify-between bg-green-500/10 border border-green-500/20 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <FileText size={15} className="text-green-400" />
                    <span className="text-sm font-semibold">{doc.name}</span>
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full font-bold uppercase">{doc.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-teal)] hover:opacity-90 text-[#0c0f14] font-black text-base p-4 rounded-xl transition-all disabled:opacity-50 shadow-lg"
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting Application...
            </>
          ) : (
            <><Send size={18} /> Submit Application</>
          )}
        </button>

        </> /* end apply tab */}

      </div>
    </div>
  );
}
