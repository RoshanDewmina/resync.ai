// app/(temp)iconDialog.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./_components/dialog";
import { Input } from "@/components/ui/input";
import {
  X,
  Loader,
  User,
  Frown,
  CornerDownLeft,
  Search,
  Wand,
} from "lucide-react";

export default function IconDialog() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState<string>("");
  const [completion, setCompletion] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen(true);
      }

      if (e.key === "Escape") {
        handleModalToggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  function handleModalToggle() {
    setOpen(!open);
    setQuery("");
    setCompletion(null);
    setError(null);
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCompletion(null);
    setError(null);

    try {
      const response = await fetch("/api/v0/chat-sessions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 3e78dbe4-80ec-4bbc-b891-bb67018883f7`,
          // Authorization: `Bearer ${process.env.reSync_API_KEY}`,
        },
        body: JSON.stringify({
          //   integration_id: "f034d36c-388c-40e0-88f7-48c81c7205ad",
          //   messages: [{ role: "user", content: query }],

          integration_id: "f034d36c-388c-40e0-88f7-48c81c7205ad",
          // integration_id: process.env.reSync_INTEGRATION_ID,
          guidance: "NON",
          context: "Im a student",
          messages: [
            {
              role: "user",
              content: query,
            },
          ],
          tags: ["tag1", "tag2"],
          chat_mode: "AUTO",
          stream: true,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setCompletion(data.message.content);
      }
    } catch (err) {
      setError("Error sending message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-base flex flex-col gap-2 items-center px-4 py-2 z-50 relative
        text-slate-500 dark:text-slate-400  hover:text-slate-700 dark:hover:text-slate-300
        transition-colors
        rounded-md
        border border-slate-200 dark:border-slate-500 hover:border-slate-300 dark:hover:border-slate-500
        min-w-[50px] min-h-[70px]"
      >
        <Search width={15} />
        {/* <span className="border border-l h-5"></span> */}
        <span className="inline-block">Ask AI</span>
        {/* <kbd
          className="absolute right-3 top-2.5
          pointer-events-none inline-flex h-5 select-none items-center gap-1
          rounded border border-slate-100 bg-slate-100 px-1.5
          font-mono text-[10px] font-medium
          text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400
          opacity-100 "
        >
          <span className="text-xs">⌘</span>K
        </kbd> */}
      </button>
      <Dialog open={open}>
        <DialogContent className="sm:max-w-[850px] max-h-[80vh] overflow-y-auto text-black dark:text-slate-100">
          <DialogHeader>
            <DialogTitle>reSync Ai powered search</DialogTitle>
            <DialogDescription>
              Hi, What can i help you with today?
            </DialogDescription>
            <hr />
            <button
              className="absolute top-0 right-2 p-2"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4 dark:text-gray-100" />
            </button>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 text-slate-700">
              {query && (
                <div className="flex gap-4">
                  <span className="bg-slate-100 dark:bg-slate-300 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <User width={18} />
                  </span>
                  <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">
                    {query}
                  </p>
                </div>
              )}

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
                  {/* <h3 className="font-semibold">Answer:</h3> */}
                  <p>{completion}</p>
                </div>
              ) : null}

              <div className="relative">
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
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-100">
                Or try:{" "}
                <button
                  type="button"
                  className="px-1.5 py-0.5
                  bg-slate-50 dark:bg-gray-500
                  hover:bg-slate-100 dark:hover:bg-gray-600
                  rounded border border-slate-200 dark:border-slate-600
                  transition-colors"
                  onClick={(_) => setQuery("What are embeddings?")}
                >
                  What are embeddings?
                </button>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-red-500">
                Ask
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
