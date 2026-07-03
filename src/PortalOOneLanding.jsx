import React from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// --- Animation Variants ---
// Header top se drop hoga
const headerVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

// Container jo apne bacchon (children) ko ek ke baad ek animate karega
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

// Har ek element niche se upar aayega smoothly
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

// --- Main Component ---
const ALCLanding = () => {
  const sectionRef = React.useRef(null);
  const [playAnimation, setPlayAnimation] = React.useState(false);
  const [animationCycle, setAnimationCycle] = React.useState(0);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=1200",
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1,
    });

    return () => trigger.kill();
  }, { scope: sectionRef });

  React.useEffect(() => {
    const handleStart = () => {
      setPlayAnimation(false);
      requestAnimationFrame(() => {
        setAnimationCycle((cycle) => cycle + 1);
        setPlayAnimation(true);
      });
    };
    const handleHide = () => setPlayAnimation(false);
    window.addEventListener("startPortalAnimation", handleStart);
    window.addEventListener("hidePortalAnimation", handleHide);
    return () => {
      window.removeEventListener("startPortalAnimation", handleStart);
      window.removeEventListener("hidePortalAnimation", handleHide);
    };
  }, []);

  return (
    <div
      id="portal-landing-root"
      ref={sectionRef}
      className="w-full min-h-[100svh] bg-[#0d0d0d] text-[#e0e0e0] font-sans p-2 sm:p-4 md:p-5 overflow-hidden box-border flex items-center justify-center relative z-10"
    >
      
      {/* Inner Box */}
      <div className="w-full h-full min-h-[calc(100svh-1rem)] sm:min-h-[calc(100svh-2rem)] md:min-h-[calc(100svh-2.5rem)] max-w-[1920px] border border-[#444] flex flex-col relative overflow-hidden">
        
        {/* === HEADER SECTION === */}
        <motion.header 
          key={`header-${animationCycle}`}
          variants={headerVariants}
          initial="hidden"
          animate={playAnimation ? "visible" : "hidden"}
          className="flex w-full h-12 sm:h-16 md:h-20 border-b border-[#444] shrink-0"
        >
          {/* 1. Logo Area */}
          <div className="flex-1 sm:flex-[1.2] border-r border-[#444] flex items-center px-3 md:px-6 min-w-0">
            <motion.svg 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              viewBox="0 0 40 40" 
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 mr-2 sm:mr-3 shrink-0 text-white cursor-pointer" 
              fill="none" stroke="currentColor" strokeWidth="1.5"
            >
              <polygon points="20,4 36,32 4,32" stroke="currentColor" fill="none" />
              <circle cx="20" cy="22" r="4" fill="currentColor" />
            </motion.svg>
            <h1 className="text-[15px] sm:text-[16px] md:text-[22px] font-bold tracking-widest text-white truncate">ALC</h1>
          </div>

          {/* 2. Nav Links */}
          <div className="flex-[2] border-r border-[#444] hidden lg:flex items-center justify-center gap-8 xl:gap-12 text-[10px] xl:text-[11px] tracking-[0.2em]">
            {['GAMES', 'SOFTWARE', 'CONTACT'].map((item) => (
              <motion.a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                whileHover={{ scale: 1.1, color: "#fff", textShadow: "0px 0px 8px rgba(255,255,255,0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="text-[#e0e0e0] transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* 3. Socials Grid */}
          <div className="w-12 sm:w-16 md:w-[80px] shrink-0 border-r border-[#444] grid grid-cols-2 grid-rows-2">
            <motion.a href="#" whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }} whileTap={{ scale: 0.9 }} className="border-r border-b border-[#444] flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" className="w-3 h-3 md:w-4 md:h-4 fill-white"><polygon points="8 6 18 12 8 18 8 6"></polygon></svg>
            </motion.a>
            <motion.a href="#" whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }} whileTap={{ scale: 0.9 }} className="border-b border-[#444] flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] md:w-[18px] md:h-[18px]" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </motion.a>
            <motion.a href="#" whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }} whileTap={{ scale: 0.9 }} className="border-r border-[#444] flex items-center justify-center font-bold text-xs md:text-sm text-white transition-colors">
              in
            </motion.a>
            <div className="flex items-center justify-center"></div>
          </div>

          {/* 4. IT Services Stack */}
          <div className="flex-[1.5] border-r border-[#444] hidden sm:flex flex-col min-w-0">
            <motion.a href="#dev" whileHover={{ backgroundColor: "#fff", color: "#000" }} whileTap={{ scale: 0.98 }} className="flex-1 border-b border-[#444] flex items-center justify-center text-[9px] md:text-[11px] tracking-[0.2em] transition-colors uppercase truncate px-2 cursor-pointer">
              Game Dev
            </motion.a>
            <motion.a href="#soft" whileHover={{ backgroundColor: "#fff", color: "#000" }} whileTap={{ scale: 0.98 }} className="flex-1 flex items-center justify-center text-[9px] md:text-[11px] tracking-[0.2em] transition-colors uppercase truncate px-2 cursor-pointer">
              Software Solutions
            </motion.a>
          </div>

          {/* 5. QR Code Area */}
          <motion.div 
            whileHover={{ scale: 1.05, filter: "drop-shadow(0px 0px 8px rgba(255,255,255,0.3))" }}
            className="w-14 sm:w-16 md:w-[80px] shrink-0 p-2 md:p-3 hidden md:flex items-center justify-center cursor-pointer"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="currentColor">
               {[...Array(64)].map((_, i) => (
                  <rect key={i} x={(i % 8) * 12.5} y={Math.floor(i / 8) * 12.5} width={Math.random() > 0.3 ? "9" : "0"} height="9" />
               ))}
               <rect x="0" y="0" width="30" height="30" fill="#0d0d0d" stroke="currentColor" strokeWidth="4"/>
               <rect x="70" y="0" width="30" height="30" fill="#0d0d0d" stroke="currentColor" strokeWidth="4"/>
               <rect x="0" y="70" width="30" height="30" fill="#0d0d0d" stroke="currentColor" strokeWidth="4"/>
            </svg>
          </motion.div>
        </motion.header>

        {/* === MAIN CONTENT SECTION === */}
        <motion.main 
          key={`main-${animationCycle}`}
          variants={staggerContainer}
          initial="hidden"
          animate={playAnimation ? "visible" : "hidden"}
          className="flex-1 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 min-h-0 relative overflow-hidden py-8 sm:py-10 md:py-0"
        >
          
          {/* Headline Marquee Container */}
          <motion.div variants={fadeUpVariants} className="relative w-full flex overflow-hidden mb-6 sm:mb-8 md:mb-12">
            <div className="flex whitespace-nowrap animate-marquee items-center">
              
              {/* --- First Set --- */}
              <div className="flex items-center gap-4 sm:gap-6 md:gap-8 pr-8 shrink-0">
                <h2 className="text-[14vw] sm:text-[12vw] lg:text-[10vw] font-black uppercase leading-none tracking-tighter text-[#e5e5e5]">
                  INVENTING
                </h2>
                <div className="relative w-[10vw] lg:w-[8vw] max-w-[120px] aspect-square shrink-0 hidden sm:block">
                   <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_12s_linear_infinite]">
                     <polygon points="100,10 190,190 10,190" fill="none" stroke="#ccc" strokeWidth="3" />
                     <circle cx="100" cy="130" r="24" fill="white" />
                   </svg>
                </div>
                <h2 className="text-[14vw] sm:text-[12vw] lg:text-[10vw] font-black uppercase leading-none tracking-tighter text-[#e5e5e5]">
                  THE NEXT CENTURY
                </h2>
              </div>

              {/* --- Second Set --- */}
              <div className="flex items-center gap-4 sm:gap-6 md:gap-8 pr-8 shrink-0">
                <h2 className="text-[14vw] sm:text-[12vw] lg:text-[10vw] font-black uppercase leading-none tracking-tighter text-[#e5e5e5]">
                  INVENTING
                </h2>
                <div className="relative w-[10vw] lg:w-[8vw] max-w-[120px] aspect-square shrink-0 hidden sm:block">
                   <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_12s_linear_infinite]">
                     <polygon points="100,10 190,190 10,190" fill="none" stroke="#ccc" strokeWidth="3" />
                     <circle cx="100" cy="130" r="24" fill="white" />
                   </svg>
                </div>
                <h2 className="text-[14vw] sm:text-[12vw] lg:text-[10vw] font-black uppercase leading-none tracking-tighter text-[#e5e5e5]">
                  THE NEXT CENTURY
                </h2>
              </div>

            </div>
          </motion.div>

          {/* Lower Copy and Mission Statement */}
          <div className="max-w-[850px] text-[#b3b3b3] text-[10px] sm:text-[11px] md:text-[13px] leading-relaxed md:leading-loose tracking-[0.05em] sm:tracking-[0.08em] space-y-4 md:space-y-6 uppercase font-medium">
            <motion.p variants={fadeUpVariants}>
              At <strong className="text-white font-bold tracking-widest">Austin Legacy Corp (ALC)</strong>, we bridge the gap between imagination<br className="hidden sm:block" />
              and reality. From cutting-edge <strong className="text-white">Game Development</strong> to robust<br className="hidden sm:block" />
              <strong className="text-white">Software Engineering</strong>, we craft digital experiences that defy limits.
            </motion.p>
            <motion.p variants={fadeUpVariants}>
              We don't just write code; we build worlds, engineer scalable platforms,<br className="hidden sm:block" />
              and shape the technological landscape of tomorrow.
                                                                              </motion.p>
            
            {/* Bottom Accent Phrase */}
            <motion.div 
              variants={fadeUpVariants}
              whileHover={{ x: 10 }} // Slides slightly to the right on hover
              className="pt-4 md:pt-6 flex items-center gap-3 md:gap-4 text-white cursor-pointer w-full sm:w-max"
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-3 h-3 md:w-4 md:h-4 bg-[#e5e5e5] rounded-none shrink-0"
              ></motion.div>
              <p className="font-black text-base sm:text-lg md:text-xl lg:text-2xl tracking-normal capitalize transition-colors hover:text-blue-400" style={{fontFamily: "Impact, sans-serif"}}>
                Let's Build The Future.
              </p>
            </motion.div>
          </div>
          
        </motion.main>
      </div>
    </div>
  );
};

export default ALCLanding;
