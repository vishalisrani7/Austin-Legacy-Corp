import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./Carousel.css";

gsap.registerPlugin(ScrollTrigger);

const CONFIG = {
  totalCards: 10,
  data: [
    {
      img: "/images/web.jpg",
      title: "Web Development",
      desc: "We engineer scalable, high-performance websites with modern architecture, responsive layouts and optimized user experiences.",
      poweredBy: ["REACT.", "NEXTJS.", "TAILWIND."]
    },
    {
      img: "/images/app.jpg",
      title: "App Development",
      desc: "Crafting powerful Android & iOS applications with seamless performance, intuitive UI and robust backend integrations.",
      poweredBy: ["FLUTTER.", "KOTLIN.", "SWIFT."]
    },
    {
      img: "/images/game.jpg",
      title: "Game Development",
      desc: "Building immersive 2D & 3D gaming experiences with dynamic mechanics, real-time rendering and interactive storytelling.",
      poweredBy: ["UNITY.", "UNREAL.", "C#."]
    },
     {
      img: "/images/clloud.jpg",
      title: "Cloud Engineering",
      desc: "Designing scalable cloud infrastructures with containerization, DevOps workflows and distributed systems.",
      poweredBy: ["AWS.", "DOCKER.", "KUBERNETES."]
    },
    {
      img: "/images/AI.png",
      title: "AI Solutions",
      desc: "Integrating artificial intelligence and machine learning to automate processes and unlock predictive insights.",
      poweredBy: ["PYTHON.", "TENSORFLOW.", "ML."]
    },
    {
      img: "/images/full.jpg",
      title: "Full Stack Systems",
      desc: "End-to-end product engineering from frontend interfaces to backend architecture and database systems.",
      poweredBy: ["MERN.", "REST API.", "GRAPHQL."]
    },
    {
      img: "/images/UI.jpg",
      title: "UI Design",
      desc: "Designing visually stunning and brand-focused digital interfaces that merge creativity with clarity.",
      poweredBy: ["FIGMA.", "ADOBE XD.", "ILLUSTRATOR."]
    },
    {
      img: "/images/UX.jpg",
      title: "UX Strategy",
      desc: "Research-driven experience design focused on usability, engagement and seamless customer journeys.",
      poweredBy: ["WIREFRAME.", "PROTOTYPE.", "USER RESEARCH."]
    },
    {
      img: "/images/enterprise.png",
      title: "Enterprise Software",
      desc: "Developing large-scale enterprise systems for automation, analytics, operations and business intelligence.",
      poweredBy: ["NODEJS.", "SPRINGBOOT.", "POSTGRES."]
    },
    {
      img: "/images/cyber.jpg",
      title: "Cyber Security",
      desc: "Securing digital ecosystems with encryption, monitoring systems and advanced threat detection architecture.",
      poweredBy: ["ENCRYPTION.", "FIREWALL.", "SIEM."]
    },
   
  ],
};

const Carousel = ({ theme }) => {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  
  const modalContainerRef = useRef(null);
  const modalContentRef = useRef(null); 

  const [selectedItem, setSelectedItem] = useState(null);
  const isDark = theme === 'dark'; 

  const setupSheet = () => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const startX = -width * 0.55; 
    const startY = height * 0.5; 
    
    const endX = width * 0.55; 
    const endY = -height * 0.5; 

    const borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

    cards.forEach((card, i) => {
      if (!card) return;
      const progress = i / (CONFIG.totalCards - 1);
      
      const x = startX + (progress * (endX - startX));
      const y = startY + (progress * (endY - startY));
      const z = i * -50; 

      gsap.set(card, {
        x: x, 
        y: y, 
        z: z,
        scale: 1, 
        zIndex: 100 + (CONFIG.totalCards - i),
        opacity: 1,
        filter: "blur(5px) brightness(0.6) grayscale(0.2)",
        borderColor: borderColor 
      });
    });
  };

  useEffect(() => {
    setupSheet();
  }, [theme]);
  useGSAP(() => {
    if (!wrapperRef.current || !containerRef.current) return;

    const cards = cardsRef.current;
    setupSheet(); 

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top top",      
        end: "+=2500", 
        pin: true,             
        scrub: 1.5, 
        anticipatePin: 1
      }
    });

    tl.from(cards, {
      x: -window.innerWidth * 1.2, 
      y: window.innerHeight * 1.2, 
      z: -500, 
      opacity: 0,
      scale: 0.5,
      rotationZ: -45, 
      stagger: 0.1,   
      duration: 2,
      ease: "power3.out"
    });

    tl.to(cards, {
        z: (i) => (i * -50) + 30, 
        duration: 1,
        ease: "sine.inOut"
    });

    tl.to(cards, {
      x: window.innerWidth * 1.2,  
      y: -window.innerHeight * 1.2, 
      opacity: 0,
      scale: 1.2, 
      rotationZ: 20,
      stagger: 0.05, 
      duration: 2,
      ease: "power2.in"
    });

  }, []); 

  useEffect(() => {
    window.addEventListener('resize', setupSheet);
    return () => window.removeEventListener('resize', setupSheet);
  }, []);

  const handleCardHover = (index, isHovering) => {
    if (selectedItem) return;
    const card = cardsRef.current[index];
    const activeBorder = isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)";
    const inactiveBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

    if (isHovering) {
        gsap.to(card, { 
            scale: 1.15, 
            zIndex: 1000, 
            filter: "blur(0px) brightness(1) grayscale(0)", 
            borderColor: activeBorder,
            duration: 0.4, 
            overwrite: 'auto',
            ease: "back.out(1.7)"
        });
    } else {
        gsap.to(card, { 
            scale: 1, 
            zIndex: 100 + (CONFIG.totalCards - index), 
            filter: "blur(5px) brightness(0.6) grayscale(0.2)", 
            borderColor: inactiveBorder,
            duration: 0.4, 
            overwrite: 'auto' 
        });
    }
  };

  const handleCardClick = (item) => setSelectedItem(item);

  const closeModal = () => {
    if(!modalContainerRef.current) return;
    gsap.to(modalContainerRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => setSelectedItem(null)
    });
    gsap.to(modalContentRef.current, {
        scale: 0.9,
        y: 20,
        duration: 0.3
    });
  };

  useEffect(() => {
    if (selectedItem && modalContainerRef.current) {
        gsap.fromTo(modalContainerRef.current, 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.4 }
        );
        gsap.fromTo(modalContentRef.current,
            { scale: 0.9, y: 30, opacity: 0 },
            { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.2)" }
        );
    }
  }, [selectedItem]);

  const splitTitle = (title) => {
    return title.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-4">
            <span className="anim-word inline-block">{word}</span>
        </span>
    ));
  };

  return (
    <>
      <div 
        ref={wrapperRef} 
        className={`carousel-wrapper relative w-full h-screen overflow-hidden z-10 transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-[#f0f0f0]'}`}
      >
         <div className="carousel-container" ref={containerRef}>
            <div className="carousel-items">
              {CONFIG.data.map((item, i) => (
                <div
                  key={i}
                  className="carousel-item"
                  ref={(el) => (cardsRef.current[i] = el)}
                  style={{ backgroundImage: `url(${item.img})` }}
                  onMouseEnter={() => handleCardHover(i, true)}
                  onMouseLeave={() => handleCardHover(i, false)}
                  onClick={() => handleCardClick(item)}
                >
                  <div className="card__number" style={{ color: isDark ? 'white' : 'black' }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>

     {selectedItem && (
  <div 
      ref={modalContainerRef}
      className={`fixed inset-0 z-[99999] flex items-center justify-center backdrop-blur-xl p-4 md:p-8 opacity-0 transition-colors duration-500 ${isDark ? 'bg-black/90' : 'bg-white/80'}`}
      onClick={closeModal}
  >
      <div 
        ref={modalContentRef}
        className="w-full max-w-[1200px] h-[85vh] md:h-[600px] flex flex-col md:grid md:grid-cols-2 gap-4 pointer-events-auto"
        onClick={(e) => e.stopPropagation()} 
      >
          
          <div className={`relative w-full h-[30%] md:h-full shrink-0 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border group transition-colors duration-500 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
              <img 
                  src={selectedItem.img} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                  <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 border border-white/20 px-2 py-1 md:px-3 md:py-1 rounded-full backdrop-blur-md">
                      Visual Exploration
                  </span>
              </div>
          </div>
          <div className="flex flex-col gap-3 md:gap-4 h-[70%] md:h-full min-h-0">
              <div className={`flex-[0.3] shrink-0 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 relative overflow-hidden flex flex-col justify-end shadow-lg transition-colors duration-500 ${isDark ? 'bg-white text-black' : 'bg-[#1a1a1a] text-white'}`}>
                 
                  <span className={`absolute top-[-5px] right-2 text-[5rem] md:text-[8rem] font-black select-none leading-none z-0 transition-colors duration-500 ${isDark ? 'text-gray-200' : 'text-white/10'}`}>
                       {String(CONFIG.data.indexOf(selectedItem) + 1).padStart(2, '0')}
                  </span>
                  <div className="relative z-10">
                      <div className="flex gap-1 mb-2 opacity-40">
                          <div className={`w-1.5 h-3 md:w-2 md:h-4 border ${isDark ? 'border-black' : 'border-white'}`}></div>
                          <div className={`w-1.5 h-3 md:w-2 md:h-4 border ${isDark ? 'border-black' : 'border-white'}`}></div>
                      </div>
                    <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
    {selectedItem.title}
</h2>
                  </div>
              </div>
              <div className={`flex-[0.7] min-h-0 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 flex flex-col justify-between shadow-2xl border relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#050505] text-white border-white/10' : 'bg-white text-black border-black/5'}`}>
                  <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-bl pointer-events-none transition-colors duration-500 ${isDark ? 'from-white/5' : 'from-black/5'} to-transparent`}></div>
                  
                  <div className="relative z-10 overflow-y-auto pr-2 custom-scrollbar">
                      <div className="flex items-center gap-2 mb-3 md:mb-4">
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-[8px] md:text-[10px] font-bold tracking-[0.3em] text-blue-500 uppercase">
                              Project Overview
                          </span>
                      </div>
                      <div className="flex gap-3 md:gap-4">
                          <div className="w-0.5 md:w-1 bg-blue-600 rounded-full shrink-0"></div>
                          <p className={`text-sm md:text-xl font-light leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              {selectedItem.desc}
                          </p>
                      </div>
                  </div>

                  <div className={`flex items-end justify-between mt-3 md:mt-4 relative z-10 border-t pt-4 md:pt-6 transition-colors duration-500 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                      <div className="flex flex-col gap-1 md:gap-2">
                          <span className={`text-[8px] md:text-[9px] uppercase tracking-widest font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Powered By</span>
                          <div className={`flex gap-2 md:gap-4 text-xs md:text-sm font-bold ${isDark ? 'text-gray-200' : 'text-black'}`}>
    {selectedItem.poweredBy.map((tech, index) => (
        <span key={index}>{tech}</span>
    ))}
</div>
                      </div>
                      <button 
                          onClick={closeModal}
                          className={`w-20 h-16 md:w-24 md:h-20 rounded-[1rem] md:rounded-[1.5rem] flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-300 shadow-lg ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
                      >
                          <span className="text-xs md:text-sm font-bold tracking-widest uppercase">Close</span>
                          <span className="text-[8px] opacity-60">Dismiss</span>
                          <svg className="w-3 h-3 md:w-4 md:h-4 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                      </button>
                  </div>
              </div>
          </div>
      </div>
  </div>
)}
    </>
  );
};

export default Carousel;