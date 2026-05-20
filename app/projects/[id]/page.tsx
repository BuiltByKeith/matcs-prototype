"use client";

import { useParams } from "next/navigation";
import ProjectDetail from "../../../components/screens/ProjectDetail";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  return <ProjectDetail projectId={id} />;
}
