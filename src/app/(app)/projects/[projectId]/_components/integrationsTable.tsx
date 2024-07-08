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
import { Button, buttonVariants } from "@/components/ui/button";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import IntegrationContextMenu from "./IntegrationContextMenu";

// import type { Integration } from "@prisma/client";

interface Integration {
  id: string;
  name: string;
  apiKey: string;
  type: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

interface IntegrationsTableProps {
  integrations: Integration[];
  onDeleteIntegration: (integrationId: string) => void; // Add this prop to handle deletion
}

export function IntegrationsTable({
  integrations,
  onDeleteIntegration,
}: IntegrationsTableProps) {
  return (
    <Table>
      <TableCaption>A list of your recent integrations.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Integration Name</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Integration ID</TableHead>
          <TableHead>API key</TableHead>
          <TableHead className="text-right">Chats</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {integrations.map((integration) => (
          <TableRow key={integration.id}>
            <TableCell className="font-medium">{integration.name}</TableCell>
            <TableCell>{new Date(integration.createdAt).toLocaleString()}</TableCell>
            <TableCell>{integration.id}</TableCell>
            <TableCell>
              <IntegrationContextMenu integration={integration} />
            </TableCell>

            <TableCell className="text-right">
              <Link
                className={buttonVariants({ variant: "link" })}
                href={`/integrations/${integration.id}`}
              >
                {integration.name}
              </Link>
            </TableCell>
            <TableCell>
              <DropdownOptions
                integrationId={integration.id}
                onDeleteIntegration={onDeleteIntegration}
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
  );
}
