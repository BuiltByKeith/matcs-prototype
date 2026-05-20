"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "../Icon";

const SECTIONS = [
  { id: "workspace", label: "Workspace", icon: "layers" },
  { id: "branding", label: "Branding", icon: "sparkle" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "integrations", label: "Integrations", icon: "bolt" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export default function Settings() {
  const [section, setSection] = useState<SectionId>("workspace");
  const [digest, setDigest] = useState(true);
  const [mentions, setMentions] = useState(true);
  const [darkLogo, setDarkLogo] = useState(false);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Workspace, branding, integrations, and notifications.</p>
        </div>
      </div>

      <div className="proto-settings">
        <nav className="card proto-settings-nav">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`proto-list-item ${section === s.id ? "active" : ""}`}
              onClick={() => setSection(s.id)}
            >
              <Icon name={s.icon} />
              {s.label}
            </button>
          ))}
        </nav>

        <div className="card proto-panel">
          {section === "workspace" && (
            <>
              <h2 className="proto-panel-title">Workspace</h2>
              <label className="proto-field">
                <span>Workspace name</span>
                <input defaultValue="Cloud Shift Digital" />
              </label>
              <label className="proto-field">
                <span>Default timezone</span>
                <select defaultValue="America/Chicago">
                  <option>America/Chicago</option>
                  <option>America/New_York</option>
                  <option>UTC</option>
                </select>
              </label>
              <label className="proto-toggle block">
                <input type="checkbox" defaultChecked />
                <span>Allow guests on shared notes</span>
              </label>
            </>
          )}

          {section === "branding" && (
            <>
              <h2 className="proto-panel-title">Branding</h2>
              <label className="proto-field">
                <span>Primary accent</span>
                <input type="color" defaultValue="#a8291a" />
              </label>
              <label className="proto-toggle block">
                <input
                  type="checkbox"
                  checked={darkLogo}
                  onChange={(e) => setDarkLogo(e.target.checked)}
                />
                <span>Use inverted logo on dark surfaces</span>
              </label>
              <button type="button" className="btn-secondary">
                <Icon name="image" /> Upload logo
              </button>
            </>
          )}

          {section === "notifications" && (
            <>
              <h2 className="proto-panel-title">Notifications</h2>
              <label className="proto-toggle block">
                <input
                  type="checkbox"
                  checked={digest}
                  onChange={(e) => setDigest(e.target.checked)}
                />
                <span>Weekly digest email</span>
              </label>
              <label className="proto-toggle block">
                <input
                  type="checkbox"
                  checked={mentions}
                  onChange={(e) => setMentions(e.target.checked)}
                />
                <span>@mentions in notes and projects</span>
              </label>
            </>
          )}

          {section === "integrations" && (
            <>
              <h2 className="proto-panel-title">Integrations</h2>
              <p className="proto-muted">
                Connect CRM, prospecting, and analytics from dedicated consoles.
              </p>
              <div className="proto-int-links">
                <Link href="/zoho" className="btn-secondary">
                  <Icon name="zoho" /> Zoho CRM
                </Link>
                <Link href="/apollo" className="btn-secondary">
                  <Icon name="apollo" /> Apollo.io
                </Link>
                <Link href="/ga" className="btn-secondary">
                  <Icon name="analytics" /> Google Analytics
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
