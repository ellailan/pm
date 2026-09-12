"use client";

import { useState } from "react";
import { X, Plus, Pencil, Check, Trash2 } from "lucide-react";
import { useTeamMembers } from "@/lib/team-context";
import { useTickets } from "@/lib/ticket-context";
import { MEMBER_COLORS, memberColor } from "@/types";
import { hexToRgba } from "@/lib/utils";

interface ManageMembersDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ManageMembersDialog({ open, onClose }: ManageMembersDialogProps) {
  const { members, addMember, removeMember, renameMember, updateMemberColor } = useTeamMembers();
  const { unassignMember } = useTickets();
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(MEMBER_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  if (!open) return null;

  const handleAdd = () => {
    if (newName.trim()) {
      addMember(newName, newColor);
      setNewName("");
      setNewColor(MEMBER_COLORS[(MEMBER_COLORS.indexOf(newColor) + 1) % MEMBER_COLORS.length]);
    }
  };

  const handleStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      renameMember(id, editName);
    }
    setEditingId(null);
    setEditName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") action();
    if (e.key === "Escape") {
      setEditingId(null);
      setEditName("");
      setNewName("");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-hand-xl shadow-md w-full max-w-sm animate-slide-up" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200/50">
            <h2 className="text-sm font-bold text-navy-800">Manage Team</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-mint-50 rounded transition-colors"
            >
              <X className="w-4 h-4 text-surface-500" />
            </button>
          </div>

          {/* Members list */}
          <div className="max-h-64 overflow-y-auto px-4 py-2 space-y-2">
            {members.map((member, i) => {
              const color = memberColor(member, i);
              return (
              <div
                key={member.id}
                className="rounded-lg border px-2 py-1.5 transition-colors"
                style={{ backgroundColor: hexToRgba(color, 0.28), borderColor: hexToRgba(color, 0.8) }}
              >
                <div className="flex items-center gap-2">
                {editingId === member.id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, () => handleSaveEdit(member.id))}
                      className="flex-1 text-sm px-2 py-1 border border-surface-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-mint-200"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(member.id)}
                      className="p-1 text-mint-600 hover:bg-white/60 rounded transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      className="w-6 h-6 rounded-full text-navy-700 flex items-center justify-center text-[10px] font-medium shrink-0"
                      style={{ backgroundColor: hexToRgba(color, 0.7) }}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <span className="flex-1 text-sm text-navy-800 truncate">{member.name}</span>
                    <button
                      onClick={() => handleStartEdit(member.id, member.name)}
                      className="p-1 text-surface-500 hover:text-navy-800 rounded transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { unassignMember(member.name); removeMember(member.id); }}
                      className="p-1 text-red-500 hover:bg-white/60 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
                </div>
                {/* Color picker */}
                <div className="flex items-center gap-1.5 mt-1.5 pl-8">
                  {MEMBER_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => updateMemberColor(member.id, c)}
                      title={c}
                      className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${c === color ? "border-navy-800 scale-110" : "border-white/70"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              );
            })}
            {members.length === 0 && (
              <p className="text-sm text-surface-500 text-center py-4">No team members yet.</p>
            )}
          </div>

          {/* Add member */}
          <div className="px-4 py-3 border-t border-surface-200/50 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a team member..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleAdd)}
                className="flex-1 text-sm px-3 py-1.5 border border-surface-300 rounded font-medium focus:outline-none focus:ring-2 focus:ring-mint-200"
              />
              <button
                onClick={handleAdd}
                disabled={!newName.trim()}
                className="p-2 rounded bg-mint-500 text-white hover:bg-mint-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-surface-500 mr-1">Color:</span>
              {MEMBER_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewColor(c)}
                  title={c}
                  className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${c === newColor ? "border-navy-800 scale-110" : "border-surface-300"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
