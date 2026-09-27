"use client";
import React, { useState } from "react";
import { FlaskConical, RefreshCw, ChevronRight, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const SIM_RESULTS = {
  entered: [
    { id: "NFST-991", name: "Ravi Kumar",   oldRank: 120, newRank: 42, reason: "Master score weight increased" },
    { id: "NFST-212", name: "Sunita Munda", oldRank: 85,  newRank: 22, reason: "Female slot count +10" },
    { id: "NFST-344", name: "Mohan Bheel",  oldRank: 102, newRank: 48, reason: "NET scale ceiling lowered" },
  ],
  exited: [
    { id: "NFST-045", name: "Vikram Singh", oldRank: 50,  newRank: 95, reason: "NET scale ceiling lowered" },
    { id: "NFST-078", name: "Anjali Oraon", oldRank: 63,  newRank: 88, reason: "Master score weight increased" },
  ],
};

export default function WhatIfSimulator() {
  const [net, setNet] = useState(50);
  const [master, setMaster] = useState(50);
  const [scaling, setScaling] = useState("percentile");
  const [divSlots, setDivSlots] = useState(38);
  const [pvtgSlots, setPvtgSlots] = useState(25);
  const [femSlots, setFemSlots] = useState(225);
  const [simming, setSimming] = useState(false);
  const [results, setResults] = useState<typeof SIM_RESULTS | null>(null);

  const run = () => { setSimming(true); setResults(null); setTimeout(()=>{ setResults(SIM_RESULTS); setSimming(false); }, 2000); };

  return (
    <div className="relative" style={{ color: "var(--text-primary)" }}>
      {/* Watermark */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 select-none" style={{ opacity: 0.03 }}>
        <h1 className="text-[8rem] font-black uppercase -rotate-12 tracking-widest whitespace-nowrap" style={{ color: "var(--accent-gold)" }}>SIMULATION</h1>
      </div>

      {/* Banner */}
      <div className="rounded-xl py-2 px-4 text-[10px] font-bold uppercase tracking-widest text-center mb-5 flex items-center justify-center gap-1.5 border" style={{ background: "var(--accent-gold-bg)", borderColor: "rgba(196,163,90,0.3)", color: "var(--accent-gold)" }}>
        <AlertTriangle size={12}/> Sandbox Mode — Not Applied to Production
      </div>

      <header className="relative z-10 mb-5 flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="text-xl font-extrabold flex items-center gap-2" style={{ color: "var(--accent-gold)" }}><FlaskConical size={22}/> What-If Simulator</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Modify weights & quotas safely. Measure displacement on synthetic data.</p>
        </div>
        <button onClick={run} disabled={simming} className="px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50" style={{ background: "var(--accent-gold)", color: "var(--bg-main)" }}>
          {simming ? <RefreshCw size={14} className="animate-spin"/> : <ChevronRight size={14}/>} {simming ? "Simulating…" : "Execute Simulation"}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 relative z-10">
        {/* Editor */}
        <div className="rounded-2xl p-5 border space-y-5" style={{ background: "var(--bg-card)", borderColor: "rgba(196,163,90,0.25)" }}>
          <h2 className="text-sm font-bold pb-2 border-b" style={{ color: "var(--accent-gold)", borderColor: "var(--border-card)" }}>Configuration Sandbox</h2>

          <div>
            <h3 className="text-[11px] font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Merit Formula Weights</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border" style={{ background: "var(--bg-card-alt)", borderColor: "var(--border-card)" }}>
                <label className="text-[10px] block mb-1" style={{ color: "var(--text-muted)" }}>NET Weight (%)</label>
                <input type="number" value={net} onChange={e=>setNet(Number(e.target.value))} className="w-full bg-transparent p-1 rounded text-base font-bold outline-none" style={{ color: "var(--accent-gold)" }} />
              </div>
              <div className="p-3 rounded-lg border" style={{ background: "var(--bg-card-alt)", borderColor: "var(--border-card)" }}>
                <label className="text-[10px] block mb-1" style={{ color: "var(--text-muted)" }}>Master's Weight (%)</label>
                <input type="number" value={master} onChange={e=>setMaster(Number(e.target.value))} className="w-full bg-transparent p-1 rounded text-base font-bold outline-none" style={{ color: "var(--accent-gold)" }} />
              </div>
            </div>
            {net+master!==100 && <p className="text-[10px] mt-1.5 flex items-center gap-1" style={{ color: "var(--accent-red)" }}><AlertTriangle size={10}/> Must sum to 100 (now {net+master})</p>}
          </div>

          <div>
            <h3 className="text-[11px] font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>NET Scaling Method</h3>
            <select value={scaling} onChange={e=>setScaling(e.target.value)} className="w-full p-2.5 rounded-lg text-xs outline-none border" style={{ background: "var(--bg-card-alt)", borderColor: "var(--border-card)", color: "var(--text-primary)" }}>
              <option value="percentile">Strict Percentile Normalization</option>
              <option value="zscore">Subject-Wise Z-Score (Proposed)</option>
              <option value="flat">Flat Ratio Extrapolation</option>
            </select>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Slot Allocations</h3>
            <div className="flex gap-2">
              {[{l:"Divyangjan",v:divSlots,s:setDivSlots},{l:"PVTG",v:pvtgSlots,s:setPvtgSlots},{l:"Female",v:femSlots,s:setFemSlots}].map(x=>(
                <div key={x.l} className="flex-1 p-2.5 rounded-lg border" style={{ background: "var(--bg-card-alt)", borderColor: "var(--border-card)" }}>
                  <label className="text-[9px] block mb-0.5" style={{ color: "var(--text-muted)" }}>{x.l}</label>
                  <input type="number" value={x.v} onChange={e=>x.s(Number(e.target.value))} className="w-full bg-transparent text-base font-bold outline-none" style={{ color: "var(--text-primary)" }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-2xl p-5 border flex flex-col" style={{ background: "var(--bg-card)", borderColor: "var(--border-card)" }}>
          <h2 className="text-sm font-bold mb-4 pb-2 border-b" style={{ borderColor: "var(--border-card)" }}>Top-N Displacement</h2>

          {!results && !simming && (
            <div className="flex-1 flex flex-col items-center justify-center" style={{ color: "var(--text-muted)" }}>
              <FlaskConical size={40} className="mb-3 opacity-20"/><p className="text-xs">Adjust parameters and execute simulation.</p>
            </div>
          )}

          {simming && (
            <div className="flex-1 flex flex-col items-center justify-center" style={{ color: "var(--accent-gold)" }}>
              <RefreshCw size={40} className="mb-3 animate-spin opacity-50"/><p className="text-xs font-bold animate-pulse">Computing cascades…</p>
            </div>
          )}

          {results && !simming && (
            <div className="flex-1 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl text-center border" style={{ background: "var(--accent-green-bg)", borderColor: "rgba(90,154,107,0.3)" }}>
                  <div className="text-xl font-extrabold" style={{ color: "var(--accent-green)" }}>{results.entered.length}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Newly Entered</div>
                </div>
                <div className="p-3 rounded-xl text-center border" style={{ background: "var(--accent-red-bg)", borderColor: "rgba(196,90,90,0.3)" }}>
                  <div className="text-xl font-extrabold" style={{ color: "var(--accent-red)" }}>{results.exited.length}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Pushed Out</div>
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-bold flex items-center gap-1.5 mb-2" style={{ color: "var(--accent-green)" }}><TrendingUp size={13}/> Entered</h3>
                <div className="space-y-1.5">
                  {results.entered.map(c=>(
                    <div key={c.id} className="p-2.5 rounded-lg flex justify-between items-center border" style={{ background: "var(--accent-green-bg)", borderColor: "rgba(90,154,107,0.2)" }}>
                      <div><div className="text-xs font-bold">{c.name}</div><div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{c.reason}</div></div>
                      <div className="text-right"><div className="text-[9px] line-through" style={{ color: "var(--text-muted)" }}>Rank {c.oldRank}</div><div className="text-xs font-mono font-bold" style={{ color: "var(--accent-green)" }}>Rank {c.newRank}</div></div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-bold flex items-center gap-1.5 mb-2" style={{ color: "var(--accent-red)" }}><TrendingDown size={13}/> Pushed Out</h3>
                <div className="space-y-1.5">
                  {results.exited.map(c=>(
                    <div key={c.id} className="p-2.5 rounded-lg flex justify-between items-center border" style={{ background: "var(--accent-red-bg)", borderColor: "rgba(196,90,90,0.2)" }}>
                      <div><div className="text-xs font-bold">{c.name}</div><div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{c.reason}</div></div>
                      <div className="text-right"><div className="text-[9px] line-through" style={{ color: "var(--text-muted)" }}>Rank {c.oldRank}</div><div className="text-xs font-mono font-bold" style={{ color: "var(--accent-red)" }}>Rank {c.newRank}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
