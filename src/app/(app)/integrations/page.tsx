// app/integration/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Integration } from "@prisma/client";

const IntegrationsPage = () => {
  const [integration, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIntegrations = async () => {
      const res = await fetch("/api/integrations");
      const data: Integration[] = await res.json();
      setIntegrations(data);
      setLoading(false);
    };

    fetchIntegrations();
  }, []);

  //   const createIntegration = async () => {
  //     const IntegrationName = prompt("Enter Integration name:");
  //     const IntegrationType = prompt("Enter Integration type:");
  //     if (!IntegrationName || !IntegrationType) return;

  //     const res = await fetch(
  //       `/api/projects/${projectId}/integrations/generate-integration-id`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(
  //           { name: IntegrationName, type: IntegrationType }
  //         ),
  //       }
  //     );
  //     if (res.ok) {
  //       const data: Integration = await res.json();
  //       setIntegrations([...integrations, data]);
  //     } else {
  //       alert("Failed to create Integration");
  //     }
  //   };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Integrations</h1>
        {/* <button onClick={createIntegration}>Create Integration</button> */}
      </div>
      {loading ? (
        <p>Loading integration...</p>
      ) : integration.length > 0 ? (
        <ul>
          {integration.map((integration) => (
            <li key={integration.id}>
              <Link href={`/integrations/${integration.id}`}>
                {integration.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No integration available.</p>
      )}
    </div>
  );
};

export default IntegrationsPage;
