"use client";
import React, { useState } from "react";
import { Eye, ShieldAlert, Check, X, ChevronLeft, ChevronRight } from "lucide-react";

const FLAGGED = [
  {
    id: "APP-NFST-0045", fullName: "Ananya Sharma", scheme: "NFST",
    documents: [
      { id: 1, type: "ST Certificate", preview: "Certificate issued by Tehsildar, Ranchi — Community: Sahariaa" },
      { id: 2, type: "Income Certificate", preview: "Family income ₹1,25,000 — Valid until 31 Mar 2027" },
      { id: 3, type: "10th Marksheet", preview: "DOB: 14-Jun-2001, Name: ANANYA SHARMA" },
    ],
    aiFindings: [
      { field: "Community Name", severity: "warning", message: "Community 'Sahariaa' is a near-miss for PVTG entry 'Sahariya'. Verify manually.", confidence: 0.82 },
    ],
    extracted: { communityName: "Sahariaa", familyIncome: "₹1,25,000", dobSource: "10th Marksheet" },
  },
  {
    id: "APP-NFST-0112", fullName: "Rajesh Oraon", scheme: "NFST",
    documents: [
      { id: 1, type: "ST Certificate", preview: "Certificate — Name: RAJESH URAON, Community: Oraon" },
      { id: 2, type: "Admission Letter", preview: "University of Delhi — M.Phil Sociology, Session 2026–27" },
    ],
    aiFindings: [
      { field: "Full Name", severity: "blocking", message: "Name mismatch: Application says 'Rajesh Oraon' but ST Certificate reads 'Rajesh Uraon'.", confidence: 0.95 },
      { field: "Admission Date", severity: "info", message: "Admission letter date is after the scheme application deadline.", confidence: 0.70 },
    ],
    extracted: { communityName: "Oraon", familyIncome: "₹2,40,000", dobSource: "Aadhaar (masked)" },
  },
  {
    id: "APP-NOS-0018", fullName: "Meera Gond", scheme: "NOS",
    documents: [
      { id: 1, type: "Acceptance Letter", preview: "University of Toronto — PhD Anthropology, Fall 2026" },
      { id: 2, type: "One-Child Affidavit", preview: "Notarized 12-Aug-2026, attesting single child under NOS scheme" },
    ],
    aiFindings: [
      { field: "One-Child Violation", severity: "blocking", message: "Fraud Analytics: Another NOS applicant (APP-NOS-0009, Sunita Gond) shares same parent name + DOB.", confidence: 0.97 },
    ],
    extracted: { communityName: "Gond", familyIncome: "₹3,50,000", dobSource: "Passport" },
  },
];

export default function ScrutinyWorkbench({ onAction }: { onAction?: (msg: string) => void }) {
  const [idx, setIdx] = useState(0);
  const [docIdx, setDocIdx] = useState(0);
  const [resolved, setResolved] = useState<Record<string, "approved" | "rejected">>({});

  const app = FLAGGED[idx];
  const done = !!resolved[app.id];

  const approve = () => { setResolved((p) => ({ ...p, [app.id]: "approved" })); onAction?.(`${app.fullName} — Override approved. Audit logged.`); };
  const reject = () => { setResolved((p) => ({ ...p, [app.id]: "rejected" })); onAction?.(`${app.fullName} — Rejected. Applicant notified.`); };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ color: "var(--text-primary)" }}>
      {/* Header */}
      <header className="h-12 shrink-0 flex items-center justify-between px-5 border-b" style={{ background: "var(--bg-card)", borderColor: "var(--border-card)" }}>
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold">Scrutiny Workbench</h2>
          <div className="flex items-center gap-1">
            <button onClick={() => { setIdx(Math.max(0, idx - 1)); setDocIdx(0); }} disabled={idx === 0} className="p-1 rounded-lg hover:opacity-80 disabled:opacity-30"><ChevronLeft size={16} /></button>
            <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{idx + 1}/{FLAGGED.length}</span>
            <button onClick={() => { setIdx(Math.min(FLAGGED.length - 1, idx + 1)); setDocIdx(0); }} disabled={idx === FLAGGED.length - 1} className="p-1 rounded-lg hover:opacity-80 disabled:opacity-30"><ChevronRight size={16} /></button>
          </div>
        </div>
        <div className="flex gap-3 items-center text-xs">
          <span className="px-3 py-1 rounded-full font-bold" style={{ background: "var(--accent-green-bg)", color: "var(--accent-green)" }}>STP Rate: 95.2%</span>
          <span style={{ color: "var(--text-muted)" }}>{FLAGGED.length} flagged</span>
        </div>
      </header>

      {/* Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: docs */}
        <div className="flex-[3] border-r p-4 flex flex-col" style={{ background: "var(--bg-card-alt)", borderColor: "var(--border-card)" }}>
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            {app.documents.map((d, i) => (
              <button key={d.id} onClick={() => setDocIdx(i)} className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all" style={{ background: docIdx === i ? "var(--accent-teal-bg)" : "var(--bg-card)", color: docIdx === i ? "var(--accent-teal)" : "var(--text-muted)", border: `1px solid ${docIdx === i ? "rgba(139,154,107,0.3)" : "var(--border-card)"}` }}>
                {d.type}
              </button>
            ))}
          </div>
          <div className="flex-1 rounded-xl flex flex-col items-center justify-center p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)" }}>
            <Eye size={32} className="mb-3" style={{ color: "var(--text-muted)", opacity: 0.3 }} />
            <p className="text-xs font-bold mb-2" style={{ color: "var(--text-secondary)" }}>{app.documents[docIdx].type}</p>
            <p className="text-xs text-center max-w-sm leading-relaxed px-4 py-3 rounded-lg font-mono" style={{ background: "var(--bg-card-alt)", color: "var(--text-secondary)" }}>{app.documents[docIdx].preview}</p>
          </div>
        </div>

        {/* Right: AI */}
        <div className="flex-[2] p-4 overflow-y-auto space-y-4" style={{ background: "var(--bg-card)" }}>
          <div>
            <h3 className="text-base font-bold">{app.fullName}</h3>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{app.id} · {app.scheme}</p>
          </div>

          {done && (
            <div className="p-3 rounded-xl text-center text-xs font-bold" style={{ background: resolved[app.id] === "approved" ? "var(--accent-green-bg)" : "var(--accent-rose-bg)", color: resolved[app.id] === "approved" ? "var(--accent-green)" : "var(--accent-rose)", border: `1px solid ${resolved[app.id] === "approved" ? "rgba(90,154,107,0.3)" : "rgba(196,90,90,0.3)"}` }}>
              {resolved[app.id] === "approved" ? "✓ APPROVED — Override logged" : "✗ REJECTED — Deficiency notice sent"}
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold flex items-center gap-2 mb-2" style={{ color: "var(--accent-rose)" }}><ShieldAlert size={14} /> AI Exception Flags</h4>
            <div className="space-y-2">
              {app.aiFindings.map((f, i) => (
                <div key={i} className="p-3 rounded-xl border" style={{ background: "var(--accent-rose-bg)", borderColor: "rgba(196,90,90,0.2)" }}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold" style={{ color: "var(--accent-rose)" }}>{f.field}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase" style={{ background: f.severity === "blocking" ? "var(--accent-rose)" : f.severity === "warning" ? "var(--accent-primary)" : "var(--accent-teal)", color: "white" }}>{f.severity}</span>
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{f.message}</p>
                  <p className="text-[10px] mt-1.5 font-mono px-2 py-1 rounded" style={{ background: "var(--bg-card-alt)", color: "var(--text-muted)" }}>Confidence: {f.confidence}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold mb-2 pb-1 border-b" style={{ borderColor: "var(--border-card)" }}>Extracted Fields</h4>
            <div className="space-y-1.5 text-xs">
              {Object.entries(app.extracted).map(([k, v]) => (
                <div key={k} className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>{k}</span><span>{v}</span></div>
              ))}
            </div>
          </div>

          {!done && (
            <div className="flex gap-2 pt-1">
              <button onClick={reject} className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors" style={{ background: "var(--accent-rose)", color: "white" }}><X size={14} /> Reject</button>
              <button onClick={approve} className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors" style={{ background: "var(--accent-green)", color: "white" }}><Check size={14} /> Override &amp; Approve</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
