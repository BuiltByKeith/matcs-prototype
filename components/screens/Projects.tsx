'use client';
import { useState } from 'react';
import Icon from '../Icon';

type Task = {
  id: number; tag: 'brand' | 'ops' | 'des' | 'eng'; title: string;
  prio: 'high' | 'med' | 'low'; due: string; subs: number; comments: number; asg: string[];
};
type ColId = 'todo' | 'prog' | 'review' | 'done';

const COLS: { id: ColId; title: string; dot: string }[] = [
  { id: 'todo',   title: 'Backlog',     dot: 'todo' },
  { id: 'prog',   title: 'In Progress', dot: 'prog' },
  { id: 'review', title: 'In Review',   dot: 'review' },
  { id: 'done',   title: 'Shipped',     dot: 'done' },
];

const AV_COLORS = ['#A8291A', '#7C3AED', '#0A66C2', '#2F8A57', '#C58A1B', '#1B3D7A'];

const TASKS: Record<ColId, Task[]> = {
  todo: [
    { id: 1, tag: 'brand', title: 'Q3 brand refresh — homepage hero direction', prio: 'high', due: 'May 12', subs: 4, comments: 2, asg: ['AA','MK','DP'] },
    { id: 2, tag: 'ops',   title: 'Migrate legacy CRM tags to Zoho custom fields', prio: 'med', due: 'May 14', subs: 8, comments: 5, asg: ['MK','LP'] },
    { id: 3, tag: 'des',   title: 'New empty-state illustrations for Intelligence', prio: 'low', due: 'May 20', subs: 3, comments: 0, asg: ['DP'] },
  ],
  prog: [
    { id: 4, tag: 'eng',   title: 'Wire AI suggestions into Compose flow', prio: 'high', due: 'May 11', subs: 6, comments: 9, asg: ['AA','LP','MK','DP'] },
    { id: 5, tag: 'brand', title: 'Email template — Spring product launch sequence', prio: 'med', due: 'May 15', subs: 5, comments: 3, asg: ['DP','MK'] },
  ],
  review: [
    { id: 6, tag: 'ops',   title: 'Apollo.io enrichment — 416 contacts dedupe pass', prio: 'high', due: 'May 10', subs: 4, comments: 7, asg: ['MK'] },
    { id: 7, tag: 'des',   title: 'Mobile composer — preview parity audit', prio: 'med', due: 'May 11', subs: 2, comments: 4, asg: ['DP','AA'] },
    { id: 8, tag: 'eng',   title: 'Performance: tab switch under 80ms', prio: 'low', due: 'May 18', subs: 3, comments: 1, asg: ['LP'] },
  ],
  done: [
    { id: 9,  tag: 'brand', title: 'BrandPulse — terracotta theme cutover', prio: 'high', due: 'May 8', subs: 12, comments: 18, asg: ['AA','DP','MK','LP','RS'] },
    { id: 10, tag: 'ops',   title: 'GA4 → Intelligence ingestion pipeline', prio: 'med', due: 'May 5', subs: 6, comments: 4, asg: ['MK','LP'] },
  ],
};

const TaskCard = ({ t }: { t: Task }) => (
  <div className="task fade-up">
    <span className={`task-tag ${t.tag}`}>{t.tag === 'brand' ? 'Brand' : t.tag === 'ops' ? 'Ops' : t.tag === 'des' ? 'Design' : 'Eng'}</span>
    <h4 className="task-title">{t.title}</h4>
    <div className="task-foot">
      <span className={`task-priority ${t.prio}`}>{t.prio}</span>
      <span><Icon name="cal" /> {t.due}</span>
      <span><Icon name="msg" /> {t.comments}</span>
      <span className="spacer" />
      <div className="avatar-stack">
        {t.asg.slice(0, 3).map((a, i) => (
          <div key={i} className="av" style={{ background: AV_COLORS[i % AV_COLORS.length] }}>{a}</div>
        ))}
        {t.asg.length > 3 && <div className="av" style={{ background: 'var(--text-muted)' }}>+{t.asg.length - 3}</div>}
      </div>
    </div>
  </div>
);

export default function Projects() {
  const [view, setView] = useState<'board' | 'list' | 'cal'>('board');
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Project Management</h1>
          <p className="page-sub">Campaigns, content drops, integrations — a single board for everyone shipping at Cloud Shift.</p>
        </div>
        <div className="page-meta">
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary"><Icon name="filter" /> Filter</button>
            <button className="btn-primary"><Icon name="plus" /> New Task</button>
          </div>
        </div>
      </div>

      <div className="toolbar">
        <div className="seg">
          <button className={`seg-btn ${view === 'board' ? 'active' : ''}`} onClick={() => setView('board')}><Icon name="grid" /> Board</button>
          <button className={`seg-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}><Icon name="list" /> List</button>
          <button className={`seg-btn ${view === 'cal' ? 'active' : ''}`} onClick={() => setView('cal')}><Icon name="cal" /> Calendar</button>
        </div>
        <span className="spacer" />
        <div className="avatar-stack" style={{ marginRight: 6 }}>
          {['AA','MK','DP','LP','RS'].map((a, i) => (
            <div key={i} className="av" style={{ width: 28, height: 28, fontSize: 10, marginLeft: i === 0 ? 0 : -8, border: '2px solid var(--bg)', background: AV_COLORS[i] }}>{a}</div>
          ))}
        </div>
        <button className="btn-secondary"><Icon name="users" /> Members</button>
      </div>

      <div className="kanban">
        {COLS.map(c => (
          <div className="column" key={c.id}>
            <div className="column-head">
              <span className={`column-dot ${c.dot}`} />
              <span className="column-title">{c.title}</span>
              <span className="column-count">{TASKS[c.id].length}</span>
              <button className="column-add"><Icon name="plus" /></button>
            </div>
            {TASKS[c.id].map(t => <TaskCard key={t.id} t={t} />)}
          </div>
        ))}
      </div>
    </>
  );
}
