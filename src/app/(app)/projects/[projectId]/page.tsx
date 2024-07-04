"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
// import type { Integration } from "@prisma/client";
import { Plus } from "lucide-react";
import { CreateDialog } from "./_components/createDialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { IntegrationsTable } from "./_components/integrationsTable";

interface Integration {
  id: string;
  name: string;
  apiKey: string;
  type: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

const IntegrationPage = ({ params }: { params: { projectId: string } }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { projectId } = params;
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  useEffect(() => {
    if (projectId) {
      fetch(`/api/projects/${projectId}/integrations`)
        .then((res) => res.json())
        .then((data: Integration[]) => setIntegrations(data))
        .finally(() => setLoading(false));
    }
  }, [projectId]);

  const createIntegration = async (
    integrationName: string,
    integrationType: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(
        `/api/projects/${projectId}/integrations/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: integrationName,
            type: integrationType,
          }),
        }
      );
      if (res.ok) {
        const data: Integration = await res.json();
        setIntegrations([...integrations, data]);
        return true; // Return success
      } else {
        throw new Error("Failed to create integration");
      }
    } catch (error) {
      console.error(error);
      return false; // Return failure
    }
  };

  const deleteIntegration = async (integrationId: string): Promise<void> => {
    try {
      const res = await fetch(
        `/api/projects/${projectId}/integrations/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ integrationId }),
        }
      );

      if (res.ok) {
        setIntegrations(
          integrations.filter((integration) => integration.id !== integrationId)
        );
      } else {
        console.error("Failed to delete integration");
      }
    } catch (error) {
      console.error("Error deleting integration:", error);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 className="font-bold text-4xl">Integration Management</h1>
        <CreateDialog
          onCreateIntegration={createIntegration}
          icon={<Plus size={18} />}
          buttonText="Create Integration"
        />
      </div>
      <Separator className="my-4" />
      <div><h1>{}</h1></div>
      {loading ? (
        <div className="flex items-center justify-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : integrations.length > 0 ? (
        <IntegrationsTable
          integrations={integrations}
          onDeleteIntegration={deleteIntegration}
        />
      ) : (
        <p className="grid place-content-center justify-center">
          No integrations available.
        </p>
      )}
    </div>
  );
};

// 3e78dbe4-80ec-4bbc-b891-bb67018883f7

export default IntegrationPage;
