"use client";

import React from "react";

// Minimum space (px) to keep the popup inside the viewport
const POPUP_W = 190;
const POPUP_H = 135;

interface DayNotePopupProps {
  date: Date;
  position: { x: number; y: number };
  onSave: (text: string) => void;
  onClose: () => void;
}

export default function DayNotePopup({
  date,
  position,
  onSave,
  onClose,
}: DayNotePopupProps) {
  const [noteDraft, setNoteDraft] = React.useState("");

  const handleSave = () => {
    if (noteDraft.trim()) onSave(noteDraft);
    onClose();
  };

  const label = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    /* Full-screen backdrop — clicking outside closes the popup */
    <div
      className="fixed"
      style={{ inset: 0, zIndex: 1000 }}
      onMouseDown={onClose}
    >
      <div
        className="fixed bg-white"
        style={{
          left: position.x,
          top: position.y,
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          padding: "6px",
          minWidth: `${POPUP_W}px`,
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header shows which day the note belongs to */}
        <div
          style={{
            fontSize: "0.82rem",
            padding: "8px 10px 6px",
            fontWeight: 600,
            color: "#111827",
          }}
        >
          Add note for {label}
        </div>

        <input
          autoFocus
          value={noteDraft}
          onChange={(e) => setNoteDraft(e.target.value)}
          placeholder="Type note…"
          className="w-full"
          style={{
            fontSize: "0.8rem",
            padding: "8px 10px",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
            outline: "none",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSave();
            }
            if (e.key === "Escape") {
              e.preventDefault();
              onClose();
            }
          }}
        />

        <div className="flex justify-end" style={{ gap: "8px", padding: "8px 4px 2px" }}>
          <button
            type="button"
            style={{
              fontSize: "0.78rem",
              padding: "6px 8px",
              borderRadius: "6px",
              color: "#374151",
            }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            style={{
              fontSize: "0.78rem",
              padding: "6px 10px",
              borderRadius: "6px",
              background: "#111827",
              color: "white",
            }}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Clamps popup position so it never clips outside the viewport.
 * Call this before storing menuPos in state.
 */
export function clampPopupPosition(
  clientX: number,
  clientY: number
): { x: number; y: number } {
  return {
    x: Math.min(clientX, window.innerWidth - POPUP_W - 8),
    y: Math.min(clientY, window.innerHeight - POPUP_H - 8),
  };
}
