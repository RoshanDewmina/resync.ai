// app/projects/_components/projectsTable.tsx
"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { DropdownOptions } from "./dropdownMenu";
import { buttonVariants } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsTableProps {
  projects: Project[];
  onDeleteProject: (projectId: string) => void; // Add this prop to handle deletion
}

export function ProjectsTable({
  projects,
  onDeleteProject,
}: ProjectsTableProps) {
  return (
    <div className="w-full">
      <Table>
        <TableCaption>A list of your recent projects.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Project Name</TableHead>
            <TableHead>Created At</TableHead>
            {/* <TableHead>Updated At</TableHead> */}
            <TableHead className=" ">View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell>{project.createdAt}</TableCell>
              {/* <TableCell>{project.updatedAt}</TableCell> */}
              <TableCell className="-translate-x-4 font-bold">
                <Link
                  className={buttonVariants({ variant: "link" })}
                  href={`/projects/${project.id}`}
                >
                  {project.name}
                </Link>
              </TableCell>
              <TableCell>
                <DropdownOptions
                  projectId={project.id}
                  onDeleteProject={onDeleteProject}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            {/* <TableCell colSpan={4}>End</TableCell> */}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
