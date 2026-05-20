"use client";

import { useMemo, useState } from "react";
import Icon from "../Icon";

type FaqItem = {
  id: number;
  category: string;
  title: string;
  body: string;
};

type Announcement = {
  id: number;
  title: string;
  date: string;
  priority: "info" | "warning";
  body: string;
  read: boolean;
};

const FAQS: FaqItem[] = [
  {
    id: 1,
    category: "Getting started",
    title: "How do I invite teammates to Prism?",
    body: "Super Admins can invite users from Menu → Super Admins. Invited users receive email with workspace link. Default role is Editor; upgrade in Settings → Workspace.",
  },
  {
    id: 2,
    category: "Getting started",
    title: "Where is the social compose flow?",
    body: "Open Social Media Contents, then use Create Something in the top bar or the compose shortcut on any post card.",
  },
  {
    id: 3,
    category: "Integrations",
    title: "Zoho sync frequency",
    body: "CRM sync runs every 15 minutes when connected. Manual sync is available on the Zoho CRM integration page.",
  },
  {
    id: 4,
    category: "AI",
    title: "AI token usage limits",
    body: "Workspace quota resets monthly. View breakdown under Menu → AI Token Usage. Overage alerts email workspace admins.",
  },
];

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: "Dashboard analytics — Alpha live",
    date: "May 19, 2026",
    priority: "info",
    body: "Home analytics widgets are in Alpha for all admins. Share feedback via Submit Feedback.",
    read: false,
  },
  {
    id: 2,
    title: "Scheduled maintenance — May 22",
    date: "May 17, 2026",
    priority: "warning",
    body: "Brief read-only window 2:00–2:30 AM UTC for database upgrades.",
    read: false,
  },
  {
    id: 3,
    title: "New email templates library",
    date: "May 6, 2026",
    priority: "info",
    body: "Six starter templates ship with the Email Studio refresh.",
    read: true,
  },
];

export default function Faq() {
  const [tab, setTab] = useState<"faq" | "announcements">("faq");
  const [query, setQuery] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [activeFaq, setActiveFaq] = useState(FAQS[0].id);
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS);

  const faqFiltered = useMemo(
    () =>
      FAQS.filter(
        (f) =>
          !query.trim() ||
          f.title.toLowerCase().includes(query.toLowerCase()) ||
          f.body.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  const annFiltered = useMemo(
    () =>
      announcements.filter((a) => !unreadOnly || !a.read).filter(
        (a) =>
          !query.trim() ||
          a.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [announcements, unreadOnly, query],
  );

  const faq = FAQS.find((f) => f.id === activeFaq) ?? faqFiltered[0];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">FAQs &amp; Announcements</h1>
          <p className="page-sub">
            Internal knowledge base and team announcements in one place.
          </p>
        </div>
      </div>

      <div className="tabs">
        <button
          type="button"
          className={`tab ${tab === "faq" ? "active" : ""}`}
          onClick={() => setTab("faq")}
        >
          <Icon name="faq" /> FAQs
        </button>
        <button
          type="button"
          className={`tab ${tab === "announcements" ? "active" : ""}`}
          onClick={() => setTab("announcements")}
        >
          <Icon name="broadcast" /> Announcements
        </button>
      </div>

      <div className="toolbar">
        <div className="search" style={{ maxWidth: 320, margin: 0 }}>
          <Icon name="search" />
          <input
            placeholder={tab === "faq" ? "Search articles…" : "Search announcements…"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {tab === "announcements" && (
          <div className="seg">
            <button
              type="button"
              className={`seg-btn ${!unreadOnly ? "active" : ""}`}
              onClick={() => setUnreadOnly(false)}
            >
              All
            </button>
            <button
              type="button"
              className={`seg-btn ${unreadOnly ? "active" : ""}`}
              onClick={() => setUnreadOnly(true)}
            >
              Unread
            </button>
          </div>
        )}
      </div>

      {tab === "faq" ? (
        faqFiltered.length === 0 ? (
          <div className="card proto-empty">
            <p>No articles match your search.</p>
            <button type="button" className="btn-secondary" onClick={() => setQuery("")}>
              Clear search
            </button>
          </div>
        ) : (
          <div className="proto-split">
            <div className="card proto-panel proto-scroll-list">
              {faqFiltered.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`proto-list-item block ${activeFaq === f.id ? "active" : ""}`}
                  onClick={() => setActiveFaq(f.id)}
                >
                  <span className="proto-pill info">{f.category}</span>
                  <span className="proto-list-item-title">{f.title}</span>
                </button>
              ))}
            </div>
            <div className="card proto-panel">
              {faq && (
                <>
                  <h2 className="proto-article-title">{faq.title}</h2>
                  <p className="proto-muted">{faq.category}</p>
                  <div className="divider" />
                  <p className="proto-article-body">{faq.body}</p>
                </>
              )}
            </div>
          </div>
        )
      ) : (
        <div className="proto-announce-grid">
          {annFiltered.length === 0 ? (
            <div className="card proto-empty">
              <p>No announcements to show.</p>
            </div>
          ) : (
            annFiltered.map((a) => (
              <article key={a.id} className={`card proto-announce ${a.read ? "read" : ""}`}>
                <div className="proto-announce-head">
                  <span className={`proto-pill ${a.priority}`}>{a.priority}</span>
                  <span className="proto-muted tnum">{a.date}</span>
                  {!a.read && <span className="proto-dot-unread" />}
                </div>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
                {!a.read && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() =>
                      setAnnouncements((list) =>
                        list.map((x) =>
                          x.id === a.id ? { ...x, read: true } : x,
                        ),
                      )
                    }
                  >
                    Mark read
                  </button>
                )}
              </article>
            ))
          )}
        </div>
      )}
    </>
  );
}
