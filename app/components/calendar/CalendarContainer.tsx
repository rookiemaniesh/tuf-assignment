"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalendar } from "../../hooks/useCalendar";
import HeroImage from "./HeroImage";
import CalendarGrid from "./CalendarGrid";
import NotesSection from "./NotesSection";
import CalendarNavigation from "./CalendarNavigation";

// ── Re-export shared types so other components still import from one place ────
export type { SelectedRange } from "../../hooks/useCalendar";

// ── Month theme config ────────────────────────────────────────────────────────

export const MONTH_CONFIGS = [
  { image: "/jan.jpg",    color: "#1D94D5" }, // Jan — Blue
  { image: "/feb.jpg",    color: "#E83E8C" }, // Feb — Pink
  { image: "/march.jpg",  color: "#28A745" }, // Mar — Green
  { image: "/april.jpg",  color: "#FD7E14" }, // Apr — Orange
  { image: "/may.jpg",    color: "#6F42C1" }, // May — Purple
  { image: "/june.jpg",   color: "#FFC107" }, // Jun — Gold
  { image: "/july.jpg",   color: "#DC3545" }, // Jul — Red
  { image: "/august.jpg", color: "#20C997" }, // Aug — Teal
  { image: "/sept.jpg",   color: "#007BFF" }, // Sep — Deep Blue
  { image: "/oct.jpg",    color: "#D35400" }, // Oct — Autumn
  { image: "/nov.jpg",    color: "#6C757D" }, // Nov — Slate
  { image: "/dec.jpg",    color: "#17A2B8" }, // Dec — Cyan
];

// ── Animation variants — module-level so the reference is stable ──────────────

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

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * CalendarContainer — pure layout component.
 *
 * All business logic (state, effects, handlers) lives in useCalendar().
 * This component's only job is to arrange UI elements and wire up the hook's
 * return values to the appropriate child components.
 */
export default function CalendarContainer() {
  const {
    today,
    currentYear,
    currentMonth,
    direction,
    range,
    notes,
    dayNotes,
    handleDayClick,
    handleNotesChange,
    addNoteForDay,
    goToPrevMonth,
    goToNextMonth,
  } = useCalendar();

  const { color: themeColor, image: imageSrc } = MONTH_CONFIGS[currentMonth];

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
          perspective: "1200px",
          border: "1px solid #d4d8e0",
          boxShadow: "-16px 20px 32px rgba(0,0,0,0.15), -4px 6px 12px rgba(0,0,0,0.08)",
        }}
      >
        {/* ── Spiral binding ── */}
        <SpiralBinding />

        {/* ── Navigation arrows ── */}
        <CalendarNavigation onPrev={goToPrevMonth} onNext={goToNextMonth} />

        {/* ── Animated month page ── */}
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
              overflow: "hidden",
            }}
          >
            <HeroImage
              year={currentYear}
              month={currentMonth}
              themeColor={themeColor}
              imageSrc={imageSrc}
            />

            {/* Bottom section: Notes (left) + Grid (right) */}
            <div className="flex flex-col sm:flex-row">
              <div className="order-2 sm:order-1 sm:w-[38%]">
                <NotesSection notes={notes} onChange={handleNotesChange} />
              </div>
              <div className="order-1 sm:order-2 sm:w-[62%]">
                <CalendarGrid
                  year={currentYear}
                  month={currentMonth}
                  range={range}
                  today={today}
                  onDayClick={handleDayClick}
                  dayNotes={dayNotes}
                  onAddNote={addNoteForDay}
                  themeColor={themeColor}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── SpiralBinding — memoized, renders once ────────────────────────────────────

/**
 * Extracted into its own memoized component so the SVG loop (Array.from × 32)
 * doesn't re-evaluate on every CalendarContainer render.
 */
const SpiralBinding = React.memo(function SpiralBinding() {
  return (
    <div
      className="absolute top-0 left-0 w-full z-40 pointer-events-none"
      style={{ borderTopLeftRadius: "6px", borderTopRightRadius: "6px" }}
    >
      <div className="w-full h-full flex justify-center items-start pt-1">
        <svg
          className="w-full h-auto max-w-[550px] overflow-visible select-none"
          viewBox="0 16 510 48"
          preserveAspectRatio="xMidYMin meet"
        >
          <defs>
            <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#1e2024" />
              <stop offset="25%"  stopColor="#555a64" />
              <stop offset="50%"  stopColor="#7a808f" />
              <stop offset="75%"  stopColor="#3c3f48" />
              <stop offset="100%" stopColor="#141518" />
            </linearGradient>
            <filter id="wire-shadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
            </filter>
            <filter id="wire-shadow-h" filterUnits="userSpaceOnUse" x="-10" y="-10" width="530" height="50">
              <feDropShadow dx="0" dy="2.5" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Horizontal wire and hanger hook */}
          <path
            d="M 65,9 L 238,9 C 246,9 249,-2 255,-2 C 261,-2 264,9 272,9 L 445,9"
            fill="none"
            stroke="url(#metal)"
            strokeWidth="2.4"
            filter="url(#wire-shadow-h)"
            strokeLinecap="round"
          />
          <rect x="253.5" y="-3.5" width="3" height="5" rx="1.5" fill="#141518" filter="url(#wire-shadow-h)" />

          {/* Wire loops */}
          {Array.from({ length: 32 }).map((_, i) => {
            if (i === 15 || i === 16) return null; // gap for hanger
            const x = i * 16 + 4;
            return (
              <g key={i} transform={`translate(${x},0)`}>
                <rect x="2.3" y="15.5" width="7.5" height="9"   rx="1.2" fill="#141518" />
                <rect x="2.3" y="15.5" width="6"   height="2.3" rx="1.2" fill="#000" opacity="0.7" />
                <path d="M3.6,16 C3.6,8 1.2,4 4.6,4 C8,4 5.6,8 5.6,20"   fill="none" stroke="url(#metal)" strokeWidth="1.6" filter="url(#wire-shadow)" />
                <path d="M6.8,16 C6.8,8 4.4,4 7.8,4 C11.2,4 8.8,8 8.8,20" fill="none" stroke="url(#metal)" strokeWidth="1.6" filter="url(#wire-shadow)" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
});
