"use client";
import { useId, useMemo, useState } from "react";
import Icon from "../Icon";

/* ────────────────────────────────────────────────────────────────────
   Marketing Dashboard
   Spec: CLOUD SHIFT DIGITAL MARKETING PLATFORM — HOME ANALYTICS DASHBOARD
   Covers the 10 widgets from the brief:
    1. Digital marketing results comparison (vs targets, scalable D/W/M)
    2. AI marketing performance insights (competitor metric explanations)
    3. Customer retention & churn
    4. Brand sentiment & share of voice
    5. Website / digital experience performance
    6. Marketing budget pacing & reallocation recommendations
    7. Return on ad spend by channel
    8. CAC : LTV
    9. Marketing ROI & revenue attribution
   10. Live competitor news feed
   ──────────────────────────────────────────────────────────────────── */

type TimeRange = "day" | "week" | "month";

/* ───────── tiny SVG primitives ───────── */

function Sparkline({
  data,
  color = "var(--primary)",
  height = 30,
  filled = true,
}: {
  data: number[];
  color?: string;
  height?: number;
  filled?: boolean;
}) {
  const id = useId();
  const gid = `${id}-g`;
  const w = 140;
  const h = height;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");
  const area = `0,${h} ${points} ${w},${h}`;
  return (
    <svg
      width="100%"
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {filled && <polygon points={area} fill={`url(#${gid})`} />}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Donut({
  percent,
  size = 132,
  stroke = 14,
  color = "var(--primary)",
  track = "var(--bg-sunken)",
  children,
}: {
  percent: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (percent / 100) * c;
  return (
    <div className="dash-donut-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={track}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="dash-donut-center">{children}</div>
    </div>
  );
}

function NPSGauge({ score, size = 200 }: { score: number; size?: number }) {
  // Maps -100..100 → 0..1 along a half-circle arc
  const t = Math.min(1, Math.max(0, (score + 100) / 200));
  const id = useId();
  const r = size / 2 - 16;
  const cx = size / 2;
  const cy = size / 2 + 4;
  const stroke = 14;
  const arcLen = Math.PI * r;
  const x1 = cx - r;
  const x2 = cx + r;
  const angle = Math.PI * (1 - t); // 180° → 0°
  const knobX = cx + r * Math.cos(Math.PI - angle);
  const knobY = cy - r * Math.sin(Math.PI - angle);

  return (
    <svg
      width="100%"
      height={size / 2 + 24}
      viewBox={`0 0 ${size} ${size / 2 + 24}`}
    >
      <defs>
        <linearGradient id={`${id}-g`} x1="0" x2="1">
          <stop offset="0%" stopColor="#b42318" />
          <stop offset="50%" stopColor="#c58a1b" />
          <stop offset="100%" stopColor="#2f8a57" />
        </linearGradient>
      </defs>
      <path
        d={`M ${x1} ${cy} A ${r} ${r} 0 0 1 ${x2} ${cy}`}
        fill="none"
        stroke="var(--bg-sunken)"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      <path
        d={`M ${x1} ${cy} A ${r} ${r} 0 0 1 ${x2} ${cy}`}
        fill="none"
        stroke={`url(#${id}-g)`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${t * arcLen} ${arcLen}`}
      />
      <circle
        cx={knobX}
        cy={knobY}
        r={8}
        fill="var(--surface)"
        stroke="var(--ink-900)"
        strokeWidth={2}
      />
    </svg>
  );
}

/* ───────── data ───────── */

type Trend = "up" | "down" | "flat";

const HERO_KPIS: {
  label: string;
  value: string;
  unit?: string;
  trend: Trend;
  delta: string;
  sub: string;
  spark: number[];
  color?: string;
  featured?: boolean;
}[] = [
  {
    label: "Marketing ROI",
    value: "4.82",
    unit: "×",
    trend: "up",
    delta: "+0.6×",
    sub: "Revenue ÷ marketing spend · last 7d",
    spark: [3.4, 3.6, 3.9, 4.0, 4.2, 4.1, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.82],
    featured: true,
  },
  {
    label: "Attributed Revenue",
    value: "$243.7K",
    trend: "up",
    delta: "+12.4%",
    sub: "$2.1M pipeline · 7d",
    spark: [180, 184, 192, 198, 205, 212, 220, 226, 232, 238, 240, 244, 243.7],
    color: "var(--success)",
  },
  {
    label: "CAC : LTV",
    value: "1 : 5.4",
    trend: "up",
    delta: "+0.3 pt",
    sub: "$1,240 CAC · $6,680 LTV",
    spark: [4.6, 4.7, 4.8, 4.9, 5.0, 5.1, 5.0, 5.2, 5.3, 5.2, 5.3, 5.4, 5.4],
    color: "var(--success)",
  },
  {
    label: "Retention",
    value: "92.4",
    unit: "%",
    trend: "up",
    delta: "+2.3 pt",
    sub: "7.6% churn · improving 3 wks",
    spark: [88, 89, 89, 90, 90, 90, 91, 91, 91, 92, 92, 92, 92.4],
    color: "var(--success)",
  },
  {
    label: "Brand NPS",
    value: "62",
    trend: "up",
    delta: "+8 pt",
    sub: "23.4% share of voice",
    spark: [48, 50, 52, 53, 55, 56, 56, 58, 59, 60, 61, 62, 62],
    color: "var(--primary)",
  },
];

const RESULTS_COMPARISON = [
  { label: "Revenue", actual: 184500, target: 165000, fmt: "money" },
  {
    label: "Pipeline Generated",
    actual: 1_240_000,
    target: 1_100_000,
    fmt: "money",
  },
  { label: "MQLs", actual: 412, target: 450, fmt: "num" },
  { label: "SQLs", actual: 147, target: 130, fmt: "num" },
  { label: "Demos Booked", actual: 38, target: 42, fmt: "num" },
  { label: "New Signups", actual: 286, target: 250, fmt: "num" },
] as const;

const PERIOD_LABEL: Record<TimeRange, string> = {
  day: "vs. yesterday's targets",
  week: "week-over-week vs. weekly targets",
  month: "month-over-month vs. monthly targets",
};
const PERIOD_RANGE: Record<TimeRange, string> = {
  day: "Tue, 12 May",
  week: "May 6 – May 12",
  month: "April → May",
};

const AI_INSIGHTS = [
  {
    competitor: "Task Flow",
    metric: "Paid CTR +38%",
    severity: "high" as const,
    why: 'Rolled out a new pricing landing page with a 14-day trial on May 4, displacing their old "demo-only" funnel. LinkedIn ads now route directly to the trial.',
    impact:
      "Siphoning bottom-funnel intent on workflow-automation queries. Counter with a free-trial badge on our /automation page.",
    time: "12 min ago",
  },
  {
    competitor: "VirtuHire",
    metric: "Organic SoV −22%",
    severity: "med" as const,
    why: 'Sunset two comparison pages ("Vs Remote.com", "Vs Deel") in their May content cleanup — lost first-page rankings for 41 commercial keywords.',
    impact:
      "Opening on HR-platform comparison terms. Expand our /vs pages targeting their lost SERPs.",
    time: "47 min ago",
  },
  {
    competitor: "Iron Fort",
    metric: "Webinar attendance +180%",
    severity: "high" as const,
    why: "Partnered with KPMG on a SOC2-readiness series — co-marketing list extended their reach by ~9,400 compliance contacts in two weeks.",
    impact:
      "Co-marketing playbook is working. Pursue a Big-4 audit partner for our SOC2 vertical.",
    time: "2 h ago",
  },
  {
    competitor: "Straight Line",
    metric: "Demo bookings +24%",
    severity: "med" as const,
    why: "Switched their pricing model from hourly to a fixed-fee $4,950 SOC2 package, aimed at Series-A startups. Removed pricing friction at the demo step.",
    impact:
      "Reconsider our hourly model on the compliance offering for sub-$10M ARR prospects.",
    time: "5 h ago",
  },
];

const ROAS_CHANNELS = [
  {
    name: "Google Ads",
    spend: 18400,
    ret: 92400,
    roas: 5.02,
    icon: "G",
    color: "#4285F4",
  },
  {
    name: "LinkedIn",
    spend: 14200,
    ret: 79300,
    roas: 5.58,
    icon: "in",
    color: "#0A66C2",
  },
  {
    name: "Meta Ads",
    spend: 9800,
    ret: 32100,
    roas: 3.27,
    icon: "f",
    color: "#1877F2",
  },
  {
    name: "TikTok",
    spend: 6300,
    ret: 21800,
    roas: 3.46,
    icon: "tt",
    color: "#000000",
  },
  {
    name: "Reddit",
    spend: 2200,
    ret: 9800,
    roas: 4.45,
    icon: "r/",
    color: "#FF4500",
  },
  {
    name: "X (Twitter)",
    spend: 4100,
    ret: 8400,
    roas: 2.05,
    icon: "𝕏",
    color: "#0F1419",
  },
];

const BUDGET = {
  total: 180_000,
  spent: 124_800,
  pace: "on-pace" as "on-pace" | "over" | "under",
  campaigns: [
    {
      name: "Q2 Brand Push",
      spent: 42000,
      budget: 45000,
      status: "on-pace" as const,
      roas: 4.8,
    },
    {
      name: "TaskFlow Counter-Campaign",
      spent: 28400,
      budget: 22000,
      status: "over" as const,
      roas: 2.1,
    },
    {
      name: "SOC2 Awareness",
      spent: 18200,
      budget: 30000,
      status: "under" as const,
      roas: 6.4,
    },
    {
      name: "AI Workflow Series",
      spent: 12400,
      budget: 18000,
      status: "on-pace" as const,
      roas: 5.1,
    },
    {
      name: "HR Platform Launch",
      spent: 23800,
      budget: 25000,
      status: "on-pace" as const,
      roas: 3.9,
    },
  ],
  reallocation: {
    amount: 6400,
    from: "TaskFlow Counter-Campaign",
    to: "SOC2 Awareness",
    rationale:
      "Counter-campaign is over-pace with CTR fading 4 days running. SOC2 is under-pace with 6.4× ROAS. Shifting $6.4K projects +$31K incremental pipeline.",
  },
};

const WEBSITE_METRICS = [
  {
    label: "Organic Sessions",
    value: "42.8K",
    delta: "+12.4%",
    trend: "up" as Trend,
    spark: [38, 40, 39, 42, 41, 44, 43, 45, 42, 44, 45, 43, 46, 42.8],
    color: "var(--success)",
  },
  {
    label: "Conversion Rate",
    value: "3.42%",
    delta: "+0.31 pt",
    trend: "up" as Trend,
    spark: [
      3.1, 3.0, 3.1, 3.2, 3.1, 3.3, 3.2, 3.4, 3.3, 3.4, 3.3, 3.5, 3.4, 3.42,
    ],
    color: "var(--success)",
  },
  {
    label: "Avg. Session",
    value: "2m 48s",
    delta: "+18s",
    trend: "up" as Trend,
    spark: [
      120, 125, 130, 135, 140, 145, 148, 150, 152, 155, 158, 162, 165, 168,
    ],
    color: "var(--primary)",
  },
  {
    label: "Bounce Rate",
    value: "38.6%",
    delta: "−2.1 pt",
    trend: "up" as Trend,
    spark: [44, 43, 42, 41, 40, 41, 40, 39, 40, 39, 39, 38, 39, 38.6],
    color: "var(--success)",
  },
];

const ATTRIBUTION = [
  { source: "Paid Search", revenue: 92400, percent: 38, color: "#a8291a" },
  { source: "LinkedIn", revenue: 56800, percent: 23, color: "#0A66C2" },
  { source: "Organic", revenue: 41200, percent: 17, color: "#2f8a57" },
  { source: "Email", revenue: 28900, percent: 12, color: "#c58a1b" },
  { source: "Direct", revenue: 14600, percent: 6, color: "#7a6d5c" },
  { source: "Referral", revenue: 9800, percent: 4, color: "#7c3aed" },
];

const COMPETITOR_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "task-flow", label: "Task Flow", sub: "Workflow Automation" },
  { id: "virtuhire", label: "VirtuHire", sub: "Virtual HR" },
  {
    id: "practitioner360",
    label: "Practitioner360",
    sub: "Smart Office Admin",
  },
  { id: "iron-fort", label: "Iron Fort", sub: "Data Security & Compliance" },
  { id: "straight-line", label: "Straight Line", sub: "SOC-2 Implementation" },
  { id: "ai-workflow", label: "AI Workflow Design", sub: "Service Providers" },
  {
    id: "software-dev",
    label: "Software Development",
    sub: "Service Providers",
  },
];

const COMPETITOR_NEWS = [
  {
    cat: "task-flow",
    competitor: "Task Flow",
    kind: "Pricing",
    headline:
      "Drops Pro tier to $29/seat, adds 14-day trial — repositioning against mid-market",
    time: "12 min ago",
    source: "taskflow.com/pricing",
    severity: "high",
  },
  {
    cat: "virtuhire",
    competitor: "VirtuHire",
    kind: "Product",
    headline: "Ships AI-assisted onboarding flow inside the HR platform",
    time: "47 min ago",
    source: "TechCrunch",
    severity: "med",
  },
  {
    cat: "practitioner360",
    competitor: "Practitioner360",
    kind: "Marketing",
    headline:
      'Launches "Office of the Future" webinar series, partnered with three industry analysts',
    time: "2 h ago",
    source: "LinkedIn",
    severity: "low",
  },
  {
    cat: "iron-fort",
    competitor: "Iron Fort",
    kind: "Partnership",
    headline:
      "Announces co-marketing partnership with KPMG for SOC2 readiness program",
    time: "4 h ago",
    source: "PRNewswire",
    severity: "high",
  },
  {
    cat: "straight-line",
    competitor: "Straight Line",
    kind: "Launch",
    headline:
      "Introduces fixed-fee $4,950 SOC2 implementation package for Series-A startups",
    time: "1 d ago",
    source: "straightline.io/blog",
    severity: "med",
  },
  {
    cat: "ai-workflow",
    competitor: "Bolt Workflow",
    kind: "Funding",
    headline:
      "AI workflow design firm Bolt raises $24M Series A led by Sequoia",
    time: "1 d ago",
    source: "Crunchbase",
    severity: "med",
  },
  {
    cat: "software-dev",
    competitor: "Pioneer Dev Studio",
    kind: "Hiring",
    headline:
      "Pioneer opens AU practice — 14 new engineers on LinkedIn signals SaaS push",
    time: "2 d ago",
    source: "LinkedIn",
    severity: "low",
  },
];

/* ───────── format helpers ───────── */
const fmtMoney = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000
      ? `$${(n / 1_000).toFixed(1)}K`
      : `$${n}`;

/* ───────── component ───────── */

export default function Dashboard() {
  const [range, setRange] = useState<TimeRange>("week");
  const [cat, setCat] = useState("all");

  // Scale comparison numbers softly per range (illustrative)
  const scale = range === "day" ? 1 / 7 : range === "month" ? 4.1 : 1;
  const comparison = useMemo(
    () =>
      RESULTS_COMPARISON.map((r) => ({
        ...r,
        actual: Math.round(r.actual * scale),
        target: Math.round(r.target * scale),
      })),
    [scale],
  );

  const filteredNews =
    cat === "all"
      ? COMPETITOR_NEWS
      : COMPETITOR_NEWS.filter((n) => n.cat === cat);

  return (
    <>
      {/* ── PAGE HEADER ───────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">
            Executive view of campaign performance, competitor signals, and
            pipeline health — synthesized across GA4, Zoho CRM, Apollo, and paid
            channels.
          </p>
        </div>
        <div className="page-meta">
          <div className="refresh-pill">
            <span className="live-dot" />
            <span>
              Auto-refresh <b style={{ color: "var(--text)" }}>2 min ago</b>
            </span>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <div className="dash-toggle">
              {(["day", "week", "month"] as TimeRange[]).map((r) => (
                <button
                  key={r}
                  className={`dash-toggle-btn ${range === r ? "active" : ""}`}
                  onClick={() => setRange(r)}
                >
                  {r === "day" ? "Day" : r === "week" ? "Week" : "Month"}
                </button>
              ))}
            </div>
            <button className="btn-secondary">
              <Icon name="refresh" /> Refresh
            </button>
            <button className="btn-secondary">
              <Icon name="file" /> Export
            </button>
          </div>
        </div>
      </div>

      {/* ── HERO KPI STRIP ────────────────────────── */}
      <div className="kpi-grid">
        {HERO_KPIS.map((k, i) => (
          <div
            key={k.label}
            className={`kpi fade-up ${k.featured ? "featured" : ""}`}
          >
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value tnum">
              {k.value}
              {k.unit && <span className="kpi-unit">{k.unit}</span>}
            </div>
            <div className="kpi-row">
              <div className="kpi-spark">
                <Sparkline
                  data={k.spark}
                  color={k.featured ? "#fff" : k.color || "var(--primary)"}
                />
              </div>
              <span className={`kpi-trend ${k.trend}`}>
                <Icon
                  name={
                    k.trend === "up"
                      ? "arrowUp"
                      : k.trend === "down"
                        ? "arrowDown"
                        : "flat"
                  }
                />
                {k.delta}
              </span>
            </div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── ROW · RESULTS COMPARISON + AI INSIGHTS ── */}
      <div className="dash-grid-83">
        {/* 1 — Digital marketing results comparison */}
        <div className="card dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">
                Digital Marketing Results — Actuals vs. Targets
              </h2>
              <div className="dash-card-sub">
                {PERIOD_LABEL[range]} · <b>{PERIOD_RANGE[range]}</b>
              </div>
            </div>
            <div className="dash-legend">
              <span className="dash-legend-item">
                <span className="dash-legend-swatch actual" /> Actual
              </span>
              <span className="dash-legend-item">
                <span className="dash-legend-swatch target" /> Target
              </span>
            </div>
          </div>

          <div className="dash-comp-grid">
            {comparison.map((m) => {
              const max = Math.max(m.actual, m.target) * 1.15;
              const actualPct = (m.actual / max) * 100;
              const targetPct = (m.target / max) * 100;
              const delta = ((m.actual - m.target) / m.target) * 100;
              const positive = delta >= 0;
              const fmt = (v: number) =>
                m.fmt === "money" ? fmtMoney(v) : v.toLocaleString();
              return (
                <div className="dash-comp-row" key={m.label}>
                  <div className="dash-comp-label">{m.label}</div>
                  <div className="dash-comp-track">
                    <div
                      className="dash-comp-fill"
                      style={{ width: `${actualPct}%` }}
                    />
                    <div
                      className="dash-comp-target"
                      style={{ left: `${targetPct}%` }}
                      aria-label="target"
                    >
                      <span className="dash-comp-target-tick" />
                      <span className="dash-comp-target-cap">
                        Target {fmt(m.target)}
                      </span>
                    </div>
                  </div>
                  <div className="dash-comp-figs">
                    <div className="dash-comp-actual tnum">{fmt(m.actual)}</div>
                    <div
                      className={`dash-comp-delta ${positive ? "up" : "down"}`}
                    >
                      <Icon name={positive ? "arrowUp" : "arrowDown"} />
                      {Math.abs(delta).toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2 — AI marketing performance insights */}
        <div className="card dash-card dash-ai-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">
                <Icon
                  name="sparkle"
                  style={{
                    width: 16,
                    height: 16,
                    color: "var(--primary)",
                    verticalAlign: "-3px",
                    marginRight: 6,
                  }}
                />
                AI Performance Insights
              </h2>
              <div className="dash-card-sub">
                Why competitor metrics moved — generated by Prism AI
              </div>
            </div>
            <span className="dash-ai-badge">Live</span>
          </div>

          <div className="dash-ai-list">
            {AI_INSIGHTS.map((ins, i) => (
              <div className="dash-ai-item" key={i}>
                <div className="dash-ai-head">
                  <span className="dash-ai-comp">{ins.competitor}</span>
                  <span
                    className={`dash-ai-metric ${
                      ins.metric.includes("+") ? "up" : "down"
                    }`}
                  >
                    {ins.metric}
                  </span>
                  <span
                    className={`dash-ai-sev ${ins.severity}`}
                    title={`severity: ${ins.severity}`}
                  />
                  <span className="dash-ai-time">{ins.time}</span>
                </div>
                <p className="dash-ai-why">
                  <b>Why · </b>
                  {ins.why}
                </p>
                <p className="dash-ai-impact">
                  <Icon name="target" />
                  <span>{ins.impact}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW · 3-up: RETENTION · CAC:LTV · BRAND/NPS ── */}
      <div className="dash-grid-3">
        {/* 3 — Customer retention & churn */}
        <div className="card dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">
                Customer Retention &amp; Churn
              </h2>
              <div className="dash-card-sub">
                Net retention this {range} · 14d trailing
              </div>
            </div>
          </div>
          <div className="dash-rt-body">
            <Donut percent={92.4} color="var(--success)">
              <div className="dash-rt-pct tnum">92.4%</div>
              <div className="dash-rt-pct-lbl">Retained</div>
            </Donut>
            <div className="dash-rt-stats">
              <div className="dash-stat-row">
                <span
                  className="dash-stat-dot"
                  style={{ background: "var(--success)" }}
                />
                <span className="dash-stat-lbl">Active</span>
                <span className="dash-stat-val tnum">1,847</span>
              </div>
              <div className="dash-stat-row">
                <span
                  className="dash-stat-dot"
                  style={{ background: "var(--danger)" }}
                />
                <span className="dash-stat-lbl">Churned</span>
                <span className="dash-stat-val tnum">152</span>
              </div>
              <div className="dash-stat-row">
                <span
                  className="dash-stat-dot"
                  style={{ background: "var(--info)" }}
                />
                <span className="dash-stat-lbl">At-risk (sales flag)</span>
                <span className="dash-stat-val tnum">94</span>
              </div>
              <div className="dash-rt-trend">
                <span className="kpi-trend up">
                  <Icon name="arrowUp" /> +2.3 pt vs prior
                </span>
                <div className="dash-rt-spark">
                  <Sparkline
                    data={[88, 89, 89, 90, 90, 91, 91, 92, 92, 92.4]}
                    color="var(--success)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 8 — CAC : LTV */}
        <div className="card dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">CAC : LTV Ratio</h2>
              <div className="dash-card-sub">Are we overpaying to acquire?</div>
            </div>
          </div>
          <div className="dash-ratio-body">
            <div className="dash-ratio-bigrow">
              <div className="dash-ratio-side">
                <div className="dash-ratio-key">CAC</div>
                <div className="dash-ratio-num tnum">$1,240</div>
                <div className="dash-ratio-sub">↘ −$84 vs prior</div>
              </div>
              <div className="dash-ratio-divide">:</div>
              <div className="dash-ratio-side">
                <div className="dash-ratio-key">LTV</div>
                <div className="dash-ratio-num tnum">$6,680</div>
                <div className="dash-ratio-sub">↗ +$310 vs prior</div>
              </div>
            </div>
            <div className="dash-ratio-bar">
              <div className="dash-ratio-bar-fill" style={{ width: "84%" }} />
              <div className="dash-ratio-bar-mark" style={{ left: "33%" }}>
                <span>3.0× safe</span>
              </div>
            </div>
            <div className="dash-ratio-figs">
              <div>
                <div className="dash-ratio-figs-lbl">Multiple</div>
                <div className="dash-ratio-figs-val tnum">5.4×</div>
              </div>
              <div>
                <div className="dash-ratio-figs-lbl">Payback</div>
                <div className="dash-ratio-figs-val tnum">7.2 mo</div>
              </div>
              <div>
                <div className="dash-ratio-figs-lbl">Status</div>
                <div className="dash-ratio-figs-val healthy">Healthy</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 — Brand sentiment & share of voice */}
        <div className="card dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">
                Brand Sentiment &amp; Share of Voice
              </h2>
              <div className="dash-card-sub">
                NPS · mentions · sentiment mix
              </div>
            </div>
          </div>
          <div className="dash-brand-body">
            <div className="dash-nps">
              <NPSGauge score={62} />
              <div className="dash-nps-score tnum">62</div>
              <div className="dash-nps-lbl">NPS · Promoter zone</div>
            </div>
            <div className="dash-brand-stats">
              <div className="dash-stat-row">
                <span className="dash-stat-lbl">Mentions (7d)</span>
                <span className="dash-stat-val tnum">14,820</span>
                <span className="kpi-trend up" style={{ marginLeft: 6 }}>
                  <Icon name="arrowUp" />
                  +18%
                </span>
              </div>
              <div className="dash-stat-row">
                <span className="dash-stat-lbl">Share of Voice</span>
                <span className="dash-stat-val tnum">23.4%</span>
                <span className="kpi-trend up" style={{ marginLeft: 6 }}>
                  <Icon name="arrowUp" />
                  +3.1 pt
                </span>
              </div>
              <div className="dash-sentiment">
                <span
                  style={{ width: "71%", background: "var(--success)" }}
                  title="Positive 71%"
                />
                <span
                  style={{ width: "22%", background: "var(--paper-400)" }}
                  title="Neutral 22%"
                />
                <span
                  style={{ width: "7%", background: "var(--danger)" }}
                  title="Negative 7%"
                />
              </div>
              <div className="dash-sentiment-lbl">
                <span>
                  <b style={{ color: "var(--success)" }}>71%</b> positive
                </span>
                <span>
                  <b>22%</b> neutral
                </span>
                <span>
                  <b style={{ color: "var(--danger)" }}>7%</b> negative
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW · ROAS BY CHANNEL + BUDGET PACING ── */}
      <div className="dash-grid-2">
        {/* 7 — ROAS by channel */}
        <div className="card dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">
                Return on Ad Spend — by Channel
              </h2>
              <div className="dash-card-sub">
                Profitable channels first · sized by attributed return
              </div>
            </div>
            <button className="btn-ghost">
              View detail <Icon name="chevR" />
            </button>
          </div>
          <div className="dash-roas-list">
            {ROAS_CHANNELS.map((c) => {
              const maxRoas = 6;
              const pct = Math.min(100, (c.roas / maxRoas) * 100);
              const good = c.roas >= 3;
              return (
                <div className="dash-roas-row" key={c.name}>
                  <div
                    className="dash-roas-mark"
                    style={{ background: c.color }}
                  >
                    {c.icon}
                  </div>
                  <div className="dash-roas-meta">
                    <div className="dash-roas-name">{c.name}</div>
                    <div className="dash-roas-sub">
                      Spend {fmtMoney(c.spend)} · Return {fmtMoney(c.ret)}
                    </div>
                  </div>
                  <div className="dash-roas-bar">
                    <div
                      className="dash-roas-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: good
                          ? "var(--grad-primary)"
                          : "var(--paper-300)",
                      }}
                    />
                  </div>
                  <div
                    className={`dash-roas-val tnum ${good ? "good" : "bad"}`}
                  >
                    {c.roas.toFixed(2)}×
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6 — Marketing budget pacing & reallocation */}
        <div className="card dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">
                Marketing Budget Pacing &amp; Reallocation
              </h2>
              <div className="dash-card-sub">
                Q2 spend vs. plan · campaign-level pace
              </div>
            </div>
            <span className="dash-pace-pill on">On-pace overall</span>
          </div>

          <div className="dash-budget-strip">
            <div className="dash-budget-top">
              <div>
                <div className="dash-budget-lbl">Spent this quarter</div>
                <div className="dash-budget-big tnum">
                  {fmtMoney(BUDGET.spent)}{" "}
                  <span>/ {fmtMoney(BUDGET.total)}</span>
                </div>
              </div>
              <div className="dash-budget-pct tnum">
                {Math.round((BUDGET.spent / BUDGET.total) * 100)}%
              </div>
            </div>
            <div className="dash-budget-bar">
              <div
                className="dash-budget-bar-fill"
                style={{ width: `${(BUDGET.spent / BUDGET.total) * 100}%` }}
              />
              <div className="dash-budget-bar-mark" style={{ left: "67%" }}>
                <span>Linear pace</span>
              </div>
            </div>
          </div>

          <div className="dash-budget-list">
            {BUDGET.campaigns.map((c) => {
              const pct = (c.spent / c.budget) * 100;
              return (
                <div className="dash-budget-row" key={c.name}>
                  <div className="dash-budget-row-name">
                    {c.name}
                    <span className={`dash-pace-pill ${c.status}`}>
                      {c.status === "on-pace"
                        ? "On pace"
                        : c.status === "over"
                          ? "Over pace"
                          : "Under pace"}
                    </span>
                  </div>
                  <div className="dash-budget-row-bar">
                    <div
                      className="dash-budget-row-fill"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        background:
                          c.status === "over"
                            ? "var(--danger)"
                            : c.status === "under"
                              ? "var(--warning)"
                              : "var(--success)",
                      }}
                    />
                  </div>
                  <div className="dash-budget-row-fig tnum">
                    {fmtMoney(c.spent)}
                    <span> / {fmtMoney(c.budget)}</span>
                  </div>
                  <div className="dash-budget-row-roas tnum">
                    {c.roas.toFixed(1)}×
                  </div>
                </div>
              );
            })}
          </div>

          <div className="dash-realloc">
            <div className="dash-realloc-head">
              <Icon name="sparkle" />
              <span>Recommended reallocation</span>
            </div>
            <div className="dash-realloc-body">
              <div className="dash-realloc-move">
                <span className="dash-realloc-amt tnum">
                  ${BUDGET.reallocation.amount.toLocaleString()}
                </span>
                <span className="dash-realloc-from">
                  {BUDGET.reallocation.from}
                </span>
                <Icon name="chevR" />
                <span className="dash-realloc-to">
                  {BUDGET.reallocation.to}
                </span>
              </div>
              <p className="dash-realloc-why">
                {BUDGET.reallocation.rationale}
              </p>
              <div className="row" style={{ gap: 8 }}>
                <button
                  className="btn-primary"
                  style={{ padding: "7px 14px", fontSize: 12.5 }}
                >
                  Approve shift
                </button>
                <button className="btn-ghost">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW · WEBSITE + ATTRIBUTION ── */}
      <div className="dash-grid-2">
        {/* 5 — Website / digital experience performance */}
        <div className="card dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">
                Website &amp; Digital Experience Performance
              </h2>
              <div className="dash-card-sub">
                Organic traffic, conversion, engagement · 14d
              </div>
            </div>
            <button className="btn-ghost">
              <Icon name="analytics" /> GA4
            </button>
          </div>
          <div className="dash-web-grid">
            {WEBSITE_METRICS.map((m) => (
              <div className="dash-web-cell" key={m.label}>
                <div className="dash-web-lbl">{m.label}</div>
                <div className="dash-web-row">
                  <div className="dash-web-val tnum">{m.value}</div>
                  <span className={`kpi-trend ${m.trend}`}>
                    <Icon name="arrowUp" /> {m.delta}
                  </span>
                </div>
                <div className="dash-web-spark">
                  <Sparkline data={m.spark} color={m.color} height={32} />
                </div>
              </div>
            ))}
          </div>
          <div className="dash-web-foot">
            <div className="dash-web-foot-stat">
              <div className="dash-web-foot-lbl">Core Web Vitals</div>
              <div className="dash-web-foot-val">
                <span className="dash-cwv good">LCP 1.8s</span>
                <span className="dash-cwv good">INP 142ms</span>
                <span className="dash-cwv warn">CLS 0.11</span>
              </div>
            </div>
            <div className="dash-web-foot-stat">
              <div className="dash-web-foot-lbl">Top page</div>
              <div className="dash-web-foot-val mono" style={{ fontSize: 12 }}>
                /platform/workflow-automation · 8.2K
              </div>
            </div>
          </div>
        </div>

        {/* 9 — Marketing ROI & revenue attribution */}
        <div className="card dash-card">
          <div className="dash-card-head">
            <div>
              <h2 className="dash-card-title">
                Marketing ROI &amp; Revenue Attribution
              </h2>
              <div className="dash-card-sub">
                Where did the $243.7K come from?
              </div>
            </div>
            <div className="dash-attr-total">
              <div className="dash-attr-total-lbl">Pipeline contribution</div>
              <div className="dash-attr-total-val tnum">$2.14M</div>
            </div>
          </div>
          <div className="dash-attr-body">
            <div className="dash-attr-donut">
              <AttributionDonut data={ATTRIBUTION} />
              <div className="dash-attr-center">
                <div className="dash-attr-center-lbl">Total attributed</div>
                <div className="dash-attr-center-val tnum">$243.7K</div>
              </div>
            </div>
            <div className="dash-attr-list">
              {ATTRIBUTION.map((a) => (
                <div className="dash-attr-row" key={a.source}>
                  <span
                    className="dash-attr-dot"
                    style={{ background: a.color }}
                  />
                  <span className="dash-attr-src">{a.source}</span>
                  <span className="dash-attr-pct tnum">{a.percent}%</span>
                  <span className="dash-attr-rev tnum">
                    {fmtMoney(a.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW · COMPETITOR LIVE FEED ── */}
      <div className="card dash-card dash-news-card">
        <div className="dash-card-head">
          <div>
            <h2 className="dash-card-title">
              <span className="dash-news-live">
                <span className="dash-news-dot" /> LIVE
              </span>
              Competitor News &amp; Product Changes
            </h2>
            <div className="dash-card-sub">
              Real-time launches, pricing moves, and marketing initiatives
              across tracked competitor categories
            </div>
          </div>
          <button className="btn-ghost">
            <Icon name="settings" /> Configure feeds
          </button>
        </div>

        <div className="dash-news-cats">
          {COMPETITOR_CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`dash-news-cat ${cat === c.id ? "active" : ""}`}
              onClick={() => setCat(c.id)}
            >
              <span className="dash-news-cat-label">{c.label}</span>
              {c.sub && <span className="dash-news-cat-sub">{c.sub}</span>}
            </button>
          ))}
        </div>

        <div className="dash-news-grid">
          {filteredNews.map((n, i) => (
            <article className="dash-news-item" key={i}>
              <div className="dash-news-top">
                <span className={`dash-news-kind kind-${n.kind.toLowerCase()}`}>
                  {n.kind}
                </span>
                <span className={`dash-news-sev ${n.severity}`} />
                <span className="dash-news-time">{n.time}</span>
              </div>
              <div className="dash-news-comp">{n.competitor}</div>
              <p className="dash-news-headline">{n.headline}</p>
              <div className="dash-news-foot">
                <Icon name="bookmark" /> {n.source}
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

/* ───────── Attribution donut (multi-segment) ───────── */
function AttributionDonut({
  data,
  size = 200,
  stroke = 28,
}: {
  data: { source: string; percent: number; color: string }[];
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--bg-sunken)"
        strokeWidth={stroke}
      />
      {data.map((d, i) => {
        const dash = (d.percent / 100) * c;
        const seg = (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={d.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
        offset += dash;
        return seg;
      })}
    </svg>
  );
}
