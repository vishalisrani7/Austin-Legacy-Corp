import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);
const TOTAL_FRAMES = 144;

export default function TrainIntro() {
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
    const playhead = { frame: 0 };
    let imagesLoaded = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === 1) render();
      };
      images.push(img);
    }

    const render = () => {
      const img = images[Math.floor(playhead.frame)];
      if (img && img.complete) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };

    gsap.set("#portal-landing-root", {
      scale: 1.1,
      filter: "blur(20px)",
      opacity: 1,
      transformOrigin: "center top" // so it zooms into the top!
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: () => `+=${window.innerHeight * 1.8}`,
        scrub: 1,
      }
    });

    tl.to(playhead, {
      frame: TOTAL_FRAMES - 1,
      ease: "none",
      onUpdate: render,
      duration: 0.8
    })
    .to(canvas, {
      scale: 2.4,
      filter: "blur(15px)",
      opacity: 0, 
      ease: "power2.in",
      duration: 0.2
    }, "reveal")
    .to("#portal-landing-root", {
      scale: 1,
      filter: "blur(0px)",
      duration: 0.2,
      ease: "power2.out",
      clearProps: "transform,filter", // CLEAR PROPS IS CRITICAL to not ruin document flow
      onStart: () => {
        window.dispatchEvent(new Event("startPortalAnimation"));
      },
      onReverseComplete: () => {
        window.dispatchEvent(new Event("hidePortalAnimation"));
      }
    }, "reveal");

  }, []);

  return (
    <>
      {/* This spacer provides the exact scroll length for the intro scrub */}
      <div className="w-full pointer-events-none" style={{ height: "180vh" }} />
      <section className="fixed top-0 left-0 w-full h-screen bg-transparent overflow-hidden z-[51] pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full object-cover origin-center bg-black" />
      </section>
    </>
  );
}
