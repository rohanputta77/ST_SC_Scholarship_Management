"use client";
import React, { useState } from "react";
import { AlertCircle, ChevronDown, Award, Search, UserCheck } from "lucide-react";

const CANDIDATES = [
  { id:"1", fullName:"Rahul Munda",  applicantId:"NFST-2026-101", bucket:"PVTG",       finalScore:92.5, scoreBreakdown:[{component:"NET/CSIR-NET (scaled)",weight:50,weightedScore:48},{component:"Master's Marks (scaled)",weight:50,weightedScore:44.5}] },
  { id:"2", fullName:"Vikram Singh", applicantId:"NFST-2026-102", bucket:"ST General",  finalScore:89.0, scoreBreakdown:[{component:"NET/CSIR-NET (scaled)",weight:50,weightedScore:45},{component:"Master's Marks (scaled)",weight:50,weightedScore:44}] },
  { id:"3", fullName:"Priya Meena",  applicantId:"NFST-2026-103", bucket:"Female (30%)",finalScore:87.2, scoreBreakdown:[{component:"NET/CSIR-NET (scaled)",weight:50,weightedScore:43.2},{component:"Master's Marks (scaled)",weight:50,weightedScore:44}] },
  { id:"4", fullName:"Deepak Bheel", applicantId:"NFST-2026-104", bucket:"Divyangjan", finalScore:84.8, scoreBreakdown:[{component:"NET/CSIR-NET (scaled)",weight:50,weightedScore:40.8},{component:"Master's Marks (scaled)",weight:50,weightedScore:44}] },
  { id:"5", fullName:"Sunita Gond",  applicantId:"NFST-2026-105", bucket:"ST General",  finalScore:82.0, scoreBreakdown:[{component:"NET/CSIR-NET (scaled)",weight:50,weightedScore:40},{component:"Master's Marks (scaled)",weight:50,weightedScore:42}] },
];

export default function SelectionCommittee({ onAction }: { onAction?: (msg: string) => void }) {
  const [expId, setExpId] = useState<string|null>(null);
  const [reasons, setReasons] = useState<Record<string,string>>({});
  const [overrides, setOverrides] = useState<Record<string,string>>({});
  const [search, setSearch] = useState("");
  const [bucket, setBucket] = useState("All");

  const doOverride = (id: string) => {
    const r = reasons[id]?.trim();
    if (!r) { alert("⚠ Enter a mandatory free-text justification first."); return; }
    setOverrides(p => ({ ...p, [id]: r }));
    onAction?.(`Override for ${CANDIDATES.find(c=>c.id===id)?.fullName}. Audit: "${r}"`);
  };

  const filtered = CANDIDATES.filter(c => {
    const ms = c.fullName.toLowerCase().includes(search.toLowerCase()) || c.applicantId.toLowerCase().includes(search.toLowerCase());
    const mb = bucket === "All" || c.bucket === bucket;
    return ms && mb;
  });
  const buckets = ["All", ...new Set(CANDIDATES.map(c => c.bucket))];

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <header className="mb-5">
        <h1 className="text-xl font-extrabold" style={{ color: "var(--accent-primary)" }}>Selection Committee Panel</h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Final merit ranking and slot-bucket allocation</p>
      </header>

      <div className="rounded-2xl p-5 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-card)" }}>
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <select className="rounded-lg px-3 py-1.5 text-xs outline-none border" style={{ background: "var(--bg-card-alt)", borderColor: "var(--border-card)", color: "var(--text-primary)" }}>
            <option>NFST (National Fellowship)</option><option>NOS (National Overseas)</option>
          </select>
          <select value={bucket} onChange={e=>setBucket(e.target.value)} className="rounded-lg px-3 py-1.5 text-xs outline-none border" style={{ background: "var(--bg-card-alt)", borderColor: "var(--border-card)", color: "var(--text-primary)" }}>
            {buckets.map(b=><option key={b}>{b}</option>)}
          </select>
          <div className="ml-auto relative">
            <Search size={13} className="absolute left-2.5 top-2" style={{ color: "var(--text-muted)" }} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" className="pl-7 pr-3 py-1.5 rounded-lg text-xs outline-none border w-44" style={{ background: "var(--bg-card-alt)", borderColor: "var(--border-card)", color: "var(--text-primary)" }} />
          </div>
        </div>

        {/* List */}
        <div className="space-y-2">
          {filtered.map((c, i) => (
            <div key={c.id} className="rounded-xl overflow-hidden border transition-colors" style={{ background: overrides[c.id] ? "var(--accent-primary-bg)" : "var(--bg-card-alt)", borderColor: overrides[c.id] ? "rgba(196,163,90,0.3)" : "var(--border-card)" }}>
              <div className="flex items-center p-3 cursor-pointer transition-colors hover:opacity-90" onClick={()=>setExpId(expId===c.id?null:c.id)}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: "var(--accent-primary-bg)", color: "var(--accent-primary)" }}>#{i+1}</div>
                <div className="ml-3 flex-1 min-w-0"><h3 className="text-sm font-bold truncate">{c.fullName}</h3><p className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>{c.applicantId}</p></div>
                <div className="flex items-center gap-2 mr-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border" style={{ background: "var(--accent-teal-bg)", color: "var(--accent-teal)", borderColor: "rgba(139,154,107,0.3)" }}>{c.bucket}</span>
                  <span className="flex items-center gap-1 text-sm font-bold" style={{ color: "var(--accent-primary)" }}><Award size={14}/>{c.finalScore}</span>
                  {overrides[c.id] && <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase" style={{ background: "var(--accent-primary)", color: "var(--bg-main)" }}>Overridden</span>}
                </div>
                <ChevronDown size={14} className={`transition-transform ${expId===c.id?"rotate-180":""}`} style={{ color: "var(--text-muted)" }} />
              </div>

              {expId === c.id && (
                <div className="p-4 border-t flex flex-col lg:flex-row gap-5" style={{ background: "rgba(0,0,0,0.15)", borderColor: "var(--border-card)" }}>
                  <div className="flex-1">
                    <h4 className="text-[11px] font-bold mb-2" style={{ color: "var(--text-secondary)" }}>Merit Score Breakdown</h4>
                    <p className="text-[9px] mb-2" style={{ color: "var(--text-muted)" }}>50% NET + 50% Master's (verified from notice 04.08.2026)</p>
                    <div className="space-y-1.5">
                      {c.scoreBreakdown.map((s, j) => (
                        <div key={j} className="flex justify-between items-center px-3 py-1.5 rounded-lg text-[11px]" style={{ background: "var(--bg-card)" }}>
                          <span>{s.component} <span style={{ color: "var(--text-muted)" }}>(W: {s.weight}%)</span></span>
                          <span className="font-mono font-bold" style={{ color: "var(--accent-teal)" }}>{s.weightedScore}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center px-3 py-1.5 rounded-lg text-[11px] font-bold border" style={{ background: "var(--accent-primary-bg)", borderColor: "rgba(196,163,90,0.2)" }}>
                        <span>Total</span><span className="font-mono" style={{ color: "var(--accent-primary)" }}>{c.finalScore}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 max-w-sm">
                    {overrides[c.id] ? (
                      <div className="rounded-xl p-4 border" style={{ background: "var(--accent-primary-bg)", borderColor: "rgba(196,163,90,0.3)" }}>
                        <h4 className="text-[11px] font-bold flex items-center gap-1.5 mb-2" style={{ color: "var(--accent-primary)" }}><UserCheck size={13}/> Override Recorded</h4>
                        <p className="text-[10px] italic px-3 py-2 rounded-lg" style={{ background: "var(--bg-card-alt)", color: "var(--text-secondary)" }}>"{overrides[c.id]}"</p>
                      </div>
                    ) : (
                      <div className="rounded-xl p-4 border" style={{ background: "var(--accent-rose-bg)", borderColor: "rgba(196,90,90,0.2)" }}>
                        <h4 className="text-[11px] font-bold flex items-center gap-1.5 mb-1" style={{ color: "var(--accent-rose)" }}><AlertCircle size={13}/> Committee Override</h4>
                        <p className="text-[9px] mb-2" style={{ color: "var(--text-muted)" }}>⚠ Recorded in the hash-chained audit log.</p>
                        <textarea value={reasons[c.id]||""} onChange={e=>setReasons(p=>({...p,[c.id]:e.target.value}))} placeholder="Mandatory justification…" className="w-full rounded-lg p-2 text-xs outline-none resize-none h-16 mb-2 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-card)", color: "var(--text-primary)" }} />
                        <button onClick={()=>doOverride(c.id)} className="w-full py-2 rounded-lg text-[11px] font-bold transition-colors" style={{ background: "var(--accent-rose)", color: "white" }}>Execute Override</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
