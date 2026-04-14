import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const API = "https://main-backend-k32m.onrender.com";

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);
const fmtCents = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

const PLATFORMS = [
  { value: "doordash", label: "DoorDash", color: "#FF3008" },
  { value: "uber", label: "Uber", color: "#000000" },
  { value: "lyft", label: "Lyft", color: "#FF00BF" },
  { value: "etsy", label: "Etsy", color: "#F56400" },
  { value: "upwork", label: "Upwork", color: "#14A800" },
  { value: "fiverr", label: "Fiverr", color: "#1DBF73" },
  { value: "amazon_flex", label: "Amazon Flex", color: "#FF9900" },
  { value: "instacart", label: "Instacart", color: "#43B02A" },
  { value: "other", label: "Other", color: "#6b7280" },
];

const EXPENSE_CATS = ["gas", "phone", "supplies", "food", "equipment", "insurance", "other"];

const QUARTERLY_DATES = [
  { quarter: "Q1", label: "Jan–Mar", due: "April 15, 2026" },
  { quarter: "Q2", label: "Apr–Jun", due: "June 16, 2026" },
  { quarter: "Q3", label: "Jul–Sep", due: "September 15, 2026" },
  { quarter: "Q4", label: "Oct–Dec", due: "January 15, 2027" },
];

function getPlatformColor(p) {
  return PLATFORMS.find((x) => x.value === p)?.color || "#6b7280";
}
function getPlatformLabel(p) {
  return PLATFORMS.find((x) => x.value === p)?.label || p;
}

// ── Components ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color = "#22c55e", icon }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: "24px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 16, right: 16, fontSize: 22, opacity: 0.3 }}>{icon}</div>
      <span style={{ fontSize: 12, fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em", color: "#6b7280", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: 32, fontWeight: 800, color, letterSpacing: "-0.02em", fontFamily: "'Space Grotesk', sans-serif" }}>{value}</span>
      {sub && <span style={{ fontSize: 12, color: "#4b5563" }}>{sub}</span>}
    </div>
  );
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: "#22c55e", error: "#ef4444", info: "#3b82f6" };
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: "#1a1a2e", border: `1px solid ${colors[type] || colors.info}`,
      borderRadius: 12, padding: "14px 20px", maxWidth: 340,
      boxShadow: `0 0 30px ${colors[type]}33`,
      color: "#e5e7eb", fontSize: 14, fontFamily: "'Space Grotesk', sans-serif",
    }}>
      {msg}
    </div>
  );
}

// ── Landing Page ───────────────────────────────────────────────────────────────

function Landing({ onSignup }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${API}/gig/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      const user = await res.json();
      localStorage.setItem("gig_user", JSON.stringify(user));
      onSignup(user);
    } catch {
      setErr("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080B14", color: "#e5e7eb", fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Gradient blobs */}
      <div style={{ position: "fixed", top: -200, left: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -200, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(234,179,8,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Nav */}
      <nav style={{ padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: "#22c55e", letterSpacing: "-0.02em" }}>GigLedger</span>
        <button onClick={() => document.getElementById("signup-form").scrollIntoView({ behavior: "smooth" })}
          style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#e5e7eb", padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 100, padding: "6px 16px", fontSize: 12, color: "#22c55e", fontFamily: "'Space Mono', monospace", marginBottom: 28, letterSpacing: "0.08em" }}>
          FREE FOR GIG WORKERS
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 24px" }}>
          Finally know what you<br />
          <span style={{ color: "#22c55e" }}>actually made</span> —<br />
          and what you owe the IRS
        </h1>
        <p style={{ fontSize: 18, color: "#6b7280", maxWidth: 540, margin: "0 auto 40px", lineHeight: 1.6 }}>
          Track income from every platform. See your real tax number. Know exactly how much to set aside each week.
        </p>

        <form id="signup-form" onSubmit={handleSignup} style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="your@email.com" required
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "14px 20px", color: "#e5e7eb", fontSize: 15, width: 280, outline: "none", fontFamily: "inherit" }} />
          <button type="submit" disabled={loading}
            style={{ background: "#22c55e", color: "#000", fontWeight: 800, border: "none", borderRadius: 10, padding: "14px 28px", cursor: "pointer", fontSize: 15, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Creating..." : "Start Free →"}
          </button>
        </form>
        {err && <p style={{ color: "#ef4444", marginTop: 12, fontSize: 14 }}>{err}</p>}
        <p style={{ color: "#4b5563", fontSize: 12, marginTop: 14, fontFamily: "'Space Mono', monospace" }}>No credit card. No BS.</p>
      </section>

      {/* Pain points */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {[
            { icon: "📱", title: "Income from 5 apps?", body: "DoorDash, Uber, Etsy, Fiverr — it's all over the place. GigLedger puts it in one place." },
            { icon: "😰", title: "Scared of tax season?", body: "Most gig workers get blindsided. We show you exactly what you owe before April hits." },
            { icon: "🤷", title: "No idea what to set aside?", body: "We calculate your exact weekly set-aside number based on what you actually earn." },
          ].map(c => (
            <div key={c.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{c.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#f3f4f6" }}>{c.title}</h3>
              <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 80px", textAlign: "center" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 48, letterSpacing: "-0.02em" }}>How it works</h2>
        <div style={{ display: "flex", gap: 0, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { n: "01", title: "Add your income", body: "Log earnings from any gig platform. Takes 10 seconds." },
            { n: "02", title: "See your dashboard", body: "Total earnings, net profit, and tax estimate in real time." },
            { n: "03", title: "Know your tax number", body: "Your exact quarterly and weekly set-aside. No surprises." },
          ].map((s, i) => (
            <div key={i} style={{ flex: "1 1 220px", padding: "0 20px 32px", position: "relative" }}>
              <div style={{ fontSize: 48, fontWeight: 900, fontFamily: "'Space Mono', monospace", color: "rgba(34,197,94,0.15)", marginBottom: 12 }}>{s.n}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platforms */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 80px", textAlign: "center" }}>
        <p style={{ color: "#4b5563", fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: "0.1em", marginBottom: 24 }}>WORKS WITH</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          {PLATFORMS.filter(p => p.value !== "other").map(p => (
            <span key={p.value} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: p.color }}>
              {p.label}
            </span>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 100px", textAlign: "center" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.02em" }}>Simple pricing</h2>
        <p style={{ color: "#6b7280", marginBottom: 48 }}>Start free. Upgrade when you're serious about your money.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            {
              name: "Free", price: "$0", cta: "Start Free", highlight: false,
              features: ["5 income entries/month", "Tax estimate", "1 AI tip/week", "Basic dashboard"],
              missing: ["Expense tracking", "Unlimited entries", "Tax export"],
            },
            {
              name: "Pro", price: "$9.99/mo", cta: "Upgrade to Pro", highlight: true,
              features: ["Unlimited income entries", "Expense tracking", "Unlimited AI advice", "Tax export", "Quarterly tax calendar", "Full dashboard"],
              missing: [],
            },
          ].map(p => (
            <div key={p.name} style={{
              background: p.highlight ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${p.highlight ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 20, padding: 32, textAlign: "left",
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: p.highlight ? "#22c55e" : "#6b7280", marginBottom: 8 }}>{p.name}</div>
              <div style={{ fontSize: 36, fontWeight: 900, marginBottom: 24, letterSpacing: "-0.02em" }}>{p.price}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                {p.features.map(f => <div key={f} style={{ fontSize: 14, color: "#d1d5db", display: "flex", gap: 8, alignItems: "center" }}><span style={{ color: "#22c55e" }}>✓</span>{f}</div>)}
                {p.missing.map(f => <div key={f} style={{ fontSize: 14, color: "#374151", display: "flex", gap: 8, alignItems: "center" }}><span>✗</span>{f}</div>)}
              </div>
              <button onClick={() => document.getElementById("signup-form").scrollIntoView({ behavior: "smooth" })}
                style={{ width: "100%", background: p.highlight ? "#22c55e" : "rgba(255,255,255,0.06)", color: p.highlight ? "#000" : "#e5e7eb", border: p.highlight ? "none" : "1px solid rgba(255,255,255,0.1)", fontWeight: 700, borderRadius: 10, padding: "12px 0", cursor: "pointer", fontSize: 15, fontFamily: "inherit" }}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "24px", borderTop: "1px solid rgba(255,255,255,0.05)", color: "#374151", fontSize: 13 }}>
        © 2026 GigLedger · Built for gig workers, by someone who gets it
      </footer>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

function Dashboard({ user, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview"); // overview | income | expenses
  const [toast, setToast] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [incomeForm, setIncomeForm] = useState({ platform: "doordash", amount: "", date: new Date().toISOString().split("T")[0], notes: "" });
  const [expenseForm, setExpenseForm] = useState({ category: "gas", amount: "", date: new Date().toISOString().split("T")[0], notes: "" });
  const [formLoading, setFormLoading] = useState(false);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const loadDashboard = useCallback(async () => {
    try {
      const res = await fetch(`${API}/gig/dashboard/${user.id}`);
      if (!res.ok) throw new Error();
      const d = await res.json();
      setData(d);
    } catch {
      showToast("Failed to load dashboard", "error");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  // Check for upgrade success
  useEffect(() => {
    if (window.location.search.includes("upgraded=true")) {
      showToast("🎉 Welcome to Pro! All features unlocked.", "success");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  async function addIncome(e) {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await fetch(`${API}/gig/income`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, ...incomeForm, amount: parseFloat(incomeForm.amount) }),
      });
      if (!res.ok) {
        const err = await res.json();
        if (res.status === 403) {
          showToast(err.detail, "error");
          return;
        }
        throw new Error();
      }
      setIncomeForm(f => ({ ...f, amount: "", notes: "" }));
      showToast("Income added ✓");
      loadDashboard();
    } catch {
      showToast("Failed to add income", "error");
    } finally {
      setFormLoading(false);
    }
  }

  async function addExpense(e) {
    e.preventDefault();
    if (user.plan === "free") {
      showToast("Expense tracking is Pro only. Upgrade below.", "error");
      return;
    }
    setFormLoading(true);
    try {
      const res = await fetch(`${API}/gig/expense`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, ...expenseForm, amount: parseFloat(expenseForm.amount) }),
      });
      if (!res.ok) throw new Error();
      setExpenseForm(f => ({ ...f, amount: "", notes: "" }));
      showToast("Expense logged ✓");
      loadDashboard();
    } catch {
      showToast("Failed to add expense", "error");
    } finally {
      setFormLoading(false);
    }
  }

  async function getAdvice() {
    setAdviceLoading(true);
    setAdvice(null);
    try {
      const res = await fetch(`${API}/gig/ai-advice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.detail || "Failed", "error");
        return;
      }
      const d = await res.json();
      setAdvice(d.advice);
    } catch {
      showToast("AI advice unavailable", "error");
    } finally {
      setAdviceLoading(false);
    }
  }

  async function upgrade() {
    try {
      const res = await fetch(`${API}/gig/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, email: user.email }),
      });
      const d = await res.json();
      window.location.href = d.url;
    } catch {
      showToast("Checkout failed", "error");
    }
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, padding: "11px 14px", color: "#e5e7eb", fontSize: 14,
    fontFamily: "'Space Grotesk', sans-serif", outline: "none", width: "100%", boxSizing: "border-box",
  };
  const selectStyle = { ...inputStyle };
  const btnStyle = (color = "#22c55e") => ({
    background: color, color: color === "#22c55e" ? "#000" : "#fff",
    fontWeight: 700, border: "none", borderRadius: 10, padding: "12px 0",
    cursor: "pointer", fontSize: 14, fontFamily: "inherit", width: "100%",
  });

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#080B14", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e", fontFamily: "'Space Mono', monospace" }}>
      Loading dashboard...
    </div>
  );

  const nextQ = QUARTERLY_DATES.find(q => new Date(q.due) >= new Date()) || QUARTERLY_DATES[3];

  return (
    <div style={{ minHeight: "100vh", background: "#080B14", color: "#e5e7eb", fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Top Nav */}
      <nav style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, background: "rgba(8,11,20,0.95)", backdropFilter: "blur(10px)", zIndex: 100 }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: "#22c55e", letterSpacing: "-0.02em" }}>GigLedger</span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {user.plan === "free" && (
            <button onClick={upgrade} style={{ background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.3)", color: "#eab308", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              ⚡ Upgrade Pro
            </button>
          )}
          {user.plan === "pro" && <span style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontFamily: "'Space Mono', monospace" }}>PRO</span>}
          <span style={{ color: "#4b5563", fontSize: 13 }}>{user.email}</span>
          <button onClick={onLogout} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
          <StatCard label="Income This Month" value={fmt(data?.income?.month)} sub={`${fmt(data?.income?.week)} this week`} color="#22c55e" icon="💰" />
          <StatCard label="Net Profit" value={fmt(data?.net_profit?.month)} sub="this month" color="#22c55e" icon="📈" />
          <StatCard label="Tax Owed (Est.)" value={fmt(data?.tax?.annual_estimate)} sub={`${data?.tax?.effective_rate || 0}% effective rate`} color="#eab308" icon="🏛️" />
          <StatCard label="Set Aside This Week" value={fmtCents(data?.set_aside_this_week)} sub="25% of this week's income" color="#ef4444" icon="🐖" />
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Platform chart */}
            {data?.platform_breakdown?.length > 0 && (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                <h3 style={{ fontSize: 14, fontFamily: "'Space Mono', monospace", letterSpacing: "0.06em", color: "#6b7280", marginBottom: 20, textTransform: "uppercase" }}>Income by Platform</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.platform_breakdown} layout="vertical" margin={{ left: 0, right: 24, top: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="platform" tickFormatter={getPlatformLabel} width={80} tick={{ fill: "#6b7280", fontSize: 12, fontFamily: "Space Grotesk" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => fmtCents(v)} contentStyle={{ background: "#0f1421", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "Space Grotesk", fontSize: 13 }} labelFormatter={getPlatformLabel} />
                    <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                      {data.platform_breakdown.map((entry) => (
                        <Cell key={entry.platform} fill={getPlatformColor(entry.platform)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent transactions */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: 14, fontFamily: "'Space Mono', monospace", letterSpacing: "0.06em", color: "#6b7280", marginBottom: 16, textTransform: "uppercase" }}>Recent Transactions</h3>
              {(data?.recent_transactions || []).length === 0 ? (
                <p style={{ color: "#374151", fontSize: 14, textAlign: "center", padding: "32px 0" }}>No transactions yet. Add your first income below.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(data?.recent_transactions || []).map((t) => (
                    <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 10 }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.type === "income" ? "#22c55e" : "#ef4444", flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#d1d5db" }}>
                            {t.type === "income" ? getPlatformLabel(t.platform) : t.category}
                          </div>
                          <div style={{ fontSize: 12, color: "#4b5563" }}>{t.date}{t.notes ? ` · ${t.notes}` : ""}</div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, color: t.type === "income" ? "#22c55e" : "#ef4444", fontFamily: "'Space Mono', monospace", fontSize: 14 }}>
                        {t.type === "income" ? "+" : "-"}{fmtCents(t.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quarterly calendar */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: 14, fontFamily: "'Space Mono', monospace", letterSpacing: "0.06em", color: "#6b7280", marginBottom: 16, textTransform: "uppercase" }}>Quarterly Tax Payments</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {QUARTERLY_DATES.map(q => {
                  const isNext = q.quarter === nextQ.quarter;
                  return (
                    <div key={q.quarter} style={{ background: isNext ? "rgba(234,179,8,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${isNext ? "rgba(234,179,8,0.3)" : "rgba(255,255,255,0.05)"}`, borderRadius: 12, padding: "14px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: isNext ? "#eab308" : "#9ca3af" }}>{q.quarter}</span>
                        {isNext && <span style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: "#eab308", background: "rgba(234,179,8,0.15)", padding: "2px 7px", borderRadius: 4 }}>NEXT</span>}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{q.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: isNext ? "#eab308" : "#6b7280", marginTop: 6 }}>Due {q.due}</div>
                      {isNext && data?.tax?.quarterly_payment > 0 && (
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#eab308", marginTop: 8, fontFamily: "'Space Mono', monospace" }}>
                          {fmtCents(data.tax.quarterly_payment)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Add income */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
              <h3 style={{ fontSize: 14, fontFamily: "'Space Mono', monospace", letterSpacing: "0.06em", color: "#6b7280", marginBottom: 16, textTransform: "uppercase" }}>Add Income</h3>
              <form onSubmit={addIncome} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <select value={incomeForm.platform} onChange={e => setIncomeForm(f => ({ ...f, platform: e.target.value }))} style={selectStyle}>
                  {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
                <input type="number" step="0.01" placeholder="Amount ($)" required value={incomeForm.amount} onChange={e => setIncomeForm(f => ({ ...f, amount: e.target.value }))} style={inputStyle} />
                <input type="date" required value={incomeForm.date} onChange={e => setIncomeForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
                <input type="text" placeholder="Notes (optional)" value={incomeForm.notes} onChange={e => setIncomeForm(f => ({ ...f, notes: e.target.value }))} style={inputStyle} />
                <button type="submit" disabled={formLoading} style={btnStyle()}>
                  {formLoading ? "Saving..." : "+ Log Income"}
                </button>
              </form>
              {user.plan === "free" && (
                <p style={{ fontSize: 11, color: "#4b5563", marginTop: 10, fontFamily: "'Space Mono', monospace" }}>Free: 5 entries/month</p>
              )}
            </div>

            {/* Add expense */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${user.plan === "free" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, padding: 20, opacity: user.plan === "free" ? 0.6 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontFamily: "'Space Mono', monospace", letterSpacing: "0.06em", color: "#6b7280", textTransform: "uppercase" }}>Log Expense</h3>
                {user.plan === "free" && <span style={{ fontSize: 10, background: "rgba(234,179,8,0.1)", color: "#eab308", border: "1px solid rgba(234,179,8,0.2)", padding: "2px 8px", borderRadius: 4, fontFamily: "'Space Mono', monospace" }}>PRO</span>}
              </div>
              {user.plan === "free" ? (
                <div style={{ textAlign: "center", padding: "8px 0" }}>
                  <p style={{ color: "#4b5563", fontSize: 13, marginBottom: 14 }}>Track expenses and maximize your deductions with Pro.</p>
                  <button onClick={upgrade} style={{ ...btnStyle("#eab308"), color: "#000" }}>Upgrade for $9.99/mo</button>
                </div>
              ) : (
                <form onSubmit={addExpense} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <select value={expenseForm.category} onChange={e => setExpenseForm(f => ({ ...f, category: e.target.value }))} style={selectStyle}>
                    {EXPENSE_CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                  <input type="number" step="0.01" placeholder="Amount ($)" required value={expenseForm.amount} onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))} style={inputStyle} />
                  <input type="date" required value={expenseForm.date} onChange={e => setExpenseForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
                  <input type="text" placeholder="Notes (optional)" value={expenseForm.notes} onChange={e => setExpenseForm(f => ({ ...f, notes: e.target.value }))} style={inputStyle} />
                  <button type="submit" disabled={formLoading} style={btnStyle("#ef4444")}>
                    {formLoading ? "Saving..." : "− Log Expense"}
                  </button>
                </form>
              )}
            </div>

            {/* AI Advice */}
            <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 16, padding: 20 }}>
              <h3 style={{ fontSize: 14, fontFamily: "'Space Mono', monospace", letterSpacing: "0.06em", color: "#818cf8", marginBottom: 12, textTransform: "uppercase" }}>AI Financial Tip</h3>
              {advice ? (
                <div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "#d1d5db", marginBottom: 16 }}>{advice}</p>
                  <button onClick={() => setAdvice(null)} style={{ background: "transparent", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Get Another</button>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 14, lineHeight: 1.6 }}>
                    Get a personalized financial tip based on your actual earnings.
                    {user.plan === "free" && " (1/week free)"}
                  </p>
                  <button onClick={getAdvice} disabled={adviceLoading}
                    style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8", fontWeight: 700, borderRadius: 10, padding: "11px 0", cursor: "pointer", fontSize: 14, fontFamily: "inherit", width: "100%", opacity: adviceLoading ? 0.7 : 1 }}>
                    {adviceLoading ? "Thinking..." : "✨ Get This Week's Tip"}
                  </button>
                </>
              )}
            </div>

            {/* Tax breakdown */}
            {data?.tax && (
              <div style={{ background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.15)", borderRadius: 16, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontFamily: "'Space Mono', monospace", letterSpacing: "0.06em", color: "#eab308", marginBottom: 14, textTransform: "uppercase" }}>Tax Breakdown</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Annual estimate", value: fmtCents(data.tax.annual_estimate) },
                    { label: "Next quarterly", value: fmtCents(data.tax.quarterly_payment) },
                    { label: "Weekly set aside", value: fmtCents(data.tax.weekly_set_aside) },
                    { label: "Effective rate", value: `${data.tax.effective_rate}%` },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: "#6b7280" }}>{row.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: "#eab308" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ── App Root ───────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gig_user")); } catch { return null; }
  });

  function handleLogout() {
    localStorage.removeItem("gig_user");
    setUser(null);
  }

  if (!user) return <Landing onSignup={setUser} />;
  return <Dashboard user={user} onLogout={handleLogout} />;
}
