"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useTickets } from "@/lib/ticket-context";
import { CalendarView } from "@/components/tickets/calendar-view";

export default function CalendarPage() {
  const { tickets, loading } = useTickets();

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-navy-800">Calendar</h1>
          <p className="text-xs text-surface-500">
            Each ticket appears on its due date (when the post should go out) and on its event date
          </p>
        </div>
        <Link href="/requests/new" className="btn-brutal-primary text-xs py-1.5 px-3">
          <PlusCircle className="w-3.5 h-3.5" />
          New Ticket
        </Link>
      </div>

      {loading ? (
        <div className="border border-surface-200/50 rounded-hand-xl bg-white/80 shadow-sm p-10 text-center text-sm text-surface-400">
          Loading tickets...
        </div>
      ) : (
        <CalendarView tickets={tickets} />
      )}
    </div>
  );
}