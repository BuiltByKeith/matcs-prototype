"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ACTIVITY,
  COMMENTS,
  getProject,
  KANBAN,
  TASK_LIST,
  type KanbanColumnId,
  type ProjectTask,
} from "../../data/projectsMock";
import Icon from "../Icon";
import ProjectDiscussion from "./project/ProjectDiscussion";

const AV_COLORS = ["#A8291A", "#7C3AED", "#0A66C2", "#2F8A57", "#C58A1B"];

const TABS = [
  { id: "tasks", label: "Tasks List", icon: "list", count: 2 },
  { id: "kanban", label: "Kanban", icon: "grid", count: 2 },
  { id: "charts", label: "Charts", icon: "chart" },
  { id: "activity", label: "Activity Log", icon: "clock" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const KANBAN_COLS: { id: KanbanColumnId; title: string; tone: string }[] = [
  { id: "todo", title: "To Do", tone: "todo" },
  { id: "progress", title: "In Progress", tone: "progress" },
  { id: "review", title: "Review", tone: "review" },
  { id: "completed", title: "Completed", tone: "completed" },
  { id: "blocked", title: "Blocked", tone: "blocked" },
];

function TaskListCard({ task }: { task: ProjectTask }) {
  return (
    <div className="proj-task-card card">
      <h4>{task.title}</h4>
      {task.tag && <span className="proj-task-tag">{task.tag}</span>}
      {task.overdue && (
        <div className="proj-overdue">
          <Icon name="clock" /> Overdue — {task.overdue}
        </div>
      )}
      <div className="proj-task-card-foot">
        <select className="proj-select" defaultValue={task.status}>
          <option>{task.status}</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <div className="avatar-stack">
          {task.assignees.map((a, i) => (
            <div
              key={a}
              className="av"
              style={{
                background: AV_COLORS[i % AV_COLORS.length],
                width: 28,
                height: 28,
                fontSize: 10,
              }}
            >
              {a}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KanbanTask({ task }: { task: ProjectTask }) {
  return (
    <div className="task fade-up">
      <span className="task-tag eng">Task</span>
      <h4 className="task-title">{task.title}</h4>
      {task.overdue && (
        <div className="proj-overdue sm">
          <Icon name="clock" /> Overdue — {task.overdue}
        </div>
      )}
      <div className="task-foot">
        <span className="task-priority med">med</span>
        <span className="spacer" />
        <div className="avatar-stack">
          {task.assignees.map((a, i) => (
            <div
              key={a}
              className="av"
              style={{ background: AV_COLORS[i % AV_COLORS.length] }}
            >
              {a}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetail({ projectId }: { projectId: string }) {
  const project = getProject(projectId);
  const [tab, setTab] = useState<TabId>("tasks");
  const [discussionOpen, setDiscussionOpen] = useState(true);
  const [taskQuery, setTaskQuery] = useState("");

  const filteredTasks = useMemo(
    () =>
      TASK_LIST.filter(
        (t) =>
          !taskQuery.trim() ||
          t.title.toLowerCase().includes(taskQuery.toLowerCase()),
      ),
    [taskQuery],
  );

  if (!project) {
    return (
      <div className="card proto-empty">
        <p>Project not found.</p>
        <Link href="/projects" className="btn-primary">
          Back to projects
        </Link>
      </div>
    );
  }

  const statusText =
    project.status === "planned"
      ? "Planned"
      : project.status === "active"
        ? "Active"
        : "Completed";

  return (
    <>
      <Link href="/projects" className="proj-back">
        <Icon name="chevR" style={{ transform: "rotate(180deg)" }} /> Projects
      </Link>

      <div className="page-header proj-detail-header">
        <div>
          <div className="proj-title-row">
            <h1 className="page-title proj-detail-title">{project.title}</h1>
            <span className={`proj-status ${project.status}`}>{statusText}</span>
          </div>
          <p className="proj-release tnum">Release: {project.release}</p>
        </div>
        <div className="page-meta">
          <button type="button" className="btn-secondary">
            Details <Icon name="chevD" />
          </button>
          <button type="button" className="btn-secondary">
            <Icon name="bookmark" /> Pin
          </button>
          <button type="button" className="btn-secondary">
            <Icon name="type" /> Edit
          </button>
          <button type="button" className="btn-secondary danger-outline">
            <Icon name="x" /> Delete
          </button>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <Icon name={t.icon} />
            {t.label}
            {"count" in t && t.count != null && (
              <span className="proj-tab-count">({t.count})</span>
            )}
          </button>
        ))}
      </div>

      <div
        className={`proj-detail-body ${discussionOpen ? "" : "discussion-collapsed"}`}
      >
        <div className="proj-detail-main card">
          {tab === "tasks" && (
            <>
              <div className="toolbar">
                <div className="search" style={{ maxWidth: 280, margin: 0 }}>
                  <Icon name="search" />
                  <input
                    placeholder="Search tasks…"
                    value={taskQuery}
                    onChange={(e) => setTaskQuery(e.target.value)}
                  />
                </div>
                <button type="button" className="btn-secondary">
                  <Icon name="filter" /> Filters
                </button>
                <span className="spacer" />
                <button type="button" className="btn-primary">
                  <Icon name="plus" /> New Task
                </button>
              </div>
              <div className="proj-task-row">
                {filteredTasks.map((t) => (
                  <TaskListCard key={t.id} task={t} />
                ))}
              </div>
            </>
          )}

          {tab === "kanban" && (
            <>
              <div className="toolbar">
                <div className="search" style={{ maxWidth: 280, margin: 0 }}>
                  <Icon name="search" />
                  <input placeholder="Search tasks…" />
                </div>
                <button type="button" className="btn-secondary">
                  <Icon name="filter" /> Filters
                </button>
                <span className="spacer" />
                <button type="button" className="btn-primary">
                  <Icon name="plus" /> New Task
                </button>
              </div>
              <div className="kanban kanban-5">
                {KANBAN_COLS.map((col) => (
                  <div className={`column column-${col.tone}`} key={col.id}>
                    <div className="column-head">
                      <span className={`column-dot ${col.tone}`} />
                      <span className="column-title">{col.title}</span>
                      <span className="column-count">
                        {KANBAN[col.id].length}
                      </span>
                    </div>
                    {KANBAN[col.id].length === 0 ? (
                      <div className="proj-column-empty">
                        <Icon name="layers" />
                        <p>Nothing here yet</p>
                      </div>
                    ) : (
                      KANBAN[col.id].map((t) => (
                        <KanbanTask key={t.id} task={t} />
                      ))
                    )}
                    <button type="button" className="proj-add-task">
                      + Add task
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "charts" && (
            <>
              <div className="zoho-section-label">Project Analytics</div>
              <div className="proj-chart-grid">
                <div className="proj-chart-card">
                  <h4>Activity Over Time</h4>
                  <div className="proj-chart-line" />
                  <div className="proj-chart-legend">
                    <span>Tasks</span>
                    <span>Project</span>
                  </div>
                </div>
                <div className="proj-chart-card">
                  <h4>Activity by Team Member</h4>
                  <div className="proj-chart-bars">
                    <div style={{ width: "85%" }} />
                    <div style={{ width: "60%" }} />
                    <div style={{ width: "40%" }} />
                  </div>
                </div>
                <div className="proj-chart-card">
                  <h4>Task Status Distribution</h4>
                  <div className="proj-donut">
                    <span>2 tasks</span>
                  </div>
                </div>
                <div className="proj-chart-card">
                  <h4>Actions Breakdown</h4>
                  <div className="proj-chart-bars">
                    <div style={{ width: "70%" }} />
                    <div style={{ width: "45%" }} />
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === "activity" && (
            <ul className="proj-activity-list">
              {ACTIVITY.map((entry, i) => (
                <li key={i} className="proj-activity-item">
                  <span className="proj-activity-dot" />
                  <div>
                    <p>
                      <strong>{entry.user}</strong> {entry.action}
                    </p>
                    <span className="proj-activity-time tnum">{entry.at}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <ProjectDiscussion
          comments={COMMENTS}
          collapsed={!discussionOpen}
          onToggle={() => setDiscussionOpen((o) => !o)}
        />
      </div>
    </>
  );
}
