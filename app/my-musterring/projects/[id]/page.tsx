import { projects } from "@/lib/data";
import { ProjectDetailClient } from "@/components/ProjectDetailClient";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find((item) => item.id === id) ?? projects[0];
  return <ProjectDetailClient seedProject={project} />;
}
