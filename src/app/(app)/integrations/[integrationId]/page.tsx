
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CreateDialog } from "../_components/createDialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatSessionsTable } from "../_components/chatSessionsTable";

interface ApiKeyResponse {
  apiKey: string;
}

interface ChatSession {
  name: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

const IntegrationPage = ({ params }: { params: { integrationId: string } }) => {
  const { integrationId } = params;
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [apiKey, setApiKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (integrationId) {
      // Fetch chat sessions for this integration
      fetch(`/api/integrations/${integrationId}/chat-sessions`)
        .then((res) => res.json())
        .then((data: ChatSession[]) => setChatSessions(data));

      // Fetch API key for this integration
      fetch(`/api/integrations/${integrationId}/api-key`)
        .then((res) => res.json())
        .then((data: ApiKeyResponse) => setApiKey(data.apiKey));

      setLoading(false);
    }
  }, [integrationId]);

  const createChatSession = async (projectName: string): Promise<boolean> => {
    const res = await fetch(
      `/api/integrations/${integrationId}/create-chat-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: projectName }),
      }
    );
    if (res.ok) {
      const data: ChatSession = await res.json();
      setChatSessions([...chatSessions, data]);
      return true; // Return success
    } else {
      return false; // Return failure
    }
  };

  const deleteChatSession = async (chatSessionId: string): Promise<void> => {
    try {
      const res = await fetch(
        `/api/integrations/${integrationId}/delete-chat-session`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chatSessionId }),
        }
      );

      if (res.ok) {
        setChatSessions(
          chatSessions.filter((chatSession) => chatSession.id !== chatSessionId)
        );
      } else {
        console.error("Failed to delete chat session");
      }
    } catch (error) {
      console.error("Error deleting chat session:", error);
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
        <h1 className="font-bold text-4xl">Chat Sessions</h1>
        <CreateDialog
          onCreateChatSession={createChatSession}
          icon={<Plus size={18} />}
          buttonText="Create Chat Session"
        />
      </div>
      {/* <p>API Key: {apiKey}</p> */}
      <Separator className="my-4" />
      {loading ? (
        <div className="flex items-center justify-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : chatSessions.length > 0 ? (
        <ChatSessionsTable
          chatSessions={chatSessions}
          onDeleteChatSession={deleteChatSession}
        />
      ) : (
        <p className="grid place-content-center justify-center">
          No chat sessions available.
        </p>
      )}
    </div>
  );
};

export default IntegrationPage;
