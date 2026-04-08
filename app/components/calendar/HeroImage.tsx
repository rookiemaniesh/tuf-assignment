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
    <div className="relative w-full overflow-hidden" style={{ height: "440px" }}>

      {/* ── Hyper-Realistic Twin-Loop Spiral Binding ── */}
      <div
        className="absolute top-0 left-0 w-full z-30 pointer-events-none"
        style={{
          height: "20px",
          background: "#dde1e8"
        }}
      >
        <div className="w-full h-full flex justify-center items-start pt-1">
          <svg width="550" height="52" viewBox="0 -2 510 48" className="overflow-visible select-none">
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
            </defs>

            {/* Loop groups */}
            {Array.from({ length: 44 }).map((_, i) => {
              if (i === 21 || i === 22) return null; // Gap for hanger

              const x = i * 11.6 + 2;
              return (
                <g key={i} transform={`translate(${x},0)`}>

  {/* PAPER HOLE */}
  <rect
    x="2.3"
    y="15.5"
    width="7"
    height="9"
    rx="1.2"
    fill="#141518"
  />
  <rect
    x="2.3"
    y="15.5"
    width="6"
    height="2.3"
    rx="1.2"
    fill="#000"
    opacity="0.7"
  />

  {/* FRONT WIRES */}
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
                // <g key={i} transform={`translate(${x}, 0)`}>
                //   {/* Punched hole */}
                //   <rect x="2.5" y="16" width="5.5" height="8" rx="1" fill="#151618" opacity="0.9" />
                //   <rect x="2.5" y="16" width="5.5" height="2" fill="#000" opacity="0.7" rx="1" />
                  
                //   {/* Twin loops */}
                //   <path d="M 3.5,20 C 3.5,6 -0.5,3 4.5,3 C 9.5,3 6.5,6 6.5,20" fill="none" stroke="url(#metal)" strokeWidth="1.6" filter="url(#wire-shadow)" />
                //   <path d="M 5.5,20 C 5.5,6 1.5,3 6.5,3 C 11.5,3 8.5,6 8.5,20" fill="none" stroke="url(#metal)" strokeWidth="1.6" filter="url(#wire-shadow)" />
                // </g>
              );
            })}

            {/* Center Calendar Hanger Hook */}
            <path
              d="M 246,18 L 251,4 C 251,0 252,-4 255,-4 C 258,-4 259,0 259,4 L 264,18"
              fill="none"
              stroke="url(#metal)"
              strokeWidth="2.2"
              filter="url(#wire-shadow)"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
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
