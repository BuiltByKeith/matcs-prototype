"use client";

import { useState } from "react";
import Icon from "../Icon";

const CATEGORIES = ["Bug", "Feature request", "UX / design", "Performance", "Other"];
const SEVERITIES = ["Low", "Medium", "High", "Critical"];

export default function Feedback() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [severity, setSeverity] = useState(SEVERITIES[1]);
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError("Subject is required.");
      return;
    }
    if (!details.trim()) {
      setError("Please add details so the team can act on this.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <div className="page-header">
          <div>
            <h1 className="page-title">Submit Feedback</h1>
            <p className="page-sub">Thanks — your note is in the queue.</p>
          </div>
        </div>
        <div className="card proto-feedback-success">
          <div className="proto-success-icon">
            <Icon name="checkCircle" style={{ width: 40, height: 40 }} />
          </div>
          <h2>Feedback received</h2>
          <p className="proto-muted">
            Reference <strong className="tnum">FB-{Date.now().toString().slice(-6)}</strong>.
            Product reviews weekly; urgent items route to Slack #prism-feedback.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setSubmitted(false);
              setSubject("");
              setDetails("");
            }}
          >
            Submit another
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Submit Feedback</h1>
          <p className="page-sub">
            Tell us what&apos;s working and what isn&apos;t — every note reaches the team.
          </p>
        </div>
      </div>

      <div className="proto-feedback-layout">
        <form className="card proto-form" onSubmit={submit}>
          {error && <div className="proto-form-error">{error}</div>}

          <label className="proto-field">
            <span>Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>

          <label className="proto-field">
            <span>Severity</span>
            <div className="seg">
              {SEVERITIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`seg-btn ${severity === s ? "active" : ""}`}
                  onClick={() => setSeverity(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </label>

          <label className="proto-field">
            <span>Subject</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Short summary"
            />
          </label>

          <label className="proto-field">
            <span>Details</span>
            <textarea
              rows={6}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Steps to reproduce, screenshots, or expected behavior…"
            />
          </label>

          <label className="proto-field">
            <span>Attachment (optional)</span>
            <button type="button" className="btn-secondary" disabled>
              <Icon name="paperclip" /> Upload file
            </button>
            <span className="proto-muted">Prototype — uploads not wired.</span>
          </label>

          <button type="submit" className="btn-primary">
            <Icon name="send" /> Send feedback
          </button>
        </form>

        <aside className="card proto-aside">
          <h3>What happens next</h3>
          <ul className="proto-steps">
            <li>
              <Icon name="check" /> Routed to the right squad by category
            </li>
            <li>
              <Icon name="clock" /> Triage within 2 business days
            </li>
            <li>
              <Icon name="msg" /> Reply via email when we need more context
            </li>
          </ul>
          <div className="divider" />
          <p className="proto-muted">
            For outages, use Helpdesk or ping #ops-urgent in Slack.
          </p>
        </aside>
      </div>
    </>
  );
}
