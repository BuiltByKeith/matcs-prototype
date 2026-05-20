"use client";

import { useState } from "react";
import type { Comment } from "../../../data/projectsMock";
import Icon from "../../Icon";

type Props = {
  comments: Comment[];
  collapsed: boolean;
  onToggle: () => void;
};

export default function ProjectDiscussion({
  comments: initial,
  collapsed,
  onToggle,
}: Props) {
  const [comments, setComments] = useState(initial);
  const [draft, setDraft] = useState("");

  const submit = () => {
    if (!draft.trim()) return;
    setComments((list) => [
      ...list,
      {
        id: list.length + 1,
        author: "You",
        initials: "YO",
        date: "Just now",
        body: draft.trim(),
      },
    ]);
    setDraft("");
  };

  if (collapsed) {
    return (
      <button
        type="button"
        className="proj-discussion-rail"
        onClick={onToggle}
        aria-label="Show comments"
      >
        <span>Show Comments</span>
      </button>
    );
  }

  return (
    <aside className="proj-discussion card">
      <button
        type="button"
        className="proj-discussion-hide"
        onClick={onToggle}
        aria-label="Hide comments"
      >
        Hide Comments
      </button>
      <div className="proj-discussion-inner">
        <div className="proj-discussion-head">
          <h3>Project Discussion</h3>
          <button type="button" className="proj-link-btn">
            Show resolved
          </button>
        </div>
        <div className="proj-comments">
          {comments.map((c) => (
            <div key={c.id} className="proj-comment">
              <div className="proj-comment-head">
                <div className="proj-comment-av">{c.initials}</div>
                <div>
                  <div className="proj-comment-author">{c.author}</div>
                  <div className="proj-comment-date">{c.date}</div>
                </div>
              </div>
              <p>{c.body}</p>
              <div className="proj-comment-actions">
                <button type="button">Reply</button>
                <button type="button">Resolve</button>
              </div>
            </div>
          ))}
        </div>
        <div className="proj-compose">
          <textarea
            placeholder="Write a project comment…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
          />
          <button type="button" className="btn-primary" onClick={submit}>
            <Icon name="msg" /> Comment
          </button>
        </div>
      </div>
    </aside>
  );
}
