import React, { useLayoutEffect, useRef, useMemo, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_PATH = "M 250 300 C 420 260, 1050 450, 1160 750 C 1250 1050, 220 1250, 400 1400 C 440 1440, 840 1540, 890 1620 C 920 1700, 600 1800, 580 1850 C 550 1900, 660 1920, 700 1950";

const MOBILE_PATH = "M 40 300 C 100 250, 320 450, 340 750 C 360 1050, 30 1250, 50 1400 C 60 1440, 300 1540, 320 1620 C 340 1700, 60 1800, 50 1850 C 40 1900, 150 1920, 180 1950";

const GsapFinalReveal = () => {
  const containerRef = useRef(null);
  const glowRef = useRef(null);
  const initialTextRef = useRef(null);
  const contentContainerRef = useRef(null);
  const pathRef = useRef(null);
  const finalTextRef = useRef(null);
  const starsRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); 
    };
    
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const stars = useMemo(() => {
    return Array.from({ length: 300 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1 + "px",
      opacity: Math.random(),
      animationDelay: `${Math.random() * 5}s`
    }));
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const path = pathRef.current;
      
      if (!path) return;

      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length
      });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=7000",
          scrub: 1,
          pin: true,
        },
      });
      tl.to(initialTextRef.current, { opacity: 0, duration: 0.5 });

      tl.fromTo(glowRef.current,
        { y: "85%", scale: 1 },
        { y: "0%", scale: 30, duration: 2, ease: "power2.inOut" },
        "-=0.5"
      );

      tl.to(contentContainerRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
      }, "-=1");

      tl.addLabel("startSnake");
      tl.to(path, {
        strokeDashoffset: 0,
        duration: 10,
        ease: "none"
      }, "startSnake");

      tl.to(contentContainerRef.current, {
        y: -2500,
        duration: 10,
        ease: "none"
      }, "startSnake");

      tl.to(starsRef.current, {
        y: -500, 
        duration: 10,
        ease: "none"
      }, "startSnake");
      tl.addLabel("exitHole");

      tl.to(contentContainerRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut"
      }, "exitHole");

      tl.to(glowRef.current, {
        scale: 1,
        y: "85%",
        duration: 2,
        ease: "power2.inOut"
      }, "exitHole");

      tl.fromTo(finalTextRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1 },
        "exitHole+=1.5"
      );

    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]); 

  return (
    <div ref={containerRef} className="relative h-screen w-full bg-white overflow-hidden font-sans">
      <div ref={initialTextRef} className="absolute inset-0 flex flex-col items-center justify-center z-0 px-4">
 
        <h2 className="text-4xl md:text-[100px] font-bold text-black text-center tracking-tighter mb-4">
          AUSTIN LEGACY CORP<br />
        </h2>
        <p className="text-gray-500 text-2xl tracking-widest uppercase">
          Inventing The Next Century
        </p>
      </div>

      <div
        ref={glowRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[95vw] md:w-[80vw] h-[40vw] rounded-t-[100%] z-10 origin-bottom will-change-transform"
        style={{
          background: `radial-gradient(
            circle at bottom center, 
            black 30%,
            #8B0000 45%,
            #FF4500 55%,
            #FFA500 65%,
            #FFD700 75%,
            transparent 80%
          )`
        }}
      ></div>

      <div className="absolute inset-0 bg-white -z-10" />
      <div
        ref={contentContainerRef}
        className="absolute top-0 left-0 w-full h-full z-20 opacity-0 translate-y-10"
      >
        <div
          ref={starsRef}
          className="absolute top-[-100%] left-0 w-full h-[800%] pointer-events-none"
        >
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute bg-white rounded-full opacity-60"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                opacity: star.opacity
              }}
            />
          ))}
        </div>
        
        <div className="absolute top-[15vh] w-full text-center z-30 px-2">
          <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter mb-4">
            What We Do
          </h1>
        </div>

        <svg
          className="absolute top-0 left-0 w-full h-[3000px] pointer-events-none overflow-visible"
          viewBox={isMobile ? "0 0 390 2000" : "0 0 1440 2000"}
          preserveAspectRatio="xMidYMin slice"
        >
          <defs>
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff9000" />
              <stop offset="100%" stopColor="#ff0000" />
            </linearGradient>
          </defs>
          
          <path
            d={isMobile ? MOBILE_PATH : DESKTOP_PATH}
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.2"
          />
          <path
            ref={pathRef}
            d={isMobile ? MOBILE_PATH : DESKTOP_PATH}
            fill="none"
            stroke="url(#snakeGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#neonGlow)"
          />
        </svg>
         <div className="absolute top-[500px] right-5 md:left-[10%] text-white opacity-50 font-mono text-sm md:text-4xl">CODECRAFTING</div>
        <div className="absolute top-[1000px] right-5 md:right-[15%] text-white opacity-50 font-mono text-sm md:text-4xl">PIXELFORGING</div>
        <div className="absolute top-[1800px] left-5 md:left-[10%] text-white opacity-50 font-mono text-sm md:text-4xl">NETBUILDING</div>
        <div className="absolute top-[2400px] left-5 md:left-[50%] text-white opacity-50 font-mono text-sm md:text-4xl">GAMEFORGING</div>
        <div className="absolute top-[2800px] left-5 md:left-[50%] text-white opacity-50 font-mono text-sm md:text-4xl">DATASHIELDING</div>
      </div>
      <div ref={finalTextRef} className="absolute inset-0 flex flex-col items-center justify-center z-0 opacity-0 px-4">
       
        <h2 className="text-4xl md:text-7xl font-bold text-black text-center tracking-tighter mb-6">
          Ready to Begin?
        </h2>
        {/* <button className="px-8 py-3 bg-black text-white rounded-full text-lg font-medium hover:scale-105 transition-all">
          Get Started
        </button> */}
      </div>

    </div>
  );
};

export default GsapFinalReveal;