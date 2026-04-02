import { useState, useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface CompanyForm {
  name: string;
  logo: File | null;
}

interface UserForm {
  name: string;
  email: string;
  role: string;
  team: string;
  password: string;
}

type Step = "landing" | "register-company" | "register-user" | "done";

// ─── Constants ────────────────────────────────────────────────────────────────
const ROLES = ["Admin", "Supervisor", "Responder", "Witness"];
const INDUSTRIES = [
  { icon: "⚓", label: "Port & Shipping" },
  { icon: "🏗️", label: "Construction" },
  { icon: "🏭", label: "Manufacturing" },
  { icon: "⛏️", label: "Mining" },
  { icon: "✈️", label: "Aviation" },
  { icon: "🏥", label: "Healthcare" },
  { icon: "⚡", label: "Energy & Utilities" },
  { icon: "🚛", label: "Logistics" },
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Real-Time Incident Reporting",
    desc: "Capture and broadcast incidents the moment they happen — no delays, no missed alerts.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    title: "Live Map & Tracking",
    desc: "See every responder and vehicle in motion on a live map. Assign, dispatch, and monitor seamlessly.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    title: "Kanban Workflow",
    desc: "Drag incidents from Open → In Progress → Resolved with full audit trails and accountability.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    title: "Analytics & Reporting",
    desc: "Trend charts, response-time metrics, and exportable reports to satisfy any compliance requirement.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Role-Based Access",
    desc: "Dock worker to admin — every role sees only what they need. Secure, scoped, and compliant.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Instant Notifications",
    desc: "Critical incidents trigger real-time alerts across all connected devices — zero lag, maximum response.",
  },
];

const STATS = [
  { value: "< 30s", label: "Average alert delivery" },
  { value: "99.9%", label: "Platform uptime" },
  { value: "6", label: "Incident categories" },
  { value: "4", label: "Role tiers supported" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavBar({ onGetStarted }: { onGetStarted: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-lime-100" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-4 h-4">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="font-black text-xl tracking-tight text-gray-900" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
            Safe<span className="text-lime-500">Zone</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "Industries", "How it works"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm font-medium text-gray-600 hover:text-lime-600 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="text-sm font-semibold text-gray-700 hover:text-lime-600 transition-colors px-3 py-1.5">
            Sign in
          </button>
          <button
            onClick={onGetStarted}
            className="text-sm font-bold bg-lime-400 hover:bg-lime-500 text-gray-900 px-5 py-2 rounded-full transition-all hover:shadow-md hover:shadow-lime-200 active:scale-95"
          >
            Get started free
          </button>
        </div>
      </div>
    </nav>
  );
}

function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-16">
      {/* Background grid + blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#84cc16 1px, transparent 1px), linear-gradient(90deg, #84cc16 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-20 -right-32 w-[600px] h-[600px] rounded-full bg-lime-100 blur-3xl opacity-60" />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-lime-50 blur-3xl opacity-80" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 bg-lime-50 border border-lime-200 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
            <span className="text-xs font-semibold text-lime-700 uppercase tracking-widest">Live incident management</span>
          </div>

          <h1
            className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] text-gray-900 mb-6"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Incident control
            <br />
            <span className="text-lime-500">for the field,</span>
            <br />
            in real time.
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-lg">
            SafeZone gives any high-risk operation — ports, construction sites, factories, mines — a single platform to report, dispatch, track, and resolve incidents before they escalate.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onGetStarted}
              className="group flex items-center gap-2 bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold text-base px-8 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-lime-200 active:scale-95"
            >
              Register your company
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 transition-transform group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className="flex items-center gap-2 text-gray-700 font-semibold text-sm hover:text-lime-600 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-700">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              Watch demo
            </button>
          </div>

          {/* Stats strip */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-gray-100">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-black text-gray-900" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                  {s.value}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right – mock dashboard card */}
        <div className="hidden lg:block relative">
          <div className="relative bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/80 overflow-hidden p-6">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Live incidents</p>
                <p className="text-xl font-black text-gray-900">Today's Overview</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-lime-700 bg-lime-50 border border-lime-200 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
                Live
              </span>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              {[
                { label: "Open", val: 4, color: "bg-amber-50 text-amber-700 border-amber-200" },
                { label: "Active", val: 7, color: "bg-blue-50 text-blue-700 border-blue-200" },
                { label: "Critical", val: 2, color: "bg-red-50 text-red-700 border-red-200" },
                { label: "Resolved", val: 18, color: "bg-lime-50 text-lime-700 border-lime-200" },
              ].map((c) => (
                <div key={c.label} className={`rounded-xl border p-3 ${c.color}`}>
                  <p className="text-xl font-black">{c.val}</p>
                  <p className="text-xs font-medium opacity-80">{c.label}</p>
                </div>
              ))}
            </div>

            {/* Fake incident rows */}
            <div className="space-y-2">
              {[
                { id: "#1042", title: "Crane hydraulic fault", sev: "Critical", status: "Active", ago: "2m ago", sevColor: "bg-red-100 text-red-700" },
                { id: "#1041", title: "Cargo spill – Dock 7B", sev: "High", status: "In Progress", ago: "11m ago", sevColor: "bg-orange-100 text-orange-700" },
                { id: "#1040", title: "Unauthorized gate entry", sev: "Medium", status: "Open", ago: "23m ago", sevColor: "bg-yellow-100 text-yellow-700" },
                { id: "#1039", title: "Forklift battery failure", sev: "Low", status: "Resolved", ago: "1h ago", sevColor: "bg-gray-100 text-gray-600" },
              ].map((row) => (
                <div key={row.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-lime-50 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth={2} className="w-4 h-4">
                      <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{row.title}</p>
                    <p className="text-xs text-gray-400">{row.id} · {row.ago}</p>
                  </div>
                  <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${row.sevColor}`}>{row.sev}</span>
                </div>
              ))}
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          </div>

          {/* Floating badge */}
          <div className="absolute -top-4 -left-4 bg-lime-400 text-gray-900 text-xs font-black px-4 py-2 rounded-full shadow-lg rotate-[-3deg]">
            ⚡ Real-time updates
          </div>
          <div className="absolute -bottom-4 -right-4 bg-white border border-gray-100 shadow-lg rounded-2xl px-4 py-3">
            <p className="text-xs text-gray-400 font-medium">Responders on map</p>
            <p className="text-xl font-black text-gray-900">12 <span className="text-lime-500 text-sm font-bold">active</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}

function IndustriesSection() {
  return (
    <section id="industries" className="py-16 bg-lime-50 border-y border-lime-100">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-bold text-lime-600 uppercase tracking-widest mb-6">Built for high-risk industries</p>
        <div className="flex flex-wrap justify-center gap-3">
          {INDUSTRIES.map((ind) => (
            <div
              key={ind.label}
              className="flex items-center gap-2 bg-white border border-lime-200 rounded-full px-5 py-2.5 shadow-sm hover:shadow-md hover:border-lime-400 transition-all cursor-default"
            >
              <span className="text-lg">{ind.icon}</span>
              <span className="text-sm font-semibold text-gray-700">{ind.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-lime-600 uppercase tracking-widest mb-3">Everything you need</p>
          <h2
            className="text-4xl lg:text-5xl font-black text-gray-900"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            One platform. Total situational awareness.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="group p-7 rounded-2xl border border-gray-100 hover:border-lime-300 hover:shadow-lg hover:shadow-lime-50 transition-all bg-white"
            >
              <div className="w-12 h-12 rounded-xl bg-lime-50 group-hover:bg-lime-100 flex items-center justify-center text-lime-600 mb-5 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { num: "01", title: "Register your company", desc: "Set up your organisation in under 2 minutes. Upload your logo, name your workspace." },
    { num: "02", title: "Add your admin account", desc: "Create the first admin user who can invite, assign roles, and configure teams." },
    { num: "03", title: "Invite your team", desc: "Add dock workers, supervisors, responders — each with role-appropriate access." },
    { num: "04", title: "Go live", desc: "Start reporting incidents, tracking responders, and resolving issues in real time." },
  ];

  return (
    <section id="how-it-works" className="py-28 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-lime-400 uppercase tracking-widest mb-3">Simple onboarding</p>
          <h2
            className="text-4xl lg:text-5xl font-black text-white"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Up and running in minutes.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="relative p-7 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-lime-500/30 transition-all group">
              <p className="text-5xl font-black text-lime-400/20 group-hover:text-lime-400/40 transition-colors mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                {s.num}
              </p>
              <h3 className="text-base font-black text-white mb-2">{s.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-lime-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-lime-200">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-8 h-8">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h2
          className="text-4xl lg:text-5xl font-black text-gray-900 mb-5"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          Ready to take control of your operations?
        </h2>
        <p className="text-lg text-gray-500 mb-8">
          Join safety teams across industries using SafeZone to prevent incidents, accelerate response, and maintain compliance.
        </p>
        <button
          onClick={onGetStarted}
          className="group inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold text-base px-10 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-lime-200 active:scale-95"
        >
          Register your company — it's free
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 transition-transform group-hover:translate-x-1">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}

// ─── Multi-step Registration ──────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {[1, 2].map((n) => (
        <div key={n} className="flex items-center gap-2 flex-1">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${
              step >= n ? "bg-lime-400 text-gray-900" : "bg-gray-100 text-gray-400"
            }`}
          >
            {step > n ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-4 h-4">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              n
            )}
          </div>
          <span className={`text-xs font-semibold ${step >= n ? "text-gray-800" : "text-gray-400"}`}>
            {n === 1 ? "Company" : "Your Account"}
          </span>
          {n < 2 && <div className={`flex-1 h-0.5 rounded-full ${step > n ? "bg-lime-400" : "bg-gray-100"}`} />}
        </div>
      ))}
    </div>
  );
}

function CompanyStep({
  form,
  setForm,
  onNext,
  onBack,
}: {
  form: CompanyForm;
  setForm: (f: CompanyForm) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; logo?: string }>({});

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, logo: file });
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs: { name?: string; logo?: string } = {};
    if (!form.name.trim()) errs.name = "Company name is required.";
    if (!form.logo) errs.logo = "Please upload your company logo.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
          Set up your company
        </h2>
        <p className="text-gray-500 mt-1 text-sm">This is your organisation's workspace in SafeZone.</p>
      </div>

      <div className="space-y-6">
        {/* Company name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Company name</label>
          <input
            type="text"
            placeholder="e.g. Meridian Port Authority"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all ${
              errors.name ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Logo upload */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Company logo</label>
          <div
            onClick={() => fileRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
              errors.logo
                ? "border-red-300 bg-red-50"
                : preview
                ? "border-lime-300 bg-lime-50"
                : "border-gray-200 bg-gray-50 hover:border-lime-300 hover:bg-lime-50"
            }`}
          >
            {preview ? (
              <div className="text-center">
                <img src={preview} alt="Logo preview" className="w-20 h-20 object-contain mx-auto rounded-xl mb-3 shadow-md" />
                <p className="text-xs font-semibold text-lime-700">{form.logo?.name}</p>
                <p className="text-xs text-gray-400 mt-1">Click to replace</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center mx-auto mb-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth={2} className="w-6 h-6">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-700">Drop your logo here or click to browse</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG · Max 5MB</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          {errors.logo && <p className="text-xs text-red-500 mt-1">{errors.logo}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between mt-10">
        <button onClick={onBack} className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          onClick={handleNext}
          className="group flex items-center gap-2 bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold text-sm px-8 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-lime-200 active:scale-95"
        >
          Continue
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 transition-transform group-hover:translate-x-1">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function UserStep({
  form,
  setForm,
  onSubmit,
  onBack,
}: {
  form: UserForm;
  setForm: (f: UserForm) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Partial<UserForm>>({});
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const errs: Partial<UserForm> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Enter a valid email.";
    if (!form.role) errs.role = "Please select a role.";
    if (!form.team.trim()) errs.team = "Team name is required.";
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit();
  };

  const field = (
    label: string,
    key: keyof UserForm,
    props: React.InputHTMLAttributes<HTMLInputElement> = {}
  ) => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1.5">{label}</label>
      <input
        {...props}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all ${
          errors[key] ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
        }`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
          Your admin account
        </h2>
        <p className="text-gray-500 mt-1 text-sm">You'll be the first admin. You can invite the rest of your team from inside the app.</p>
      </div>

      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          {field("Full name", "name", { placeholder: "Jane Doe" })}
          {field("Work email", "email", { type: "email", placeholder: "jane@company.com" })}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* Role select */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all appearance-none bg-gray-50 ${
                errors.role ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <option value="">Select a role</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
          </div>

          {field("Team / Department", "team", { placeholder: "e.g. Dock Operations" })}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={form.password}
              placeholder="At least 8 characters"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all ${
                errors.password ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPass ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          {/* Strength bar */}
          {form.password && (
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    form.password.length >= n * 3
                      ? n <= 1 ? "bg-red-400" : n <= 2 ? "bg-orange-400" : n <= 3 ? "bg-yellow-400" : "bg-lime-400"
                      : "bg-gray-100"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400">
          By creating an account you agree to our{" "}
          <a href="#" className="text-lime-600 font-semibold hover:underline">Terms of Service</a> and{" "}
          <a href="#" className="text-lime-600 font-semibold hover:underline">Privacy Policy</a>.
        </p>
      </div>

      <div className="flex items-center justify-between mt-10">
        <button onClick={onBack} className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="group flex items-center gap-2 bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold text-sm px-8 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-lime-200 active:scale-95"
        >
          Create account
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 transition-transform group-hover:translate-x-1">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function SuccessScreen({ companyName }: { companyName: string }) {
  return (
    <div className="text-center py-6">
      <div className="w-20 h-20 rounded-full bg-lime-100 border-4 border-lime-300 flex items-center justify-center mx-auto mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth={2.5} className="w-10 h-10">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h2 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
        You're all set!
      </h2>
      <p className="text-gray-500 text-sm mb-1">
        <span className="font-bold text-gray-800">{companyName}</span> has been registered on SafeZone.
      </p>
      <p className="text-gray-400 text-xs mb-8">Check your email to verify your account and log in.</p>
      <button className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold text-sm px-8 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-lime-200 active:scale-95">
        Go to dashboard →
      </button>
    </div>
  );
}

function RegisterModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [done, setDone] = useState(false);
  const [companyForm, setCompanyForm] = useState<CompanyForm>({ name: "", logo: null });
  const [userForm, setUserForm] = useState<UserForm>({ name: "", email: "", role: "", team: "", password: "" });

  const handleSubmit = () => {
    // Here you'd call your API: POST company then POST user
    console.log("Company:", companyForm);
    console.log("User:", userForm);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-lime-400 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-3.5 h-3.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="font-black text-lg tracking-tight text-gray-900" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Safe<span className="text-lime-500">Zone</span>
            </span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 text-gray-600">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 pt-5">
          {done ? (
            <SuccessScreen companyName={companyForm.name} />
          ) : (
            <>
              <ProgressBar step={currentStep} />
              {currentStep === 1 && (
                <CompanyStep
                  form={companyForm}
                  setForm={setCompanyForm}
                  onNext={() => setCurrentStep(2)}
                  onBack={onClose}
                />
              )}
              {currentStep === 2 && (
                <UserStep
                  form={userForm}
                  setForm={setUserForm}
                  onSubmit={handleSubmit}
                  onBack={() => setCurrentStep(1)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [step, setStep] = useState<Step>("landing");

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const openRegister = () => setStep("register-company");
  const closeRegister = () => setStep("landing");

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <NavBar onGetStarted={openRegister} />
      <HeroSection onGetStarted={openRegister} />
      <IndustriesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection onGetStarted={openRegister} />

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-lime-400 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-3.5 h-3.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="font-black text-lg" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Safe<span className="text-lime-400">Zone</span>
            </span>
          </div>
          <p className="text-xs text-gray-500">© 2026 SafeZone. Real-time incident management for every industry.</p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Contact"].map((t) => (
              <a key={t} href="#" className="text-xs text-gray-500 hover:text-lime-400 transition-colors font-medium">{t}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* Registration Modal */}
      {step !== "landing" && <RegisterModal onClose={closeRegister} />}
    </div>
  );
}