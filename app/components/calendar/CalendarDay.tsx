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
}: CalendarDayProps) {
  const dayNum = date.getDate();

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
    </div>
  );
}
