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
}

export default function HeroImage({
  year,
  month,
  themeColor,
  imageSrc,
}: HeroImageProps) {
  return (
    <div className="relative w-full overflow-hidden h-[240px] sm:h-[440px]">

      {/* ── Hero photograph ── */}
      <Image
        src={imageSrc}
        alt="Calendar hero"
        fill
        className="object-cover object-center"
        priority
      />
      

      {/* ── Geometric overlay: separated banner shape ── */}
      <svg
        className="absolute bottom-0 left-0 w-full z-10 h-[100px] sm:h-[180px] overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
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
      <div className="absolute right-4 sm:right-8 text-right z-20 bottom-[75px] sm:bottom-[115px]">
        <span
          className="block font-light tracking-[0.22em] text-[0.85rem] sm:text-[0.95rem]"
          style={{ color: "rgba(255,255,255,0.82)" }}
        >
          {year}
        </span>
        <span
          className="block font-extrabold tracking-[0.15em] leading-none text-xl sm:text-[1.5rem]"
          style={{ color: "white" }}
        >
          {MONTH_NAMES[month]} 
        </span>
      </div>
    </div>
  );
}
