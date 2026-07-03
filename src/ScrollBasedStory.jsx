import React from 'react';

const timelineData = [
  {
    yearSuffix: '45',
    title: 'PROJECT GENESIS INITIATED',
    desc: 'The original blueprints for decentralized computational architecture are drafted in a classified lab. The seeds for what would become Austin Legacy Corp (ALC) are planted, decades before the modern internet.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200', 
    caption: 'ARCHIVE_45: EARLY MAINFRAME SCHEMATICS'
  },
  {
    yearSuffix: '59',
    title: 'THE ARPANET INTEGRATION',
    desc: 'The foundation of interconnected systems goes live. Our early engineers contribute to the core packet-switching protocols that redefine global communication.',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200', 
    caption: 'ARCHIVE_59: NODE 1 INITIALIZATION'
  },
  {
    yearSuffix: '84',
    title: 'FIRST COMMERCIAL SOFTWARE RELEASE',
    desc: 'ALC officially incorporates. We transition from government-contracted deep tech to commercial enterprise solutions, releasing a revolutionary database management system.',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200', 
    caption: 'ARCHIVE_84: COMPILED SOURCE CODE v1.0'
  },
  {
    yearSuffix: '99',
    title: 'THE Y2K PARADIGM SHIFT',
    desc: 'While the world panicked over the millennium bug, ALC deployed global defense protocols, securing the digital infrastructure of top financial institutions overnight.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200', 
    caption: 'ARCHIVE_99: GLOBAL NETWORK DEFENSE'
  }
];

const ScrollBasedStory = ({ embedded = false }) => {
  return (
    <div className="w-full h-full relative font-sans overflow-hidden" style={{ background: embedded ? "transparent" : "#0a0a0a" }}>
      
      {/* PERFECTLY FIXED PRIMARY YEAR MARKER ("19") */}
      <div className="absolute left-10 md:left-20 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <h1 className="text-[32vw] md:text-[24vw] leading-[0.75] tracking-tighter m-0 font-black text-white drop-shadow-2xl" style={{ fontFamily: 'Impact, sans-serif' }}>
          19
        </h1>
      </div>

      {/* HORIZONTAL TIMELINE STRIP */}
      <div className="w-full h-full relative story-strip">
        {timelineData.map((item, index) => (
          <div key={index} className="absolute inset-0 w-full h-full flex items-center px-8 md:px-24 story-item">
             
             {/* THE SCROLLING YEAR SUFFIX */}
             <div className="absolute left-[36vw] md:left-[26vw] top-1/2 -translate-y-1/2 pointer-events-none story-year-suffix">
               <h1 className="text-[32vw] md:text-[24vw] leading-[0.75] tracking-tighter m-0 font-black text-[#222]" style={{ fontFamily: 'Impact, sans-serif' }}>
                 {item.yearSuffix}
               </h1>
             </div>

             {/* CONTENT CARD - Glassmorphism UI */}
             <div className="relative z-20 w-full max-w-xl ml-auto mr-[5vw] flex flex-col group mt-10 md:mt-24 story-content p-8 rounded-3xl"
                  style={{
                    background: "rgba(10, 10, 10, 0.5)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                  }}>
                <div className="w-12 h-[2px] bg-white/20 mb-6 group-hover:bg-blue-500 group-hover:w-24 transition-all duration-500 ease-out"></div>
                
                <p className="text-2xl md:text-4xl font-bold uppercase mb-4 text-zinc-100 tracking-tight font-rajdhani">
                  {item.title}
                </p>
                <p className="text-sm md:text-lg text-zinc-400 mb-8 leading-relaxed font-medium font-jetbrains">
                  {item.desc}
                </p>
                
                {item.imageUrl && (
                  <div className="flex flex-col gap-4 w-full">
                    <div className="relative overflow-hidden bg-[#111] border border-white/10 w-full h-[250px] shadow-2xl rounded-xl">
                      <img 
                        src={item.imageUrl} 
                        className="w-full h-full object-cover grayscale opacity-60 story-img scale-110 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                        alt={`Archive 19${item.yearSuffix}`} 
                      />
                    </div>
                    {item.caption && (
                        <p className="text-xs text-blue-400 font-jetbrains tracking-widest uppercase">{item.caption}</p>
                    )}
                  </div>
                )}
             </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollBasedStory;