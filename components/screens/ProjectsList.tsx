"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PROJECTS, type Project } from "../../data/projectsMock";
import Icon from "../Icon";

function statusLabel(s: Project["status"]) {
  return s === "planned" ? "Planned" : s === "active" ? "Active" : "Completed";
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card proj-card fade-up">
      <div className="proj-card-top">
        <span className={`proj-status ${project.status}`}>
          {statusLabel(project.status)}
        </span>
        <button
          type="button"
          className="proj-pin"
          aria-label={project.pinned ? "Unpin project" : "Pin project"}
        >
          <Icon name="bookmark" />
        </button>
      </div>
      <h2 className="proj-card-title">{project.title}</h2>
      <p className="proj-card-desc">{project.description}</p>
      <div className="proj-card-meta">
        <span>
          <Icon name="cal" /> {project.date}
        </span>
        <span>
          <Icon name="users" /> {project.members}
        </span>
        <span>
          <Icon name="checkCircle" /> {project.tasks} tasks
        </span>
      </div>
      <div className="proj-card-foot">
        <Link
          href={`/projects/${project.id}`}
          className="btn-primary proj-open"
        >
          Open <Icon name="arrowUp" style={{ width: 14, height: 14 }} />
        </Link>
        <button type="button" className="btn-secondary proj-icon-btn" aria-label="Edit">
          <Icon name="type" />
        </button>
        <button type="button" className="btn-secondary proj-icon-btn danger" aria-label="Delete">
          <Icon name="x" />
        </button>
      </div>
    </article>
  );
}

export default function ProjectsList() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      PROJECTS.filter(
        (p) =>
          !query.trim() ||
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Project Management</h1>
          <p className="page-sub">
            Create and manage your projects and tasks.
          </p>
        </div>
        <div className="page-meta">
          <button type="button" className="btn-secondary">
            <Icon name="list" /> All Tasks
          </button>
          <button type="button" className="btn-primary">
            <Icon name="plus" /> New Project
          </button>
        </div>
      </div>

      <div className="toolbar proj-list-toolbar">
        <div className="search proj-search">
          <Icon name="search" />
          <input
            placeholder="Search projects…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="proj-grid">
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="card proto-empty">No projects match your search.</div>
      )}
    </>
  );
}
