"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Clock, Calendar, MapPin, User,
  Paperclip, Edit3, CheckCircle, RotateCcw, Trash2,
  ExternalLink, Save, X,
} from "lucide-react";
import { useTickets } from "@/lib/ticket-context";
import { formatDate, formatDateTime, timeAgo } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import { RequestStatus, REQUEST_STATUSES, Priority, PRIORITIES } from "@/types";

export default function RequestDetailPage() {
  const params = useParams();
  const { tickets, completeTicket, restoreTicket, updateTicket, deleteTicket } = useTickets();
  const ticket = tickets.find((t) => t.id === params.id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingContentLink, setEditingContentLink] = useState(false);
  const [contentLinkInput, setContentLinkInput] = useState<string>("");

  const saveContentLink = async () => {
    if (!ticket) return;
    try {
      await updateTicket(ticket.id, { contentLink: contentLinkInput.trim() });
      setEditingContentLink(false);
    } catch {
      // error handled by context
    }
  };

  if (!ticket) {
    return (
      <div className="p-6 max-w-4xl mx-auto animate-fade-in">
        <Link href="/requests" className="text-sm font-bold text-navy-600 hover:text-mint-600 flex items-center gap-1 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to requests
        </Link>
        <div className="rounded-hand-xl p-12 text-center bg-white/80 shadow-sm">
          <p className="text-navy-700 font-bold">Request not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      {/* Back */}
      <Link href="/requests" className="text-sm font-bold text-navy-600 hover:text-mint-600 flex items-center gap-1 mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to requests
      </Link>

      {/* Header */}
      <div className="rounded-hand-xl bg-white/80 p-6 mb-6 shadow-sm border border-surface-200/50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-navy-800">{ticket.title}</h1>
          </div>
          <div className="flex gap-2">
            {ticket.status === "Completed" ? (
              <button
                onClick={() => restoreTicket(ticket.id)}
                className="text-sm font-bold text-navy-600 hover:text-mint-600 rounded-hand px-3 py-1.5 hover:bg-mint-50 transition-colors"
                title="Reopen ticket"
              >
                <RotateCcw className="w-4 h-4 inline" />
                Reopen
              </button>
            ) : (
              <button
                onClick={() => completeTicket(ticket.id)}
                className="text-sm font-bold text-navy-600 hover:text-mint-600 rounded-hand px-3 py-1.5 hover:bg-mint-50 transition-colors"
                title="Mark ticket as complete"
              >
                <CheckCircle className="w-4 h-4 inline" />
                Mark Complete
              </button>
            )}
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="text-sm font-bold text-navy-600 hover:text-pink-600 rounded-hand px-3 py-1.5 hover:bg-pink-50 transition-colors"
              title="Delete ticket"
            >
              <Trash2 className="w-4 h-4 inline" />
              Delete
            </button>
            <Link
              href={`/requests/new?edit=${ticket.id}`}
              className="btn-brutal-secondary text-sm py-1.5"
            >
              <Edit3 className="w-4 h-4 inline" />
              Edit
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap text-sm">
          <div className="flex items-center gap-1.5">
            <select
              value={ticket.status}
              onChange={(e) => updateTicket(ticket.id, { status: e.target.value as RequestStatus })}
              className={cn(
                "text-sm font-bold px-2 py-1 rounded-hand border border-surface-300 bg-white",
                ticket.status === "Open" && "text-navy-700",
                ticket.status === "In Progress" && "text-amber-700",
                ticket.status === "In Review" && "text-blue-700",
                ticket.status === "Completed" && "text-mint-700"
              )}
            >
              {REQUEST_STATUSES.filter((s) => s !== "Archived").map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5 text-navy-600">
            <User className="w-4 h-4" />
            <span>{ticket.pointOfContact}</span>
          </div>
          <div className="flex items-center gap-1.5 text-navy-600">
            <Calendar className="w-4 h-4" />
            <span>Created {formatDateTime(ticket.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-navy-600">
            <Clock className="w-4 h-4" />
            <span>Updated {timeAgo(ticket.updatedAt)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Graphic Types */}
        <div className="rounded-hand-xl bg-mint-50/30 p-5">
          <h2 className="text-sm font-bold text-navy-700 mb-3 uppercase">What Needs to be Made</h2>
          <div className="flex flex-wrap gap-1.5">
            {ticket.graphicTypes.map((g, i) => (
              <span key={i} className="text-xs font-bold bg-mint-500 text-white px-2.5 py-1 rounded-full">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Content Link */}
        <div className="rounded-hand-xl bg-white/80 p-5 shadow-sm border border-surface-200/50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-navy-700 uppercase">Content Link</h2>
            {!editingContentLink && (
              <button
                onClick={() => {
                  setContentLinkInput(ticket.contentLink || "");
                  setEditingContentLink(true);
                }}
                className="text-navy-500 hover:text-navy-700"
                title="Edit content link"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
          {editingContentLink ? (
            <div className="space-y-3">
              <input
                type="text"
                className="input-brutal text-sm py-1.5"
                placeholder="https://..."
                value={contentLinkInput}
                onChange={(e) => setContentLinkInput(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={saveContentLink}
                  className="btn-brutal-primary text-sm py-1.5"
                >
                  <Save className="w-4 h-4 inline" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setContentLinkInput(ticket.contentLink || "");
                    setEditingContentLink(false);
                  }}
                  className="btn-brutal-secondary text-sm py-1.5"
                >
                  <X className="w-4 h-4 inline" />
                  Cancel
                </button>
              </div>
            </div>
          ) : ticket.contentLink ? (
            <a
              href={ticket.contentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-navy-700 hover:text-mint-600 flex items-center gap-1.5 break-all"
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              {ticket.contentLink}
            </a>
          ) : (
            <p className="text-sm text-surface-500">No content link added yet. Click the pencil to add one.</p>
          )}
        </div>

        {/* Details Card */}
        <div className="rounded-hand-xl bg-white/80 p-5 shadow-sm border border-surface-200/50">
          <h2 className="text-sm font-bold text-navy-700 mb-3 uppercase">Details</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-navy-500 uppercase">Name</p>
              <p className="text-sm text-navy-800">{ticket.eventName}</p>
            </div>
            {ticket.eventTime && (
              <div>
                <p className="text-xs text-navy-500 uppercase">Time</p>
                <p className="text-sm text-navy-800">{ticket.eventTime}</p>
              </div>
            )}
            {ticket.eventLocation && (
              <div>
                <p className="text-xs text-navy-500 uppercase">Location</p>
                <p className="text-sm text-navy-800">{ticket.eventLocation}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-navy-500 uppercase">Due Date</p>
              <p className={`text-sm font-bold ${new Date(ticket.deadline) < new Date() ? "text-pink-600" : "text-navy-800"}`}>
                {formatDate(ticket.deadline)}
                {new Date(ticket.deadline) < new Date() && " (OVERDUE)"}
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-hand-xl bg-white/80 p-5 shadow-sm border border-surface-200/50">
          <h2 className="text-sm font-bold text-navy-700 mb-2 uppercase">Summary</h2>
          <p className="text-sm text-navy-800 leading-relaxed">{ticket.summary}</p>
        </div>

        {/* Creative Vision */}
        <div className="rounded-hand-xl bg-white/80 p-5 shadow-sm border border-surface-200/50">
          <h2 className="text-sm font-bold text-navy-700 mb-2 uppercase">Creative Vision</h2>
          <p className="text-sm text-navy-800 leading-relaxed whitespace-pre-wrap">{ticket.creativeVision}</p>
        </div>

        {/* References */}
        {ticket.references.length > 0 && (
          <div className="rounded-hand-xl bg-white/80 p-5 shadow-sm border border-surface-200/50">
            <h2 className="text-sm font-bold text-navy-700 mb-2 uppercase">References</h2>
            <div className="space-y-1.5">
              {ticket.references.map((ref, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded border border-surface-200/50 bg-mint-50/30">
                  <span className="text-sm text-navy-700 truncate flex-1">{ref}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Requests */}
        {ticket.additionalRequests && (
          <div className="rounded-hand-xl bg-white/80 p-5 shadow-sm border border-surface-200/50">
            <h2 className="text-sm font-bold text-navy-700 mb-2 uppercase">Additional Requests</h2>
            <p className="text-sm text-navy-800 leading-relaxed">{ticket.additionalRequests}</p>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={() => deleteTicket(ticket.id)}
          title="Delete Ticket"
          message="Are you sure you want to delete this ticket? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </div>
  );
}
