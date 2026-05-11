import Icon from '../components/Icon';

type Props = { title: string; sub: string; icon?: string };

export default function ComingSoon({ title, sub, icon = 'sparkle' }: Props) {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-sub">{sub}</p>
        </div>
      </div>
      <div className="card" style={{ padding: 48, textAlign: 'center', display: 'grid', placeItems: 'center', minHeight: 380 }}>
        <div>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--grad-primary)', display: 'grid', placeItems: 'center', color: '#fff', margin: '0 auto 18px', boxShadow: 'var(--shadow-glow)' }}>
            <Icon name={icon} style={{ width: 28, height: 28 }} />
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, letterSpacing: '-.015em' }}>Coming soon</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13.5, maxWidth: 380 }}>
            This screen is being designed. The shell, navigation, and theme are wired up so you can drop the real view in here without touching anything else.
          </p>
        </div>
      </div>
    </>
  );
}
