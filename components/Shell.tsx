'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { getProject } from '../data/projectsMock';

const CRUMBS: Record<string, string[]> = {
  '/':            ['Discover', 'Dashboard'],
  '/dashboard':   ['Discover', 'Dashboard'],
  '/intelligence':['Discover', 'BP Intelligence'],
  '/social':      ['Discover', 'Social Media Contents'],
  '/email':       ['Discover', 'Email Templates'],
  '/notes':       ['Discover', 'Prism Notes'],
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

  const projectMatch = pathname.match(/^\/projects\/([^/]+)$/);
  const project = projectMatch ? getProject(projectMatch[1]) : undefined;
  const crumbs = project
    ? ['Discover', 'Project Management', project.title]
    : CRUMBS[pathname] || ['BrandPulse'];
  const sidebarPath =
    pathname === '/composer'
      ? '/social'
      : pathname.startsWith('/projects')
        ? '/projects'
        : pathname;

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
