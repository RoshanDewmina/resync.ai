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
} from "./components/dialog";
import { Input } from "@/components/ui/input";
import {
  X,
  Loader,
  User,
  Frown,
  CornerDownLeft,
  Search,
  Wand,
  Send,
} from "lucide-react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import WordRotate from "@/components/magicui/word-rotate";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ResyncWidgetProps {
  authorization: string;
  integrationId: string;
  guidance?: string;
  context?: string;
  role?: string;
  tags?: string[];
  chatMode?: string;
  //   organizationDisplayName?: string;
  title?: string;
  description?: string;
  primaryBrandColor?: string;
  botAvatarLight?: React.ReactNode;
  botAvatarDark?: React.ReactNode;
  buttonText?: string;
  questions?: string[];
  searchButtonType?: "searchBar" | "iconText" | "icon";
  classNames?: {
    button?: string;
    card?: string;
    cardHeader?: string;
    cardBody?: string;
    modalFooter?: string;
    searchButton?: string;
    closeButton?: string;
    submitButton?: string;
  };
}

export function ResyncWidget({
  authorization,
  integrationId,
  guidance,
  context,
  role = "user",
  tags = [],
  chatMode = "NORMAL",
  //   organizationDisplayName,
  title = "OpenAI powered doc search",
  description = "Build your own ChatGPT style search with Next.js, OpenAI & Supabase.",
  primaryBrandColor,
  botAvatarLight,
  botAvatarDark,
  buttonText = "Ask Ai",
  questions = [],
  searchButtonType = "searchBar",
  classNames = {},
}: ResyncWidgetProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [completion, setCompletion] = React.useState<string | null>(null);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen(true);
      }

      if (e.key === "Escape") {
        console.log("esc");
        handleModalToggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  function handleModalToggle() {
    setOpen(!open);
    setQuery("");
    setError(null);
    setCompletion(null);
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setCompletion(null);

    try {
      const response = await fetch(
        // `${process.env.NEXT_BASE_URL}/api/v0/chat-sessions`,
        `/api/v0/chat-sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authorization}`,
          },
          body: JSON.stringify({
            integration_id: integrationId,
            guidance,
            context,
            role,
            tags,
            chat_mode: chatMode,
            messages: [{ role: "user", content: query }],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setCompletion(data.message?.content || "No answer found");
      }
    } catch (error) {
      setError("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {searchButtonType === "searchBar" && (
        <Button
          onClick={() => setOpen(true)}
          variant="default"
          className={cn(
            "text-base flex gap-2 items-center px-4 py-2 z-50 relative text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors rounded-md border border-slate-200 dark:border-slate-500 hover:border-slate-300 dark:hover:border-slate-500 min-w-[200px]",
            classNames.button
          )}
        >
          <Search width={15} />
          <span className="inline-block ">Search...</span>
          <kbd className="absolute right-3 top-2.5 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-100 bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>{" "}
        </Button>
      )}
      {searchButtonType === "iconText" && (
        <Button
          onClick={() => setOpen(true)}
          className={cn(
            "text-base flex flex-col gap-2 items-center px-4 py-2 z-50 relative text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors rounded-md border border-slate-200 dark:border-slate-500 hover:border-slate-300 dark:hover:border-slate-500 min-w-[50px] min-h-[80px]",
            classNames.button
          )}
        >
          {" "}
          <Search width={15} />
          {buttonText}
        </Button>
      )}
      {searchButtonType === "icon" && (
        <Button
          onClick={() => setOpen(true)}
          className={cn(
            "text-base flex items-center justify-center p-2 z-50 relative text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors rounded-md min-w-[50px] min-h-[50px]",
            classNames.button
          )}
        >
          <Search width={15} />
        </Button>
      )}

      <Dialog open={open}>
        <DialogContent
          className={cn(
            "sm:max-w-[850px] max-h-[80vh] overflow-y-auto text-black",
            classNames.card
          )}
        >
          <DialogHeader className={cn(classNames.cardHeader)}>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
            <hr />
            <button
              className={cn(
                "absolute top-0 right-2 p-2",
                classNames.closeButton
              )}
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4 dark:text-gray-100" />
            </button>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div
              className={cn(
                "grid gap-4 py-4 text-slate-700",
                classNames.cardBody
              )}
            >
              {query && (
                <div className="flex gap-4">
                  <span className="bg-slate-100 dark:bg-slate-300 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <User width={18} />{" "}
                  </span>
                  <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">
                    {query}
                  </p>
                </div>
              )}

              {isLoading && (
                <>
                  <div className="grid grid-cols-2">
                    {" "}
                    <div className="animate-spin relative flex w-5 h-5 ml-2">
                      <Loader />
                    </div>
                    {/* <div className="flex items-start">
                      <WordRotate
                        className="text-sm font-light text-black dark:text-white"
                        words={["Understanding Query", "Thinking", "Searching"]}
                      />
                    </div> */}
                  </div>
                </>
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
                  {completion}
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

              {questions.length > 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-100">
                  Or try:{" "}
                  {questions.map((question: any, index) => (
                    <button
                      key={index}
                      type="button"
                      className="px-1.5 py-0.5 bg-slate-50 dark:bg-gray-500 hover:bg-slate-100 dark:hover:bg-gray-600 rounded border border-slate-200 dark:border-slate-600 transition-colors"
                      onClick={(_) => setQuery(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className={cn(classNames.modalFooter)}>
              <Button
                type="submit"
                className={cn("bg-red-500", classNames.submitButton)}
              >
                <Send width={18} />
              </Button>
              <div className="absolute bottom-4 left-4 text-sm">
                Powered By{" "}
                <a
                  href="https://www.resyncai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  Resync
                </a>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
