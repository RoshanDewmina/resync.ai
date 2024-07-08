

"use client";
import {
  Bird,
  Book,
  Bot,
  Code2,
  CornerDownLeft,
  Frown,
  LifeBuoy,
  Loader,
  Mic,
  Paperclip,
  Pencil,
  Rabbit,
  Settings,
  Settings2,
  Share,
  SquareTerminal,
  SquareUser,
  Triangle,
  Turtle,
  User,
  Wand,
} from "lucide-react";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import UploadDocuments from "./_components/page";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completion, setCompletion] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [integrationId, setIntegrationId] = useState<string>("");
  const [prevSessionId, setPrevSessionId] = useState<string>("");
  const [messages, setMessages] = useState<{ sender: string, content: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setCompletion(null);

    // Add the user's message to the messages state
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', content: query }]);

    try {
      if (!prevSessionId) {
        const response = await fetch(`/api/v1/chat-sessions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            integration_id: integrationId,
            guidance: "",
            context: "",
            role: "user",
            tags: [],
            chat_mode: "",
            messages: [{ role: "user", content: query }],
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Something went wrong");
        } else {
          setCompletion(data.message?.content || "No answer found");
          setSessionId(data.chat_session_id);
          setMessages((prevMessages) => [...prevMessages, { sender: 'bot', content: data.message?.content || "No answer found" }]);
        }
      } else {
        const response = await fetch(`/api/v1/chat-sessions/${prevSessionId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            integration_id: integrationId,
            guidance: "",
            context: "",
            role: "user",
            tags: [],
            chat_mode: "",
            messages: [{ role: "user", content: query }],
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Something went wrong");
        } else {
          setCompletion(data.message?.content || "No answer found");
          setSessionId(data.chat_session_id);
          setMessages((prevMessages) => [...prevMessages, { sender: 'bot', content: data.message?.content || "No answer found" }]);
        }
      }
    } catch (error) {
      setError("Failed to fetch data");
    } finally {
      setIsLoading(false);
      setQuery("");
    }
  };

  return (
    <div className="grid h-full w-full p-4">
      <div className="flex flex-col">
        <header className="top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4 ring-1 p-4 rounded-xl ring-gray-200">
          <h1 className="text-xl font-semibold">Playground</h1>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 text-sm"
          >
            <Share className="size-3.5" />
            Share
          </Button>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            className="relative hidden flex-col items-start gap-8 md:flex"
            x-chunk="dashboard-03-chunk-0"
          >
            <div className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Settings
                </legend>
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <div className="grid gap-3">
                    <Label htmlFor="content">Chat Session ID</Label>
                    <Input
                      id="chatSessionId"
                      placeholder="Add Chat Session ID to access previous chats"
                      value={prevSessionId}
                      onChange={(e) => setPrevSessionId(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="content">Integration</Label>
                    <Input
                      id="integrationId"
                      placeholder="Add integration ID"
                      value={integrationId}
                      onChange={(e) => setIntegrationId(e.target.value)}
                    />
                  </div>
                </fieldset>
                <div className="overflow-auto max-h-[500px]">
                  <UploadDocuments integrationId={integrationId}/>
                </div>
              </fieldset>
            </div>
          </div>
          <div className="relative flex min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <div className="grid w-full h-full mb-4 items-start gap-6">
              <fieldset className="h-full grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Settings
                </legend>

                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} gap-4`}>
                    <span className={`p-2 w-8 h-8 rounded-full text-center flex items-center justify-center ${message.sender === 'user' ? 'bg-slate-100 dark:bg-slate-300' : 'bg-green-100'}`}>
                      {message.sender === 'user' ? <User width={18} /> : <Wand width={18} className="text-white" />}
                    </span>
                    {/* <p className={`mt-0.5 font-semibold ${message.sender === 'user' ? 'text-slate-700 dark:text-slate-100' : 'text-green-700'}`}>
                      {message.content.replace(/"/g, "")}
                    </p> */}
                  </div>
                ))}

                {isLoading && (
                  <div className="animate-spin relative flex w-5 h-5 ml-2">
                    <Loader />
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-4">
                    <span className="bg-red-100 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                      <Frown width={18} />
                    </span>
                    <span className="text-slate-700 dark:text-slate-100">
                      Sad news, the search has failed! Please try again.
                    </span>
                  </div>
                )}

                {completion && !error ? (
                  <div className="flex items-center gap-4 dark:text-white">
                    <span className="bg-green-500 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                      <Wand width={18} className="text-white" />
                    </span>
                    <h3 className="font-semibold">:</h3>
                    {completion.replace(/"/g, "")}
                  </div>
                ) : null}
              </fieldset>
            </div>

            <form
              className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
              onSubmit={handleSubmit}
            >
              <Label htmlFor="message" className="sr-only">
                Message
              </Label>

              <Textarea
                id="message"
                placeholder="Type your message here..."
                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex items-center pb-5 m-2">
                {sessionId && (
                  <Badge variant="outline">`SessionId : {sessionId}`</Badge>
                )}
                <Button
                  type="submit"
                  size="sm"
                  className="ml-auto gap-1.5"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Send Message"}
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
