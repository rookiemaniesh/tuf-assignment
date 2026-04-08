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
  imageSrc: string;
  onPrev: () => void;
  onNext: () => void;
}

export default function HeroImage({
  year,
  month,
  themeColor,
  imageSrc,
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
              <filter id="wire-shadow-h" filterUnits="userSpaceOnUse" x="-10" y="-10" width="530" height="50">
                <feDropShadow dx="0" dy="2.5" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
              </filter>
            </defs>

            

            {/* Unified Hanger & Horizontal Wire (Threaded inside loops) */}
            <path
              d="M 65,9 
                 L 238,9 
                 C 246,9 249,-2 255,-2 
                 C 261,-2 264,9 272,9 
                 L 445,9"
              fill="none"
              stroke="url(#metal)"
              strokeWidth="2.4"
              filter="url(#wire-shadow-h)"
              strokeLinecap="round"
            />
            {/* Hanger Hook Plastic Clip */}
            <rect
              x="253.5"
              y="-3.5"
              width="3"
              height="5"
              rx="1.5"
              fill="#141518"
              filter="url(#wire-shadow-h)"
            />

            {/* Loop groups */}
            {Array.from({ length: 32 }).map((_, i) => {
              if (i === 15 || i === 16) return null; // Gap for hanger

              const x = i * 16 + 4;
              return (
                <g key={i} transform={`translate(${x},0)`}>

  {/* PAPER HOLE */}
  <rect
    x="2.3"
    y="15.5"
    width="7.5"
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
              );
            })}
          </svg>
        </div>
      </div>

      {/* ── Hero photograph ── */}
      <Image
        src={imageSrc}
        alt="Calendar hero"
        fill
        className="object-cover object-center"
        priority
        style={{ paddingTop: "18px" }}
      />
      

      {/* ── Geometric overlay: separated banner shape ── */}
      <svg
        className="absolute bottom-0 left-0 w-full z-10"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ height: "180px", overflow: "visible" }}
      >
        {/* Blue band shape overlapping the image */}
        <path
          d="M 0,25 
             L 28,55 
             Q 38,65 48,55 
             L 100,-20 
             L 100,120 
             L 0,120 Z"
          fill={themeColor}
        />
        {/* White shape masking the bottom of the blue band, blending into the UI area */}
        <path
          d="M 0,65 
             L 28,95 
             Q 38,100 48,90 
             L 100,50 
             L 100,120 
             L 0,120 Z"
          fill="white"
        />
      </svg>

      {/* ── Month + Year label (sits on the right-hand blue triangle) ── */}
      <div className="absolute right-8 text-right z-20" style={{ bottom: "115px" }}>
        <span
          className="block font-light tracking-[0.22em]"
          style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.95rem" }}
        >
          {year}
        </span>
        <span
          className="block font-extrabold tracking-[0.15em] leading-none"
          style={{ color: "white", fontSize: "1.5rem" }}
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
          top: "44px",
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
          top: "44px",
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
