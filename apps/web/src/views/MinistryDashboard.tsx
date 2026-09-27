"use client";
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, ComposedChart, Line,
} from "recharts";
import { AlertCircle, MapPin, Users, Activity, BarChart2, Clock, TrendingUp } from "lucide-react";

const FUNNEL = [
  { stage: "Draft",     nfst: 1247, nos: 312, drop: 0 },
  { stage: "Submitted", nfst: 1100, nos: 280, drop: 12 },
  { stage: "Institute", nfst: 920,  nos: 248, drop: 16 },
  { stage: "Ministry",  nfst: 710,  nos: 201, drop: 23 },
  { stage: "Selected",  nfst: 500,  nos: 150, drop: 30 },
  { stage: "Awarded",   nfst: 480,  nos: 142, drop: 4 },
];
const SLOTS = [
  { bucket: "ST General",   filled: 312, total: 450 },
  { bucket: "PVTG",         filled: 20,  total: 25 },
  { bucket: "Divyangjan",   filled: 22,  total: 38 },
  { bucket: "Female (30%)", filled: 146, total: 225 },
];
const FAIRNESS = [
  { attr: "Female",     sel: 48, rej: 52 },
  { attr: "Male",       sel: 42, rej: 58 },
  { attr: "PVTG",       sel: 80, rej: 20 },
  { attr: "Divyangjan", sel: 58, rej: 42 },
];
const AGING = [
  { bucket: "0–3d",  inst: 320, min: 180 },
  { bucket: "3–7d",  inst: 210, min: 140 },
  { bucket: "7–15d", inst: 90,  min: 65 },
  { bucket: "15d+",  inst: 40,  min: 22 },
];
const SLA = [
  { name: "Ranchi University",     avg: 22, count: 18 },
  { name: "IGNOU RC-Delhi",        avg: 19, count: 14 },
  { name: "Sambalpur University",  avg: 17, count: 11 },
  { name: "NE Hill University",    avg: 15, count: 8 },
  { name: "BHU",                   avg: 12, count: 5 },
];
const KPIS = [
  { label: "Total Applications", value: "1,559",  prev: "1,423", pct: "+9.55%",  up: true,  color: "var(--accent-teal)" },
  { label: "Awarded",            value: "622",     prev: "580",   pct: "+7.24%",  up: true,  color: "var(--accent-green)" },
  { label: "STP Rate",           value: "95.2%",   prev: "93.8%", pct: "+1.49%",  up: true,  color: "var(--accent-blue)" },
  { label: "SLA Breaches",       value: "56",      prev: "61",    pct: "−8.20%",  up: false, color: "var(--accent-rose)" },
  { label: "Fraud Flags",        value: "12",      prev: "18",    pct: "−33.3%",  up: false, color: "var(--accent-orange)" },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl p-4 border ${className}`} style={{ background: "var(--bg-card)", borderColor: "var(--border-card)" }}>{children}</div>;
}

const tt = { backgroundColor: "#1a1f2b", border: "1px solid #232a38", borderRadius: 8, color: "#f0ede8", fontSize: 11 };

export default function MinistryDashboard() {
  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {KPIS.map((k) => (
          <Card key={k.label} className="min-w-[170px] flex-1">
            <p className="text-[10px] font-medium mb-2 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{k.label}</p>
            <div className="flex items-end justify-between gap-2">
              <span className="text-xl font-extrabold tracking-tight">{k.value}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: k.up ? "var(--accent-green-bg)" : "var(--accent-rose-bg)", color: k.up ? "var(--accent-green)" : "var(--accent-rose)" }}>
                {k.pct}
              </span>
            </div>
            <p className="text-[9px] mt-1" style={{ color: "var(--text-muted)" }}>vs {k.prev}</p>
          </Card>
        ))}
      </div>

      {/* Funnel + Slots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold flex items-center gap-1.5"><Activity size={14} style={{ color: "var(--accent-teal)" }} /> Lifecycle Funnel</h2>
            <span className="text-[9px] px-2 py-0.5 rounded" style={{ background: "var(--bg-card-alt)", color: "var(--text-muted)" }}>Both Schemes</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={FUNNEL}>
                <XAxis dataKey="stage" stroke="#5c6275" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#5c6275" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tt} />
                <Legend iconSize={6} wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="nfst" fill="#5aada8" name="NFST" radius={[4,4,0,0]} />
                <Bar dataKey="nos"  fill="#6b8cce" name="NOS"  radius={[4,4,0,0]} />
                <Line type="monotone" dataKey="drop" stroke="#c47272" strokeWidth={2} name="Drop-off %" dot={{ r: 3, fill: "#c47272" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="text-xs font-bold flex items-center gap-1.5 mb-3"><Users size={14} style={{ color: "var(--accent-teal)" }} /> Slot Utilization</h2>
          <div className="space-y-4">
            {SLOTS.map((s) => {
              const pct = Math.round((s.filled / s.total) * 100);
              const c = pct >= 90 ? "var(--accent-green)" : pct >= 50 ? "var(--accent-teal)" : "var(--accent-orange)";
              return (
                <div key={s.bucket}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-medium">{s.bucket}</span>
                    <span className="font-bold" style={{ color: c }}>{s.filled}/{s.total}</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: "var(--bg-card-alt)" }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: c }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Map + Fairness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="h-64 flex flex-col">
          <h2 className="text-xs font-bold flex items-center gap-1.5 mb-2"><MapPin size={14} style={{ color: "var(--accent-teal)" }} /> Geographic Distribution</h2>
          <div className="flex-1 rounded-lg flex flex-col items-center justify-center relative overflow-hidden" style={{ background: "var(--bg-card-alt)" }}>
            <MapPin size={32} className="mb-2" style={{ color: "var(--text-muted)", opacity: 0.2 }} />
            <p className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>SOI-Compliant Choropleth</p>
            <p className="text-[9px] mt-0.5 text-center max-w-[180px]" style={{ color: "var(--text-muted)", opacity: 0.6 }}>Requires MapTiler key</p>
            <div className="absolute top-4 left-8 w-16 h-16 rounded-full blur-3xl" style={{ background: "rgba(90,173,168,0.06)" }} />
            <div className="absolute bottom-4 right-8 w-20 h-20 rounded-full blur-3xl" style={{ background: "rgba(107,140,206,0.06)" }} />
          </div>
        </Card>

        <Card className="h-64 flex flex-col">
          <h2 className="text-xs font-bold flex items-center gap-1.5 mb-1"><BarChart2 size={14} style={{ color: "var(--accent-teal)" }} /> Fairness Panel</h2>
          <p className="text-[9px] mb-2" style={{ color: "var(--text-muted)" }}>Selection vs Rejection by attribute</p>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FAIRNESS} layout="vertical">
                <XAxis type="number" stroke="#5c6275" fontSize={9} domain={[0,100]} tickLine={false} axisLine={false} />
                <YAxis dataKey="attr" type="category" stroke="#5c6275" width={75} fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tt} />
                <Legend iconSize={6} wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="sel" stackId="a" fill="#6ba87a" name="Selected %" radius={[0,3,3,0]} />
                <Bar dataKey="rej" stackId="a" fill="#c47272" name="Rejected %" radius={[0,3,3,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Aging + SLA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-xs font-bold flex items-center gap-1.5 mb-3"><Clock size={14} style={{ color: "var(--accent-teal)" }} /> Pendency Aging</h2>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AGING}>
                <XAxis dataKey="bucket" stroke="#5c6275" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#5c6275" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tt} />
                <Legend iconSize={6} wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="inst" fill="#c9a96e" name="Institute" radius={[3,3,0,0]} />
                <Bar dataKey="min" fill="#c49a5a" name="Ministry" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="text-xs font-bold flex items-center gap-1.5 mb-3" style={{ color: "var(--accent-rose)" }}><AlertCircle size={14} /> SLA Breaches</h2>
          <table className="w-full text-[11px]">
            <thead><tr style={{ color: "var(--text-muted)" }}><th className="text-left p-1.5 font-medium">Institute</th><th className="text-center p-1.5 font-medium">Avg Days</th><th className="text-right p-1.5 font-medium">Count</th></tr></thead>
            <tbody>
              {SLA.map((r, i) => (
                <tr key={i} className="border-t" style={{ borderColor: "var(--border-subtle)", background: i < 3 ? "var(--accent-rose-bg)" : "transparent" }}>
                  <td className="p-1.5 font-medium">{r.name}</td>
                  <td className="p-1.5 text-center" style={{ color: "var(--text-secondary)" }}>{r.avg}</td>
                  <td className="p-1.5 text-right font-bold" style={{ color: "var(--accent-rose)" }}>{r.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
