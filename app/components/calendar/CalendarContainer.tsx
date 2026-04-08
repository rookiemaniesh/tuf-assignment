"use client";

import React, { useState, useEffect, useCallback } from "react";
import HeroImage from "./HeroImage";
import CalendarGrid from "./CalendarGrid";
import NotesSection from "./NotesSection";

// Theme configurations for each month
export const MONTH_CONFIGS = [
  { image: "/jan.jpg", color: "#1D94D5" },   // Jan (Blue)
  { image: "/feb.jpg", color: "#E83E8C" },   // Feb (Pinkish Red)
  { image: "/march.jpg", color: "#28A745" }, // Mar (Green)
  { image: "/april.jpg", color: "#FD7E14" }, // Apr (Orange)
  { image: "/may.jpg", color: "#6F42C1" },   // May (Purple)
  { image: "/june.jpg", color: "#FFC107" },  // Jun (Yellow/Gold)
  { image: "/july.jpg", color: "#DC3545" },  // Jul (Red)
  { image: "/august.jpg", color: "#20C997" },// Aug (Teal)
  { image: "/sept.jpg", color: "#007BFF" },  // Sep (Deep Blue)
  { image: "/oct.jpg", color: "#D35400" },   // Oct (Autumn)
  { image: "/nov.jpg", color: "#6C757D" },   // Nov (Slate)
  { image: "/dec.jpg", color: "#17A2B8" }    // Dec (Cyan)
];
export interface SelectedRange {
  start: Date | null;
  end: Date | null;
}

type DayNotes = Record<string, string[]>;

function dayKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function CalendarContainer() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [range, setRange] = useState<SelectedRange>({ start: null, end: null });
  const [notes, setNotes] = useState("");
  const [dayNotes, setDayNotes] = useState<DayNotes>({});

  // Load notes from localStorage
  useEffect(() => {
    const key = `calendar-notes-${currentYear}-${currentMonth}`;
    const saved = localStorage.getItem(key);
    if (saved) setNotes(saved);
    else setNotes("");
  }, [currentYear, currentMonth]);

  // Load per-day notes from localStorage
  useEffect(() => {
    const key = `calendar-day-notes-${currentYear}-${currentMonth}`;
    const saved = localStorage.getItem(key);
    if (!saved) {
      setDayNotes({});
      return;
    }
    try {
      const parsed = JSON.parse(saved) as DayNotes;
      setDayNotes(parsed && typeof parsed === "object" ? parsed : {});
    } catch {
      setDayNotes({});
    }
  }, [currentYear, currentMonth]);

  // Save notes to localStorage
  const handleNotesChange = useCallback(
    (val: string) => {
      setNotes(val);
      const key = `calendar-notes-${currentYear}-${currentMonth}`;
      localStorage.setItem(key, val);
    },
    [currentYear, currentMonth]
  );

  const addNoteForDay = useCallback(
    (date: Date, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const k = dayKey(date);

      setDayNotes((prev) => {
        const next: DayNotes = { ...prev, [k]: [...(prev[k] ?? []), trimmed] };
        const storageKey = `calendar-day-notes-${currentYear}-${currentMonth}`;
        localStorage.setItem(storageKey, JSON.stringify(next));
        return next;
      });

      const line = `${k}: ${trimmed}`;
      const nextNotes = notes.trim().length ? `${notes.trimEnd()}\n${line}\n` : `${line}\n`;
      handleNotesChange(nextNotes);
    },
    [currentYear, currentMonth, handleNotesChange, notes]
  );

  const handleDayClick = useCallback(
    (date: Date) => {
      setRange((prev) => {
        if (!prev.start || (prev.start && prev.end)) {
          // First click — set start
          return { start: date, end: null };
        } else {
          // Second click — set end (ensure proper order)
          if (date < prev.start) {
            return { start: date, end: prev.start };
          }
          return { start: prev.start, end: date };
        }
      });
    },
    []
  );

  const goToPrevMonth = useCallback(() => {
    setRange({ start: null, end: null });
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth]);

  const goToNextMonth = useCallback(() => {
    setRange({ start: null, end: null });
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }, [currentMonth]);

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: "#dde1e8", padding: "24px 16px" }}
    >
      <div
        className="w-full overflow-hidden bg-white"
        style={{
          maxWidth: "560px",
          borderRadius: "6px",
          //boxShadow: "-10px 0 25px rgba(0,0,0,0.15)"
         // boxShadow: "0 8px 32px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.12)",
        }}
      >
        {/* Hero Image Section */}
        <HeroImage
          year={currentYear}
          month={currentMonth}
          themeColor={MONTH_CONFIGS[currentMonth].color}
          imageSrc={MONTH_CONFIGS[currentMonth].image}
          onPrev={goToPrevMonth}
          onNext={goToNextMonth}
        />

        {/* Bottom Section: Notes (left) + Calendar (right) */}
        <div className="flex flex-col sm:flex-row">
          {/* Notes — left on desktop, bottom on mobile */}
          <div
            className="order-2 sm:order-1 sm:w-[38%]"
          >
            <NotesSection notes={notes} onChange={handleNotesChange} />
          </div>

          {/* Calendar — right on desktop, top on mobile */}
          <div className="order-1 sm:order-2 sm:w-[62%]">
            <CalendarGrid
              year={currentYear}
              month={currentMonth}
              range={range}
              today={today}
              onDayClick={handleDayClick}
              dayNotes={dayNotes}
              onAddNote={addNoteForDay}
              themeColor={MONTH_CONFIGS[currentMonth].color}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
