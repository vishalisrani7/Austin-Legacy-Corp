import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './Hero.css';
gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const container = useRef(null);
  const pathRef = useRef(null);
  
  useGSAP(() => {
    const path = pathRef.current;
    const length = path.getTotalLength();
    gsap.set(path, { 
      strokeDasharray: length, 
      strokeDashoffset: length 
    });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "+=6000", // Total scroll distance
        scrub: 1, // Smooth catch-up (1 second delay) for "heavy" feel
        pin: true, // Lock the screen
      }
    });

    // --- PHASE 1: MOUNTAIN RISE (0% - 15%) ---
    tl.to(".mountain-bg", {
      top: "-280vh", // Rise way up
      duration: 5,
      ease: "power2.inOut",
      // Intense Glow Animation
      boxShadow: "0 -200px 300px rgba(255, 50, 0, 1), 0 -80px 100px rgba(255, 180, 0, 0.8)"
    }, 0);

    // Fade out white intro text
    tl.to(".scene-intro", { opacity: 0, duration: 2 }, 0);

    // --- PHASE 2: REVEAL TITLE (15% - 20%) ---
    tl.to(".main-title", { opacity: 1, y: -20, duration: 2 }, ">-2");

    // --- PHASE 3: DRAW LINE & MOVE CAMERA (20% - 100%) ---
    // We run these in parallel
    
    // A. Draw the Snake Line
    tl.to(path, {
      strokeDashoffset: 0,
      duration: 30, // Long duration relative to total scroll
      ease: "none" // Linear draw, speed controlled by scroll
    }, "startLine");

    // B. Move the Canvas UP (Camera Follow Effect)
    // As line goes down, we push canvas up so we stay centered
    tl.to(".content-canvas", {
      y: -1800, 
      duration: 30,
      ease: "none"
    }, "startLine");

    // --- PHASE 4: REVEAL MARKERS (Synced with Draw) ---
    // We insert these at specific times in the timeline when the line reaches them
    
    // Born (Early)
    tl.to(".marker-born", { opacity: 1, duration: 1 }, "startLine+=3");
    
    // Age 22 (After first big curve)
    tl.to(".marker-22", { opacity: 1, duration: 1 }, "startLine+=12");
    
    // Age 31 (After second curve)
    tl.to(".marker-31", { opacity: 1, duration: 1 }, "startLine+=20");
    
    // Age 41 (Near end)
    tl.to(".marker-41", { opacity: 1, duration: 1 }, "startLine+=28");

  }, { scope: container });

  return (
    <div ref={container} className="scroll-container">
      <div className="pinned-viewport">

        {/* 1. WHITE INTRO LAYER */}
        <div className="scene-intro">
          <div className="testimonial-content">
            <h2 style={{fontSize: '3rem', color: 'black', textAlign: 'center'}}>
              Becoming a<br/>healthier dad.
            </h2>
          </div>
        </div>

        {/* 2. RISING MOUNTAIN LAYER */}
        <div className="mountain-bg"></div>

        {/* 3. MOVING CANVAS (Holds Line & Content) */}
        <div className="content-canvas">
          
          {/* Main Title */}
          <div className="main-title">
            <h1>Unlock all the potential<br /><span style={{color:'#999'}}>your life holds</span></h1>
          </div>

          {/* SVG Canvas */}
          <svg className="svg-track" viewBox="0 0 1440 2500" preserveAspectRatio="xMidYMin slice">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff9000" />
                <stop offset="50%" stopColor="#ff4500" />
                <stop offset="100%" stopColor="#ff0000" />
              </linearGradient>
              {/* Intense Neon Glow Filter */}
              <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="coloredBlur"/> {/* Double blur for intensity */}
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* THE PROFESSIONAL SNAKE PATH (Bezier Curves)
               M 720 400: Start Center
               C ... : Cubic Bezier to create smooth, tension-filled curves
               This path goes Wide Right -> Narrower Left -> Narrowest Right
            */}
            <path
              ref={pathRef}
              d="
                M 720 400
                C 720 700 1350 600 1350 1000
                S 200 1300 200 1600
                S 1100 1900 1100 2200
              "
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#neonGlow)"
            />
          </svg>

          {/* MARKERS (Positioned via CSS to match the SVG coordinates) */}
          <div className="marker marker-born" style={{ top: '650px', left: '150px' }}>
             <div className="marker-label">[ ] BORN</div>
             <h3>C-Section</h3>
          </div>

          <div className="marker marker-22" style={{ top: '1000px', right: '120px', textAlign: 'right' }}>
             <div className="marker-label">[ ] AGE 22</div>
             <h3>Annual Baseline</h3>
          </div>

          <div className="marker marker-31" style={{ top: '1600px', left: '250px' }}>
             <div className="marker-label">[ ] AGE 31</div>
             <h3>Fertility Protocol</h3>
          </div>

          <div className="marker marker-41" style={{ top: '2200px', right: '380px', textAlign: 'right' }}>
             <div className="marker-label">[ ] AGE 41</div>
             <h3>Longevity Phase</h3>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;