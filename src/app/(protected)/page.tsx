"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { PortfolioDot } from "@/components/ui/portfolio-dot";
import { SkeletonColumn } from "@/components/ui/skeleton";
import { useTickets } from "@/lib/ticket-context";
import { useTeamMembers } from "@/lib/team-context";
import { Ticket, Portfolio } from "@/types";

const priorityOrder: Record<string, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };

export default function BoardPage() {
  const { tickets, moveTicket, addToBoard, loading } = useTickets();
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e: React.DragEvent, targetMember: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    const source = e.dataTransfer.getData("source");
    moveTicket(id, targetMember);
    if (source === "sidebar") {
      addToBoard(id);
    }
    setDraggingId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const { members } = useTeamMembers();
  const columns = members.map((m) => [
    m.name,
    tickets.filter((t) => t.assignedTo === m.name),
  ]) as [string, Ticket[]][];

  return (
    <div className="h-full flex flex-col">
      {/* Board header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-surface-200/50 bg-white/80">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-navy-800">Board</h1>
          <span className="text-xs text-surface-500">{tickets.length} tickets</span>
        </div>
        <Link href="/requests/new" className="btn-brutal-primary text-xs py-1.5 px-3">
          <PlusCircle className="w-3.5 h-3.5" />
          New Ticket
        </Link>
      </div>

      {/* Kanban columns */}
      <div className="flex-1 flex gap-3 p-4 overflow-x-auto bg-gold-50">
        {loading ? (
          <>
            <SkeletonColumn />
            <SkeletonColumn />
            <SkeletonColumn />
            <SkeletonColumn />
            <SkeletonColumn />
          </>
        ) : (
          columns.map(([member, memberTickets]) => (
            <div
              key={member}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, member)}
              className={cn(
                "flex flex-col w-64 shrink-0 rounded-hand-xl bg-white/50 transition-colors duration-200",
                draggingId && "ring-2 ring-mint-300"
              )}
            >
              {/* Column header */}
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-surface-200/30">
                <Avatar name={member} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-navy-800 truncate">{member}</p>
                  <p className="text-[10px] text-surface-400">{memberTickets.length} ticket{memberTickets.length !== 1 ? "s" : ""}</p>
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 space-y-1.5 p-2 overflow-y-auto">
                {(memberTickets as Ticket[])
                  .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
                  .map((ticket) => (
                    <div
                      key={ticket.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ticket.id)}
                      onDragEnd={() => setDraggingId(null)}
                      className={cn(
                        "bg-white rounded-hand-xl border border-surface-200/50 px-3 py-2.5 cursor-grab active:cursor-grabbing transition-all duration-200",
                        draggingId === ticket.id
                          ? "opacity-50 scale-95 shadow-sm"
                          : "hover:border-mint-300 hover:shadow-sm"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                          ticket.priority === "Urgent" && "bg-navy-800 text-white",
                          ticket.priority === "High" && "bg-pink-100 text-pink-700",
                          ticket.priority === "Medium" && "bg-purple-100 text-purple-700",
                          ticket.priority === "Low" && "bg-mint-100 text-mint-700",
                        )}>
                          {ticket.priority}
                        </span>
                      </div>
                      <Link href={`/requests/${ticket.id}`} className="block">
                        <p className="text-xs font-bold text-navy-800 leading-snug line-clamp-2 hover:text-mint-600 transition-colors">
                          {ticket.title}
                        </p>
                      </Link>
                      <div className="flex items-center gap-2 mt-1.5">
                        <PortfolioDot portfolio={ticket.portfolio as Portfolio} />
                        <span className={cn(
                          "text-[10px]",
                          new Date(ticket.deadline) < new Date() ? "text-pink-600" : "text-surface-400"
                        )}>
                          {new Date(ticket.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
