"use client";
import React, { memo, useEffect, useRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const GlowingEffect = memo(
  ({
    blur = 0,
    spread = 20, 
    variant = "default",
    glow = false,
    className,
    borderWidth = 3, 
    disabled = false,
    speed = 2,
    movementDuration = 2,
    inactiveZone = 0.7,
    proximity = 0,
  }) => {
    const containerRef = useRef(null);

    useEffect(() => {
      let angle = 0;
      let animationFrame;

      const animate = () => {
        angle = (angle + speed) % 360;
        if (containerRef.current) {
          containerRef.current.style.setProperty("--start", String(angle));
          containerRef.current.style.setProperty("--active", "1");
        }
        animationFrame = requestAnimationFrame(animate);
      };

      if (!disabled) {
        animate();
      }

      return () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
      };
    }, [speed, disabled]);

    return (
      <>
        <div
          className={cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "white" && "border-white",
            disabled && "!block"
          )}
        />
        <div
          ref={containerRef}
          style={{
            "--blur": `${blur}px`,
            "--spread": spread,
            "--start": "0",
            "--active": "1",
            "--glowingeffect-border-width": `${borderWidth}px`,
            "--repeating-conic-gradient-times": "5",
            "--gradient":
              variant === "white"
                ? `repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  var(--black),
                  var(--black) calc(25% / var(--repeating-conic-gradient-times))
                )`
                : `repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  #00FFFF 0%,   /* Cyan Neon */
                  #39FF14 25%,  /* Neon Green */
                  #FFFF00 50%,  /* Neon Yellow */
                  #FF4500 75%,  /* Neon Orange-Red */
                  #00FFFF 100%
                )`,
          }}
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)] ",
            className,
            disabled && "!hidden"
          )}
        >
          <div
            className={cn(
              "glow",
              "rounded-[inherit]",
              'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
              "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
              "after:[background:var(--gradient)]",
              "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
              "after:[mask-clip:padding-box,border-box]",
              "after:[mask-composite:intersect]",
              "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"            
            )}
          />
        </div>
      </>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";
export { GlowingEffect };