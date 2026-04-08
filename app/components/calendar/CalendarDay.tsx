"use client";

import React from "react";

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isWeekend: boolean;
  hasEnd: boolean;
  themeColor: string;
  onClick: () => void;
  hasNote: boolean;
  onAddNote: (text: string) => void;
}

export default function CalendarDay({
  date,
  isCurrentMonth,
  isToday,
  isStart,
  isEnd,
  isInRange,
  isWeekend,
  hasEnd,
  themeColor,
  onClick,
  hasNote,
  onAddNote,
}: CalendarDayProps) {
  const dayNum = date.getDate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuPos, setMenuPos] = React.useState<{ x: number; y: number } | null>(null);
  const [noteDraft, setNoteDraft] = React.useState("");

  // ── Base text color ──
  let textColor = "#2d3340"; // default: near-black
  if (!isCurrentMonth) textColor = "#b9b9b9ff";
  else if (isWeekend) textColor = themeColor;

  // ── Range strip background (the horizontal tinted band) ──
  let stripStyle: React.CSSProperties = {};
  if (isStart && isEnd) {
    // Single-day selection: no strip, just circle
    stripStyle = {};
  } else if (isStart && hasEnd) {
    stripStyle = {
      background: `linear-gradient(to right, transparent 50%, ${themeColor}22 50%)`,
    };
  } else if (isEnd) {
    stripStyle = {
      background: `linear-gradient(to right, ${themeColor}22 50%, transparent 50%)`,
    };
  } else if (isInRange) {
    stripStyle = { background: `${themeColor}22` };
  }

  // ── Inner circle/dot styles for start & end ──
  const isEndpoint = isStart || isEnd;
  const circleStyle: React.CSSProperties = isEndpoint
    ? {
        background: themeColor,
        color: "white",
        borderRadius: "50%",
      }
    : {};

  // Override text color for endpoints
  if (isEndpoint) textColor = "white";

  // Today: hollow ring (only when not a selected endpoint)
  const todayRing =
    isToday && !isEndpoint
      ? { boxShadow: `0 0 0 1.5px ${themeColor}` }
      : {};

  return (
    <div
      className="flex items-center justify-center relative"
      style={{ height: "32px" }}
    >
      <div 
        className="absolute w-full" 
        style={{ height: "28px", top: "2px", ...stripStyle }} 
      />
      <button
        onClick={onClick}
        disabled={!isCurrentMonth}
        className="flex items-center justify-center rounded-full transition-all duration-150 select-none relative z-10"
        style={{
          width: "28px",
          height: "28px",
          fontSize: "0.72rem",
          fontWeight: isEndpoint || isToday ? 700 : isCurrentMonth ? 500 : 400,
          color: textColor,
          cursor: isCurrentMonth ? "pointer" : "default",
          ...circleStyle,
          ...todayRing,
        }}
        onContextMenu={(e) => {
          if (!isCurrentMonth) return;
          e.preventDefault();
          setMenuPos({ x: e.clientX, y: e.clientY });
          setMenuOpen(true);
          setNoteDraft("");
        }}
        onMouseEnter={(e) => {
          if (isCurrentMonth && !isEndpoint) {
            (e.currentTarget as HTMLButtonElement).style.background = `${themeColor}14`;
          }
        }}
        onMouseLeave={(e) => {
          if (isCurrentMonth && !isEndpoint) {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }
        }}
      >
        {dayNum}
      </button>

      {isCurrentMonth && hasNote ? (
        <div
          aria-hidden
          className="absolute"
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "999px",
            background: "#FACC15",
            bottom: "2px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
          }}
        />
      ) : null}

      {menuOpen && menuPos ? (
        <div
          className="fixed"
          style={{ inset: 0, zIndex: 1000 }}
          onMouseDown={() => setMenuOpen(false)}
        >
          <div
            className="fixed bg-white"
            style={{
              left: menuPos.x,
              top: menuPos.y,
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              padding: "6px",
              minWidth: "160px",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "0.82rem",
                padding: "8px 10px 6px",
                fontWeight: 600,
                color: "#111827",
              }}
            >
              Add note
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
                  if (noteDraft.trim()) onAddNote(noteDraft);
                  setMenuOpen(false);
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  setMenuOpen(false);
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
                onClick={() => setMenuOpen(false)}
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
                onClick={() => {
                  if (noteDraft.trim()) onAddNote(noteDraft);
                  setMenuOpen(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
