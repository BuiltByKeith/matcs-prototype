"use client";

import { useMemo, useState } from "react";
import Icon from "../Icon";

type ResourceType = "brand" | "templates" | "links";

type Resource = {
  id: number;
  type: ResourceType;
  title: string;
  description: string;
  url: string;
  tags: string[];
};

const RESOURCES: Resource[] = [
  {
    id: 1,
    type: "brand",
    title: "Brand guidelines PDF",
    description: "Logo usage, color ramps, typography, voice.",
    url: "#brand-guidelines",
    tags: ["PDF", "2026"],
  },
  {
    id: 2,
    type: "brand",
    title: "Logo asset pack",
    description: "SVG and PNG exports for light and dark backgrounds.",
    url: "#logos",
    tags: ["ZIP"],
  },
  {
    id: 3,
    type: "templates",
    title: "Social post Figma kit",
    description: "LinkedIn, Instagram, and X frame templates.",
    url: "#figma-social",
    tags: ["Figma"],
  },
  {
    id: 4,
    type: "templates",
    title: "Email header blocks",
    description: "Reusable blocks matching Email Studio templates.",
    url: "#email-blocks",
    tags: ["HTML"],
  },
  {
    id: 5,
    type: "links",
    title: "Google Analytics — main property",
    description: "Production GA4 property for cloudshift.net.",
    url: "#ga",
    tags: ["External"],
  },
  {
    id: 6,
    type: "links",
    title: "Zoho CRM pipeline",
    description: "Enterprise pipeline view for marketing ops.",
    url: "#zoho",
    tags: ["CRM"],
  },
];

const FILTERS: { id: "all" | ResourceType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "brand", label: "Brand" },
  { id: "templates", label: "Templates" },
  { id: "links", label: "Links" },
];

export default function Tools() {
  const [filter, setFilter] = useState<"all" | ResourceType>("all");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const visible = useMemo(
    () =>
      RESOURCES.filter(
        (r) =>
          (filter === "all" || r.type === filter) &&
          (!query.trim() ||
            r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.description.toLowerCase().includes(query.toLowerCase())),
      ),
    [filter, query],
  );

  const copyLink = (r: Resource) => {
    void navigator.clipboard?.writeText(r.url);
    setCopied(r.id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tools &amp; Resources</h1>
          <p className="page-sub">Brand assets, links, and templates for your team.</p>
        </div>
        <div className="page-meta">
          <button type="button" className="btn-primary">
            <Icon name="plus" /> Add resource
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search" style={{ maxWidth: 320, margin: 0 }}>
          <Icon name="search" />
          <input
            placeholder="Search resources…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="seg">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`seg-btn ${filter === f.id ? "active" : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="proto-tools-grid">
        {visible.map((r) => (
          <div key={r.id} className="card proto-tool-card fade-up">
            <div className="proto-tool-icon">
              <Icon
                name={
                  r.type === "brand"
                    ? "layers"
                    : r.type === "templates"
                      ? "file"
                      : "tools"
                }
              />
            </div>
            <span className="proto-pill info">{r.type}</span>
            <h3>{r.title}</h3>
            <p className="proto-muted">{r.description}</p>
            <div className="proto-tags">
              {r.tags.map((t) => (
                <span key={t} className="proto-tag">
                  {t}
                </span>
              ))}
            </div>
            <div className="proto-tool-actions">
              <a className="btn-secondary" href={r.url} aria-label={`Open ${r.title}`}>
                <Icon name="eye" /> Open
              </a>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => copyLink(r)}
              >
                <Icon name="paperclip" />
                {copied === r.id ? "Copied" : "Copy link"}
              </button>
            </div>
          </div>
        ))}
      </div>
      {visible.length === 0 && (
        <div className="card proto-empty">No resources match your filters.</div>
      )}
    </>
  );
}
