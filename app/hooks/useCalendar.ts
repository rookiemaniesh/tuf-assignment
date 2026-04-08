"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { dayKey } from "../lib/calendarUtils";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SelectedRange {
  start: Date | null;
  end: Date | null;
}

type DayNotes = Record<string, string[]>;

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * useCalendar — encapsulates all calendar business logic.
 *
 * Responsibilities:
 *  - Current month/year navigation with direction tracking for animation
 *  - Date range selection (click start → click end)
 *  - General month notes (persisted per month in localStorage)
 *  - Per-day notes (persisted per month in localStorage)
 *
 * The component that consumes this hook is a pure layout layer with zero
 * business logic of its own, making both the hook and the component independently
 * testable and easy to reason about.
 */
export function useCalendar() {
  // Stable "today" — created once, safe across midnight if the tab stays open.
  const today = useMemo(() => new Date(), []);

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [direction, setDirection] = useState(0); // -1 = prev, +1 = next (drives animation)
  const [range, setRange] = useState<SelectedRange>({ start: null, end: null });
  const [notes, setNotes] = useState("");
  const [dayNotes, setDayNotes] = useState<DayNotes>({});

  // ── Persistence ─────────────────────────────────────────────────────────────

  // Load both note types together whenever the visible month changes.
  // Unified into one effect: single dependency array, one batch of state sets.
  useEffect(() => {
    // General month notes
    setNotes(
      localStorage.getItem(`calendar-notes-${currentYear}-${currentMonth}`) ?? ""
    );

    // Per-day notes
    const raw = localStorage.getItem(
      `calendar-day-notes-${currentYear}-${currentMonth}`
    );
    if (!raw) {
      setDayNotes({});
      return;
    }
    try {
      const parsed = JSON.parse(raw) as DayNotes;
      setDayNotes(parsed && typeof parsed === "object" ? parsed : {});
    } catch {
      setDayNotes({});
    }
  }, [currentYear, currentMonth]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  /** Persist general notes and update state in one call. */
  const handleNotesChange = useCallback(
    (val: string) => {
      setNotes(val);
      localStorage.setItem(`calendar-notes-${currentYear}-${currentMonth}`, val);
    },
    [currentYear, currentMonth]
  );

  /**
   * Append a note for a specific day.
   * Also appends a "YYYY-MM-DD: text" line to the general month notes so both
   * views stay in sync without a separate read.
   *
   * Side effects are computed OUTSIDE the setState updater so they run only
   * once — React may invoke functional updaters twice in Strict Mode.
   */
  const addNoteForDay = useCallback(
    (date: Date, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const k = dayKey(date);

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

  /**
   * Handle a day cell click.
   * - First click  → sets range start, clears end
   * - Second click → sets range end (swaps if end < start)
   * - Any click after a complete range → resets and starts fresh
   */
  const handleDayClick = useCallback((date: Date) => {
    setRange((prev) => {
      if (!prev.start || (prev.start && prev.end)) {
        return { start: date, end: null };
      }
      if (date < prev.start) {
        return { start: date, end: prev.start };
      }
      return { start: prev.start, end: date };
    });
  }, []);

  /** Navigate to the previous month, resetting the selected range. */
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

  /** Navigate to the next month, resetting the selected range. */
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

  // ── Public API ───────────────────────────────────────────────────────────────

  return {
    // State
    today,
    currentYear,
    currentMonth,
    direction,
    range,
    notes,
    dayNotes,
    // Handlers
    handleDayClick,
    handleNotesChange,
    addNoteForDay,
    goToPrevMonth,
    goToNextMonth,
  } as const;
}
