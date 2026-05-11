'use client';
import * as React from 'react';
import { useState } from 'react';
import Icon from '../Icon';

type TKind = 'tmpl-1' | 'tmpl-2' | 'tmpl-3' | 'tmpl-4' | 'tmpl-5' | 'tmpl-6';
type Template = { id: number; kind: TKind; status: 'draft' | 'published' | 'archived'; title: string; from: string; date: string };

const TEMPLATES: Template[] = [
  { id: 1, kind: 'tmpl-1', status: 'draft',     title: 'Welcome — V1', from: 'BrandPulse Team', date: 'May 6, 2026' },
  { id: 2, kind: 'tmpl-2', status: 'published', title: 'Your Social Content', from: 'BrandPulse',  date: 'Apr 28, 2026' },
  { id: 3, kind: 'tmpl-3', status: 'published', title: 'VirtuHire AI Workspace', from: 'VirtuHire', date: 'Apr 17, 2026' },
  { id: 4, kind: 'tmpl-4', status: 'published', title: 'I AM THE TECH GUY',     from: 'TechGuy',    date: 'Apr 15, 2026' },
  { id: 5, kind: 'tmpl-5', status: 'published', title: 'Find Your Next Great Hire', from: 'VirtuHire', date: 'Mar 24, 2026' },
  { id: 6, kind: 'tmpl-6', status: 'published', title: 'Accelerate Feature Delivery', from: 'Claude Code', date: 'Mar 24, 2026' },
];

const PreviewT1 = () => (<div className="tmpl-1"><div style={{ fontSize: 11, color: '#7A6D5C', marginBottom: 18 }}>Your text here</div><h1>Hello there 👋</h1><p>A quick note from the BrandPulse team — we&apos;re shipping new automations every week. Reply to tell us what to build next.</p><span className="b">Click here</span></div>);
const PreviewT2 = () => (<div className="tmpl-2"><h1>Your Social Content.<br />One Platform. Infinite Reach.</h1><p>BrandPulse gives your team a single place to create, approve, schedule, and analyze content across every major social channel — powered by Gemini AI.</p><span className="b">Get started</span></div>);
const PreviewT3 = () => (<div className="tmpl-3"><div className="hd">VirtuHire</div><div className="hero"><h2>Introducing VirtuHire&apos;s AI Interview Workspace</h2></div></div>);
const PreviewT4 = () => (<div className="tmpl-4"><div className="lbl">From the desk of —</div><h1>I am the Tech Guy</h1><div style={{ fontSize: 11, opacity: .85, maxWidth: '70%', margin: '0 auto 18px', lineHeight: 1.5 }}>Add a short description that tells your readers what this email is about.</div><span className="b">Get started</span></div>);
const PreviewT5 = () => (<div className="tmpl-5"><div className="logo">VirtuHire</div><h1>Find Your Next Great Hire.</h1><p>Hi [Developer Name],</p><p>VirtuHire is an AI Interview workspace that screens, interviews, and scores candidates for engineering teams — so you can focus on the closer conversations that actually matter.</p></div>);
const PreviewT6 = () => (<div className="tmpl-6"><div className="lbl">Engineering Update</div><h1>Accelerate Feature Delivery with Claude Code</h1></div>);

const PREVIEW_MAP: Record<TKind, () => React.ReactElement> = {
  'tmpl-1': PreviewT1, 'tmpl-2': PreviewT2, 'tmpl-3': PreviewT3, 'tmpl-4': PreviewT4, 'tmpl-5': PreviewT5, 'tmpl-6': PreviewT6,
};

function EmailCard({ t }: { t: Template }) {
  const P = PREVIEW_MAP[t.kind];
  return (
    <div className="email-card fade-up">
      <div className="email-preview">
        <div className="email-preview-inner"><P /></div>
      </div>
      <div className="email-meta">
        <span className={`email-status ${t.status}`}>{t.status}</span>
        <span className="email-date tnum">{t.date}</span>
      </div>
      <div className="email-title-row">
        <h3 className="email-title">{t.title}</h3>
        <div className="email-from"><Icon name="mail" /> {t.from}</div>
      </div>
      <div className="email-actions">
        <button className="btn-secondary"><Icon name="eye" /> Open</button>
        <button className="btn-secondary"><Icon name="send" /> Campaign</button>
        <button className="email-more"><Icon name="more" /></button>
      </div>
    </div>
  );
}

export default function Email() {
  const [tab, setTab] = useState('templates');
  const [filter, setFilter] = useState('Active');

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Email Studio</h1>
          <p className="page-sub">Design templates, launch campaigns, and manage your audience — all without leaving BrandPulse.</p>
        </div>
        <div className="page-meta">
          <button className="btn-primary"><Icon name="plus" /> Create Template</button>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'templates' ? 'active' : ''}`} onClick={() => setTab('templates')}><Icon name="mail" /> Templates</button>
        <button className={`tab ${tab === 'campaigns' ? 'active' : ''}`} onClick={() => setTab('campaigns')}><Icon name="send" /> Campaigns</button>
        <button className={`tab ${tab === 'audience' ? 'active' : ''}`} onClick={() => setTab('audience')}><Icon name="users" /> Audience</button>
        <button className={`tab ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}><Icon name="settings" /> Settings</button>
      </div>

      <div className="toolbar">
        <div className="search" style={{ maxWidth: 320, margin: 0 }}>
          <Icon name="search" />
          <input placeholder="Search templates…" />
        </div>
        <div className="seg">
          {['Active', 'Published', 'Draft', 'Archived'].map(f => (
            <button key={f} className={`seg-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div className="email-grid">
        {TEMPLATES.map(t => <EmailCard key={t.id} t={t} />)}
      </div>
    </>
  );
}
