"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Card,
  CardHeader,
  CardBody,
  ModalProps,
} from "@nextui-org/react";

import {
  CornerDownLeft,
  Unplug,
  Loader,
  Search,
  User,
  Wand,
  Edit3,
  Plus,
} from "lucide-react";

import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };

type ResyncWidgetProps = ModalProps & {
  authorization: string;
  integrationId: string;
  guidance?: string;
  context?: string;
  role?: string;
  tags?: string[];
  chatMode?: string;
  stream?: boolean;
  organizationDisplayName?: string;
  title?: string;
  description?: string;
  primaryBrandColor?: string;
  botAvatarLight?: React.ReactNode;
  botAvatarDark?: React.ReactNode;
  questions?: string[];
  searchButtonType?: "searchBar" | "iconSearch" | "icon";
  customButton?: React.ReactNode;
  classNames?: {
    button?: string;
    modal?: string;
    modalHeader?: string;
    card?: string;
    cardHeader?: string;
    cardBody?: string;
    modalFooter?: string;
    searchButton?: string;
    closeButton?: string;
    submitButton?: string;
  };
};

const ResyncWidget: React.FC<ResyncWidgetProps> = ({
  authorization,
  integrationId,
  guidance,
  context,
  role = "user",
  tags = [],
  chatMode = "NORMAL",
  stream = true,
  organizationDisplayName,
  title,
  description,
  primaryBrandColor,
  botAvatarLight,
  botAvatarDark,
  questions = [],
  searchButtonType = "searchBar",
  customButton,
  classNames,
  ...modalProps
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [query, setQuery] = useState<string>("");
  const [completion, setCompletion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>(
    "Understanding the question..."
  );
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<
    { question: string; answer: string }[]
  >([]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        onOpen();
      }

      if (e.key === "Escape") {
        handleModalToggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onOpen]);

  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    if (isLoading) {
      timer1 = setTimeout(() => {
        setLoadingText("Searching...");
        timer2 = setTimeout(() => {
          setLoadingText("Verifying result...");
        }, 2000);
      }, 1000);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isLoading]);

  function handleModalToggle() {
    onOpenChange();
    setQuery("");
    setCompletion(null);
    setError(null);
  }

  function handleClearHistory() {
    setChatHistory([]);
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
      const response = await fetch(`/api/v0/chat-sessions`, {
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
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setCompletion(data.message.content);
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { question: query, answer: data.message.content },
        ]);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Error sending message");
    } finally {
      setIsLoading(false);
    }
  };

  const renderButton = () => {
    if (customButton) return customButton;

    switch (searchButtonType) {
      case "iconSearch":
        return (
          <Button
            onPress={onOpen}
            className={cn(
              "flex flex-col items-center relative w-25 h-20 backdrop-blur-md ring-1 ring-slate-200 p-4 bg-white/50 rounded-xl",
              classNames?.searchButton
            )}
            style={{ backgroundColor: primaryBrandColor }}
          >
            <div className="flex justify-center w-full">
              <Search width={30} className="text-center" />
            </div>
            <span className="inline-block text-center">Search...</span>
          </Button>
        );
      case "icon":
        return (
          <Button
            onPress={onOpen}
            className={cn(
              "flex flex-col items-center justify-center w-12 h-12 backdrop-blur-md ring-1 ring-slate-200 p-4 bg-white/50 rounded-xl",
              classNames?.searchButton
            )}
            style={{ backgroundColor: primaryBrandColor }}
          >
            <div className="flex items-center justify-center w-full h-full ">
              <Search width={30} className="text-center" />
            </div>
          </Button>
        );
      case "searchBar":
      default:
        return (
          <Button
            onPress={onOpen}
            className={cn(
              "flex space-x-1 align-end gap-1 relative w-52 h-10 backdrop-blur-md ring-1 ring-slate-200 p-4 bg-white/50 rounded-xl",
              classNames?.searchButton
            )}
            style={{ backgroundColor: primaryBrandColor }}
          >
            <Search width={15} className="" />
            <span className="inline-block font-semibold">Ask Me!</span>
          </Button>
        );
    }
  };

  return (
    <>
      {renderButton()}
      <Modal
        {...modalProps}
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className={cn(classNames?.modal)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader
                className={cn(
                  "flex justify-between gap-1 items-center",
                  classNames?.modalHeader
                )}
              >
                <div className="flex flex-col gap-1">
                  {organizationDisplayName}
                </div>
              </ModalHeader>
              <Card className={cn("py-4", classNames?.card)}>
                <CardHeader
                  className={cn(
                    "pb-0 pt-2 px-4 flex-col items-start",
                    classNames?.cardHeader
                  )}
                >
                  <h4 className="font-bold text-large">{title}</h4>
                  <p className="text-tiny font-bold">{description}</p>

                  <div className=" flex justify-end  -translate-y-10 translate-x-80 pl-8">
                    <Button
                      variant="light"
                      color="danger"
                      onClick={handleClearHistory}
                    >
                      <Plus className="text-danger" />
                    </Button>
                  </div>
                </CardHeader>

                <CardBody
                  className={cn("overflow-visible py-2", classNames?.cardBody)}
                >
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4 text-slate-700 overflow-y-auto max-h-96">
                      {chatHistory.map((chat, index) => (
                        <div key={index} className="flex flex-col gap-2">
                          <div className="flex gap-4">
                            <span className="bg-slate-100 dark:bg-slate-300 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                              <User width={18} />
                            </span>
                            <div>
                              <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">
                                {chat.question}
                              </p>
                              <p>{chat.answer}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {isLoading && (
                        <div className="flex flex-col space-y-3">
                          <div className="flex items-center gap-2">
                            <Loader className="animate-spin" />
                            <span className="text-slate-700 dark:text-slate-100">
                              {loadingText}
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
                            Sad news, the search has failed! Please try again.
                          </span>
                        </div>
                      )}

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
                          {questions.map((question, index) => (
                            <button
                              key={index}
                              type="button"
                              className="px-1.5 py-0.5 bg-slate-50 dark:bg-gray-500 hover:bg-slate-100 dark:hover:bg-gray-600 rounded border border-slate-200 dark:border-slate-600 transition-colors"
                              onClick={() => setQuery(question)}
                            >
                              {question}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <ModalFooter
                      className={cn(
                        "flex justify-between",
                        classNames?.modalFooter
                      )}
                    >
                      <div className="flex items-center gap-2 mt-10">
                        <small className="text-default-500">Powered by</small>
                        <span className="font-bold font-secondary">Resync</span>
                      </div>
                      <div className="flex gap-2 mt-10">
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                          className={cn(classNames?.closeButton)}
                        >
                          Close
                        </Button>
                        <Button
                          variant="shadow"
                          color="primary"
                          type="submit"
                          className={cn(classNames?.submitButton)}
                        >
                          Ask
                        </Button>
                      </div>
                    </ModalFooter>
                  </form>
                </CardBody>
              </Card>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ResyncWidget;
