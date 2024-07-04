"use client";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ProjectsTable } from "./_components/projectsTable";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateDialog } from "./_components/createDialog";

interface Project {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("/api/projects");
      const data: Project[] = await res.json();
      setProjects(data);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const createProject = async (projectName: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: projectName }),
      });

      if (res.ok) {
        const newProject: Project = await res.json();
        setProjects([...projects, newProject]);
        return true; // Return success
      } else {
        throw new Error("Failed to create project");
      }
    } catch (error) {
      console.error(error);
      return false; // Return failure
    }
  };

  const deleteProject = async (projectId: string): Promise<void> => {
    try {
      const res = await fetch(`/api/projects/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });

      if (res.ok) {
        setProjects(projects.filter((project) => project.id !== projectId));
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="w-full">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 className="font-bold text-4xl">Projects</h1>
        <CreateDialog
          onCreateProject={createProject}
          icon={<Plus size={18} />}
          buttonText="Create Project"
        />
      </div>
      <Separator className="my-4" />
      {loading ? (
        <>
          <div className="flex items-center justify-center min-w-full">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </>
      ) : projects.length > 0 ? (
        <ProjectsTable projects={projects} onDeleteProject={deleteProject} />
      ) : (
        <p className="grid place-content-center justify-center">
          No projects available.
        </p>
      )}
    </div>
  );
};

export default ProjectsPage;
