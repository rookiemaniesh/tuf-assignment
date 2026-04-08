"use client";

import React, { useMemo } from "react";
import { dayKey, isSameDay, stripTime } from "../../lib/calendarUtils";
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


// Pure function — no closure dependencies, safe to live outside the component.
function computeDayState(
  date: Date,
  isCurrentMonth: boolean,
  today: Date,
  range: { start: Date | null; end: Date | null }
) {
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

  // Compute all 42 cell states in one memoized pass.
  // Re-runs only when cells, range, or today changes — not on themeColor/dayNotes changes.
  const cellStates = useMemo(
    () => cells.map(({ date, isCurrentMonth }) => computeDayState(date, isCurrentMonth, today, range)),
    [cells, range, today]
  );

  return (
    <div className="p-3 sm:pt-[14px] sm:pr-[16px] sm:pb-[16px] sm:pl-[12px]">
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
          const state = cellStates[idx];
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
