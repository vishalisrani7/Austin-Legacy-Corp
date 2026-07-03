import React, { useCallback, useEffect, useRef, useState } from "react";
import AppContent from "./AppContent";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { 
  Home, Layers, BarChart2, BookOpen, MessageSquare, Phone,
  CloudSun, Play, Pause, SkipForward, SkipBack, Thermometer,
  Activity, Server, Cpu
} from "lucide-react";

const GlassPanel = ({ children, className = "", style = {} }) => (
  <div
    className={`rounded-[32px] p-5 ${className}`}
    style={{
      background: "rgba(30, 30, 30, 0.4)", 
      backdropFilter: "blur(20px)", 
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)", 
      boxShadow: "0 10px 40px rgba(0,0,0,0.3)", 
      ...style
    }}
  >
    {children}
  </div>
);

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => { 
    const timer = setInterval(() => setTime(new Date()), 1000); 
    return () => clearInterval(timer); 
  }, []);
  
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <GlassPanel>
      <div className="text-white/70 text-sm font-medium mb-1 font-rajdhani tracking-widest uppercase">
        {time.getFullYear()} {months[time.getMonth()]}
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-6xl font-bold font-jetbrains tracking-tighter">
          {String(time.getHours()).padStart(2, '0')}:{String(time.getMinutes()).padStart(2, '0')}
        </div>
        <div className="text-blue-400 font-medium writing-vertical-rl transform -rotate-180 text-sm font-rajdhani">
          {days[time.getDay()]}
        </div>
      </div>
    </GlassPanel>
  );
};

const WeatherWidget = () => {
  const [isCelsius, setIsCelsius] = useState(true);
  const baseTempC = 35;
  const temp = isCelsius ? baseTempC : Math.round((baseTempC * 9/5) + 32);
  const unit = isCelsius ? "C" : "F";

  return (
    <GlassPanel className="relative overflow-hidden group cursor-pointer" style={{ transition: "all 0.3s ease" }}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/10 opacity-50" />
      <div 
        className="relative z-10 flex justify-between items-start" 
        onClick={() => setIsCelsius(!isCelsius)}
      >
        <div>
          <h4 className="text-white/70 text-sm font-medium font-rajdhani tracking-wider">AJMER, RJ</h4>
          <div className="text-4xl font-semibold mt-1 font-jetbrains tracking-tighter">
            {temp}°{unit}
          </div>
          <div className="text-white/60 text-xs mt-2 font-jetbrains flex items-center gap-1">
            <Thermometer size={12} /> {isCelsius ? "35°/27°C" : "95°/80°F"} • Sunny
          </div>
        </div>
        <CloudSun className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" size={32} />
      </div>
    </GlassPanel>
  );
};

// 3. Dynamic Music Player Widget (Custom Design)
const MusicWidget = () => {
  return (    <div className="flex flex-col items-center group/he select-none w-full">
      <div className="relative z-0 h-20 -mb-2 transition-all duration-200 group-hover/he:h-0">
        <svg width={144} height={144} viewBox="0 0 128 128" className="duration-500 border-4 rounded-full shadow-md border-zinc-400 border-spacing-5 animate-[spin_3s_linear_infinite] transition-all">
          <svg>
            <rect width={128} height={128} fill="black" />
            <circle cx={20} cy={20} r={2} fill="white" />
            <circle cx={40} cy={30} r={2} fill="white" />
            <circle cx={60} cy={10} r={2} fill="white" />
            <circle cx={80} cy={40} r={2} fill="white" />
            <circle cx={100} cy={20} r={2} fill="white" />
            <circle cx={120} cy={50} r={2} fill="white" />
            <circle cx={90} cy={30} r={10} fill="white" fillOpacity="0.5" />
            <circle cx={90} cy={30} r={8} fill="white" />
            <path d="M0 128 Q32 64 64 128 T128 128" fill="purple" stroke="black" strokeWidth={1} />
            <path d="M0 128 Q32 48 64 128 T128 128" fill="mediumpurple" stroke="black" strokeWidth={1} />
            <path d="M0 128 Q32 32 64 128 T128 128" fill="rebeccapurple" stroke="black" strokeWidth={1} />
            <path d="M0 128 Q16 64 32 128 T64 128" fill="purple" stroke="black" strokeWidth={1} />
            <path d="M64 128 Q80 64 96 128 T128 128" fill="mediumpurple" stroke="black" strokeWidth={1} />
          </svg>
        </svg>
        <div className="absolute z-10 w-8 h-8 bg-white border-4 rounded-full shadow-sm border-zinc-400 top-12 left-12" />
      </div>
      <div className="z-30 flex flex-col w-40 h-20 transition-all duration-300 bg-white shadow-md group-hover/he:h-40 group-hover/he:w-72 rounded-2xl shadow-zinc-400">
        <div className="flex flex-row w-full h-0 group-hover/he:h-20">
          <div className="relative flex items-center justify-center w-24 h-24 group-hover/he:-top-6 group-hover/he:-left-4 opacity-0 group-hover/he:animate-[spin_3s_linear_infinite] group-hover/he:opacity-100 transition-all duration-100">
            <svg width={96} height={96} viewBox="0 0 128 128" className="duration-500 border-4 rounded-full shadow-md border-zinc-400 border-spacing-5">
              <svg>
                <rect width={128} height={128} fill="black" />
                <circle cx={20} cy={20} r={2} fill="white" />
                <circle cx={40} cy={30} r={2} fill="white" />
                <circle cx={60} cy={10} r={2} fill="white" />
                <circle cx={80} cy={40} r={2} fill="white" />
                <circle cx={100} cy={20} r={2} fill="white" />
                <circle cx={120} cy={50} r={2} fill="white" />
                <circle cx={90} cy={30} r={10} fill="white" fillOpacity="0.5" />
                <circle cx={90} cy={30} r={8} fill="white" />
                <path d="M0 128 Q32 64 64 128 T128 128" fill="purple" stroke="black" strokeWidth={1} />
                <path d="M0 128 Q32 48 64 128 T128 128" fill="mediumpurple" stroke="black" strokeWidth={1} />
                <path d="M0 128 Q32 32 64 128 T128 128" fill="rebeccapurple" stroke="black" strokeWidth={1} />
                <path d="M0 128 Q16 64 32 128 T64 128" fill="purple" stroke="black" strokeWidth={1} />
                <path d="M64 128 Q80 64 96 128 T128 128" fill="mediumpurple" stroke="black" strokeWidth={1} />
              </svg>
            </svg>
            <div className="absolute z-10 w-6 h-6 bg-white border-4 rounded-full shadow-sm border-zinc-400 top-9 left-9" />
          </div>
          <div className="flex flex-col justify-center w-full pl-3 -ml-24 overflow-hidden group-hover/he:-ml-3 text-nowrap">
            <p className="text-xl font-bold text-black">Music Name</p>
            <p className="text-zinc-600">Singer &amp; artist</p>
          </div>
        </div>
        <div className="flex flex-row mx-3 mt-3 bg-indigo-100 rounded-md min-h-4 group-hover/he:mt-0">
          <span className="hidden pl-3 text-sm text-zinc-600 group-hover/he:inline-block">0:00</span>
          <input type="range" min={0} max={100} defaultValue={0} className="w-24 group-hover/he:w-full flex-grow h-1 mx-2 my-auto bg-gray-300 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md" />
          <span className="hidden pr-3 text-sm text-zinc-600 group-hover/he:inline-block">3:45</span>
        </div>
        <div className="flex flex-row items-center justify-center flex-grow mx-3 space-x-5 text-black">
          <label htmlFor="playMode" className="flex items-center justify-center w-0 h-full cursor-pointer group-hover/he:w-12">
            <input type="checkbox" id="playMode" className="hidden peer/playMode" />
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-repeat peer-checked/playMode:hidden">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="hidden feather feather-shuffle peer-checked/playMode:inline-block">
              <polyline points="16 3 21 3 21 8" />
              <line x1={4} y1={20} x2={21} y2={3} />
              <polyline points="21 16 21 21 16 21" />
              <line x1={15} y1={15} x2={21} y2={21} />
              <line x1={4} y1={4} x2={9} y2={9} />
            </svg>
          </label>
          <div className="flex items-center justify-center w-12 h-full cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-skip-back">
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1={5} y1={19} x2={5} y2={5} />
            </svg>
          </div>
          <label htmlFor="playStatus" className="flex items-center justify-center w-12 h-full cursor-pointer">
            <input type="checkbox" name="playStatus" id="playStatus" className="hidden peer/playStatus" />
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-play peer-checked/playStatus:hidden">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="hidden feather feather-pause peer-checked/playStatus:inline-block">
              <rect x={6} y={4} width={4} height={16} />
              <rect x={14} y={4} width={4} height={16} />
            </svg>
          </label>
          <div className="flex items-center justify-center w-12 h-full cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-skip-forward">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1={19} y1={5} x2={19} y2={19} />
            </svg>
          </div>
          <div className="flex items-center justify-center w-12 h-full cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-0 feather feather-list group-hover/he:w-12">
              <line x1={8} y1={6} x2={21} y2={6} />
              <line x1={8} y1={12} x2={21} y2={12} />
              <line x1={8} y1={18} x2={21} y2={18} />
              <line x1={3} y1={6} x2="3.01" y2={6} />
              <line x1={3} y1={12} x2="3.01" y2={12} />
              <line x1={3} y1={18} x2="3.01" y2={18} />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Dynamic Custom Widget (ALC Server Status)
const ServerWidget = () => {
  return (
    <button className="group relative w-full text-left">
      <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 opacity-20 blur-xl transition-all duration-500 group-hover:opacity-50 group-hover:blur-2xl"></div>

      <div className="relative flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-1 pr-4 w-full">
        <div className="flex items-center gap-3 rounded-lg bg-slate-900/50 px-3 py-2 flex-grow">
          <div className="relative shrink-0">
            <div className="absolute -inset-1 rounded-lg bg-teal-500/20 blur-sm transition-all duration-300 group-hover:bg-teal-500/30 group-hover:blur-md"></div>
            <svg
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              className="relative h-6 w-6 text-teal-500"
            >
              <path
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
            </svg>
          </div>

          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-white truncate">89.3%</span>
              <svg
                stroke="currentColor"
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 shrink-0 text-emerald-500 transform transition-transform duration-300 group-hover:translate-y-[-2px]"
              >
                <path
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
            </div>
            <span className="text-[10px] font-medium text-slate-400 truncate">Performance</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-2">
            <div className="flex flex-col items-center gap-1">
              <div className="h-8 w-1.5 rounded-full bg-slate-800 p-[2px]">
                <div className="h-4 w-full rounded-full bg-emerald-500/50 transition-all duration-300 group-hover:h-6"></div>
              </div>
              <span className="text-[10px] font-medium text-slate-400">CPU</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="h-8 w-1.5 rounded-full bg-slate-800 p-[2px]">
                <div className="h-6 w-full rounded-full bg-teal-500/50 transition-all duration-300 group-hover:h-7"></div>
              </div>
              <span className="text-[10px] font-medium text-slate-400">MEM</span>
            </div>
          </div>

          <div className="flex items-center gap-1 ml-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
            <span className="text-[10px] font-semibold text-slate-300">ON</span>
          </div>
        </div>

        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
      </div>
    </button>
  );
};

const ScreenContent = ({ onScreenEnd, showWebsiteScreen, containerBridgeRef = null, onScrollProgress }) => {
  const containerRef = useRef(null);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // PERFECT GSAP MATH SYNC (Total timeline duration is 14)
  const navItems = [
    { id: "home", icon: Home, fraction: 0 },
    { id: "processes", icon: Layers, fraction: 1 / 14 },
    { id: "stats", icon: BarChart2, fraction: 5 / 14 },
    { id: "story", icon: BookOpen, fraction: 9 / 14 },
    { id: "review", icon: MessageSquare, fraction: 13 / 14 },
    { id: "contact", icon: Phone, fraction: 13.65 / 14 },
  ];

  const handleActiveSectionChange = useCallback((sectionId) => {
    setActiveSection(sectionId);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (containerBridgeRef) containerBridgeRef.current = container;
    
    if (showWebsiteScreen) {
      container.scrollTop = 0;
      setHasReachedEnd(false);
      setActiveSection("home");
      if(onScrollProgress) onScrollProgress(0); 
    }
    return () => { if (containerBridgeRef?.current === container) containerBridgeRef.current = null; };
  }, [containerBridgeRef, showWebsiteScreen, onScrollProgress]);

  useEffect(() => {
    if (!showWebsiteScreen) return undefined;
    const refresh = () => ScrollTrigger.refresh();
    const frame = requestAnimationFrame(() => requestAnimationFrame(refresh));
    return () => cancelAnimationFrame(frame);
  }, [showWebsiteScreen]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const maxScroll = container.scrollHeight - container.clientHeight;
      const progress = maxScroll > 0 ? container.scrollTop / maxScroll : 0;
      if(onScrollProgress) onScrollProgress(progress); 

      if (progress > 0.995 && !hasReachedEnd) {
        setHasReachedEnd(true);
        if (onScreenEnd) setTimeout(() => onScreenEnd(), 300);
      }
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [onScreenEnd, hasReachedEnd, onScrollProgress]);

  const handleBackToTop = () => {
    if (containerRef.current) gsap.to(containerRef.current, { scrollTop: 0, duration: 1.5, ease: "power3.inOut" });
  };

  const scrollToSection = (id) => {
    const container = containerRef.current;
    if (!container) return;
    const item = navItems.find(n => n.id === id);
    if (!item) return;

    const maxScroll = container.scrollHeight - container.clientHeight;
    const targetScroll = maxScroll * item.fraction;

    gsap.to(container, {
      scrollTop: targetScroll,
      duration: 1.5,
      ease: "power3.inOut"
    });
  };

  return (
    <div 
      className="pointer-events-auto flex items-center justify-between relative" 
      style={{ 
        width: "100%", 
        height: "100%", 
        padding: "24px", 
        boxSizing: "border-box", 
        gap: "40px", 
        perspective: "1800px", 
        transformStyle: "preserve-3d" 
      }}
    >

      <div 
        className="flex flex-col items-center justify-center gap-6 py-8 px-4 shrink-0 rounded-[40px] z-20 will-change-transform" 
        style={{ 
          background: "rgba(30, 30, 30, 0.4)", 
          backdropFilter: "blur(16px)", 
          WebkitBackdropFilter: "blur(16px)", 
          border: "1px solid rgba(255, 255, 255, 0.1)", 
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          transform: "rotateY(25deg) translateZ(10px)", 
          transformStyle: "preserve-3d" 
        }}
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          return (
            <button 
              key={item.id} 
              onClick={() => scrollToSection(item.id)} 
              className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 group ${ isActive ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white hover:bg-white/15" }`}
            >
              <Icon size={22} className="relative z-10" />
            </button>
          );
        })}
      </div>

      {/* CENTER AREA: MAIN SCREEN (Expanded) */}
      <div 
        className="z-10"
        style={{ 
          flex: 1, 
          height: "100%", 
          borderRadius: "32px", 
          background: "rgba(7,10,16,0.6)", 
          backdropFilter: "blur(24px)", 
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.05)"
        }}
      >
        <div style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: "32px" }}>
          <div ref={containerRef} style={{ width: "100%", height: "100%", overflowY: "auto", overflowX: "hidden", scrollBehavior: "auto", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <AppContent
              scrollerRef={containerRef}
              theme="dark"
              onBackToTop={handleBackToTop}
              embedded
              onActiveSectionChange={handleActiveSectionChange}
            />
          </div>
        </div>
      </div>

      {/* RIGHT AREA: 4 DYNAMIC WIDGETS (Tilted -25 degrees) */}
      <div 
        className="hidden xl:flex flex-col gap-5 w-[300px] shrink-0 z-20 h-full overflow-y-auto overflow-x-hidden scrollbar-hide py-2 will-change-transform" 
        style={{ 
          transform: "rotateY(-25deg) translateZ(10px)", 
          transformStyle: "preserve-3d",
          scrollbarWidth: "none", 
          msOverflowStyle: "none"
        }}
      >
        <ClockWidget />
        <WeatherWidget />
        <MusicWidget />
        <ServerWidget />
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; width: 0px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ScreenContent;
