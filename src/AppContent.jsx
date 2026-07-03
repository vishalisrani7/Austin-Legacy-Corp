import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CardSection from "./CardSection";
import HowWeDo from "./HowWeDo";
import Review from "./Review";
import Footer from "./Footer";
import ScrollBasedStory from "./ScrollBasedStory";
import HyperSpeed from "./HyperSpeed";

gsap.registerPlugin(ScrollTrigger);

const APP_CONTENT_TIMELINE_DURATION = 15;
const APP_CONTENT_SECTIONS = [
  { id: "home", time: 0 },
  { id: "processes", time: 1 },
  { id: "stats", time: 5 },
  { id: "story", time: 9 },
  { id: "review", time: 13 },
  { id: "hyperspeed", time: 14 },
  { id: "contact", time: APP_CONTENT_TIMELINE_DURATION - 0.35 },
];

function getActiveSectionFromTimelineTime(time) {
  let activeSection = APP_CONTENT_SECTIONS[0].id;

  for (let i = APP_CONTENT_SECTIONS.length - 1; i >= 0; i -= 1) {
    if (time >= APP_CONTENT_SECTIONS[i].time - 0.18) {
      activeSection = APP_CONTENT_SECTIONS[i].id;
      break;
    }
  }

  return activeSection;
}

function StatsSection() {
  const steps = [
    { id: "01", title: "Unlocking the opportunity", subtitle: "Business strategy", content: ["Before anything beautiful or brilliant gets built, we dig into the core of your business. We ask uncomfortably smart questions, uncover truths, and map where the real value lives. No random feature factories here — only direction that matters. The outcome? A strategy engineered to win."] },
    { id: "02", title: "We help solve a range of business challenges", subtitle: "Design & Execution", content: ["Once the path is clear, we design and prototype like scientists in a creative lab. We test, break, refine, repeat — until ideas become solutions people actually care about. Call it innovation, call it problem-solving. We call it Tuesday."] },
    { id: "03", title: "Driving adoption and scale", subtitle: "Growth & Analysis", content: ["Launching is just the kickoff. We help you define KPIs, set up analytics, and track what users love (and what they pretend to love). Our data detectives hunt for improvements to maximize performance and growth. We equip your team to scale independently."] },
    { id: "04", title: "Sustained Innovation & Support", subtitle: "Long-term Partnership", content: ["After launch, the evolution continues. Monitoring, updates, enhancements, improvements — continuous progress that keeps you ahead of change, not catching up to it."] },
  ];

  return (
    <div className="w-full h-full relative font-sans stats-strip">
      {steps.map((step, index) => (
        <div key={index} className="absolute inset-0 w-full h-full flex flex-col justify-center px-10 lg:px-24 overflow-hidden stats-item">
          <div className="absolute top-10 left-10 lg:top-16 lg:left-16 text-[100px] lg:text-[220px] leading-none font-bold tracking-tighter opacity-10 pointer-events-none z-0">
            {step.id}
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20 relative z-10 w-full max-w-[1400px] mx-auto">
            <div className="w-full lg:w-[45%] pr-0 lg:pr-10">
              <h2 className="text-3xl lg:text-5xl font-bold mb-3 lg:mb-4 leading-tight">{step.title}</h2>
              <h3 className="text-base lg:text-xl font-medium opacity-60 mt-2 text-blue-400">{step.subtitle}</h3>
            </div>
            <div className="w-full lg:w-[55%] text-lg lg:text-2xl leading-relaxed opacity-90">
              <p className="whitespace-pre-line">{step.content.join(" ")}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AppContent({ scrollerRef = null, theme = "dark", onBackToTop, embedded = false, onActiveSectionChange }) {
  const containerRef = useRef(null);
  const panelsRef = useRef([]);
  const activeSectionRef = useRef("home");
  const shellBackground = embedded ? "rgba(6, 10, 18, 0.38)" : "#000000";

  useGSAP(() => {
    if (!containerRef.current || !scrollerRef?.current) return;
    const panels = panelsRef.current.filter(Boolean);
    if (panels.length === 0) return;

    gsap.set(panels, { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" });
    gsap.set(panels.slice(1), { xPercent: 100, autoAlpha: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        scroller: scrollerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1, 
      }
    });

    tl.eventCallback("onUpdate", () => {
      const activeSection = getActiveSectionFromTimelineTime(tl.time());
      if (activeSectionRef.current !== activeSection) {
        activeSectionRef.current = activeSection;
        onActiveSectionChange?.(activeSection);
      }
    });

    // 0 -> 1 (HowWeDo transition & horizontal slide)
    tl.to(panels[0], { filter: "blur(20px)", autoAlpha: 0, scale: 0.95, duration: 0.5 })
      .fromTo(panels[1], { xPercent: 100, autoAlpha: 0, scale: 1.05 }, { xPercent: 0, autoAlpha: 1, scale: 1, duration: 0.5 });
    const howWeDoItems = panels[1].querySelectorAll('.how-we-do-item');
    if (howWeDoItems.length > 0) {
      gsap.set(Array.from(howWeDoItems).slice(1), { xPercent: 100, autoAlpha: 0 });
      for (let i = 0; i < howWeDoItems.length - 1; i++) {
        tl.to(howWeDoItems[i], { filter: "blur(20px)", autoAlpha: 0, scale: 0.95, duration: 0.5 })
          .fromTo(howWeDoItems[i+1], { xPercent: 100, autoAlpha: 0, scale: 1.05 }, { xPercent: 0, autoAlpha: 1, scale: 1, duration: 0.5 });
      }
    }

    // 1 -> 2 (Stats transition & horizontal slide)
    tl.to(panels[1], { filter: "blur(20px)", autoAlpha: 0, scale: 0.95, duration: 0.5 })
      .fromTo(panels[2], { xPercent: 100, autoAlpha: 0, scale: 1.05 }, { xPercent: 0, autoAlpha: 1, scale: 1, duration: 0.5 });
    const statsItems = panels[2].querySelectorAll('.stats-item');
    if (statsItems.length > 0) {
      gsap.set(Array.from(statsItems).slice(1), { xPercent: 100, autoAlpha: 0 });
      for (let i = 0; i < statsItems.length - 1; i++) {
        tl.to(statsItems[i], { filter: "blur(20px)", autoAlpha: 0, scale: 0.95, duration: 0.5 })
          .fromTo(statsItems[i+1], { xPercent: 100, autoAlpha: 0, scale: 1.05 }, { xPercent: 0, autoAlpha: 1, scale: 1, duration: 0.5 });
      }
    }

    // 2 -> 3 (Story transition & horizontal slide)
    tl.to(panels[2], { filter: "blur(20px)", autoAlpha: 0, scale: 0.95, duration: 0.5 })
      .fromTo(panels[3], { xPercent: 100, autoAlpha: 0, scale: 1.05 }, { xPercent: 0, autoAlpha: 1, scale: 1, duration: 0.5 });
    
    const storyStrip = panels[3].querySelector('.story-strip');
    const storyItems = panels[3].querySelectorAll('.story-item');
    
    if (storyStrip && storyItems.length > 0) {
      gsap.set(Array.from(storyItems).slice(1), { xPercent: 100, autoAlpha: 0 });
      // 1. Initial pop-in for the very first item
      tl.fromTo(storyItems[0].querySelector('.story-content'), 
        { autoAlpha: 0, y: 40 }, 
        { autoAlpha: 1, y: 0, duration: 0.8 }
      );
      
      // 2. Loop through the remaining items to create the Move & Pause effect
      for (let i = 1; i < storyItems.length; i++) {
        
        // Sequential blur-out/slide-in transition between items
        tl.to(storyItems[i-1], { filter: "blur(20px)", autoAlpha: 0, scale: 0.95, duration: 0.75 })
          .fromTo(storyItems[i], { xPercent: 100, autoAlpha: 0, scale: 1.05 }, { xPercent: 0, autoAlpha: 1, scale: 1, duration: 0.75 });
        
        // THE PAUSE: Horizontal slide stops, user scroll now powers these internal animations
        tl.fromTo(storyItems[i].querySelector('.story-year-suffix'), 
          { x: 100, autoAlpha: 0, scale: 0.8 }, 
          { x: 0, autoAlpha: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, 
          "-=0.5" // Triggers slightly before the slide finishes
        )
        .fromTo(storyItems[i].querySelector('.story-content'), 
          { autoAlpha: 0, filter: "blur(12px)", x: 40 }, 
          { autoAlpha: 1, filter: "blur(0px)", x: 0, duration: 1 },
          "<" // Syncs with the year-suffix animation
        )
        .fromTo(storyItems[i].querySelector('.story-img'), 
          { scale: 1.4, filter: "blur(10px)" }, 
          { scale: 1, filter: "blur(0px)", duration: 1, ease: "power2.out" },
          "-=0.5"
        );
      }
    }

    // 3 -> 4 (Review)
    tl.to(panels[3], { filter: "blur(20px)", autoAlpha: 0, scale: 0.95, duration: 0.5 })
      .fromTo(panels[4], { xPercent: 100, autoAlpha: 0, scale: 1.05 }, { xPercent: 0, autoAlpha: 1, scale: 1, duration: 0.5 });

    // 4 -> 5 (HyperSpeed)
    tl.to(panels[4], { filter: "blur(20px)", autoAlpha: 0, scale: 0.95, duration: 0.5 })
      .fromTo(panels[5], { xPercent: 100, autoAlpha: 0, scale: 1.05 }, { xPercent: 0, autoAlpha: 1, scale: 1, duration: 0.5 });

    // 5 -> 6 (Contact)
    tl.to(panels[5], { filter: "blur(20px)", autoAlpha: 0, scale: 0.95, duration: 0.5 })
      .fromTo(panels[6], { xPercent: 100, autoAlpha: 0, scale: 1.05 }, { xPercent: 0, autoAlpha: 1, scale: 1, duration: 0.5 });

    activeSectionRef.current = "home";
    onActiveSectionChange?.("home");
  }, { scope: containerRef, dependencies: [scrollerRef?.current, onActiveSectionChange] });

  const setPanelRef = (el, index) => { if (el) panelsRef.current[index] = el; };
  const panelClass = "absolute inset-0 w-full h-full overflow-hidden bg-black";
  const embeddedPanelScrollClass = embedded ? "overflow-hidden" : "overflow-y-auto overflow-x-hidden scrollbar-hide";

  return (
    <main ref={containerRef} className="relative w-full text-white" style={{ height: "4000%" }}>
      <div className="sticky top-0 left-0 w-full overflow-hidden" style={{ height: "100vh", background: shellBackground }}>
        
        <div ref={(el) => setPanelRef(el, 0)} className={`${panelClass} z-[70]`} style={{ background: shellBackground }}>
          <div className={`w-full h-full ${embeddedPanelScrollClass}`}>
            <CardSection scrollerRef={scrollerRef} embedded={embedded} />
          </div>
        </div>
        
        <div ref={(el) => setPanelRef(el, 1)} className={`${panelClass} z-[60]`} style={{ background: shellBackground }}>
          <div className="w-full h-full">
            <HowWeDo embedded={embedded} />
          </div>
        </div>
        
        <div ref={(el) => setPanelRef(el, 2)} className={`${panelClass} z-[50]`} style={{ background: shellBackground }}>
          <div className="w-full h-full">
            <StatsSection />
          </div>
        </div>
        
        <div ref={(el) => setPanelRef(el, 3)} className={`${panelClass} z-[40]`} style={{ background: shellBackground }}>
          <div className="w-full h-full overflow-hidden">
            <ScrollBasedStory theme={theme} embedded={embedded} />
          </div>
        </div>
        
        <div ref={(el) => setPanelRef(el, 4)} className={`${panelClass} z-[30]`} style={{ background: shellBackground }}>
          <div className={`w-full h-full ${embeddedPanelScrollClass}`}>
            <Review scrollerRef={scrollerRef} embedded={embedded} />
          </div>
        </div>
        
        <div ref={(el) => setPanelRef(el, 5)} className={`${panelClass} z-[20]`} style={{ background: shellBackground }}>
          <div className={`w-full h-full overflow-hidden relative cursor-crosshair`}>
            <HyperSpeed />
          </div>
        </div>
        
        <div ref={(el) => setPanelRef(el, 6)} className={`${panelClass} z-[10]`} style={{ background: shellBackground }}>
          <div className={`w-full h-full flex items-center justify-center ${embeddedPanelScrollClass}`}>
            <Footer theme={theme} onBackToTop={onBackToTop} embedded={embedded} />
          </div>
        </div>
      </div>
    </main>
  );
}
