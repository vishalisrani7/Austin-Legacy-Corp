import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import ViewportDecryptedText from './ViewportDecryptedText';
import ASCIIText from './ASCIIText';

gsap.registerPlugin(ScrollTrigger);

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

// Continuous floating effect for the inline cards
const floatVariants = {
  animate: {
    y: [-4, 4, -4],
    transition: { repeat: Infinity, duration: 4, ease: "easeInOut" }
  }
};

const CardSection = ({ scrollerRef = null, embedded = false }) => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (embedded) return undefined;

    ScrollTrigger.create({
      trigger: sectionRef.current,
      scroller: scrollerRef?.current || undefined,
      start: "top top",
      end: "+=1200",
      pin: true,
      pinSpacing: true,
      scrub: 1,
    });
  }, { scope: sectionRef, dependencies: [embedded, scrollerRef] });

  return (
    <div 
      ref={sectionRef} 
      className={`flex flex-col justify-center pl-10 md:pl-24 lg:pl-32 pr-6 md:pr-12 font-['Inter',sans-serif] overflow-hidden ${
        embedded ? "h-full min-h-full py-10 md:py-12" : "min-h-screen py-20"
      }`}
      style={{
        background: embedded ? "rgba(237, 238, 244, 0.28)" : "#FAFAFA",
        color: embedded ? "#f8fafc" : "#0A0A0A",
      }}
    >
      {/* Framer Motion Wrapper for staggered entrance */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }} // Re-animates when scrolling back
        className="max-w-[1400px] w-full text-left"
      >
        
        <motion.h1
          variants={fadeUpVariants}
          className={`text-5xl md:text-7xl lg:text-[100px] font-bold tracking-tight leading-[1.3] md:leading-[1.4] ${
            embedded ? "text-white" : "text-[#0A0A0A]"
          }`}
        >
          Design studio focused on <br className="hidden md:block" />
          crafting 
          
          {/* Card 1: Michael (Floating Wrapper) */}
          <motion.span variants={floatVariants} animate="animate" className="inline-block align-middle mx-4 md:mx-8 relative -mt-4 md:-mt-8 z-10">
            {/* Hover Interaction Wrapper */}
            <motion.div 
              initial={{ rotate: 3, scale: 1 }}
              whileHover={{ rotate: 0, scale: 1.15, zIndex: 50 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="shadow-[0_35px_80px_-20px_rgba(0,0,0,0.25)] rounded-xl md:rounded-2xl bg-white border border-gray-200 w-24 md:w-48 h-16 md:h-28 relative hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.35)] cursor-pointer"
            >
              <div className="w-full h-full flex flex-col gap-2 p-2 md:p-4 rounded-xl md:rounded-2xl">
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1/3 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-3/4 h-2 bg-gray-200 rounded-full"></div>
                <div className="w-1/2 h-2 bg-gray-200 rounded-full"></div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-1/2 bg-[#16A34A] rounded-full"></div>
              </div>
              <motion.span 
                whileHover={{ scale: 1.1 }}
                className="absolute -right-6 top-1/2 flex items-center shadow-lg bg-[#5B21B6] text-white text-[10px] md:text-xl font-semibold px-2 md:px-4 py-1.5 rounded-full"
              >
                <ViewportDecryptedText text="Michael" />
              </motion.span>
            </motion.div>
          </motion.span>
          
          websites, <br className="hidden lg:block" />
          
          {/* Card 2: Colin (Floating Wrapper) */}
          <motion.span variants={floatVariants} animate="animate" style={{ animationDelay: "0.5s" }} className="inline-block align-middle mr-4 md:mr-8 relative -mt-4 md:-mt-8 z-10">
            <motion.div 
              initial={{ rotate: -4, scale: 1 }}
              whileHover={{ rotate: 0, scale: 1.15, zIndex: 50 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="shadow-[0_35px_80px_-20px_rgba(0,0,0,0.25)] rounded-xl md:rounded-2xl bg-white border border-gray-200 w-20 md:w-40 h-16 md:h-28 relative hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.35)] cursor-pointer"
            >
              <div className="w-full h-full p-2 md:p-3 flex gap-2 rounded-xl md:rounded-2xl">
                <div className="w-4 md:w-6 h-full bg-[#DCFCE7] rounded flex flex-col p-1 gap-1">
                  <div className="w-full h-1.5 bg-[#EA580C] rounded-full"></div>
                  <div className="w-full h-2 bg-white rounded-full"></div>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="w-full h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-full h-full bg-gray-100 rounded"></div>
                </div>
              </div>
              <motion.span 
                whileHover={{ scale: 1.1 }}
                className="absolute right-[-10px] bottom-[-12px] flex items-center shadow-lg bg-[#EA580C] text-white text-[10px] md:text-sm font-semibold px-2 md:px-4 py-1.5 rounded-full"
              >
                <ViewportDecryptedText text="Colin" />
              </motion.span>
            </motion.div>
          </motion.span>

          software, and 
          
          {/* Card 3: Dual Cards (Floating Wrapper) */}
          <motion.span variants={floatVariants} animate="animate" style={{ animationDelay: "1s" }} className="inline-flex align-middle mx-3 md:mx-6 relative w-16 md:w-28 h-20 md:h-32 -mt-4 md:-mt-8 z-10">
            <motion.div 
              whileHover="hover"
              whileTap="tap"
              className="relative w-full h-full cursor-pointer"
            >
              {/* Back Card */}
              <motion.span 
                variants={{
                  hover: { rotate: -15, x: -10, scale: 1.05 },
                  tap: { scale: 0.95 }
                }}
                initial={{ rotate: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute left-0 top-0 w-11 md:w-20 h-16 md:h-28 bg-[#FEF3C7] rounded-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] border border-gray-300 flex flex-col p-2"
              >
                <div className="w-1/3 h-1.5 bg-gray-400 rounded-full mx-auto mb-2"></div>
                <div className="w-full h-full bg-white rounded-lg shadow-inner"></div>
              </motion.span>
              
              {/* Front Card */}
              <motion.span 
                variants={{
                  hover: { rotate: 0, x: 10, scale: 1.1, zIndex: 20 },
                  tap: { scale: 0.95 }
                }}
                initial={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute right-0 bottom-0 w-11 md:w-20 h-16 md:h-28 bg-white rounded-xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.35)] border border-gray-200 flex flex-col p-2 gap-2"
              >
                <div className="w-1/3 h-1.5 bg-gray-500 rounded-full mx-auto"></div>
                <div className="flex-1 bg-gray-100 rounded p-1.5 flex flex-col gap-1.5">
                  <div className="w-full h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full"></div>
                  <div className="w-full h-3 bg-[#16A34A]/20 border border-[#16A34A]/40 rounded-md mt-auto"></div>
                </div>
              </motion.span>
            </motion.div>
          </motion.span>

          apps.
        </motion.h1>

        <motion.p
          variants={fadeUpVariants}
          className={`text-lg md:text-2xl mt-10 md:mt-12 font-medium tracking-tight ${
            embedded ? "text-white/70" : "text-gray-600"
          }`}
        >
          <ViewportDecryptedText text="Our mission is to make visually appealing, useful and honest work." />
        </motion.p>

        <motion.div variants={fadeUpVariants} className="mt-10 md:mt-14 w-max">
          <motion.button 
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-[#0A0A0A] text-white px-8 py-4 rounded-full font-medium text-sm md:text-lg shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3)] transition-colors"
          >
            {/* Arrow icon moves right on hover */}
            <motion.svg 
              variants={{
                hover: { x: 5 }
              }}
              className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14m-7-7l7 7-7 7"/>
            </motion.svg>
            <ViewportDecryptedText text="Say Hello" />
          </motion.button>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default CardSection;
