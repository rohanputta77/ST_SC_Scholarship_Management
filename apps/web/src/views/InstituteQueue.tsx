"use client";
import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Clock, FileText, X } from "lucide-react";

const REJECTION_CODES = ["not_bonafide_student","invalid_documents","already_availed_scholarship_full_duration","income_certificate_invalid_period","community_name_mismatch","other_with_remark"];

const MOCK = [
  { id: 1, fullName: "Arjun Munda",    applicantId: "NFST-2026-081", scheme: "NFST", slaDeadline: Date.now() + 0.1*86400000, isEscalated: true },
  { id: 2, fullName: "Priya Meena",     applicantId: "NFST-2026-092", scheme: "NFST", slaDeadline: Date.now() + 12*86400000,  isEscalated: false },
  { id: 3, fullName: "Ramesh Oraon",    applicantId: "NOS-2026-004",  scheme: "NOS",  slaDeadline: Date.now() + 14*86400000,  isEscalated: false },
  { id: 4, fullName: "Sunita Gond",     applicantId: "NFST-2026-103", scheme: "NFST", slaDeadline: Date.now() + 2*86400000,   isEscalated: true },
  { id: 5, fullName: "Deepak Bheel",    applicantId: "NFST-2026-117", scheme: "NFST", slaDeadline: Date.now() + 8*86400000,   isEscalated: false },
  { id: 6, fullName: "Kavita Sahariya", applicantId: "NOS-2026-011",  scheme: "NOS",  slaDeadline: Date.now() + 5*86400000,   isEscalated: false },
];

function Sla({ deadline, escalated }: { deadline: number; escalated: boolean }) {
  const [rem, setRem] = useState("");
  useEffect(() => {
    const t = () => { const d = deadline - Date.now(); if (d <= 0) { setRem("OVERDUE"); return; } setRem(`${Math.floor(d/86400000)}d ${Math.floor((d%86400000)/3600000)}h`); };
    t(); const id = setInterval(t, 60000); return () => clearInterval(id);
  }, [deadline]);
  const urgent = escalated || rem === "OVERDUE";
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg" style={{ background: urgent ? "var(--accent-rose-bg)" : "var(--accent-teal-bg)", color: urgent ? "var(--accent-rose)" : "var(--accent-teal)" }}>
      <Clock size={12} /> SLA: {rem} {urgent && <AlertTriangle size={11} />}
    </div>
  );
}

export default function InstituteQueue({ onAction }: { onAction?: (msg: string) => void }) {
  const [apps, setApps] = useState(MOCK);
  const [sel, setSel] = useState<Set<number>>(new Set());
  const [docId, setDocId] = useState<number|null>(null);

  const toggle = (id: number) => setSel(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const bulkApprove = () => { const n = apps.filter(a => sel.has(a.id)); setApps(p => p.filter(a => !sel.has(a.id))); setSel(new Set()); onAction?.(`Bulk approved ${n.length}: ${n.map(a=>a.fullName).join(", ")}`); };
  const reject = (id: number, code: string) => { const a = apps.find(x=>x.id===id); setApps(p=>p.filter(x=>x.id!==id)); setSel(p=>{const s=new Set(p);s.delete(id);return s;}); onAction?.(`${a?.fullName} rejected — ${code.replace(/_/g," ")}`); };
  const approve = (id: number) => { const a = apps.find(x=>x.id===id); setApps(p=>p.filter(x=>x.id!==id)); setSel(p=>{const s=new Set(p);s.delete(id);return s;}); onAction?.(`${a?.fullName} verified & approved.`); };

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <header className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: "var(--accent-teal)" }}>Institute Verification Queue</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{apps.length} applications pending</p>
        </div>
        <button onClick={bulkApprove} disabled={sel.size===0} className="px-5 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-30" style={{ background: "var(--accent-green)", color: "white" }}>
          <span className="flex items-center gap-1.5"><CheckCircle size={14}/> Bulk Approve ({sel.size})</span>
        </button>
      </header>

      {apps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16" style={{ color: "var(--text-muted)" }}>
          <CheckCircle size={40} className="mb-3 opacity-30" /><p className="text-xs font-medium">All applications processed!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {apps.map(a => (
            <div key={a.id} className="rounded-2xl p-4 border flex flex-col justify-between transition-colors" style={{ background: "var(--bg-card)", borderColor: "var(--border-card)" }}>
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div><h3 className="text-sm font-bold">{a.fullName}</h3><p className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>{a.applicantId} · {a.scheme}</p></div>
                  <input type="checkbox" checked={sel.has(a.id)} onChange={()=>toggle(a.id)} className="w-4 h-4 rounded accent-[#8b9a6b] cursor-pointer" />
                </div>
                <Sla deadline={a.slaDeadline} escalated={a.isEscalated} />
              </div>
              <div className="mt-4 space-y-2">
                <button onClick={()=>setDocId(docId===a.id?null:a.id)} className="w-full py-1.5 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1.5 border transition-colors" style={{ background: "var(--bg-card-alt)", borderColor: "var(--border-card)", color: "var(--text-secondary)" }}>
                  <FileText size={13}/> {docId===a.id?"Hide":"View"} Documents
                </button>
                {docId===a.id && (
                  <div className="rounded-lg p-2.5 text-[10px] space-y-1 font-mono" style={{ background: "var(--bg-card-alt)", color: "var(--text-muted)" }}>
                    <p>📄 ST_Certificate.pdf — DigiLocker verified</p><p>📄 Income_Certificate.pdf — OCR: ₹2,40,000</p><p>📄 Admission_Letter.pdf — 2026-27</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={()=>approve(a.id)} className="py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors" style={{ background: "var(--accent-green)", color: "white" }}><CheckCircle size={13}/> Approve</button>
                  <select defaultValue="" onChange={e=>{if(e.target.value)reject(a.id,e.target.value)}} className="py-1.5 rounded-lg text-[11px] font-bold text-center outline-none cursor-pointer" style={{ background: "var(--accent-rose)", color: "white" }}>
                    <option value="" disabled>Reject…</option>
                    {REJECTION_CODES.map(c=><option key={c} value={c} style={{ background: "var(--bg-card)", color: "var(--text-primary)", textAlign: "left" }}>{c.replace(/_/g," ")}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
