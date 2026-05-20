"use client";

import { useMemo, useState } from "react";
import Icon from "../Icon";

type FeedItem = {
  id: number;
  area: string;
  title: string;
  version: string;
  date: string;
  body: string;
  read: boolean;
};

const FEED: FeedItem[] = [
  {
    id: 1,
    area: "Dashboard",
    title: "Home analytics widgets — Alpha",
    version: "v0.8",
    date: "May 19, 2026",
    body: "Ten marketing KPI widgets with day/week/month ranges. Feedback welcome via Submit Feedback.",
    read: false,
  },
  {
    id: 2,
    area: "Email",
    title: "Email Studio template library",
    version: "v0.7",
    date: "May 6, 2026",
    body: "Six responsive templates with preview and campaign stubs.",
    read: false,
  },
  {
    id: 3,
    area: "Integrations",
    title: "Zoho + Apollo connectors",
    version: "v0.6",
    date: "Apr 28, 2026",
    body: "Connection consoles with mapping tables and activity logs (prototype data).",
    read: true,
  },
  {
    id: 4,
    area: "Social",
    title: "Composer AI suggestions",
    version: "v0.5",
    date: "Apr 12, 2026",
    body: "Gemini-powered caption and hashtag suggestions in compose flow.",
    read: true,
  },
];

const AREAS = ["All", "Dashboard", "Email", "Integrations", "Social"];

export default function Broadcast() {
  const [items, setItems] = useState(FEED);
  const [area, setArea] = useState("All");

  const unread = items.filter((i) => !i.read).length;

  const visible = useMemo(
    () => items.filter((i) => area === "All" || i.area === area),
    [items, area],
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Feature Broadcasts</h1>
          <p className="page-sub">
            Product updates across Prism — {unread} unread
          </p>
        </div>
        <div className="page-meta">
          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              setItems((list) => list.map((i) => ({ ...i, read: true })))
            }
          >
            Mark all read
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="seg">
          {AREAS.map((a) => (
            <button
              key={a}
              type="button"
              className={`seg-btn ${area === a ? "active" : ""}`}
              onClick={() => setArea(a)}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="proto-broadcast-feed">
        {visible.map((item) => (
          <article
            key={item.id}
            className={`card proto-broadcast-card ${item.read ? "read" : ""}`}
          >
            <div className="proto-broadcast-head">
              <span className="proto-pill info">{item.area}</span>
              <span className="proto-pill synced tnum">{item.version}</span>
              <span className="proto-muted">{item.date}</span>
              {!item.read && <span className="proto-dot-unread" />}
            </div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <div className="proto-broadcast-foot">
              <button type="button" className="btn-secondary">
                View details
              </button>
              {!item.read && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() =>
                    setItems((list) =>
                      list.map((i) =>
                        i.id === item.id ? { ...i, read: true } : i,
                      ),
                    )
                  }
                >
                  Mark read
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
