import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const incidentTrend = [
  { month: "Aug", open: 34, resolved: 28, critical: 6 },
  { month: "Sep", open: 41, resolved: 35, critical: 9 },
  { month: "Oct", open: 29, resolved: 38, critical: 4 },
  { month: "Nov", open: 52, resolved: 44, critical: 14 },
  { month: "Dec", open: 38, resolved: 50, critical: 7 },
  { month: "Jan", open: 45, resolved: 42, critical: 11 },
  { month: "Feb", open: 61, resolved: 55, critical: 18 },
  { month: "Mar", open: 48, resolved: 60, critical: 9 },
];

const categoryData = [
  { name: "Network",  value: 31 },
  { name: "Security", value: 24 },
  { name: "Hardware", value: 18 },
  { name: "Software", value: 15 },
  { name: "Access",   value: 12 },
];

const resolutionTime = [
  { category: "Network",  avgHours: 4.2 },
  { category: "Security", avgHours: 2.1 },
  { category: "Hardware", avgHours: 8.7 },
  { category: "Software", avgHours: 3.4 },
  { category: "Access",   avgHours: 1.6 },
];

const teamPerformance = [
  { team: "Alpha",   resolved: 87, sla: 92, response: 78 },
  { team: "Beta",    resolved: 74, sla: 81, response: 85 },
  { team: "Gamma",   resolved: 91, sla: 88, response: 90 },
  { team: "Delta",   resolved: 65, sla: 70, response: 72 },
  { team: "Epsilon", resolved: 83, sla: 86, response: 88 },
];

const weeklyVolume = [
  { day: "Mon", incidents: 18 },
  { day: "Tue", incidents: 24 },
  { day: "Wed", incidents: 31 },
  { day: "Thu", incidents: 22 },
  { day: "Fri", incidents: 29 },
  { day: "Sat", incidents: 11 },
  { day: "Sun", incidents: 7 },
];

const radarData = [
  { subject: "Detection",  A: 88 },
  { subject: "Response",   A: 74 },
  { subject: "Resolution", A: 91 },
  { subject: "Prevention", A: 63 },
  { subject: "Escalation", A: 82 },
  { subject: "Comm.",      A: 77 },
];

const P = {
  blue:   "#2563eb",
  rose:   "#e11d48",
  amber:  "#d97706",
  violet: "#7c3aed",
  green:  "#059669",
  grid:   "#f1f5f9",
  text:   "#94a3b8",
};

const PIE_COLORS = ["#2563eb", "#7c3aed", "#e11d48", "#d97706", "#059669"];

const KPIS = [
  { icon: "🚨", label: "Total Incidents", value: "347",  sub: "↑ 12% vs last period", color: P.rose,   bg: "#fff1f2" },
  { icon: "✅", label: "Resolved",        value: "298",  sub: "86% resolution rate",  color: P.green,  bg: "#f0fdf4" },
  { icon: "⚡", label: "Critical",        value: "23",   sub: "↓ 8% vs last period",  color: P.amber,  bg: "#fffbeb" },
  { icon: "⏱", label: "Avg. Resolution", value: "3.4h", sub: "SLA target: 4h",       color: P.blue,   bg: "#eff6ff" },
  { icon: "👥", label: "Teams Active",    value: "5",    sub: "All teams online",      color: P.violet, bg: "#f5f3ff" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
      padding: "10px 14px", fontSize: 12, color: "#1e293b",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    }}>
      <p style={{ color: P.blue, fontWeight: 700, margin: "0 0 6px" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: "3px 0", fontWeight: 500 }}>
          {p.name}: <strong style={{ color: "#0f172a" }}>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

function StatCard({ icon, label, value, sub, color, bg }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
      padding: "20px 22px", position: "relative", overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: color, borderRadius: "16px 16px 0 0",
      }} />
      <div style={{
        position: "absolute", bottom: -16, right: -16,
        width: 72, height: 72, borderRadius: "50%", background: bg,
      }} />
      <div style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 36, height: 36, borderRadius: 10, background: bg,
        fontSize: 18, marginBottom: 14,
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: 30, fontWeight: 800, color: "#0f172a",
        fontFamily: "'Space Mono', monospace", lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 5, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: 11, color, marginTop: 6, fontWeight: 600 }}>{sub}</div>}
    </div>
  );
}

function ChartCard({ title, subtitle, children, span = 1 }) {
  return (
    <div style={{
      gridColumn: `span ${span}`,
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
      padding: "22px 24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
    }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{title}</h3>
        {subtitle && (
          <p style={{ margin: "3px 0 0", fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500 }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function ReportsPage() {
  const [range, setRange] = useState("30d");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      color: "#1e293b",
      padding: "32px 36px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes livepulse {
          0%,100% { box-shadow: 0 0 0 3px rgba(5,150,105,0.3); }
          50%      { box-shadow: 0 0 0 6px rgba(5,150,105,0.08); }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%", background: P.green,
              animation: "livepulse 2s infinite",
            }} />
            <span style={{ fontSize: 10, color: P.green, fontFamily: "'Space Mono', monospace", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
              Live · Updated just now
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Operations Report
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>
            Incident coordination &amp; management · Mar 2026
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 2, background: "#f1f5f9", borderRadius: 10, padding: 3, border: "1px solid #e2e8f0" }}>
            {["7d", "30d", "90d", "1y"].map(r => (
              <button key={r} onClick={() => setRange(r)} style={{
                padding: "5px 14px", borderRadius: 7, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 600,
                background: range === r ? "#fff" : "transparent",
                color: range === r ? "#0f172a" : "#94a3b8",
                boxShadow: range === r ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s",
              }}>{r}</button>
            ))}
          </div>
          <button style={{
            padding: "8px 18px", borderRadius: 9, background: P.blue, border: "none",
            color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
            boxShadow: `0 2px 8px ${P.blue}40`,
          }}>
            ↓ Export
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 18 }}>
        {KPIS.map((k, i) => <StatCard key={i} {...k} />)}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>

        <ChartCard title="Incident Volume Trend" subtitle="Open · Resolved · Critical — Monthly" span={3}>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={incidentTrend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gOpen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={P.rose} stopOpacity={0.12} />
                  <stop offset="95%" stopColor={P.rose} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={P.blue} stopOpacity={0.12} />
                  <stop offset="95%" stopColor={P.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={P.grid} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: P.text, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: P.text, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
              <Legend wrapperStyle={{ fontSize: 11, color: P.text, paddingTop: 10 }} />
              <Area type="monotone" dataKey="open"     name="Open"     stroke={P.rose}  strokeWidth={2} fill="url(#gOpen)"     dot={false} />
              <Area type="monotone" dataKey="resolved" name="Resolved" stroke={P.blue}  strokeWidth={2} fill="url(#gResolved)" dot={false} />
              <Line type="monotone" dataKey="critical" name="Critical" stroke={P.amber} strokeWidth={2}
                dot={{ r: 3, fill: P.amber, strokeWidth: 0 }} strokeDasharray="5 3" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Incidents by Category" subtitle="Distribution this period">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%"
                innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value">
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: P.text }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Avg. Resolution Time" subtitle="Hours per category">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={resolutionTime} margin={{ top: 4, right: 4, bottom: 0, left: -24 }} barSize={18}>
              <CartesianGrid stroke={P.grid} vertical={false} />
              <XAxis dataKey="category" tick={{ fill: P.text, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: P.text, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
              <Bar dataKey="avgHours" name="Avg Hours" radius={[5, 5, 0, 0]}>
                {resolutionTime.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Operational Readiness" subtitle="Response · SLA · Resolution score">
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={78}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 10 }} />
              <Radar name="Score" dataKey="A" stroke={P.blue} fill={P.blue} fillOpacity={0.1} strokeWidth={2} />
              <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Incident Volume" subtitle="Incidents per day of week">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyVolume} margin={{ top: 4, right: 4, bottom: 0, left: -24 }} barSize={24}>
              <CartesianGrid stroke={P.grid} vertical={false} />
              <XAxis dataKey="day" tick={{ fill: P.text, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: P.text, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="incidents" name="Incidents" fill={P.violet} radius={[5, 5, 0, 0]}
                background={{ fill: "#f8fafc", radius: 5 }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Team Performance Metrics" subtitle="Resolved · SLA compliance · Response speed" span={2}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={teamPerformance} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barSize={10} barGap={3}>
              <CartesianGrid stroke={P.grid} vertical={false} />
              <XAxis dataKey="team" tick={{ fill: P.text, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: P.text, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: P.text, paddingTop: 10 }} />
              <Bar dataKey="resolved" name="Resolved %" fill={P.blue}   radius={[3, 3, 0, 0]} />
              <Bar dataKey="sla"      name="SLA %"       fill={P.violet} radius={[3, 3, 0, 0]} />
              <Bar dataKey="response" name="Response %"  fill={P.green}  radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* Footer */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 10, color: "#cbd5e1", fontFamily: "'Space Mono', monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Incident Command · Reports Module · v2.4.1
        </p>
        <p style={{ fontSize: 11, color: "#cbd5e1" }}>© 2026 Ops Team</p>
      </div>
    </div>
  );
}