"use client";

import React from "react";

interface CalendarNavigationProps {
  onPrev: () => void;
  onNext: () => void;
}

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const NAV_BTN_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.18)",
  backdropFilter: "blur(4px)",
};

const NAV_BTN_CLASS =
  "absolute z-50 flex items-center justify-center w-8 h-8 rounded-full text-white transition-all duration-200 hover:scale-110";

export default function CalendarNavigation({ onPrev, onNext }: CalendarNavigationProps) {
  return (
    <>
      <button
        onClick={onPrev}
        aria-label="Previous month"
        className={`${NAV_BTN_CLASS} right-auto top-6 left-3 sm:top-11 sm:left-4`}
        style={NAV_BTN_STYLE}
      >
        <ChevronLeft />
      </button>
      <button
        onClick={onNext}
        aria-label="Next month"
        className={`${NAV_BTN_CLASS} top-6 right-3 sm:top-11 sm:right-4 left-auto`}
        style={NAV_BTN_STYLE}
      >
        <ChevronRight />
      </button>
    </>
  );
}
