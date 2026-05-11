'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

type NavItem = { id: string; href: string; label: string; icon: string; badge?: { kind: 'alpha' | 'new' | 'count'; text: string } };

const NAV: { discover: NavItem[]; integrations: NavItem[]; menu: NavItem[] } = {
  discover: [
    { id: 'intelligence', href: '/intelligence', label: 'BP Intelligence', icon: 'chart', badge: { kind: 'alpha', text: 'Alpha' } },
    { id: 'social',       href: '/social',       label: 'Social Media Contents', icon: 'feed', badge: { kind: 'count', text: '29' } },
    { id: 'email',        href: '/email',        label: 'Email Templates',       icon: 'mail', badge: { kind: 'new', text: 'New' } },
    { id: 'notes',        href: '/notes',        label: 'BrandPulse Notes',      icon: 'notes' },
    { id: 'projects',     href: '/projects',     label: 'Project Management',    icon: 'project' },
    { id: 'faq',          href: '/faq',          label: 'FAQs & Announcements',  icon: 'faq' },
    { id: 'tools',        href: '/tools',        label: 'Tools & Resources',     icon: 'tools' },
    { id: 'feedback',     href: '/feedback',     label: 'Submit Feedback',       icon: 'feedback' },
  ],
  integrations: [
    { id: 'zoho',   href: '/zoho',   label: 'Zoho CRM',         icon: 'zoho',      badge: { kind: 'new', text: 'New' } },
    { id: 'apollo', href: '/apollo', label: 'Apollo.io',        icon: 'apollo',    badge: { kind: 'new', text: 'New' } },
    { id: 'ga',     href: '/ga',     label: 'Google Analytics', icon: 'analytics', badge: { kind: 'new', text: 'New' } },
  ],
  menu: [
    { id: 'settings',  href: '/settings',  label: 'Settings',           icon: 'settings' },
    { id: 'helpdesk',  href: '/helpdesk',  label: 'Helpdesk',           icon: 'help' },
    { id: 'broadcast', href: '/broadcast', label: 'Feature Broadcasts', icon: 'broadcast' },
    { id: 'tokens',    href: '/tokens',    label: 'AI Token Usage',     icon: 'coins' },
    { id: 'admins',    href: '/admins',    label: 'Super Admins',       icon: 'shield' },
  ],
};

function SidebarItem({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link href={item.href} className={`sb-item ${active ? 'active' : ''}`}>
      <Icon name={item.icon} />
      <span className="sb-item-label">{item.label}</span>
      {item.badge && <span className={`sb-badge ${item.badge.kind}`}>{item.badge.text}</span>}
    </Link>
  );
}

export default function Sidebar({ current }: { current: string }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  const isActive = (href: string) => current === href || (href === '/intelligence' && current === '/');

  return (
    <aside className="sidebar">
      <div className="sb-orb" />
      <div className="sidebar-inner">
        <div className="sb-header-pro">
          <div className="sb-brand-row">
            <div className="sb-brand-mark"><Icon name="bolt" /></div>
            <div className="sb-brand-info">
              <div className="sb-brand-name">BrandPulse</div>
              <div className="sb-brand-status"><span className="status-dot" /> Online</div>
            </div>
            <button className="sb-collapse" aria-label="Collapse sidebar"><Icon name="sidebar" /></button>
          </div>
        </div>

        <div className="sb-scroll">
          <div className="sb-group">
            <div className="sb-group-label">Discover</div>
            {NAV.discover.map(item => (
              <SidebarItem key={item.id} item={item} active={isActive(item.href)} />
            ))}
          </div>
          <div className="sb-group">
            <div className="sb-group-label">Integrations</div>
            {NAV.integrations.map(item => (
              <SidebarItem key={item.id} item={item} active={isActive(item.href)} />
            ))}
          </div>
          <div className="sb-group">
            <div className="sb-group-label">Menu</div>
            {NAV.menu.map(item => (
              <SidebarItem key={item.id} item={item} active={isActive(item.href)} />
            ))}
          </div>
        </div>

        <div className="sb-footer" ref={popoverRef}>
          <button className={`sb-account ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(o => !o)}>
            <div className="sb-avatar">AA</div>
            <div className="sb-user">
              <div className="sb-user-name">Allen Keith Aradillos</div>
              <div className="sb-user-role">Admin · aradillos@cloudshift.net</div>
            </div>
            <Icon name="chevD" style={{ width: 14, height: 14, color: 'var(--text-muted)', transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
          </button>

          {menuOpen && (
            <div className="sb-popover">
              <div className="sb-popover-head">
                <div className="sb-avatar" style={{ width: 40, height: 40, borderRadius: 12, fontSize: 14 }}>AA</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text)' }}>Allen Keith Aradillos</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>aradillos@cloudshift.net</div>
                </div>
              </div>
              <div className="sb-popover-sep" />
              <button className="sb-popover-item" onClick={() => { router.push('/account'); setMenuOpen(false); }}>
                <Icon name="user" /> <span>Account</span>
              </button>
              <button className="sb-popover-item" onClick={() => { router.push('/settings'); setMenuOpen(false); }}>
                <Icon name="settings" /> <span>Settings</span>
              </button>
              <button className="sb-popover-item" onClick={() => { router.push('/helpdesk'); setMenuOpen(false); }}>
                <Icon name="help" /> <span>Helpdesk</span>
              </button>
              <div className="sb-popover-sep" />
              <button className="sb-popover-item danger">
                <Icon name="logout" /> <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
