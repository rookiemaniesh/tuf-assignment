"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { dayKey } from "../../lib/calendarUtils";
import { motion, AnimatePresence } from "framer-motion";
import HeroImage from "./HeroImage";
import CalendarGrid from "./CalendarGrid";
import NotesSection from "./NotesSection";
import CalendarNavigation from "./CalendarNavigation";

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

// ── Animation variants — defined at module level so the object reference
// is stable and is not recreated on every render. ──
const pageVariants = {
  initial: (direction: number) => ({
    rotateX: direction > 0 ? 90 : -90,
    opacity: 0,
    boxShadow: "0px 20px 40px rgba(0,0,0,0.5)",
  }),
  animate: {
    rotateX: 0,
    opacity: 1,
    boxShadow: "0px 0px 0px rgba(0,0,0,0)",
    transition: { duration: 0.6 },
  },
  exit: (direction: number) => ({
    rotateX: direction < 0 ? 90 : -90,
    opacity: 0,
    boxShadow: "0px 20px 40px rgba(0,0,0,0.5)",
    transition: { duration: 0.6 },
  }),
};

export default function CalendarContainer() {
  // Stable reference — avoids recreating a Date on every render
  // and prevents a stale "today" if the calendar stays open past midnight.
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [direction, setDirection] = useState(0);
  const [range, setRange] = useState<SelectedRange>({ start: null, end: null });
  const [notes, setNotes] = useState("");
  const [dayNotes, setDayNotes] = useState<DayNotes>({});

  // Load both general notes and per-day notes whenever the visible month changes.
  // Unified into one effect (single dependency array, one extra render instead of two).
  useEffect(() => {
    // General notes
    setNotes(localStorage.getItem(`calendar-notes-${currentYear}-${currentMonth}`) ?? "");

    // Per-day notes
    const raw = localStorage.getItem(`calendar-day-notes-${currentYear}-${currentMonth}`);
    if (!raw) { setDayNotes({}); return; }
    try {
      const parsed = JSON.parse(raw) as DayNotes;
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

      // Compute the next value outside the updater so localStorage.setItem
      // only runs once (React may call functional updaters twice in Strict Mode).
      const nextDayNotes: DayNotes = {
        ...dayNotes,
        [k]: [...(dayNotes[k] ?? []), trimmed],
      };
      setDayNotes(nextDayNotes);
      localStorage.setItem(
        `calendar-day-notes-${currentYear}-${currentMonth}`,
        JSON.stringify(nextDayNotes)
      );

      const line = `${k}: ${trimmed}`;
      const nextNotes = notes.trim().length
        ? `${notes.trimEnd()}\n${line}\n`
        : `${line}\n`;
      handleNotesChange(nextNotes);
    },
    [currentYear, currentMonth, dayNotes, notes, handleNotesChange]
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
    setDirection(-1);
    setRange({ start: null, end: null });
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth]);

  const goToNextMonth = useCallback(() => {
    setDirection(1);
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
      className="flex items-center justify-center min-h-screen p-2 sm:p-6"
      style={{ background: "radial-gradient(circle at 85% 15%, #ffffff 0%, #f0f1f5 40%, #e2e4e9 100%)" }}
    >
      <div
        className="w-full bg-white relative"
        style={{
          maxWidth: "560px",
          borderRadius: "6px",
          perspective: "1200px", // For 3D flip effect
          border: "1px solid #d4d8e0",
          boxShadow: "-16px 20px 32px rgba(0,0,0,0.15), -4px 6px 12px rgba(0,0,0,0.08)",
        }}
      >
        {/* ── Hyper-Realistic Twin-Loop Spiral Binding ── */}
        <div
          className="absolute top-0 left-0 w-full z-40 pointer-events-none"
          style={{
            borderTopLeftRadius: "6px",
            borderTopRightRadius: "6px"
          }}
        >
          <div className="w-full h-full flex justify-center items-start pt-1">
            <svg
              className="w-full h-auto max-w-[550px] overflow-visible select-none"
              viewBox="0 16 510 48"
              preserveAspectRatio="xMidYMin meet"
            >
              <defs>
                <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1e2024" />
                  <stop offset="25%" stopColor="#555a64" />
                  <stop offset="50%" stopColor="#7a808f" />
                  <stop offset="75%" stopColor="#3c3f48" />
                  <stop offset="100%" stopColor="#141518" />
                </linearGradient>
                <filter id="wire-shadow" x="-40%" y="-40%" width="180%" height="180%">
                  <feDropShadow dx="0" dy="2.5" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
                </filter>
                <filter id="wire-shadow-h" filterUnits="userSpaceOnUse" x="-10" y="-10" width="530" height="50">
                  <feDropShadow dx="0" dy="2.5" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
                </filter>
              </defs>

              {/* Unified Hanger & Horizontal Wire (Threaded inside loops) */}
              <path
                d="M 65,9 L 238,9 C 246,9 249,-2 255,-2 C 261,-2 264,9 272,9 L 445,9"
                fill="none"
                stroke="url(#metal)"
                strokeWidth="2.4"
                filter="url(#wire-shadow-h)"
                strokeLinecap="round"
              />
              {/* Hanger Hook Plastic Clip */}
              <rect x="253.5" y="-3.5" width="3" height="5" rx="1.5" fill="#141518" filter="url(#wire-shadow-h)" />

              {/* Loop groups */}
              {Array.from({ length: 32 }).map((_, i) => {
                if (i === 15 || i === 16) return null; // Gap for hanger

                const x = i * 16 + 4;
                return (
                  <g key={i} transform={`translate(${x},0)`}>
                    {/* PAPER HOLE */}
                    <rect x="2.3" y="15.5" width="7.5" height="9" rx="1.2" fill="#141518" />
                    <rect x="2.3" y="15.5" width="6" height="2.3" rx="1.2" fill="#000" opacity="0.7" />
                    
                    {/* FRONT WIRES */}
                    <path
                      d="M3.6,16 C3.6,8 1.2,4 4.6,4 C8,4 5.6,8 5.6,20"
                      fill="none"
                      stroke="url(#metal)"
                      strokeWidth="1.6"
                      filter="url(#wire-shadow)"
                    />
                    <path
                      d="M6.8,16 C6.8,8 4.4,4 7.8,4 C11.2,4 8.8,8 8.8,20"
                      fill="none"
                      stroke="url(#metal)"
                      strokeWidth="1.6"
                      filter="url(#wire-shadow)"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* ── Navigation arrows ── */}
        <CalendarNavigation onPrev={goToPrevMonth} onNext={goToNextMonth} />

        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={`${currentYear}-${currentMonth}`}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ 
              transformOrigin: "top center",
              backfaceVisibility: "hidden",
              width: "100%",
              backgroundColor: "white",
              borderRadius: "6px",
              overflow: "hidden"
            }}
          >
            {/* Hero Image Section */}
            <HeroImage
              year={currentYear}
              month={currentMonth}
              themeColor={MONTH_CONFIGS[currentMonth].color}
              imageSrc={MONTH_CONFIGS[currentMonth].image}
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
