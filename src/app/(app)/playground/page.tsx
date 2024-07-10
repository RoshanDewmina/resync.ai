

"use client";
import {
  CornerDownLeft,
  Frown,
  Loader,
  Plus,
  Share,
  Unplug,
  User,
  Wand,
} from "lucide-react";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import UploadDocuments from "./_components/page";
import {
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Card,
} from "@nextui-org/react";
import { cn } from "@/lib/cn";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completion, setCompletion] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [integrationId, setIntegrationId] = useState<string>("");
  const [prevSessionId, setPrevSessionId] = useState<string>("");
  const [messages, setMessages] = useState<
    { sender: string; content: string }[]
  >([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setCompletion(null);

    // Add the user's message to the messages state
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", content: query },
    ]);

    try {
      const response = await fetch(
        // prevSessionId
          // ? `/api/v1/chat-sessions/${prevSessionId}`
          `/api/v0/chat-sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 884fef34-4c00-4d85-9a29-21adf9621523`,
          },
          body: JSON.stringify({
            integration_id: "76882c33-61b7-460d-88b8-260cce563643",
            guidance: "",
            context: "",
            role: "user",
            tags: [],
            chat_mode: "",
            messages: [{ role: "user", content: query }],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setCompletion(data.message?.content || "No answer found");
        setSessionId(data.chat_session_id);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "bot",
            content: data.message?.content || "No answer found",
          },
        ]);
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
            variant="bordered"
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
                    <Label htmlFor="chatSessionId">Chat Session ID</Label>
                    <Input
                      id="chatSessionId"
                      placeholder="Add Chat Session ID to access previous chats"
                      value={prevSessionId}
                      onChange={(e) => setPrevSessionId(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="integrationId">Integration</Label>
                    <Input
                      id="integrationId"
                      placeholder="Add integration ID"
                      value={integrationId}
                      onChange={(e) => setIntegrationId(e.target.value)}
                    />
                  </div>
                </fieldset>
                <div className="overflow-auto max-h-[500px]">
                  <UploadDocuments integrationId={integrationId} />
                </div>
              </fieldset>
            </div>
          </div>
          <div className="relative flex min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <Card>
              {/* <CardContent> */}
                <>
                  <CardHeader
                    className={cn("flex justify-between gap-1 items-center")}
                  >
                    <div className="flex flex-col gap-1">Resync Ai</div>
                  </CardHeader>
                  <Card className={cn("py-4")}>
                    <CardHeader
                      className={cn("pb-0 pt-2 px-4 flex-col items-start")}
                    >
                      <h4 className="font-bold text-large">Hi</h4>
                      <p className="text-tiny font-bold">How can I help?</p>
                    </CardHeader>
                    <div className="flex justify-end -translate-y-8">
                      <Button
                        variant="light"
                        color="danger"
                        onClick={() => setMessages([])}
                      >
                        <Plus className="cursor-pointer text-danger" />
                      </Button>
                    </div>
                    <CardBody className={cn("overflow-visible py-2")}>
                      <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4 text-slate-700 overflow-y-auto max-h-96">
                          {messages.map((message, index) => (
                            <div key={index} className="flex flex-col gap-2">
                              <div className="flex gap-4">
                              <span className="bg-slate-100 dark:bg-slate-300 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                                {message.sender === "user" ? (
                                  <User width={18} />
                                ) : (
                                  <Wand width={18} />
                                )}
                              </span>
                                <div>
                                  <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">
                                    {message.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}

                          {isLoading && (
                            <div className="flex flex-col space-y-3">
                              <div className="flex items-center gap-2">
                                <Loader className="animate-spin" />
                                <span className="text-slate-700 dark:text-slate-100">
                                  Loading...
                                </span>
                              </div>
                            </div>
                          )}

                          {error && (
                            <div className="flex items-center gap-4">
                              <span className="bg-red-100 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                                <Unplug width={18} />
                              </span>
                              <span className="text-slate-700 dark:text-slate-100">
                                Sad news, the search has failed! Please try
                                again.
                              </span>
                            </div>
                          )}

                          {/* <div className="relative">
                            <Input
                              placeholder="Ask a question..."
                              name="search"
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              className="col-span-3"
                            />
                            <CornerDownLeft
                              className={`absolute top-3 right-5 h-4 w-4 text-gray-300 transition-opacity ${
                                query ? "opacity-100" : "opacity-0"
                              }`}
                            />
                          </div> */}
                        </div>
                        <CardFooter className={cn("flex justify-between")}>
                          {/* <div className="flex gap-2 mt-10">
                            <Button
                              variant="shadow"
                              color="primary"
                              type="submit"
                            >
                              Ask
                            </Button>
                          </div> */}
                        </CardFooter>
                      </form>
                    </CardBody>
                  </Card>
                </>
              {/* </CardContent> */}
            </Card>

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
              {sessionId && (
                  <Badge variant="outline">SessionId : {sessionId}</Badge>
                )}
            </form>
          </div>
          
        </main>
      </div>
    </div>
  );
}
