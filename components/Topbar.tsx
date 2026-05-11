'use client';
import { Fragment } from 'react';
import Icon from './Icon';

type Props = {
  crumbs: string[];
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onCompose: () => void;
};

export default function Topbar({ crumbs, theme, onToggleTheme, onCompose }: Props) {
  return (
    <header className="topbar">
      <div className="crumb">
        {crumbs.map((c, i) => (
          <Fragment key={i}>
            <span className={i === crumbs.length - 1 ? 'crumb-current' : ''}>{c}</span>
            {i < crumbs.length - 1 && (
              <span className="crumb-sep"><Icon name="chevR" style={{ width: 12, height: 12 }} /></span>
            )}
          </Fragment>
        ))}
      </div>

      <span className="spacer" />

      <div className="topbar-actions">
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
        <button className="icon-btn" aria-label="AI assistant"><Icon name="sparkle" /></button>
        <button className="icon-btn" aria-label="Broadcasts"><Icon name="speaker" /></button>
        <button className="icon-btn" aria-label="Notifications">
          <Icon name="bell" />
          <span className="dot" />
        </button>
        <div style={{ width: 8 }} />
        <button className="btn-primary" onClick={onCompose}>
          <Icon name="plus" />
          <span>Create Post</span>
        </button>
      </div>
    </header>
  );
}
