"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import Icon from "./Icon";

type Props = {
  crumbs: string[];
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onCompose: () => void;
};

export default function Topbar({
  crumbs,
  theme,
  onToggleTheme,
  onCompose,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <header className="topbar">
      <div className="crumb">
        {crumbs.map((c, i) => (
          <Fragment key={i}>
            <span className={i === crumbs.length - 1 ? "crumb-current" : ""}>
              {c}
            </span>
            {i < crumbs.length - 1 && (
              <span className="crumb-sep">
                <Icon name="chevR" style={{ width: 12, height: 12 }} />
              </span>
            )}
          </Fragment>
        ))}
      </div>

      <span className="spacer" />

      <div className="topbar-actions">
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} />
        </button>
        <button className="icon-btn" aria-label="AI assistant">
          <Icon name="sparkle" />
        </button>
        <button className="icon-btn" aria-label="Broadcasts">
          <Icon name="speaker" />
        </button>
        <button className="icon-btn" aria-label="Notifications">
          <Icon name="bell" />
          <span className="dot" />
        </button>
        <div style={{ width: 8 }} />
        <div className="create-menu" ref={menuRef}>
          <button
            type="button"
            className="btn-primary create-menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <Icon name="plus" />
            <span>Create Something</span>
            <Icon
              name="chevD"
              style={{
                width: 10,
                height: 10,
                opacity: 0.8,
                transform: menuOpen ? "rotate(180deg)" : "none",
                transition: "transform .2s",
              }}
            />
          </button>
          {menuOpen && (
            <div className="create-menu-list" role="menu">
              <button
                type="button"
                className="create-menu-item"
                onClick={() => {
                  setMenuOpen(false);
                  onCompose();
                }}
              >
                <span className="create-menu-item-icon">
                  <Icon name="feed" />
                </span>
                Social media content <Icon name="plus" />
              </button>
              <button type="button" className="create-menu-item" disabled>
                <span className="create-menu-item-icon">
                  <Icon name="mail" />
                </span>
                Email templates <Icon name="plus" />
              </button>
              <button type="button" className="create-menu-item" disabled>
                <span className="create-menu-item-icon">
                  <Icon name="notes" />
                </span>
                Notes <Icon name="plus" />
              </button>
              <button type="button" className="create-menu-item" disabled>
                <span className="create-menu-item-icon">
                  <Icon name="project" />
                </span>
                Project <Icon name="plus" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
