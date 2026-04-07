"use client";

import React from "react";

interface NotesSectionProps {
  notes: string;
  onChange: (val: string) => void;
}

// Number of ruled lines to draw
const LINE_COUNT = 8;

export default function NotesSection({ notes, onChange }: NotesSectionProps) {
  return (
    <div
      className="h-full flex flex-col"
      style={{ padding: "18px 20px 16px 20px" }}
    >
      {/* "Notes" heading — small, gray, like printed text */}
      <p
        className="text-xs tracking-widest uppercase mb-3 font-semibold"
        style={{ color: "#aab0bb", letterSpacing: "0.18em" }}
      >
        Notes
      </p>

      {/* Lined paper container */}
      <div className="relative flex-1" style={{ minHeight: `${LINE_COUNT * 28}px` }}>
        {/* Draw horizontal ruled lines */}
        {Array.from({ length: LINE_COUNT }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0"
            style={{
              top: `${(i + 1) * 28 - 1}px`,
              height: "1px",
              background: "#e2e5eb",
            }}
          />
        ))}

        {/* Transparent textarea that sits on top of the lines */}
        <textarea
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          placeholder=""
          className="absolute inset-0 w-full h-full resize-none bg-transparent text-gray-700 text-xs"
          style={{
            lineHeight: "28px",
            paddingTop: "3px",
            border: "none",
            outline: "none",
            fontFamily: "inherit",
          }}
          spellCheck={false}
        />
      </div>

      {/* Faint auto-saved hint */}
      <p
        className="text-right mt-2 text-xs"
        style={{ color: "#c8cdd8", fontSize: "0.68rem" }}
      >
        auto-saved
      </p>
    </div>
  );
}
