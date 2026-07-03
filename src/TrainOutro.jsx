import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);
const TOTAL_FRAMES = 144;

export default function TrainOutro() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useGSAP(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    canvas.width = 1920;
    canvas.height = 1080;

    const currentFrame = (idx) => `/frames/ezgif-frame-${String(idx + 4).padStart(3, "0")}.jpg`;
    
    const images = [];
    const playhead = { frame: TOTAL_FRAMES - 1 };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    const render = () => {
      const img = images[Math.floor(playhead.frame)];
      if (img && img.complete) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };

    images[TOTAL_FRAMES - 1].onload = render;

    gsap.set(canvas, {
      scale: 2.4,
      filter: "blur(10px)",
      opacity: 0, // start invisible
      transformOrigin: "center center",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "bottom bottom",
        end: "+=180%",
        scrub: 1, 
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        // 🔥 THE LOOP JUMP 🔥
        onLeave: () => {
          gsap.set(canvas, { opacity: 0 }); // Hide to avoid flicker
          // Jaise hi train frame 0 par aayegi, page quietly top par bhej do!
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
      }
    });

    // Instantly fade in canvas while zooming out footer
    tl.to(canvas, {
      opacity: 1,
      duration: 0.05
    }, "start")
    .to("#contact", {
      scale: 0.9,
      filter: "blur(15px)",
      opacity: 0,
      duration: 0.15,
      ease: "power2.in",
      clearProps: "transform,filter"
    }, "start")
    .to(canvas, {
      scale: 1,
      filter: "blur(0px)",
      ease: "power2.out",
      duration: 0.2
    }, "start+=0.05")
    .to(playhead, {
      frame: 0,
      ease: "none",
      onUpdate: render,
      duration: 0.75
    }, "start+=0.25");

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full h-screen relative z-[51] pointer-events-none -mt-[100vh] overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full object-cover origin-center bg-black opacity-0" />
    </section>
  );
}
