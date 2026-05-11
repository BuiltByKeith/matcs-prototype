'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const CRUMBS: Record<string, string[]> = {
  '/':            ['Discover', 'BP Intelligence'],
  '/intelligence':['Discover', 'BP Intelligence'],
  '/social':      ['Discover', 'Social Media Contents'],
  '/email':       ['Discover', 'Email Templates'],
  '/notes':       ['Discover', 'BrandPulse Notes'],
  '/projects':    ['Discover', 'Project Management'],
  '/faq':         ['Discover', 'FAQs & Announcements'],
  '/tools':       ['Discover', 'Tools & Resources'],
  '/feedback':    ['Discover', 'Submit Feedback'],
  '/zoho':        ['Integrations', 'Zoho CRM'],
  '/apollo':      ['Integrations', 'Apollo.io'],
  '/ga':          ['Integrations', 'Google Analytics'],
  '/settings':    ['Menu', 'Settings'],
  '/account':     ['Menu', 'Account'],
  '/helpdesk':    ['Menu', 'Helpdesk'],
  '/broadcast':   ['Menu', 'Feature Broadcasts'],
  '/tokens':      ['Menu', 'AI Token Usage'],
  '/admins':      ['Menu', 'Super Admins'],
  '/composer':    ['Discover', 'Social Media Contents', 'Create Post'],
};

export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const t = (typeof window !== 'undefined' && localStorage.getItem('bp-theme')) || 'light';
    setTheme(t as 'light' | 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('bp-theme', theme); } catch {}
  }, [theme]);

  const crumbs = CRUMBS[pathname] || ['BrandPulse'];
  // Map composer back to social for sidebar highlight
  const sidebarPath = pathname === '/composer' ? '/social' : pathname;

  const onCompose = () => router.push('/composer');

  return (
    <div className="app" data-screen-label={pathname}>
      <Sidebar current={sidebarPath} />
      <main className="main">
        <Topbar
          crumbs={crumbs}
          theme={theme}
          onToggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
          onCompose={onCompose}
        />
        <div className="content" key={pathname}>{children}</div>
      </main>
    </div>
  );
}
