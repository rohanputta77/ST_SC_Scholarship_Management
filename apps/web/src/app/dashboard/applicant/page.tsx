"use client";
import React, { useState } from 'react';
import { 
  User, CheckCircle2, FileText, AlertCircle, Clock, FileKey, ShieldCheck, Download, LogOut, ChevronRight, Activity
} from 'lucide-react';
import ThemeSwitcher from "@/components/ThemeSwitcher";


const TRACKER_STEPS = [
  { id: 'submitted', label: 'Application Submitted', date: '10 Aug, 2025', status: 'completed' },
  { id: 'institute', label: 'Institute Verification', date: '12 Aug, 2025', status: 'completed' },
  { id: 'scrutiny', label: 'Scrutiny Officer', date: '18 Aug, 2025', status: 'current' },
  { id: 'selection', label: 'Selection Committee', date: 'Pending', status: 'pending' },
  { id: 'pfms', label: 'PFMS Sanction', date: 'Pending', status: 'pending' },
];

const AshokaChakra = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} fill="none" stroke="currentColor">
    <circle cx="50" cy="50" r="46" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="38" strokeWidth="0.5" strokeDasharray="1 3" opacity="0.6" />
    <circle cx="50" cy="50" r="6" fill="currentColor" />
    {Array.from({ length: 24 }).map((_, i) => (
      <line key={i} x1="50" y1="50" x2="50" y2="6" strokeWidth="1.2" strokeLinecap="round" transform={`rotate(${i * 15} 50 50)`} />
    ))}
  </svg>
);

export default function ApplicantPortal() {
  const [activeTab, setActiveTab] = useState<'status' | 'documents'>('status');

  const logout = () => {
    document.cookie = `user_role=; path=/; max-age=0`;
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen font-sans overflow-hidden relative transition-colors duration-500" style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}>
      
      {/* ── BACKGROUND AURORA (Matching Landing Page) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen" style={{ opacity: "var(--aurora-opacity)" }}>
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px] animate-pulse"
             style={{ background: 'radial-gradient(circle, rgba(255,153,51,0.15) 0%, transparent 70%)' }} />
        <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full blur-[100px] animate-pulse"
             style={{ background: 'radial-gradient(circle, rgba(0,82,163,0.15) 0%, transparent 70%)', animationDelay: '2s' }} />
      </div>

      {/* ── TOP APP BAR ── */}
      <header className="relative z-50 backdrop-blur-md border-b sticky top-0 transition-colors duration-500"
              style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <AshokaChakra className="w-8 h-8 animate-[spin_20s_linear_infinite]" style={{ color: "var(--accent-primary)" }} />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>Ministry of Tribal Affairs</span>
              <span className="text-sm font-black tracking-tight" style={{ color: "var(--text-primary)" }}>Applicant Terminal</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 border rounded-full shadow-sm"
                 style={{ background: "var(--accent-green-bg)", borderColor: "var(--accent-green)" }}>
              <ShieldCheck size={14} style={{ color: "var(--accent-green)" }} />
              <span className="text-xs font-bold" style={{ color: "var(--accent-green)" }}>Aadhaar Verified</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              
              <div className="h-6 w-[1px]" style={{ background: "var(--border-subtle)" }}></div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Rohan Putta</p>
                  <p className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>ID: NFST25-9982</p>
                </div>
                <button onClick={logout} className="p-2 rounded-full transition-colors hover:opacity-80" style={{ color: "var(--text-muted)", background: "var(--bg-main)" }}>
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex gap-8">
        
        {/* SIDEBAR */}
        <aside className="w-64 shrink-0 space-y-2 sticky top-24">
          <button 
            onClick={() => setActiveTab('status')}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all border-l-2`}
            style={{ 
              background: activeTab === 'status' ? 'var(--bg-card)' : 'transparent',
              borderColor: activeTab === 'status' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'status' ? 'var(--text-primary)' : 'var(--text-muted)'
            }}
          >
            <div className="flex items-center gap-3"><Activity size={18} /> Telemetry & Status</div>
            {activeTab === 'status' && <ChevronRight size={16} style={{ color: "var(--accent-primary)" }} />}
          </button>
          
          <button 
            onClick={() => setActiveTab('documents')}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all border-l-2`}
            style={{ 
              background: activeTab === 'documents' ? 'var(--bg-card)' : 'transparent',
              borderColor: activeTab === 'documents' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'documents' ? 'var(--text-primary)' : 'var(--text-muted)'
            }}
          >
            <div className="flex items-center gap-3"><FileKey size={18} /> Encrypted Vault</div>
            {activeTab === 'documents' && <ChevronRight size={16} style={{ color: "var(--accent-primary)" }} />}
          </button>

          <div className="mt-8 p-4 border rounded-xl backdrop-blur-md"
               style={{ background: "var(--accent-orange-bg)", borderColor: "var(--border-subtle)" }}>
            <div className="flex items-start gap-3">
              <AlertCircle size={16} className="mt-0.5 shrink-0" style={{ color: "var(--accent-orange)" }} />
              <p className="text-xs font-medium leading-relaxed" style={{ color: "var(--text-primary)" }}>
                Application locked. Scrutiny in progress. Edits are disabled until further notice.
              </p>
            </div>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 min-w-0 space-y-6">
          
          {activeTab === 'status' && (
            <>
              {/* High-Tech Status Header */}
              <div className="backdrop-blur-xl border rounded-2xl p-6 relative overflow-hidden group transition-colors duration-500"
                   style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000" style={{ background: "var(--accent-orange)" }}></div>
                <div className="absolute left-0 top-0 bottom-0 w-1 shadow-sm" style={{ background: "var(--accent-orange)" }}></div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3" style={{ color: "var(--text-primary)" }}>
                      STATUS: SCRUTINY
                    </h2>
                    <p className="text-sm mt-1 font-mono" style={{ color: "var(--text-muted)" }}>LST_UPDATED: 18 AUG 2025 10:45:00 UTC</p>
                  </div>
                  <div className="px-4 py-2 rounded-lg border font-mono text-sm flex items-center gap-2 shadow-sm"
                       style={{ background: "var(--bg-main)", borderColor: "var(--border-subtle)", color: "var(--accent-primary)" }}>
                    <Clock size={16} className="animate-spin-slow" />
                    PROCESSING
                  </div>
                </div>
              </div>

              {/* Journey Stepper */}
              <div className="backdrop-blur-xl border rounded-2xl p-8 relative transition-colors duration-500"
                   style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
                <h3 className="text-sm font-black tracking-widest uppercase mb-8 pb-4 border-b"
                    style={{ color: "var(--text-muted)", borderColor: "var(--border-subtle)" }}>Audit Trail</h3>
                
                <div className="relative">
                  <div className="absolute left-[21px] top-4 bottom-4 w-[1px]" style={{ background: "var(--border-subtle)" }}></div>
                  
                  <div className="space-y-8">
                    {TRACKER_STEPS.map((step, index) => (
                      <div key={step.id} className="relative flex items-start gap-6">
                        
                        {/* Stepper Node */}
                        <div className={`relative z-10 w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-500`}
                             style={{ 
                               background: step.status === 'completed' ? "var(--bg-main)" : step.status === 'current' ? "var(--bg-main)" : "var(--bg-card)",
                               borderColor: step.status === 'completed' ? "var(--accent-green)" : step.status === 'current' ? "var(--accent-primary)" : "var(--border-subtle)",
                               color: step.status === 'completed' ? "var(--accent-green)" : step.status === 'current' ? "var(--accent-primary)" : "var(--text-muted)"
                             }}>
                          {step.status === 'completed' ? <CheckCircle2 size={18} /> : 
                           step.status === 'current' ? <Activity size={18} className="animate-pulse" /> : 
                           <span className="font-mono text-sm font-bold">0{index + 1}</span>}
                        </div>

                        {/* Details */}
                        <div className="flex-1 pt-1.5">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className={`text-lg font-bold tracking-tight`} style={{ color: step.status === 'pending' ? "var(--text-muted)" : "var(--text-primary)" }}>
                              {step.label}
                            </h4>
                            <span className={`text-[10px] font-mono tracking-widest px-2 py-1 rounded border`}
                                  style={{
                                    background: "var(--bg-main)",
                                    borderColor: step.status === 'completed' ? "var(--accent-green)" : step.status === 'current' ? "var(--accent-primary)" : "var(--border-subtle)",
                                    color: step.status === 'completed' ? "var(--accent-green)" : step.status === 'current' ? "var(--accent-primary)" : "var(--text-muted)"
                                  }}>
                              {step.date}
                            </span>
                          </div>
                          
                          {/* Event Payloads */}
                          {step.id === 'institute' && step.status === 'completed' && (
                            <div className="border rounded-lg p-3 mt-2 inline-block" style={{ background: "var(--bg-main)", borderColor: "var(--border-subtle)" }}>
                              <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                                VERIFIED_BY: <span style={{ color: "var(--text-primary)" }}>DR. A. SHARMA (IIT DELHI)</span> <br/>
                                HASH: <span>0x8F9A2...B14C</span>
                              </p>
                            </div>
                          )}
                          {step.id === 'scrutiny' && step.status === 'current' && (
                            <div className="border rounded-lg p-3 mt-2 inline-block" style={{ background: "var(--bg-main)", borderColor: "var(--border-subtle)" }}>
                              <p className="text-xs font-mono flex items-center gap-2" style={{ color: "var(--accent-primary)" }}>
                                <Activity size={12} className="animate-pulse" />
                                INITIATING DIGILOCKER HANDSHAKE...
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'documents' && (
            <div className="backdrop-blur-xl border rounded-2xl p-8 relative transition-colors duration-500"
                 style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
              <h3 className="text-sm font-black tracking-widest uppercase mb-8 pb-4 border-b"
                  style={{ color: "var(--text-muted)", borderColor: "var(--border-subtle)" }}>Encrypted Document Vault</h3>
              
              <div className="grid gap-3">
                {[
                  { name: 'Aadhaar Core Identity', source: 'UIDAI e-KYC API', verified: true },
                  { name: 'Caste Validation Token', source: 'DigiLocker Auth', verified: true },
                  { name: 'PG Degree Certificate', source: 'Manual IPFS Upload', verified: false },
                  { name: 'NET Score Vector', source: 'NTA Secure API', verified: true }
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border transition-all hover:scale-[1.01]"
                       style={{ background: "var(--bg-main)", borderColor: "var(--border-subtle)" }}>
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-lg border`}
                           style={{
                             background: doc.verified ? "var(--bg-card)" : "var(--bg-main)",
                             borderColor: doc.verified ? "var(--accent-green)" : "var(--border-subtle)",
                             color: doc.verified ? "var(--accent-green)" : "var(--text-muted)"
                           }}>
                        {doc.verified ? <ShieldCheck size={18} /> : <FileText size={18} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold font-mono tracking-tight" style={{ color: "var(--text-primary)" }}>{doc.name}</h4>
                        <p className="text-[10px] font-mono mt-0.5 tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>SRC: {doc.source}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {doc.verified ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--accent-green)" }}>
                          <CheckCircle2 size={12} /> SECURE
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase animate-pulse" style={{ color: "var(--accent-orange)" }}>
                          <Clock size={12} /> PENDING
                        </span>
                      )}
                      
                      <button className="transition-colors p-2 rounded-lg hover:opacity-80" style={{ color: "var(--text-muted)", background: "var(--bg-card)" }}>
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
