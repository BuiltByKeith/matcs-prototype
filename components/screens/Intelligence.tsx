'use client';
import { useId, useState } from 'react';
import Icon from '../Icon';

function Sparkline({ data, color = 'var(--primary)', filled = true }: { data: number[]; color?: string; filled?: boolean }) {
  const id = useId();
  const gradientId = `${id}-gradient`;
  const w = 120, h = 32;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  const area = `0,${h} ${points} ${w},${h}`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {filled && <polygon points={area} fill={`url(#${gradientId})`} />}
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type KPIProps = {
  label: string; value: string; unit?: string;
  trend: 'up' | 'down' | 'flat'; trendVal: string;
  sub: string; spark: number[]; sparkColor?: string; featured?: boolean;
};

function KPI({ label, value, unit, trend, trendVal, sub, spark, sparkColor, featured }: KPIProps) {
  const TrendIcon = trend === 'up' ? 'arrowUp' : trend === 'down' ? 'arrowDown' : 'flat';
  return (
    <div className={`kpi fade-up ${featured ? 'featured' : ''}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value tnum">
        {value}{unit && <span className="kpi-unit">{unit}</span>}
      </div>
      <div className="kpi-row">
        <div className="kpi-spark">
          <Sparkline data={spark} color={featured ? '#fff' : sparkColor || 'var(--primary)'} />
        </div>
        <span className={`kpi-trend ${trend}`}>
          <Icon name={TrendIcon} />
          {trendVal}
        </span>
      </div>
      <div className="kpi-sub">{sub}</div>
    </div>
  );
}

const INSIGHTS = [
  { source: 'CRM', strength: 3, time: '12 min ago',
    title: '276 CRM accounts — information technology & services leads at 19%',
    body: '53 of 276 accounts are in information technology & services. Other verticals: hospital & health care, utilities. Avg annual revenue $2,964.8M across 234 accounts with revenue data.',
    tags: ['zoho_crm', 'accounts', 'it_services', 'revenue_data'],
    suggest: 'information technology & services accounts are your dominant segment — build account-based marketing campaigns targeting this vertical.' },
  { source: 'CRM', strength: 3, time: '34 min ago',
    title: '"Chief Operating Officer" is the dominant title across 416 CRM contacts',
    body: '10 contacts (2%) hold the title "Chief Operating Officer". Top titles: COO (10), Director of Communications (5), Director of Operations (4). 48% hold C-suite, VP, or Director-level roles.',
    tags: ['zoho_crm', 'contacts', 'title_field', '414_with_data'],
    suggest: 'Use the title distribution to personalise outreach — decision-maker titles warrant a different message than end-user titles.' },
  { source: 'Audience', strength: 2, time: '1 h ago',
    title: 'Health & care vertical shows 27% engagement lift on Tuesday posts',
    body: 'Hospital & health care contacts opened email at 41% on Tuesdays vs 32% on Thursdays. Top engaged titles: Practice Manager, Director of Operations.',
    tags: ['ga4', 'health_care', 'tuesday_send', 'open_rate'],
    suggest: 'Shift health-care nurture sends to Tuesday 10:00 PST — expect a ~9pt open-rate lift on the next sequence.' },
  { source: 'Viral', strength: 2, time: '2 h ago',
    title: 'Information technology & services industry concentration in CRM contacts',
    body: '71 information technology & services contacts (17% of total). Segment exists across 4 active campaigns.',
    tags: ['zoho_crm', 'contacts', 'it_vertical'],
    suggest: 'Segment exists — consider drafting a nurture sequence targeting this vertical.' },
];

const AUDIENCE = [
  { label: 'information technology & services', value: 124, delta: 'up' },
  { label: 'hospital & health care', value: 104, delta: 'up' },
  { label: 'utilities', value: 93, delta: 'up' },
  { label: 'government administration', value: 71, delta: 'up' },
  { label: 'civic & social organization', value: 46, delta: 'flat' },
];

export default function Intelligence() {
  const [tab, setTab] = useState('intelligence');
  const [chip, setChip] = useState('All');
  const maxAud = Math.max(...AUDIENCE.map(a => a.value));

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Marketing Intelligence</h1>
          <p className="page-sub">Synthesised from GA4, Facebook, Email, Zoho CRM, and external trend signals — ranked by signal strength.</p>
        </div>
        <div className="page-meta">
          <div className="refresh-pill">
            <span className="live-dot" />
            <span>Last refreshed <b style={{ color: 'var(--text)' }}>just now</b></span>
          </div>
          <button className="btn-secondary"><Icon name="refresh" /> Refresh</button>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'intelligence' ? 'active' : ''}`} onClick={() => setTab('intelligence')}><Icon name="chart" /> Intelligence</button>
        <button className={`tab ${tab === 'recos' ? 'active' : ''}`} onClick={() => setTab('recos')}><Icon name="sparkle" /> Generated Recommendations</button>
        <button className={`tab ${tab === 'perf' ? 'active' : ''}`} onClick={() => setTab('perf')}><Icon name="analytics" /> Content Performance</button>
      </div>

      <div className="kpi-grid">
        <KPI label="Market Momentum" value="-44.5" unit="%" trend="down" trendVal="44.5%" sub="295 sessions · 22d composite index" spark={[60,55,52,50,45,42,38,34,33,30,28,30,32,30]} sparkColor="var(--danger)" />
        <KPI featured label="Audience Growth" value="416" unit="contacts" trend="down" trendVal="27.9%" sub="416 contacts · last 14d" spark={[80,75,70,68,65,62,58,55,52,50,52,55,52,50]} />
        <KPI label="Content Velocity" value="2" unit="pub/wk" trend="flat" trendVal="0%" sub="3 posts tracked · last 14d" spark={[3,3,2,3,2,2,2,3,2,2,2,2,2,2]} sparkColor="var(--text-muted)" />
        <KPI label="CRM Opportunity" value="416" unit="contacts" trend="up" trendVal="99.5%" sub="+1 new (14d) · 416 contacts · 276 accounts" spark={[20,25,30,40,55,80,120,180,220,280,340,380,400,416]} sparkColor="var(--success)" />
        <KPI label="Campaign Health" value="100" trend="up" trendVal="0.8%" sub="deliverability · opens · last send" spark={[95,96,97,96,98,97,98,99,98,99,100,99,100,100]} sparkColor="var(--success)" />
      </div>

      <div className="feed-grid">
        <div className="card feed-card">
          <div className="feed-head">
            <div>
              <h2 className="feed-title">What&apos;s happening now</h2>
              <div className="feed-title-sub">Insight feed · rule-based extraction · ranked by signal strength · <b style={{ color: 'var(--text)' }}>Cloud Shift Inc.</b></div>
            </div>
            <div className="chip-row">
              {['All', 'Traffic', 'Audience', 'Viral', 'CRM', 'Email'].map(c => (
                <button key={c} className={`chip ${chip === c ? 'active' : ''}`} onClick={() => setChip(c)}>{c}</button>
              ))}
            </div>
          </div>
          {INSIGHTS.map((ins, i) => (
            <div className="insight" key={i}>
              <div className="insight-head">
                <span className="insight-source"><Icon name="bookmark" />{ins.source}</span>
                <span className="insight-strength">
                  {[0,1,2].map(j => <span key={j} className={`dot ${j < ins.strength ? 'on' : ''}`} />)}
                  <span>{ins.strength === 3 ? 'High' : ins.strength === 2 ? 'Med' : 'Low'}</span>
                </span>
                <span className="insight-time">{ins.time}</span>
              </div>
              <h3 className="insight-title">{ins.title}</h3>
              <p className="insight-body">{ins.body}</p>
              <div className="tag-row">
                {ins.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
              <div className="suggest">
                <Icon name="sparkle" />
                <span><b>Suggestion · </b>{ins.suggest}</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="card side-card" style={{ background: 'linear-gradient(135deg, rgba(168,41,26,.04), transparent 60%)' }}>
            <div className="side-card-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--grad-primary)', display: 'grid', placeItems: 'center', color: '#fff' }}>
                  <Icon name="sparkle" style={{ width: 16, height: 16 }} />
                </div>
                <div>
                  <h3 className="side-card-title">Generate campaign ideas</h3>
                  <div className="side-card-sub">Synthesize signals into campaign briefs</div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '0 0 14px', lineHeight: 1.5 }}>
              Generates campaign angles, subject lines, and audience targeting from your CRM and email data.
            </p>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}><Icon name="sparkle" /> Generate recommendations</button>
          </div>

          <div className="card side-card">
            <div className="side-card-head">
              <h3 className="side-card-title">Audience observations</h3>
              <div className="side-card-sub">CRM segments · last 14d</div>
            </div>
            {AUDIENCE.map(a => (
              <div className="obs-row" key={a.label}>
                <span className="obs-label">{a.label}</span>
                <div className="obs-bar"><div className="obs-bar-fill" style={{ width: `${(a.value / maxAud) * 100}%` }} /></div>
                <span className="obs-num tnum">{a.value}</span>
                <span className={`obs-delta ${a.delta}`}>{a.delta === 'up' ? '↗' : a.delta === 'down' ? '↘' : '→'}</span>
              </div>
            ))}
          </div>

          <div className="card side-card">
            <div className="side-card-head">
              <h3 className="side-card-title">Channels at a glance</h3>
              <div className="side-card-sub">last 14d · sessions & engagement</div>
            </div>
            {[
              { name: 'Facebook',  icon: 'fb', val: '12.4K', delta: '+8.1%', color: '#1877F2' },
              { name: 'LinkedIn',  icon: 'li', val: '6.8K',  delta: '+12.3%', color: '#0A66C2' },
              { name: 'Instagram', icon: 'ig', val: '4.1K',  delta: '-2.4%',  color: '#DD2A7B' },
              { name: 'X (Twitter)', icon: 'x_twitter', val: '1.9K', delta: '+0.6%', color: '#000' },
            ].map((c, i) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 3 ? '1px dashed var(--border)' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: c.color, color: '#fff', display: 'grid', placeItems: 'center' }}>
                  <Icon name={c.icon} style={{ width: 14, height: 14 }} />
                </div>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{c.name}</span>
                <span className="tnum" style={{ fontWeight: 600, fontSize: 13 }}>{c.val}</span>
                <span style={{ fontSize: 11.5, color: c.delta.startsWith('-') ? 'var(--danger)' : 'var(--success)', fontWeight: 600, minWidth: 50, textAlign: 'right' }}>{c.delta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
