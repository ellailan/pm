"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Send } from "lucide-react";
import { cn, toDateKey } from "@/lib/utils";
import { Ticket, Priority } from "@/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_VISIBLE_TICKETS = 3;

const PRIORITY_ORDER: Record<Priority, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };

const PRIORITY_CHIP: Record<Priority, string> = {
  Urgent: "bg-navy-800 text-white",
  High: "bg-pink-100 text-pink-700",
  Medium: "bg-purple-100 text-purple-700",
  Low: "bg-mint-100 text-mint-700",
};

interface CalendarCell {
  date: Date;
  key: string;
  inMonth: boolean;
}

type CalendarEntry = {
  ticket: Ticket;
  kind: "due" | "event";
};

export function CalendarView({ tickets }: { tickets: Ticket[] }) {
  const today = new Date();
  const todayKey = toDateKey(today);
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  // Group tickets by due date (when the post should go out) AND by event date.
  // A ticket can appear twice — once on each of those dates.
  const byDate = new Map<string, CalendarEntry[]>();
  const addEntry = (key: string, ticket: Ticket, kind: "due" | "event") => {
    const list = byDate.get(key);
    if (list) list.push({ ticket, kind });
    else byDate.set(key, [{ ticket, kind }]);
  };
  tickets.forEach((t) => {
    if (t.deadline) addEntry(toDateKey(t.deadline), t, "due");
    if (t.eventDate) addEntry(toDateKey(t.eventDate), t, "event");
  });
  byDate.forEach((list) =>
    list.sort((a, b) => {
      // due dates first (by priority), then event dates
      if (a.kind !== b.kind) return a.kind === "due" ? -1 : 1;
      const diff = (PRIORITY_ORDER[b.ticket.priority] ?? 0) - (PRIORITY_ORDER[a.ticket.priority] ?? 0);
      return diff !== 0 ? diff : a.ticket.title.localeCompare(b.ticket.title);
    })
  );

  // Build the 6-week grid for the visible month (Sunday-first)
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    cells.push({ date, key: toDateKey(date), inMonth: date.getMonth() === month });
  }

  const moveMonth = (delta: number) =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));

  const goToday = () => {
    const d = new Date();
    setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthTicketCount = tickets.filter(
    (t) =>
      (t.deadline && t.deadline.startsWith(monthPrefix)) ||
      (t.eventDate && t.eventDate.startsWith(monthPrefix))
  ).length;

  return (
    <div className="border border-surface-200/50 rounded-hand-xl bg-white/80 shadow-sm">
      {/* Calendar header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-surface-200/30">
        <button onClick={goToday} className="btn-brutal-secondary text-xs py-1">
          Today
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => moveMonth(-1)}
            className="p-1.5 rounded-hand border border-surface-200/50 hover:bg-mint-50 transition-colors"
            title="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-bold text-navy-800 min-w-[11rem] text-center">
            {viewDate.toLocaleString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <button
            onClick={() => moveMonth(1)}
            className="p-1.5 rounded-hand border border-surface-200/50 hover:bg-mint-50 transition-colors"
            title="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <span className="text-xs text-surface-500">
          {monthTicketCount} tickets this month
        </span>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 border-b border-surface-200/30">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-1.5 text-center text-[10px] font-bold uppercase text-navy-500"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-[1px] bg-surface-200/40">
        {cells.map((cell) => {
          const dayEntries = byDate.get(cell.key) ?? [];
          const isToday = cell.key === todayKey;
          const isPast = cell.key < todayKey;
          return (
            <div
              key={cell.key}
              className={cn(
                "flex flex-col gap-1 px-1 py-1 min-h-[84px]",
                isToday
                  ? "bg-mint-50/30"
                  : cell.inMonth
                  ? "bg-white/80"
                  : "bg-surface-100/40 text-surface-400"
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "w-5 h-5 text-[10px] font-bold flex items-center justify-center rounded-full",
                    isToday
                      ? "bg-mint-500 text-white"
                      : cell.inMonth
                      ? "text-navy-700"
                      : "text-surface-400"
                  )}
                >
                  {cell.date.getDate()}
                </span>
                {dayEntries.length > 0 && (
                  <span className="text-[9px] font-bold text-navy-500">
                    {dayEntries.length}
                  </span>
                )}
              </div>
              <div className="space-y-0.5 min-w-0">
                {dayEntries.slice(0, MAX_VISIBLE_TICKETS).map(({ ticket: t, kind }) => {
                  const completed = t.status === "Completed";
                  const overdue = kind === "due" && isPast && !completed;
                  if (kind === "event") {
                    return (
                      <Link
                        key={`${t.id}-event`}
                        href={`/requests/${t.id}`}
                        title={`Event date: ${t.eventDate} — ${t.eventName || "event"}`}
                        className={cn(
                          "flex items-center gap-1 px-1 py-0.5 text-[9px] font-medium rounded border-2 border-dashed border-gold-600 text-gold-700 bg-white/90",
                          completed && "opacity-60 line-through"
                        )}
                      >
                        <CalendarDays className="w-3 h-3 shrink-0" />
                        <span className="flex items-center gap-0.5 min-w-0">
                          <span className="uppercase font-bold text-gold-700 shrink-0">Event</span>
                          <span className="truncate flex-1">{t.title}</span>
                        </span>
                      </Link>
                    );
                  }
                  return (
                    <Link
                      key={t.id}
                      href={`/requests/${t.id}`}
                      title={`${t.title}${overdue ? " (OVERDUE)" : ""} — post date: ${t.deadline}`}
                      className={cn(
                        "flex items-center gap-0.5 px-1 py-0.5 text-[9px] font-medium rounded",
                        PRIORITY_CHIP[t.priority] ?? "bg-surface-200/60 text-navy-700",
                        completed && "opacity-60 line-through",
                        overdue && "border border-pink-400",
                        t.priority === "Urgent" && "ring-1 ring-pink-400"
                      )}
                    >
                      <Send className="w-3 h-3 shrink-0" />
                      <span className="truncate flex-1">{t.title}</span>
                    </Link>
                  );
                })}
                {dayEntries.length > MAX_VISIBLE_TICKETS && (
                  <span className="block text-[9px] font-bold text-navy-500 truncate">
                    +{dayEntries.length - MAX_VISIBLE_TICKETS} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-t border-surface-200/30 text-[9px]">
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-mint-100 text-mint-700 font-medium">
          <Send className="w-3 h-3 shrink-0" />
          <span className="truncate max-w-[7rem]">Post date</span>
        </span>
        <span className="text-surface-500">— when the post goes out (priority pill · overdue = red border)</span>
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border-2 border-dashed border-gold-600 text-gold-700 bg-white/90 font-medium">
          <CalendarDays className="w-3 h-3 shrink-0" />
          <span className="uppercase font-bold">Event</span>
        </span>
        <span className="text-surface-500">— when the event happens</span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-mint-500" />
          Today
        </span>
        <span className="text-navy-500">Click a ticket to open it</span>
      </div>
    </div>
  );
}