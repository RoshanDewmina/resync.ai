"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
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
} from "lucide-react";

import { clsx, type ClassValue } from "clsx";
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

type reTraceWidgetProps = ModalProps & {
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
  searchButtonType?: "searchbar" | "iconSearch" | "icon";
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

const reTraceWidget: React.FC<reTraceWidgetProps> = ({
  authorization,
  integrationId,
  guidance,
  context,
  role = "user",
  tags = [],
  chatMode = "AUTO",
  stream = true,
  organizationDisplayName,
  title,
  description,
  primaryBrandColor,
  botAvatarLight,
  botAvatarDark,
  questions = ["What are embeddings?"],
  searchButtonType = "searchbar",
  customButton,
  classNames,
  ...modalProps
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [query, setQuery] = React.useState<string>("");
  const [completion, setCompletion] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
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

  function handleModalToggle() {
    onOpenChange();
    setQuery("");
    setCompletion(null);
    setError(null);
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Debug log
    setIsLoading(true);
    setCompletion(null);
    setError(null);

    try {
      const response = await fetch("/api/v0/chat-sessions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authorization}`,
        },
        body: JSON.stringify({
          integration_id: integrationId,
          guidance: guidance,
          context: context,
          messages: [
            {
              role: role,
              content: query,
            },
          ],
          tags: tags,
          chat_mode: chatMode,
          stream: stream,
        }),
      });

      const data = await response.json();
      console.log("API response:", data); // Debug log

      if (data.error) {
        setError(data.error);
      } else {
        setCompletion(data.message.content);
      }
    } catch (err) {
      console.error("Error sending message:", err); // Debug log
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
              "flex flex-col items-center relative w-25 h-20",
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
              "flex flex-col items-center justify-center w-12 h-12",
              classNames?.searchButton
            )}
            style={{ backgroundColor: primaryBrandColor }}
          >
            <div className="flex items-center justify-center w-full h-full">
              <Search width={30} className="text-center" />
            </div>
          </Button>
        );
      case "searchbar":
      default:
        return (
          <Button
            onPress={onOpen}
            className={cn(
              "flex space-x-1 align-end gap-1 relative w-40 h-10",
              classNames?.searchButton
            )}
            style={{ backgroundColor: primaryBrandColor }}
          >
            <Search width={15} />
            <span className="inline-block">Search...</span>
            <kbd
              className="right-3 top-2.5
              pointer-events-none inline-flex h-5 select-none items-center gap-1
              rounded border border-slate-100 bg-slate-100
              font-mono text-[10px] font-medium px-2
              text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400
              opacity-100"
            >
              <span className="text-xs">⌘</span>K
            </kbd>
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
                className={cn("flex flex-col gap-1", classNames?.modalHeader)}
              >
                {organizationDisplayName}
              </ModalHeader>
              <Card className={cn("py-4", classNames?.card)}>
                <CardHeader
                  className={cn(
                    "pb-0 pt-2 px-4 flex-col items-start",
                    classNames?.cardHeader
                  )}
                >
                  <p className="text-tiny uppercase font-bold">{description}</p>
                  <h4 className="font-bold text-large">{title}</h4>
                </CardHeader>
                <CardBody
                  className={cn("overflow-visible py-2", classNames?.cardBody)}
                >
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

                      {isLoading ? (
                        <div className="flex flex-col space-y-3">
                          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Loader className="animate-spin" />
                            <span className="text-slate-700 dark:text-slate-100">
                              Understanding the question...
                            </span>
                          </div>
                        </div>
                      ) : null}

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

                      {completion && !error ? (
                        <div className="flex items-center gap-4 dark:text-white">
                          <span className="bg-green-500 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                            <Wand width={18} className="text-white" />
                          </span>
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
                    </div>
                    <ModalFooter
                      className={cn(
                        "flex justify-between items-center",
                        classNames?.modalFooter
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <small className="text-default-500">Powered by</small>
                        <span className="font-bold">
                          {organizationDisplayName}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                          className={cn(classNames?.closeButton)}
                        >
                          Close
                        </Button>
                        <Button
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

export default reTraceWidget;
