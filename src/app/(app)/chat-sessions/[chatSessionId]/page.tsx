"use client";
import { useEffect, useState } from "react";
import type { Message } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@radix-ui/themes";
import ChatInterface from "../_components/chatInterface";
import { UserIcon, BotIcon } from "lucide-react";

const ChatSessionPage = ({ params }: { params: { chatSessionId: string } }) => {
  const { chatSessionId } = params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (chatSessionId) {
      // Fetch messages for this chat session
      fetch(`/api/chat-sessions/${chatSessionId}`)
        .then((res) => res.json())
        .then((data: { messages: Message[] }) => setMessages(data.messages))
        .catch((error) => console.error("Error fetching messages:", error));
    }
  }, [chatSessionId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);

    const res = await fetch(`/api/chat-sessions/${chatSessionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          role: "user",
          content: newMessage,
          recordsCited: null,
        },
        stream: false,
      }),
    });

    if (res.ok) {
      const data: { message: Message } = await res.json();
      setMessages([...messages, data.message]);
      setNewMessage("");
    } else {
      alert("Failed to send message");
    }

    setIsLoading(false);
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
        <h1 className="font-bold text-4xl">Chat Session</h1>
        {/* <CreateDialog
          onCreateChatSession={createChatSession}
          icon={<Plus size={18} />}
          buttonText="Create Chat Session"
        /> */}
      </div>
      <Separator className="my-4" />
      <div className="p-2">
        {messages?.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              padding: "4px",
            }}
          >
            {" "}
            <Skeleton>
              {msg.role === "user" ? (
                <>
                  <div>{msg.content}</div>
                  <UserIcon className="ml-2" />
                </>
              ) : (
                <>
                  <BotIcon className="mr-2" />
                  <div>{msg.content}</div>
                </>
              )}
            </Skeleton>
          </div>
        ))}
        {isLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            {/* <Skeleton className="h-12 w-12 rounded-lg" /> */}
          </div>
        )}
      </div>
      <Separator className="my-4" />
      <ChatInterface
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default ChatSessionPage;
