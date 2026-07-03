import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const StoryTimeline = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    // GSAP Context to handle cleanup easily in React
    let ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".timeline-section");
      
      // 1. Horizontal Scroll Animation
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true, // Ye screen ko wahi rok dega (pin kar dega)
          scrub: 1,  // Scroll ke sath smooth sync
          snap: 1 / (sections.length - 1), // Optional: section pe aake rukne ke liye
          end: () => "+=" + trackRef.current.offsetWidth, // Scroll kitna lamba chalega
        },
      });

      // 2. Fade-in Animations for elements inside the sections
      sections.forEach((section) => {
        const fadeElements = section.querySelectorAll(".fade-up-element");
        
        fadeElements.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              scrollTrigger: {
                trigger: el,
                containerAnimation: gsap.getById("horizontal-scroll"), // Link to horizontal scroll
                start: "left center+=200", // Jab element screen me aaye
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      });
    }, containerRef);

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    // Main Container - Height set to h-screen so it takes full viewport
    <div ref={containerRef} className="h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 font-sans relative">
      
      {/* The continuous connecting line running through the center */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-zinc-700 z-0 pointer-events-none transform -translate-y-1/2"></div>

      {/* The Track that moves horizontally */}
      <div ref={trackRef} className="flex h-full w-[400vw]">
        
        {/* Section 1 */}
        <div className="timeline-section w-screen h-full flex flex-col justify-center items-center relative z-10 px-20">
          <div className="fade-up-element text-left max-w-2xl bg-zinc-900/80 p-8 rounded-2xl border border-zinc-800 backdrop-blur-sm">
            <h1 className="text-6xl font-bold mb-6 tracking-tight">Keep going. <br/> One small step.</h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Our journey started in a small garage with nothing but a laptop and a vision. 
              Every milestone, win, or challenge was shaped by the incredible people we met along the way.
            </p>
          </div>
          {/* Timeline Node */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-100 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
          <span className="absolute top-[55%] left-1/2 transform -translate-x-1/2 text-sm text-zinc-500 font-mono">2004</span>
        </div>

        {/* Section 2 */}
        <div className="timeline-section w-screen h-full flex flex-col justify-center items-start relative z-10 px-32">
          <div className="fade-up-element text-left max-w-xl">
            <h2 className="text-4xl font-semibold mb-4 text-zinc-200">The Early Years</h2>
            <p className="text-zinc-400 text-lg mb-8">
              "Sounds a bit like a paradox, doesn't it?" Five years of learning how not to do it led me to a one-year ultimatum. 
              Quality-first design, laser-focused, no mercy.
            </p>
            <div className="w-full h-64 bg-zinc-800 rounded-xl flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition duration-500 cursor-pointer">
              <span className="text-zinc-500">[Image Placeholder]</span>
            </div>
          </div>
          <div className="absolute top-1/2 left-[20%] transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-zinc-400 rounded-full"></div>
          <span className="absolute top-[55%] left-[20%] transform -translate-x-1/2 text-sm text-zinc-500 font-mono">2006</span>
        </div>

        {/* Section 3 */}
        <div className="timeline-section w-screen h-full flex flex-col justify-center items-end relative z-10 px-32">
          <div className="fade-up-element text-right max-w-xl">
            <h2 className="text-5xl font-bold mb-4">Plan B was making <br/><span className="text-zinc-500">Plan A work.</span></h2>
            <p className="text-zinc-400 text-lg">
              Soon, we moved into our first official space: a snug 5x5m room near the university. 
              It was just a pair of computers, tables and chairs, and a whole lot of drive.
            </p>
          </div>
          <div className="absolute top-1/2 right-[20%] transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-zinc-400 rounded-full"></div>
          <span className="absolute top-[55%] right-[20%] transform translate-x-1/2 text-sm text-zinc-500 font-mono">2013</span>
        </div>

        {/* Section 4 */}
        <div className="timeline-section w-screen h-full flex flex-col justify-center items-center relative z-10 px-20">
           <div className="fade-up-element text-center">
            <h2 className="text-4xl font-semibold mb-8">Meet the team</h2>
            <div className="flex gap-12 justify-center">
                {/* Team Avatars */}
                {[1, 2, 3].map((item) => (
                    <div key={item} className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-zinc-800 border-2 border-zinc-700 mb-4 flex items-center justify-center text-zinc-600">Avatar</div>
                        <p className="font-medium text-zinc-200">Developer {item}</p>
                        <p className="text-xs text-zinc-500 font-mono">2015 - Present</p>
                    </div>
                ))}
            </div>
           </div>
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-100 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
           <span className="absolute top-[55%] left-1/2 transform -translate-x-1/2 text-sm text-zinc-500 font-mono">Now</span>
        </div>

      </div>
    </div>
  );
};

export default StoryTimeline;