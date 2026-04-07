"use client";

import React from "react";
import Image from "next/image";

const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

interface HeroImageProps {
  year: number;
  month: number; // 0-indexed
  themeColor: string;
  onPrev: () => void;
  onNext: () => void;
}

export default function HeroImage({
  year,
  month,
  themeColor,
  onPrev,
  onNext,
}: HeroImageProps) {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: "300px" }}>

      {/* ── Spiral binding dots at the very top ── */}
      <div
        className="absolute top-0 left-0 right-0 z-30 flex justify-center gap-5 py-1"
        style={{ background: "rgba(0,0,0,0.18)" }}
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: 10,
              height: 10,
              background:
                "radial-gradient(circle at 35% 35%, #d0d4da, #7a8090)",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4), 0 1px 1px rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>

      {/* ── Hero photograph ── */}
      <Image
        src="/hero.png"
        alt="Calendar hero"
        fill
        className="object-cover object-center"
        priority
        style={{ paddingTop: "18px" }}
      />

      {/* ── Geometric overlay: two rising triangles (mountain-peak zigzag) ── */}
      {/*
          The shape matches the reference: a blue band that starts from the
          bottom-left corner, rises to a peak roughly 1/4 across, dips back
          to the base, then rises again at ~55% to a taller peak (right side),
          and fills the right corner—creating the classic wall-calendar wave.
      */}
      <svg
        className="absolute bottom-0 left-0 w-full z-10"
        viewBox="0 0 700 130"
        preserveAspectRatio="none"
        style={{ height: "130px" }}
      >
        {/* Main wave / mountain-peak shape */}
        <path
          d="M0,130 L0,90 L120,130 L240,55 L380,130 L700,130 Z"
          fill={themeColor}
        />
        {/* Right-side taller triangle for the date label area */}
        <path
          d="M340,130 L500,10 L700,80 L700,130 Z"
          fill={themeColor}
          opacity="0.92"
        />
      </svg>

      {/* ── Month + Year label (sits on the right-hand blue triangle) ── */}
      <div className="absolute bottom-5 right-7 text-right z-20">
        <span
          className="block font-light tracking-[0.22em]"
          style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.95rem" }}
        >
          {year}
        </span>
        <span
          className="block font-extrabold tracking-[0.15em] leading-none"
          style={{ color: "white", fontSize: "2rem" }}
        >
          {MONTH_NAMES[month]}
        </span>
      </div>

      {/* ── Navigation arrows ── */}
      <button
        onClick={onPrev}
        aria-label="Previous month"
        className="absolute z-30 flex items-center justify-center w-8 h-8 rounded-full text-white transition-all duration-200 hover:scale-110"
        style={{
          top: "24px",
          left: "12px",
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(4px)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={onNext}
        aria-label="Next month"
        className="absolute z-30 flex items-center justify-center w-8 h-8 rounded-full text-white transition-all duration-200 hover:scale-110"
        style={{
          top: "24px",
          right: "12px",
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(4px)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
