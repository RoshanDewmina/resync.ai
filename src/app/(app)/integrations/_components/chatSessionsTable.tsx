"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { DropdownOptions } from "./dropdownMenu";
import { buttonVariants } from "@/components/ui/button";
// import type { ChatSession } from "@prisma/client";

interface ChatSession {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatSessionsTableProps {
  chatSessions: ChatSession[];
  onDeleteChatSession: (chatSessionId: string) => void;
}

export function ChatSessionsTable({
  chatSessions,
  onDeleteChatSession,
}: ChatSessionsTableProps) {
  return (
    <Table>
      <TableCaption>A list of your recent chat sessions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Session ID</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead className="text-right">View</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {chatSessions.map((chatSession) => (
          <TableRow key={chatSession.id}>
            <TableCell className="font-medium">{chatSession.id}</TableCell>
            <TableCell>{chatSession.createdAt}</TableCell>
            <TableCell>{chatSession.updatedAt}</TableCell>
            <TableCell className="text-right">
              <Link
                className={buttonVariants({ variant: "link" })}
                href={`/chat-sessions/${chatSession.id}`}
              >
                View Session
              </Link>
            </TableCell>
            <TableCell>
              <DropdownOptions
                chatSessionId={chatSession.id}
                onDeleteChatSession={onDeleteChatSession}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          {/* <TableCell colSpan={5}>End</TableCell> */}
        </TableRow>
      </TableFooter>
    </Table>
  );
}
