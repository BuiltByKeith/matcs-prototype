'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Icon from '../Icon';

type ChannelKey = 'fb' | 'ig' | 'li' | 'tw';

export default function Composer() {
  const router = useRouter();
  const [tab, setTab] = useState('compose');
  const [channels, setChannels] = useState<Record<ChannelKey, boolean>>({ fb: true, ig: true, li: false, tw: false });
  const [text, setText] = useState("Unlock the real value of AI — beyond automation.\n\nPrompt Engineering is the key to transforming generative AI from a tool into a true strategic advantage for every team in your org.\n\n#AI #PromptEngineering #BrandPulse");
  const [title, setTitle] = useState('Prompt Engineering — Strategic Advantage');
  const [audience, setAudience] = useState('IT & Services Decision-Makers');
  const toggle = (c: ChannelKey) => setChannels(s => ({ ...s, [c]: !s[c] }));

  return (
    <>
      <div className="page-header">
        <div>
          <button className="btn-ghost" onClick={() => router.push('/social')} style={{ marginBottom: 6 }}>
            <Icon name="chevR" style={{ transform: 'rotate(180deg)' }} /> Back to posts
          </button>
          <h1 className="page-title">Create <em>Post</em></h1>
          <p className="page-sub">Draft once, schedule across channels — with AI assist trained on your CRM signals.</p>
        </div>
        <div className="page-meta">
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary"><Icon name="file" /> Save Draft</button>
            <button className="btn-secondary"><Icon name="eye" /> Submit for Review</button>
            <button className="btn-primary"><Icon name="send" /> Schedule</button>
          </div>
        </div>
      </div>

      <div className="composer-shell">
        <div className="card composer-main">
          <div className="composer-tabs">
            <button className={`tab ${tab === 'compose' ? 'active' : ''}`} onClick={() => setTab('compose')}><Icon name="type" /> Compose</button>
            <button className={`tab ${tab === 'media' ? 'active' : ''}`} onClick={() => setTab('media')}><Icon name="image" /> Media</button>
            <button className={`tab ${tab === 'audience' ? 'active' : ''}`} onClick={() => setTab('audience')}><Icon name="target" /> Audience</button>
            <button className={`tab ${tab === 'schedule' ? 'active' : ''}`} onClick={() => setTab('schedule')}><Icon name="cal" /> Schedule</button>
          </div>
          <div className="composer-body">
            <div className="field">
              <label className="field-label"><Icon name="flag" /> Title (internal)</label>
              <input className="input" value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div className="field">
              <label className="field-label"><Icon name="layers" /> Publish to</label>
              <div className="channel-grid">
                {([
                  { id: 'fb' as const, name: 'Facebook', icon: 'fb' },
                  { id: 'ig' as const, name: 'Instagram', icon: 'ig' },
                  { id: 'li' as const, name: 'LinkedIn', icon: 'li' },
                  { id: 'tw' as const, name: 'X (Twitter)', icon: 'x_twitter' },
                ]).map(c => (
                  <div key={c.id} className={`channel-card ${channels[c.id] ? 'selected' : ''}`} onClick={() => toggle(c.id)}>
                    <div className={`channel-card-icon ${c.id}`}><Icon name={c.icon} /></div>
                    <div className="channel-card-name">{c.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="field">
              <label className="field-label"><Icon name="type" /> Post content</label>
              <textarea className="textarea" value={text} onChange={e => setText(e.target.value)} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                <span>{text.length} / 2200 chars</span>
                <span className="spacer" />
                <button className="btn-ghost"><Icon name="hash" /> Hashtags</button>
                <button className="btn-ghost"><Icon name="smile" /> Emoji</button>
                <button className="btn-ghost"><Icon name="paperclip" /> Attach</button>
              </div>
              <div className="suggest-card">
                <div className="suggest-head"><Icon name="sparkle" /> AI Suggestions · trained on your CRM</div>
                <div className="suggest-list">
                  <div className="suggest-item">&ldquo;<b>Cut the hype, keep the impact.</b>&rdquo; Try a punchier opener for IT decision-makers — they skip vendor-speak.</div>
                  <div className="suggest-item">Add <b>#AgenticAI</b> and <b>#B2BMarketing</b> — trending in your CRM segment this week.</div>
                  <div className="suggest-item">Best send time for this audience: <b>Tuesday 10:15 AM PST</b> (based on 47 prior sends).</div>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="field-label"><Icon name="target" /> Audience targeting</label>
              <select className="select" value={audience} onChange={e => setAudience(e.target.value)}>
                <option>IT &amp; Services Decision-Makers</option>
                <option>Hospital &amp; Health Care · Practice Managers</option>
                <option>All CRM contacts (416)</option>
                <option>Custom segment…</option>
              </select>
            </div>

            <div className="field">
              <label className="field-label"><Icon name="cal" /> Schedule</label>
              <div className="schedule-row">
                <input className="input" type="date" defaultValue="2026-05-13" />
                <input className="input" type="time" defaultValue="10:15" />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                ⚡ Optimal slot detected — <b style={{ color: 'var(--primary)' }}>Tue 10:15 PST</b> · 9pt open-rate lift expected.
              </div>
            </div>
          </div>
        </div>

        <div className="card preview-card">
          <div className="preview-head">
            <span className="preview-title">Live preview · Facebook</span>
            <div className="seg" style={{ padding: 2 }}>
              <button className="seg-btn active" style={{ padding: '4px 9px' }}><Icon name="fb" /></button>
              <button className="seg-btn" style={{ padding: '4px 9px' }}><Icon name="ig" /></button>
              <button className="seg-btn" style={{ padding: '4px 9px' }}><Icon name="li" /></button>
            </div>
          </div>
          <div className="preview-body">
            <div className="phone-frame">
              <div className="phone-head">
                <div className="phone-avatar">CS</div>
                <div>
                  <div className="phone-name">Cloud Shift Inc.</div>
                  <div className="phone-meta">Sponsored · 🌍</div>
                </div>
              </div>
              <div className="phone-body">{text}</div>
              <div style={{ aspectRatio: '1.91 / 1', background: 'linear-gradient(135deg, #1B3D7A, #0F2147)', position: 'relative', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#fff', textAlign: 'center', padding: '0 20px' }}>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: '.15em', opacity: .7, marginBottom: 6 }}>PRESENTING</div>
                    <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.015em' }}>Prompt Engineering</div>
                    <div style={{ fontSize: 11, opacity: .85, marginTop: 4 }}>The Strategic Advantage</div>
                  </div>
                </div>
              </div>
              <div className="phone-actions">
                <span><Icon name="heart" /> Like</span>
                <span><Icon name="msg" /> Comment</span>
                <span><Icon name="repeat" /> Share</span>
              </div>
            </div>
            <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 11.5, color: 'var(--text-muted)', display: 'flex', gap: 8, alignItems: 'center' }}>
              <Icon name="sparkle" style={{ width: 14, height: 14, color: 'var(--primary)' }} />
              <span>Predicted reach: <b style={{ color: 'var(--text)' }}>4.2K – 6.1K</b> · Engagement: <b style={{ color: 'var(--text)' }}>3.8%</b></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
