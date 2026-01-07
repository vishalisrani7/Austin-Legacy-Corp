import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
  Children,
  cloneElement,
  isValidElement,
} from "react";
import DecryptedText from "./DecryptedText";
import {
  SiPython,
  SiFlutter,
  SiFigma,
  SiZapier,
  SiWordpress,
  SiWebflow,
  SiReact,
} from "react-icons/si";
import { TbBrandNextjs } from "react-icons/tb";
import "./App.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import Dither from "./Prism";
import LetterGlitch from "./LetterGlitch";
import CardSwap2, { Card2 } from "./CardSwap2";
import PillNav from "./PillNav";
import ServiceCard from "./ServiceCard";
import {
  Zap,
  Code2,
  ShieldCheck,
  PenTool,
  Gamepad2,
  Megaphone,
  Layout,
  
  Cpu,
  Bot,
  Search,
  Wrench,
  BrainCircuit,
} from "lucide-react";
import Footer from "./Footer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

function CustomCursor() {
  const [isClicking, setIsClicking] = useState(false);
  const cursorRef = useRef(null);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const moveCursor = (e) => {
      const cursor = cursorRef.current;
      if (cursor) {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`hidden lg:block pointer-events-none fixed z-[9999] w-10 h-10 ml-5 mt-5
        -translate-x-1/2 -translate-y-1/2 transition-transform duration-150
        `}
      style={{
        backgroundImage: `url(${isClicking ? "/Click.png" : "/Normal.png"})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
function App() {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) return;

    gsap.to(window, {
      duration: 1.5,
      scrollTo: {
        y: section.offsetTop,
        autoKill: true,
      },
      ease: "power4.inOut",
    });
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <CustomCursor />
      <main className="">
        <HeroSection scrollToSection={scrollToSection} />
        <section id="about">
          <CardStackSection />
        </section>
        <section id="processes">
          <ProcessSection />
        </section>
        <section id="stats">
          <StatsSection />
        </section>
      </main>
      <section id="contact">
        <Footer />
      </section>
    </div>
  );
}
function HeroSection({ scrollToSection }) {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const navRef = useRef(null);
  const contactRef = useRef(null);
  const tickerRef = useRef(null);

  const navItems = [
    { label: "About us", href: "#about" },
    { label: "How We Do", href: "#processes" },
    { label: "Our stats", href: "#stats" },
    { label: "Contact", href: "#contact" },
  ];

  useGSAP(() => {
    
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      paused: true,
    });

    gsap.set(
      [logoRef.current, navRef.current, contactRef.current, tickerRef.current],
      { opacity: 1, y: 0 } 
    );

    gsap.set(logoRef.current, { opacity: 0, y: 20 });
    gsap.set([navRef.current, contactRef.current], { opacity: 0, y: 20 });
    gsap.set(tickerRef.current, { opacity: 0, y: 20 });


    tl.to(logoRef.current, { opacity: 1, y: 0, duration: 1 })
      .to(
        [navRef.current, contactRef.current],
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
        },
        "-=0.8"
      )
      .to(tickerRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.6");

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      onEnter: () => tl.play(),
      once: true,
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full bg-black overflow-hidden"
    >
      <div className="absolute inset-0 z-0 w-full h-full">
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>

      <div className="relative z-10 w-full h-full max-w-[1600px] mx-auto px-4 md:px-12 pointer-events-none">
        
        <div
          ref={logoRef}
          className="absolute top-[25%] md:-top-60 left-0 w-full flex justify-center opacity-0"
        >
          <img
            src="/ALC.png"
            alt="Brand Logo"
            className="w-[80%] max-w-[400px] md:max-w-none md:w-[1000px] object-contain"
          />
        </div>

        <div
          ref={navRef}
          className="absolute bottom-[120px] md:bottom-[180px] left-1/2 -translate-x-1/2 z-50 opacity-0 w-full flex justify-center pointer-events-auto"
        >
          <div className="scale-90 md:scale-100 origin-bottom">
            <PillNav
              items={navItems}
              onItemClick={(href) => {
                const id = href.replace("#", "");
                scrollToSection(id);
              }}
              baseColor="#000000ff"
              pillColor="#f8f8f8ff"
              pillTextColor="#000000ff"
              hoveredPillTextColor="#ffffffff"
              className="shadow-2xl rounded-full"
            />
          </div>
        </div>
      </div>

      <div 
        ref={tickerRef}
        className="absolute bottom-0 w-full bg-black/90 border-t border-white/10 py-3 lg:py-5 overflow-hidden flex z-20 pointer-events-auto"
      >
        <div className="flex items-center whitespace-nowrap marquee">
          {[
            ["Python", <SiPython />],
            ["Make", <TbBrandNextjs />],
            ["Flutterflow", <SiFlutter />],
            ["Figma", <SiFigma />],
            ["Zapier", <SiZapier />],
            ["Wordpress", <SiWordpress />],
            ["Webflow", <SiWebflow />],
            ["ReactJS", <SiReact />],
            ["Flutter", <SiFlutter />],
          ].map(([text, icon], i) => (
            <div
              key={i}
              className="flex items-center gap-2 lg:gap-3 text-neutral-300 text-sm lg:text-lg font-medium px-4 lg:px-8"
            >
              <span className="text-xl lg:text-2xl opacity-80">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center whitespace-nowrap marquee">
          {[
            ["Python", <SiPython />],
            ["Make", <TbBrandNextjs />],
            ["Flutterflow", <SiFlutter />],
            ["Figma", <SiFigma />],
            ["Zapier", <SiZapier />],
            ["Wordpress", <SiWordpress />],
            ["Webflow", <SiWebflow />],
            ["ReactJS", <SiReact />],
            ["Flutter", <SiFlutter />],
          ].map(([text, icon], i) => (
            <div
              key={`dup-${i}`}
              className="flex items-center gap-2 lg:gap-3 text-neutral-300 text-sm lg:text-lg font-medium px-4 lg:px-8"
            >
              <span className="text-xl lg:text-2xl opacity-80">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
gsap.registerPlugin(ScrollTrigger);

const stackData = [
  {
    id: 1,
    title: "Web & Mobile App Development",
    desc: "We build apps that don’t crash, lag, or embarrass you in front of investors. Architecture built with discipline — not duct tape. Scalable infrastructure, maintainable code, and performance tuned to feel effortless. Your users won’t notice how well it works… and that’s the point.",
    bgImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
    HeaderIcon: Zap,
    Icon: Code2,
    from: "from-blue-600",
    to: "to-indigo-900",
  },
  {
    id: 2,
    title: "UI/UX & Graphic Designing",
    desc: "Interfaces without chaos. Journeys without confusion. We obsess over the difference between “that’ll do” and “hell yes.” Design that respects both the human brain and the business goals behind it. Every pixel aligned. Every interaction justified. No decorative nonsense.",
    bgImage:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600",
    HeaderIcon: ShieldCheck,
    Icon: PenTool,
    from: "from-emerald-600",
    to: "to-teal-900",
  },
  {
    id: 3,
    title: "Game Development",
    desc: "We engineer experiences players actually want to return to. Smooth mechanics, tight controls, stable performance — delight, not frustration. We never ship “fun in theory.” If it doesn’t feel good to play, we’re not done yet.",
    bgImage:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=600",
    HeaderIcon: Gamepad2,
    Icon: Gamepad2,
    from: "from-orange-600",
    to: "to-red-900",
  },
  {
    id: 4,
    title: "Digital Marketing & SEO",
    desc: "Growth that doesn’t rely on luck, viral prayers, or spammy pop-ups. We make search engines understand you, users find you, and revenue follow you. Strategy first. Numbers always. Hype only when deserved. Performance you can measure — not just admire in a pitch deck.",
    bgImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    HeaderIcon: Megaphone,
    Icon: Search,
    from: "from-purple-600",
    to: "to-pink-900",
  },
  {
    id: 5,
    title: "Embodied Software (IoT)",
    desc: "Where algorithms meet atoms. We build systems that think digitally and act physically — robots, smart devices, IoT, the works. Bulletproof reliability baked into every component. When your hardware is out in the real world, failure is not an option… and we behave accordingly.",
    bgImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600",
    HeaderIcon: Cpu,
    Icon: Wrench,
    from: "from-cyan-600",
    to: "to-blue-900",
  },
  {
    id: 6,
    title: "AI Micro-Agents",
    desc: "Not “let’s replace humans” AI — more like highly skilled coworkers that don’t sleep. Single-purpose intelligence trained for precision, automation, and speed. Small, powerful, and always improving — like the overachiever in the class group project. We build AI that earns its keep.",
    bgImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600",
    HeaderIcon: Bot,
    Icon: BrainCircuit,
    from: "from-rose-600",
    to: "to-fuchsia-900",
  },
];

function CardStackSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardDimensions, setCardDimensions] = useState({
    width: 800,
    height: 500,
  });

  const sectionRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      let newWidth, newHeight;

      if (screenWidth >= 1024) {
        newWidth = Math.min(800, screenWidth * 0.55);
        newHeight = Math.min(550, screenHeight * 0.8);
      } else if (screenWidth >= 768) {
        newWidth = 600;
        newHeight = 450;
      } else {
        newWidth = screenWidth * 0.85;
        newHeight = 320;
      }

      setCardDimensions({ width: newWidth, height: newHeight });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      id: "about",
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const totalItems = stackData.length;
        if (!totalItems) return;

        const rawIndex = Math.round(self.progress * (totalItems - 1));
        const clampedIndex = Math.max(0, Math.min(rawIndex, totalItems - 1));

        setActiveIndex((prev) => (prev === clampedIndex ? prev : clampedIndex));
      },
    });

    triggerRef.current = trigger;

    return () => {
      if (trigger) trigger.kill();
    };
  }, []);

  const handleCardClick = (index) => {
    const totalItems = stackData.length;
    if (!totalItems) return;

    setActiveIndex(index);

    if (!triggerRef.current) return;
    const st = triggerRef.current;

    const progress = totalItems === 1 ? 0 : index / (totalItems - 1);
    const targetScroll = st.start + (st.end - st.start) * progress;

    const baseDuration = 0.5;
    const extra = Math.abs(index - activeIndex) * 0.25;

    gsap.to(window, {
      scrollTo: { y: targetScroll, autoKill: false },
      duration: baseDuration + extra,
      ease: "power2.inOut",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[400vh] bg-black text-white"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-[140px]" />
          <div className="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-blue-500/20 blur-[130px]" />
        </div>

        <div className="relative z-10 flex w-[90%] max-w-[1600px] mx-auto flex-col lg:flex-row lg:items-center h-full pt-10 lg:pt-0">
          <div className="flex-none lg:flex-1 flex flex-col justify-end lg:justify-center lg:pr-10 z-20 h-[30%] lg:h-full lg:max-h-[60vh] pb-4 lg:pb-0">
            <div className="mb-4 lg:mb-8 lg:-mt-12">
              <h1 className="text-3xl lg:text-5xl font-semibold leading-tight text-zinc-100 mb-2 lg:mb-4 underline decoration-blue-500/30 underline-offset-8">
                OUR CAPABILITIES
                <br />
              </h1>
            </div>

            <div className="relative h-24 lg:h-40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                  className="absolute top-0 left-0 jetbrains"
                >
                  <h2 className="text-xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2 lg:mb-4">
                    {stackData[activeIndex]?.title}
                  </h2>
                  <p className="text-zinc-400 text-sm lg:text-lg leading-relaxed max-w-lg lg:line-clamp-none">
                    {stackData[activeIndex]?.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="relative flex-1 flex items-start lg:items-center justify-center w-full lg:h-full lg:top-40 mt-20">
            <div className="mt-4 lg:mt-0">
              <CardSwap2
                currentIndex={activeIndex}
                skewAmount={6}
                width={cardDimensions.width}
                height={cardDimensions.height}
                cardDistance={50}
                verticalDistance={90}
                onCardClick={handleCardClick}
              >
                {stackData.map((item, index) => (
                  <Card2 key={item.id} index={index}>
                    <ServiceCard
                      number={item.id}
                      title={item.title}
                      HeaderIcon={item.HeaderIcon}
                      Icon={item.Icon}
                      from={item.from}
                      to={item.to}
                      bgImage={item.bgImage}
                    />
                  </Card2>
                ))}
              </CardSwap2>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-full bg-black/90 border-t border-white/10 py-3 lg:py-5 overflow-hidden flex z-20">
          <div className="flex items-center whitespace-nowrap marquee-reverse">
            {[
              ["Python", <SiPython />],
              ["Make", <TbBrandNextjs />],
              ["Flutterflow", <SiFlutter />],
              ["Figma", <SiFigma />],
              ["Zapier", <SiZapier />],
              ["Wordpress", <SiWordpress />],
              ["Webflow", <SiWebflow />],
              ["ReactJS", <SiReact />],
              ["Flutter", <SiFlutter />],
            ].map(([text, icon], i) => (
              <div
                key={i}
                className="flex items-center gap-2 lg:gap-3 text-neutral-300 text-sm lg:text-lg font-medium px-4 lg:px-8"
              >
                <span className="text-xl lg:text-2xl opacity-80">{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center whitespace-nowrap marquee-reverse">
            {[
              ["Python", <SiPython />],
              ["Make", <TbBrandNextjs />],
              ["Flutterflow", <SiFlutter />],
              ["Figma", <SiFigma />],
              ["Zapier", <SiZapier />],
              ["Wordpress", <SiWordpress />],
              ["Webflow", <SiWebflow />],
              ["ReactJS", <SiReact />],
              ["Flutter", <SiFlutter />],
            ].map(([text, icon], i) => (
              <div
                key={`dup-${i}`}
                className="flex items-center gap-2 lg:gap-3 text-neutral-300 text-sm lg:text-lg font-medium px-4 lg:px-8"
              >
                <span className="text-xl lg:text-2xl opacity-80">{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    id: "01",
    title: "BLUEPRINTING",
    content:
      "We start by diving head-first into your world — no floaties. We get to know your goals, your users, your space, and the opportunities everyone else missed. Research meets ruthless clarity to shape strategies that make sense (and money). Think detective work, but with fewer trench coats and more insight.",
  },
  {
    id: "02",
    title: "FIELDCARFTING",
    content:
      "Ideas don’t live in slide decks. We turn concepts into real, functioning digital products built to perform in the wild. Fast shipping, precision engineering, and builds that behave beautifully under pressure. From dev to launch, everything’s handled.",
  },
  {
    id: "03",
    title: "SHIELDWORKING",
    content:
      "Once you’re live, we guard and improve your product like it’s our own. Performance, security, optimization, resilience — engineered, tested, reinforced. Long-term success isn’t luck. It’s defense with discipline.",
  },
  {
    id: "04",
    title: "SIGNALHUNTING",
    content:
      "Launch is the starting line, not the finish. We track real-world behavior, analyze what users love (and what they politely pretend to love), and uncover opportunities for growth. We tune systems, scale impact, and help you operate independently — even if we secretly hope you keep us around.",
  },
];

function ProcessSection() {
  const container = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const tickerRef = useRef(null);

  useGSAP(
    () => {
      if (!steps || steps.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "processes",
          trigger: container.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, 
          pin: ".pin-content",
        },
        defaults: { ease: "none" } 
      });

      steps.forEach((step, i) => {
        const isLast = i === steps.length - 1;
        const nextI = i + 1;
        
        gsap.set(`.step-content-${i}`, {
          xPercent: -50,
          yPercent: -50,
          left: "50%",
          top: "50%",
          position: "absolute",
          width: "100%",
          autoAlpha: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 30,
        });

        if (i !== 0) {
          gsap.set(`.step-title-${i}`, { opacity: 0, color: "#606162ff" });
          gsap.set(`.step-plus-${i}`, { opacity: 0, scale: 0.5 });
        }

        if (!isLast) {
          tl.to(
            `.step-content-${i}`,
            {
              autoAlpha: 0,
              y: -30,
              duration: 0.5,
            },
            `+=1.5`
          )
            .to(
              `.step-title-${i}`,
              { opacity: 0, color: "#606162ff", x: 0, duration: 0.3 },
              "<"
            )
            .to(
              `.step-plus-${i}`,
              { opacity: 0, scale: 0.5, duration: 0.3 },
              "<"
            )
            .to(
              `.step-title-${nextI}`,
              {
                opacity: 1,
                color: "#ffffff",
                duration: 0.3,
                onStart: () => setActiveStep(nextI),
                onReverseComplete: () => setActiveStep(i),
              },
              "<+=0.1"
            )
            .to(
              `.step-plus-${nextI}`,
              { opacity: 1, scale: 1, duration: 0.3 },
              "<"
            )
            .to(
              `.step-content-${nextI}`,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
              },
              "<"
            );
        }
      });
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="relative w-full"
      style={{ height: `${(steps.length + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0 bg-black">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>

      <div className="pin-content absolute top-0 left-0 h-screen w-full flex flex-col justify-center overflow-hidden px-4 md:px-16 bg-transparent text-white z-10">
        <div className="absolute top-16 md:top-10 left-1/2 -translate-x-1/2 z-20 w-full text-center px-4">
          <h3 
            className="text-white text-lg md:text-4xl underline font-bold tracking-wider uppercase inline-block jetbrains"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            Our Core Practice Disciplines
          </h3>
        </div>

        <div className="flex flex-col md:flex-row w-full h-full items-center justify-center pt-20 md:pt-0 pb-16 md:pb-0">
          
          <div className="w-full md:w-1/2 relative flex justify-center items-center md:items-center h-[30vh] md:h-[60vh] md:mb-0">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`step-title-${i} absolute left-1/2 transform -translate-x-1/2 will-change-transform flex items-center justify-center w-full jetbrains`}
                style={{
                  opacity: i === 0 ? 1 : 0,
                  color: i === 0 ? "white" : "#4b5563",
                }}
              >
                <div className="flex items-start md:-ml-20 lg:-ml-40 justify-center w-full">
                  <span className="text-xs md:text-xl font-mono mt-1 md:mt-0 mr-2 opacity-70">
                    {step.id}
                  </span>

                  <h2 
                    className="text-4xl md:text-[50px] lg:text-[60px] font-medium leading-[1] md:leading-[0.9] uppercase whitespace-nowrap text-center jetbrains"
                    style={{ fontFamily: '"JetBrains Mono", monospace' }}
                  >
                    <DecryptedText
                      speed={100}
                      text={step.title}
                      animate={activeStep === i}
                      revealDirection="center"
                      className="jetbrains" 
                      encryptedClassName="jetbrains opacity-70"
                    />
                  </h2>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full md:w-1/2 min-h-[40vh] md:h-[60vh] relative flex items-start justify-center -translate-y-6 md:translate-y-0 pt-2">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`step-content-${i} w-full px-2 md:px-12 text-center flex justify-center`}
                style={{ visibility: "visible" }}
              >
                <p 
                  className="text-gray-300 text-lg md:text-[20px] lg:text-[30px] leading-relaxed font-bold tracking-wide max-w-[90%] md:max-w-full mx-auto jetbrains"
                  style={{ fontFamily: '"JetBrains Mono", monospace' }}
                >
                  <DecryptedText
                    speed={50}
                    text={step.content}
                    animate={activeStep === i}
                    revealDirection="start"
                    className="jetbrains"
                    encryptedClassName="jetbrains opacity-50"
                  />
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={tickerRef}
          className="absolute bottom-0 left-0 w-full bg-black/90 border-t border-white/10 py-2 md:py-4 overflow-hidden flex z-50"
        >
          {[0, 1].map((iter) => (
            <div
              key={iter}
              className={`flex items-center whitespace-nowrap animate-marquee ${
                iter === 1 ? "marquee-reverse" : "marquee"
              }`}
            >
              {[
                ["Python", <SiPython />],
                ["Make", <TbBrandNextjs />],
                ["Flutterflow", <SiFlutter />],
                ["Figma", <SiFigma />],
                ["Zapier", <SiZapier />],
                ["Wordpress", <SiWordpress />],
                ["Webflow", <SiWebflow />],
                ["ReactJS", <SiReact />],
                ["Flutter", <SiFlutter />],
              ].map(([text, icon], i) => (
                <div
                  key={`${iter}-${i}`}
                  className="ticker-item flex items-center gap-2 md:gap-3 text-neutral-400 text-sm md:text-lg font-medium px-4 md:px-8"
                >
                  <span className="tech-icon text-lg md:text-2xl">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </section>
  );
}

const StatsSection = () => {
  const steps = [
    {
      id: "01",
      title: "Unlocking the opportunity",
      subtitle: "Business strategy",
      content: [
        "Before anything beautiful or brilliant gets built, we dig into the core of your business. We ask uncomfortably smart questions, uncover truths, and map where the real value lives. No random feature factories here — only direction that matters. The outcome? A strategy engineered to win.",
      ],
    },
    {
      id: "02",
      title: "We help solve a range of business challenges",
      subtitle: "Design & Execution",
      content: [
        "Once the path is clear, we design and prototype like scientists in a creative lab. We test, break, refine, repeat — until ideas become solutions people actually care about. Call it innovation, call it problem-solving. We call it Tuesday.",
      ],
    },
    {
      id: "03",
      title: "Driving adoption and scale",
      subtitle: "Growth & Analysis",
      content: [
        "Launching is just the kickoff. We help you define KPIs, set up analytics, and track what users love (and what they pretend to love). Our data detectives hunt for improvements to maximize performance and growth. We equip your team to scale independently—because you shouldn’t need us forever… even though we secretly hope you’ll stay.",
      ],
    },
    {
      id: "04",
      title: "Sustained Innovation & Support",
      subtitle: "Long-term Partnership",
      content: [
        "After launch, the evolution continues. Monitoring, updates, enhancements, improvements — continuous progress that keeps you ahead of change, not catching up to it. Think of us as the personal trainers of your product. Always pushing. Always improving. Never letting it get soft.",
      ],
    },
  ];

  return (
    <div className="w-full text-white font-sans pb-10 lg:pb-20">
      {steps.map((step, index) => (
        <div
          key={index}
          className="relative flex flex-col lg:flex-row w-full group"
        >
          <div className="w-full lg:w-[25%] px-6 lg:pl-20 pb-4 lg:pb-12 pt-8 lg:pt-0">
            <div className="static lg:sticky lg:top-12">
              <div className="text-[80px] lg:text-[150px] leading-none font-bold tracking-tighter text-white/90">
                {step.id}
              </div>
            </div>
          </div>

          <div
            className={`w-full lg:w-[75%] flex flex-col lg:flex-row pt-4 lg:pt-10 pb-12 lg:pb-20 px-6 lg:pr-20 ${
              index !== 0
                ? "border-t border-gray-300/20 lg:border-gray-300"
                : ""
            }`}
          >
            <div className="w-full lg:w-[40%] pr-0 lg:pr-10 pt-2 mb-6 lg:mb-0">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3 lg:mb-4 leading-tight">
                {step.title}
              </h2>
              <h3 className="text-base lg:text-lg font-medium text-gray-400 lg:text-gray-500 mt-2">
                {step.subtitle}
              </h3>
            </div>

            <div className="w-full lg:w-[60%] pl-0 lg:pl-20 lg:pr-20 text-lg lg:text-2xl text-gray-200 lg:text-white leading-relaxed">
              <p className="whitespace-pre-line">{step.content.join(" ")}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
