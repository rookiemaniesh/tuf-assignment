"use client";

import React, { useMemo } from "react";
import CalendarDay from "./CalendarDay";
import { SelectedRange } from "./CalendarContainer";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

interface CalendarGridProps {
  year: number;
  month: number; // 0-indexed
  range: SelectedRange;
  today: Date;
  onDayClick: (date: Date) => void;
  dayNotes: Record<string, string[]>;
  onAddNote: (date: Date, text: string) => void;
  themeColor: string;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function dayKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function CalendarGrid({
  year,
  month,
  range,
  today,
  onDayClick,
  dayNotes,
  onAddNote,
  themeColor,
}: CalendarGridProps) {
  // Build the grid cells: Monday-first layout
  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    // 0=Sun,1=Mon..6=Sat → shift so Monday=0
    const startDow = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const grid: { date: Date; isCurrentMonth: boolean }[] = [];

    // Trailing days from previous month
    for (let i = startDow - 1; i >= 0; i--) {
      grid.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      grid.push({ date: new Date(year, month, d), isCurrentMonth: true });
    }

    // Leading days from next month (fill to 42 cells = 6 rows)
    const remaining = 42 - grid.length;
    for (let d = 1; d <= remaining; d++) {
      grid.push({ date: new Date(year, month + 1, d), isCurrentMonth: false });
    }

    return grid;
  }, [year, month]);

  const getDayState = (date: Date, isCurrentMonth: boolean) => {
    const d = stripTime(date);
    const isToday = isSameDay(d, stripTime(today));
    const start = range.start ? stripTime(range.start) : null;
    const end = range.end ? stripTime(range.end) : null;

    let isStart = false;
    let isEnd = false;
    let isInRange = false;

    if (start) {
      isStart = isSameDay(d, start);
      if (end) {
        isEnd = isSameDay(d, end);
        isInRange = d > start && d < end;
      }
    }

    // Mon=0 … Sat=5, Sun=6
    const dow = (date.getDay() + 6) % 7;
    const isWeekend = dow >= 5;

    return { isToday, isStart, isEnd, isInRange, isWeekend, isCurrentMonth, hasEnd: !!end };
  };

  return (
    <div style={{ padding: "14px 16px 16px 12px" }}>
      {/* Weekday header row */}
      <div className="grid grid-cols-7" style={{ marginBottom: "4px" }}>
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className="text-center font-bold tracking-wider"
            style={{
              fontSize: "0.62rem",
              paddingBottom: "4px",
              color: i >= 5 ? themeColor : "#000000ff",
              letterSpacing: "0.08em",
            }}
          >
            {day}
          </div>
        ))}
      </div>


      {/* Day cells — 6 rows × 7 cols */}
      <div className="grid grid-cols-7">
        {cells.map(({ date, isCurrentMonth }, idx) => {
          const state = getDayState(date, isCurrentMonth);
          const hasNote = isCurrentMonth && (dayNotes[dayKey(date)]?.length ?? 0) > 0;
          return (
            <CalendarDay
              key={idx}
              date={date}
              themeColor={themeColor}
              onClick={() => isCurrentMonth && onDayClick(date)}
              onAddNote={(text) => onAddNote(date, text)}
              hasNote={hasNote}
              {...state}
            />
          );
        })}
      </div>
    </div>
  );
}
