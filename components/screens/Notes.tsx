"use client";

import { useMemo, useState } from "react";
import Icon from "../Icon";

type Notebook = { id: string; name: string; count: number };
type Note = {
  id: number;
  notebookId: string;
  title: string;
  preview: string;
  body: string;
  updated: string;
  pinned: boolean;
  shared: boolean;
};

const NOTEBOOKS: Notebook[] = [
  { id: "work", name: "Work", count: 4 },
  { id: "campaigns", name: "Campaigns", count: 3 },
  { id: "personal", name: "Personal", count: 2 },
];

const INITIAL_NOTES: Note[] = [
  {
    id: 1,
    notebookId: "work",
    title: "Q2 content calendar kickoff",
    preview: "Agenda: channel mix, owner assignments…",
    body: "Agenda:\n- Review channel performance from Q1\n- Assign owners for LinkedIn, email, and blog\n- Lock publishing cadence for June",
    updated: "Today, 9:14 AM",
    pinned: true,
    shared: true,
  },
  {
    id: 2,
    notebookId: "work",
    title: "Brand voice guardrails",
    preview: "Tone: confident, warm, never corporate…",
    body: "Tone: confident, warm, never corporate.\nAvoid: synergy, leverage, disrupt.\nPrefer: ship, clarify, measurable.",
    updated: "Yesterday",
    pinned: false,
    shared: false,
  },
  {
    id: 3,
    notebookId: "campaigns",
    title: "Spring launch — email sequence",
    preview: "Email 1: teaser, Email 2: proof points…",
    body: "Email 1 — Teaser (May 22)\nEmail 2 — Social proof (May 24)\nEmail 3 — CTA with demo link (May 26)",
    updated: "May 18",
    pinned: true,
    shared: true,
  },
  {
    id: 4,
    notebookId: "campaigns",
    title: "Apollo enrichment batch notes",
    preview: "416 contacts queued for dedupe…",
    body: "416 contacts queued. Run dedupe before pushing to Zoho.\nTag: spring-outbound",
    updated: "May 16",
    pinned: false,
    shared: false,
  },
  {
    id: 5,
    notebookId: "personal",
    title: "Weekly standup template",
    preview: "Shipped / Shipping / Blocked",
    body: "Shipped:\nShipping:\nBlocked:",
    updated: "May 10",
    pinned: false,
    shared: false,
  },
];

export default function Notes() {
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [notebookId, setNotebookId] = useState("work");
  const [activeId, setActiveId] = useState(1);
  const [scope, setScope] = useState<"mine" | "shared">("mine");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return notes
      .filter((n) => n.notebookId === notebookId)
      .filter((n) => (scope === "shared" ? n.shared : true))
      .filter(
        (n) =>
          !query.trim() ||
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.body.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }, [notes, notebookId, scope, query]);

  const active = notes.find((n) => n.id === activeId) ?? filtered[0];

  const updateBody = (body: string) => {
    if (!active) return;
    setNotes((list) =>
      list.map((n) =>
        n.id === active.id
          ? { ...n, body, preview: body.slice(0, 48) + "…", updated: "Just now" }
          : n,
      ),
    );
  };

  const addNote = () => {
    const id = Math.max(0, ...notes.map((n) => n.id)) + 1;
    const note: Note = {
      id,
      notebookId,
      title: "Untitled note",
      preview: "",
      body: "",
      updated: "Just now",
      pinned: false,
      shared: false,
    };
    setNotes((list) => [note, ...list]);
    setActiveId(id);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Prism Notes</h1>
          <p className="page-sub">
            Shared notes, decisions, and meeting minutes — searchable across your team.
          </p>
        </div>
        <div className="page-meta">
          <button type="button" className="btn-primary" onClick={addNote}>
            <Icon name="plus" /> New note
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search" style={{ maxWidth: 320, margin: 0 }}>
          <Icon name="search" />
          <input
            placeholder="Search notes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="seg">
          <button
            type="button"
            className={`seg-btn ${scope === "mine" ? "active" : ""}`}
            onClick={() => setScope("mine")}
          >
            My notes
          </button>
          <button
            type="button"
            className={`seg-btn ${scope === "shared" ? "active" : ""}`}
            onClick={() => setScope("shared")}
          >
            Shared
          </button>
        </div>
      </div>

      <div className="proto-notes">
        <aside className="proto-notes-side card">
          <div className="proto-notes-side-label">Notebooks</div>
          {NOTEBOOKS.map((nb) => (
            <button
              key={nb.id}
              type="button"
              className={`proto-list-item ${notebookId === nb.id ? "active" : ""}`}
              onClick={() => {
                setNotebookId(nb.id);
                const first = notes.find((n) => n.notebookId === nb.id);
                if (first) setActiveId(first.id);
              }}
            >
              <Icon name="notes" />
              <span>{nb.name}</span>
              <span className="proto-list-count tnum">{nb.count}</span>
            </button>
          ))}
        </aside>

        <div className="proto-notes-list card">
          {filtered.length === 0 ? (
            <div className="proto-empty">
              <p>No notes match your search.</p>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setQuery("")}
              >
                Clear search
              </button>
            </div>
          ) : (
            filtered.map((n) => (
              <button
                key={n.id}
                type="button"
                className={`proto-note-row ${activeId === n.id ? "active" : ""}`}
                onClick={() => setActiveId(n.id)}
              >
                {n.pinned && <Icon name="bookmark" className="proto-pin" />}
                <div>
                  <div className="proto-note-row-title">{n.title}</div>
                  <div className="proto-note-row-meta">
                    {n.updated}
                    {n.shared && " · Shared"}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="proto-notes-editor card">
          {active ? (
            <>
              <input
                className="proto-notes-title-input"
                value={active.title}
                onChange={(e) =>
                  setNotes((list) =>
                    list.map((n) =>
                      n.id === active.id ? { ...n, title: e.target.value } : n,
                    ),
                  )
                }
              />
              <textarea
                className="proto-notes-body"
                value={active.body}
                onChange={(e) => updateBody(e.target.value)}
                placeholder="Start writing…"
              />
              <div className="proto-notes-editor-foot">
                <span className="proto-muted">Edited {active.updated}</span>
                <span className="proto-muted">AA, MK viewing</span>
              </div>
            </>
          ) : (
            <div className="proto-empty">Select or create a note.</div>
          )}
        </div>
      </div>
    </>
  );
}
