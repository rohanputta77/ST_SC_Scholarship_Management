"use client";
import React, { useState } from "react";
import { Settings, Save, FileText, Beaker, Plus, Trash2, CheckCircle } from "lucide-react";

type DocReq = { name: string; mode: "Mandatory"|"Conditional"|"Optional" };
const INIT_DOCS: DocReq[] = [
  { name: "ST / PVTG Certificate", mode: "Mandatory" },
  { name: "Income Certificate", mode: "Conditional" },
  { name: "10th Marksheet (for DOB)", mode: "Mandatory" },
  { name: "Admission Letter", mode: "Mandatory" },
  { name: "Bank Passbook (first page)", mode: "Mandatory" },
  { name: "Disability Certificate", mode: "Conditional" },
];

export default function SchemeStudio({ onAction }: { onAction?: (msg: string) => void }) {
  const [docs, setDocs] = useState<DocReq[]>(INIT_DOCS);
  const [newDoc, setNewDoc] = useState("");
  const [effDate, setEffDate] = useState("");
  const [saved, setSaved] = useState(false);

  const addDoc = () => { if (!newDoc.trim()) return; setDocs(p=>[...p,{name:newDoc.trim(),mode:"Mandatory"}]); setNewDoc(""); };
  const rmDoc = (i: number) => setDocs(p=>p.filter((_,j)=>j!==i));
  const chMode = (i: number, m: DocReq["mode"]) => setDocs(p=>p.map((d,j)=>j===i?{...d,mode:m}:d));

  const save = () => {
    if (!effDate) { alert("Set an Effective From date first."); return; }
    setSaved(true);
    onAction?.(`New scheme version saved — effective ${effDate}. Immutable; in-flight apps unaffected.`);
    setTimeout(()=>setSaved(false), 4000);
  };

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <header className="mb-5">
        <h1 className="text-xl font-extrabold flex items-center gap-2" style={{ color: "#d48edb" }}><Settings size={22}/> Scheme Studio</h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Edit checklists, rules & quotas. Every save creates an immutable new version.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Doc checklist */}
        <div className="rounded-2xl p-5 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-card)" }}>
          <h2 className="text-sm font-bold flex items-center gap-2 mb-3"><FileText size={15} style={{ color: "#d48edb" }}/> Document Checklist</h2>
          <div className="space-y-1.5 mb-3">
            {docs.map((d, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg border group" style={{ background: "var(--bg-card-alt)", borderColor: "var(--border-card)" }}>
                <span className="flex-1 text-xs">{d.name}</span>
                <select value={d.mode} onChange={e=>chMode(i,e.target.value as DocReq["mode"])} className="rounded px-2 py-0.5 text-[10px] outline-none border" style={{ background: "var(--bg-card)", borderColor: "var(--border-card)", color: "var(--text-primary)" }}>
                  <option>Mandatory</option><option>Conditional</option><option>Optional</option>
                </select>
                <button onClick={()=>rmDoc(i)} className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-opacity" style={{ color: "var(--accent-red)" }}><Trash2 size={12}/></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newDoc} onChange={e=>setNewDoc(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addDoc()} placeholder="Add document type…" className="flex-1 px-3 py-1.5 rounded-lg text-xs outline-none border" style={{ background: "var(--bg-card-alt)", borderColor: "var(--border-card)", color: "var(--text-primary)" }} />
            <button onClick={addDoc} className="px-2.5 py-1.5 rounded-lg transition-colors" style={{ background: "#d48edb", color: "var(--bg-main)" }}><Plus size={14}/></button>
          </div>
        </div>

        {/* Rules + Weights */}
        <div className="rounded-2xl p-5 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-card)" }}>
          <h2 className="text-sm font-bold flex items-center gap-2 mb-3"><Beaker size={15} style={{ color: "#d48edb" }}/> Eligibility Rules (JSON Logic)</h2>
          <textarea className="w-full rounded-lg p-3 font-mono text-[10px] outline-none resize-none h-32 border" style={{ background: "var(--bg-card-alt)", borderColor: "var(--border-card)", color: "var(--accent-olive)" }} defaultValue={JSON.stringify({and:[{"<=":[{var:"age"},36]},{">=":[{var:"marks_percent"},55]},{in:[{var:"community"},{var:"approved_st_list"}]}]},null,2)} />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border" style={{ background: "var(--bg-card-alt)", borderColor: "var(--border-card)" }}>
              <p className="text-[10px] mb-1" style={{ color: "var(--text-muted)" }}>NET Weight (%)</p>
              <input type="number" defaultValue={50} className="w-full bg-transparent text-lg font-bold outline-none" style={{ color: "#d48edb" }} />
            </div>
            <div className="p-3 rounded-lg border" style={{ background: "var(--bg-card-alt)", borderColor: "var(--border-card)" }}>
              <p className="text-[10px] mb-1" style={{ color: "var(--text-muted)" }}>Master's Weight (%)</p>
              <input type="number" defaultValue={50} className="w-full bg-transparent text-lg font-bold outline-none" style={{ color: "#d48edb" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="rounded-2xl p-5 flex flex-wrap justify-between items-center gap-4 border transition-colors" style={{ background: saved ? "var(--accent-green-bg)" : "rgba(212,142,219,0.08)", borderColor: saved ? "rgba(90,154,107,0.3)" : "rgba(212,142,219,0.25)" }}>
        <div>
          <h3 className="text-sm font-bold" style={{ color: saved ? "var(--accent-green)" : "#d48edb" }}>{saved ? "✓ Version Saved" : "Deploy Configuration"}</h3>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{saved ? "In-flight applications retain original version." : "Creates NEW immutable scheme_version row."}</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" value={effDate} onChange={e=>setEffDate(e.target.value)} className="px-3 py-1.5 rounded-lg text-xs outline-none border" style={{ background: "var(--bg-card-alt)", borderColor: "var(--border-card)", color: "var(--text-primary)" }} />
          <button onClick={save} disabled={saved} className="px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all" style={{ background: saved ? "var(--accent-green)" : "#d48edb", color: "white", opacity: saved ? 0.7 : 1 }}>
            {saved ? <CheckCircle size={14}/> : <Save size={14}/>} {saved ? "Saved" : "Save as New Version"}
          </button>
        </div>
      </div>
    </div>
  );
}
