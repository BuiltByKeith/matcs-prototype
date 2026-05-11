'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Icon from '../Icon';

type Post = {
  id: number; status: 'draft' | 'pending' | 'approved' | 'rejected';
  tone: 'red' | 'green' | 'amber' | 'slate' | 'image';
  initials?: string; img?: 'kt' | 'pr' | 'mn';
  date: string; comments: number;
  channel?: 'fb' | 'li' | null;
  scheduled?: string; published?: boolean; failed?: boolean;
  text: string;
};

const POSTS: Post[] = [
  { id: 1, status: 'draft', tone: 'red', initials: 'WH', date: 'May 8', comments: 2, channel: null,
    text: 'When CEOs and CFOs are actively involved in operations, the impact on products can be significant. A CEO brings vision, customer understanding, and strategic direction. Their fingerprint shows in every shipped feature.' },
  { id: 2, status: 'draft', tone: 'slate', initials: 'LO', date: 'May 6', comments: 8, channel: null,
    text: "Looking to stay ahead in social media? Here's what's trending today! Effective content isn't just about promotion — it's about connecting, engaging, and adding value. Whether it's…" },
  { id: 3, status: 'draft', tone: 'image', img: 'kt', date: 'May 6', comments: 4, channel: null,
    text: 'Post Export Created by Khent Mark Dahay and edited by Derrick Poon Young. Scheduled Date — Monday, May 11. Created February 2, 2026. Status: Pending AI Agents.' },
  { id: 4, status: 'approved', tone: 'image', img: 'kt', date: 'Apr 29', comments: 0, channel: 'fb', scheduled: 'Apr 29, 8:30 PM',
    text: 'Unlock the real value of AI — beyond automation. Prompt Engineering is the key to transforming generative AI into a strategic advantage for every team in your org.' },
  { id: 5, status: 'rejected', tone: 'red', initials: 'TE', date: 'Apr 28', comments: 0, channel: null,
    text: 'Test content for the rejection workflow. Awaiting reviewer notes before resubmission.' },
  { id: 6, status: 'draft', tone: 'slate', initials: 'CS', date: 'Apr 26', comments: 2, channel: null,
    text: 'CLOUD SHIFT VIDEO PROMO THEME: CLIENT-FIRST SOLUTION DESIGN APPROACH. The hurried pace to produce technology solutions amid evolving market conditions demands a more deliberate posture.' },
  { id: 7, status: 'approved', tone: 'green', initials: 'TI', date: 'Apr 28', comments: 2, channel: 'fb', published: true,
    text: 'Tired of juggling multiple marketing tools and struggling to prove ROI? We get it. The modern marketing landscape demands agility, clarity, and intelligence.' },
  { id: 8, status: 'approved', tone: 'image', img: 'pr', date: 'Apr 25', comments: 5, channel: 'fb', failed: true,
    text: 'VirtuHire & Practitioner360 One Pager — agentic AI software development and custom digital business solutions for medical professionals and small businesses.' },
  { id: 9, status: 'approved', tone: 'image', img: 'mn', date: 'Apr 15', comments: 4, channel: 'fb',
    text: 'Manual office and clinic administration is burdensome. Introducing Practitioner360, the smart, intelligent and automated digital partner for medical professionals and SMBs.' },
  { id: 10, status: 'draft', tone: 'red', initials: 'TB', date: 'Apr 15', comments: 5, channel: null,
    text: 'The Best Value Approach to Data Analytics: Integrating AI and Human Judgment for Strategic Decision Making. Nowadays, many leaders chase dashboards instead of decisions…' },
  { id: 11, status: 'pending', tone: 'amber', initials: 'AG', date: 'Apr 12', comments: 7, channel: null,
    text: 'Agentic AI is moving from buzzword to backbone. Three patterns we keep seeing in production: tool-use orchestration, memory-augmented agents, and cost-aware routing.' },
  { id: 12, status: 'approved', tone: 'green', initials: 'NL', date: 'Apr 10', comments: 3, channel: 'li', published: true,
    text: 'New on the BrandPulse blog — a field guide for B2B marketers building first-party data strategies on top of CRM signals instead of cookie-decay heuristics.' },
];

const STATUS_META: Record<Post['status'], { label: string; icon: string }> = {
  draft:    { label: 'Draft',    icon: 'file' },
  pending:  { label: 'Pending',  icon: 'clock' },
  approved: { label: 'Approved', icon: 'checkCircle' },
  rejected: { label: 'Rejected', icon: 'xCircle' },
};

function PostCard({ p }: { p: Post }) {
  return (
    <div className="post-card fade-up">
      <div className={`post-thumb tone-${p.tone}`}>
        {p.tone === 'image' ? (
          <div style={{ width: '100%', height: '100%', background: p.img === 'kt'
            ? 'linear-gradient(135deg, #1B3D7A, #0F2147)'
            : p.img === 'pr' ? 'linear-gradient(135deg, #F4F1EC, #E5DDD0)'
            : 'linear-gradient(135deg, #C8A584, #8B6A48)', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background:
              p.img === 'pr' ? 'radial-gradient(60% 80% at 30% 50%, rgba(180,35,24,.18), transparent 60%)'
              : 'radial-gradient(60% 80% at 70% 50%, rgba(255,255,255,.15), transparent 60%)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: '.02em', textAlign: 'center', textShadow: '0 2px 8px rgba(0,0,0,.4)', padding: '0 16px' }}>
              {p.img === 'kt' ? 'KHENT MARK DAHAY' : p.img === 'pr' ? 'Practitioner360' : 'Manual Office Admin'}
            </div>
          </div>
        ) : (
          <div className="post-thumb-placeholder">{p.initials}</div>
        )}
        <div className={`post-status ${p.status}`}>
          <Icon name={STATUS_META[p.status].icon} />
          {STATUS_META[p.status].label}
        </div>
        {p.channel && (
          <div className="post-channel">
            <span className="channel-pill" style={{ background: p.failed ? 'rgba(180,35,24,.95)' : p.published ? 'rgba(47,138,87,.95)' : 'rgba(24,119,242,.95)' }}>
              <Icon name={p.channel === 'fb' ? 'fb' : 'li'} />
              {p.failed ? 'Failed' : p.published ? 'Published' : 'Scheduled'}
            </span>
          </div>
        )}
      </div>
      <div className="post-body">
        <p className="post-text">{p.text}</p>
        <div className="post-foot">
          <span className="post-foot-item"><Icon name="cal" /> {p.date}</span>
          <span className="post-foot-item"><Icon name="msg" /> {p.comments}</span>
          <span className="spacer" />
          <button className="post-foot-item" style={{ color: 'var(--primary)' }}><Icon name="eye" /></button>
        </div>
      </div>
    </div>
  );
}

export default function Social() {
  const router = useRouter();
  const [tab, setTab] = useState<Post['status'] | 'all'>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const filters: { id: Post['status'] | 'all'; label: string; icon: string }[] = [
    { id: 'all',      label: 'All Posts',  icon: 'grid' },
    { id: 'draft',    label: 'Drafts',     icon: 'file' },
    { id: 'pending',  label: 'Pending',    icon: 'clock' },
    { id: 'approved', label: 'Approved',   icon: 'checkCircle' },
    { id: 'rejected', label: 'Rejected',   icon: 'xCircle' },
  ];
  const filtered = tab === 'all' ? POSTS : POSTS.filter(p => p.status === tab);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Social Content</h1>
          <p className="page-sub">{POSTS.length} posts across drafts, review, and live channels — synced with Facebook, LinkedIn, Instagram & X.</p>
        </div>
        <div className="page-meta">
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary"><Icon name="filter" /> Filter</button>
            <button className="btn-primary" onClick={() => router.push('/composer')}><Icon name="plus" /> New Post</button>
          </div>
        </div>
      </div>

      <div className="toolbar">
        <div className="seg">
          {filters.map(f => (
            <button key={f.id} className={`seg-btn ${tab === f.id ? 'active' : ''}`} onClick={() => setTab(f.id)}>
              <Icon name={f.icon} className="dot-icon" />
              {f.label}
              {tab === f.id && <span style={{ marginLeft: 4, fontSize: 10, fontWeight: 700, color: 'var(--primary)' }}>{filtered.length}</span>}
            </button>
          ))}
        </div>
        <span className="spacer" />
        <div className="search" style={{ maxWidth: 280, margin: 0 }}>
          <Icon name="search" />
          <input placeholder="Search posts…" />
        </div>
        <div className="seg">
          <button className={`seg-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}><Icon name="grid" /></button>
          <button className={`seg-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}><Icon name="list" /></button>
        </div>
      </div>

      <div className="post-grid">
        {filtered.map(p => <PostCard key={p.id} p={p} />)}
      </div>
    </>
  );
}
