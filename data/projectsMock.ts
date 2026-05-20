export type ProjectStatus = "planned" | "active" | "completed";

export type Project = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  release: string;
  date: string;
  members: number;
  tasks: number;
  pinned?: boolean;
};

export type ProjectTask = {
  id: number;
  title: string;
  tag?: string;
  overdue?: string;
  status: string;
  assignees: string[];
};

export type KanbanColumnId =
  | "todo"
  | "progress"
  | "review"
  | "completed"
  | "blocked";

export type ActivityEntry = {
  user: string;
  action: string;
  at: string;
};

export type Comment = {
  id: number;
  author: string;
  initials: string;
  date: string;
  body: string;
  resolved?: boolean;
};

export const PROJECTS: Project[] = [
  {
    id: "cloud-shift-website",
    title: "Cloud Shift Corporate Website and VirtuHire Website Improvement",
    description:
      "Corporate site refresh, VirtuHire positioning, and shared design system rollout across both properties.",
    status: "planned",
    release: "4/20/2026",
    date: "May 8, 2026",
    members: 5,
    tasks: 47,
    pinned: true,
  },
  {
    id: "q3-brand-refresh",
    title: "Q3 Brand Refresh",
    description:
      "Homepage hero, social templates, and voice guidelines for the Cloud Shift marketing push.",
    status: "active",
    release: "6/15/2026",
    date: "May 12, 2026",
    members: 4,
    tasks: 32,
    pinned: true,
  },
  {
    id: "spring-email-launch",
    title: "Spring Product Launch Email Sequence",
    description:
      "Six-email nurture sequence supporting the spring campaign across email and social.",
    status: "active",
    release: "5/1/2026",
    date: "May 6, 2026",
    members: 3,
    tasks: 18,
  },
  {
    id: "zoho-migration",
    title: "Zoho CRM Tag Migration",
    description:
      "Map legacy CRM tags to Zoho custom fields and validate sync with marketing ops.",
    status: "planned",
    release: "7/1/2026",
    date: "May 14, 2026",
    members: 2,
    tasks: 24,
  },
  {
    id: "intelligence-empty-states",
    title: "Intelligence Empty-State Illustrations",
    description:
      "Illustration set and copy for dashboard widgets when data is loading or unavailable.",
    status: "planned",
    release: "8/10/2026",
    date: "May 20, 2026",
    members: 2,
    tasks: 9,
  },
  {
    id: "composer-ai",
    title: "Composer AI Suggestions",
    description:
      "Wire Gemini caption and hashtag suggestions into the social compose flow.",
    status: "active",
    release: "5/22/2026",
    date: "May 11, 2026",
    members: 4,
    tasks: 21,
  },
];

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export const TASK_LIST: ProjectTask[] = [
  {
    id: 1,
    title: "REVOPS APPROACH FOR CLOUDSHIFT AND VIRTUHIRE",
    tag: "Feature",
    overdue: "Apr 30",
    status: "To Do",
    assignees: ["DP", "KD"],
  },
  {
    id: 2,
    title: "Homepage hero copy and layout approval",
    tag: "Feature",
    overdue: "May 2",
    status: "To Do",
    assignees: ["AA", "MK"],
  },
];

export const KANBAN: Record<KanbanColumnId, ProjectTask[]> = {
  todo: TASK_LIST,
  progress: [],
  review: [],
  completed: [],
  blocked: [],
};

export const ACTIVITY: ActivityEntry[] = [
  {
    user: "Derrick Poon Young",
    action: "created task \"REVOPS APPROACH FOR CLOUDSHIFT AND VIRTUHIRE\"",
    at: "3/27/2026, 4:29:50 AM",
  },
  {
    user: "System Admin",
    action: "updated project status to Planned",
    at: "3/26/2026, 2:10:00 PM",
  },
  {
    user: "Morgan Kim",
    action: "added comment on project discussion",
    at: "3/25/2026, 9:15:22 AM",
  },
  {
    user: "Allen Keith Aradillos",
    action: "pinned project",
    at: "3/24/2026, 11:02:18 AM",
  },
];

export const COMMENTS: Comment[] = [
  {
    id: 1,
    author: "System Admin",
    initials: "SA",
    date: "Mar 28",
    body: "Please review the RevOps approach doc before we lock homepage messaging.",
  },
  {
    id: 2,
    author: "Kyle Derrick",
    initials: "KD",
    date: "Mar 27",
    body: "@Allen Keith Aradillos — shared draft in Prism Notes. Feedback welcome by Friday.",
  },
  {
    id: 3,
    author: "Derrick Poon Young",
    initials: "DP",
    date: "Mar 23",
    body: "VirtuHire section needs updated product screenshots from the design team.",
  },
];
