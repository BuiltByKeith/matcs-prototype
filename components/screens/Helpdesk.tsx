"use client";

import { useMemo, useState } from "react";
import Icon from "../Icon";

type Ticket = {
  id: string;
  subject: string;
  requester: string;
  status: "open" | "pending" | "resolved";
  priority: "low" | "med" | "high";
  updated: string;
  body: string;
};

const TICKETS: Ticket[] = [
  {
    id: "HD-1042",
    subject: "Email template preview shows wrong font",
    requester: "M. Kim",
    status: "open",
    priority: "high",
    updated: "12m ago",
    body: "Preview pane uses system serif instead of Inter Tight after theme toggle.",
  },
  {
    id: "HD-1041",
    subject: "Zoho sync paused — auth expired",
    requester: "Ops bot",
    status: "pending",
    priority: "med",
    updated: "2h ago",
    body: "Reconnect required on integration page. Last sync 6h ago.",
  },
  {
    id: "HD-1038",
    subject: "Request: export social posts to CSV",
    requester: "D. Patel",
    status: "open",
    priority: "low",
    updated: "Yesterday",
    body: "Need bulk export for Q2 reporting deck.",
  },
  {
    id: "HD-1035",
    subject: "Composer image upload fails over 4MB",
    requester: "A. Aradillos",
    status: "resolved",
    priority: "med",
    updated: "May 17",
    body: "Resolved by increasing client-side limit message.",
  },
];

export default function Helpdesk() {
  const [tickets, setTickets] = useState(TICKETS);
  const [statusFilter, setStatusFilter] = useState<"all" | Ticket["status"]>("all");
  const [activeId, setActiveId] = useState(TICKETS[0].id);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      tickets.filter(
        (t) =>
          (statusFilter === "all" || t.status === statusFilter) &&
          (!query.trim() ||
            t.subject.toLowerCase().includes(query.toLowerCase()) ||
            t.id.toLowerCase().includes(query.toLowerCase())),
      ),
    [tickets, statusFilter, query],
  );

  const active = tickets.find((t) => t.id === activeId) ?? filtered[0];

  const setStatus = (id: string, status: Ticket["status"]) => {
    setTickets((list) =>
      list.map((t) => (t.id === id ? { ...t, status, updated: "Just now" } : t)),
    );
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Helpdesk</h1>
          <p className="page-sub">Internal support queue — triage, assign, and resolve.</p>
        </div>
        <div className="page-meta">
          <button type="button" className="btn-primary">
            <Icon name="plus" /> New ticket
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search" style={{ maxWidth: 280, margin: 0 }}>
          <Icon name="search" />
          <input
            placeholder="Search tickets…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="seg">
          {(["all", "open", "pending", "resolved"] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={`seg-btn ${statusFilter === s ? "active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      <div className="proto-split proto-split--wide">
        <div className="card proto-panel proto-scroll-list">
          {filtered.length === 0 ? (
            <div className="proto-empty">No tickets match filters.</div>
          ) : (
            filtered.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`proto-ticket-row ${activeId === t.id ? "active" : ""}`}
                onClick={() => setActiveId(t.id)}
              >
                <span className="tnum proto-muted">{t.id}</span>
                <span className="proto-ticket-subject">{t.subject}</span>
                <span className={`proto-pill ${t.status}`}>{t.status}</span>
                <span className="proto-muted">{t.updated}</span>
              </button>
            ))
          )}
        </div>

        <div className="card proto-panel">
          {active ? (
            <>
              <div className="proto-ticket-detail-head">
                <h2>{active.subject}</h2>
                <span className={`proto-pill ${active.priority}`}>
                  {active.priority}
                </span>
              </div>
              <p className="proto-muted">
                {active.requester} · {active.id} · Updated {active.updated}
              </p>
              <div className="divider" />
              <p>{active.body}</p>
              <div className="proto-ticket-actions">
                <button type="button" className="btn-secondary">
                  Assign
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setStatus(active.id, "pending")}
                >
                  Mark pending
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setStatus(active.id, "resolved")}
                >
                  Resolve
                </button>
              </div>
            </>
          ) : (
            <div className="proto-empty">Select a ticket.</div>
          )}
        </div>
      </div>
    </>
  );
}
