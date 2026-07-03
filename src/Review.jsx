import React from 'react';

const reviews = [
  {
    id: 1,
    text: "The app you built for us is incredibly fast and flawless. Great job!",
    name: "John D.",
    company: "Austin Legacy Corp",
    date: "16 / 11 / 23",
  },
  {
    id: 2,
    text: "Your team handled our complex software requirements perfectly. Highly recommended!",
    name: "Sarah M.",
    company: "Austin Legacy Corp",
    date: "04 / 11 / 23",
  },
  {
    id: 3,
    text: "Working with ALC was a game-changer. The website redesign boosted our sales by 40%!",
    name: "Michael R.",
    company: "Austin Legacy Corp",
    date: "05 / 11 / 23",
  },
  {
    id: 4,
    text: "Top tier IT services. The new cloud infra is exactly what we needed.",
    name: "Emily W.",
    company: "Tech Solutions",
    date: "19 / 10 / 23",
  },
  {
    id: 5,
    text: "Austin Legacy Corp delivered our mobile app ahead of schedule. The UX is stunning and bugs are zero.",
    name: "David K.",
    company: "Innovate Inc",
    date: "08 / 11 / 23",
  },
  {
    id: 6,
    text: "Code quality is superb. You guys really know how to build robust backend systems.",
    name: "Alex P.",
    company: "Global Systems",
    date: "03 / 11 / 23",
  }
];

export default function Review({ scrollerRef = null, embedded = false }) {
  // Group reviews into chunks of 3
  const reviewGroups = [];
  for (let i = 0; i < reviews.length; i += 3) {
    reviewGroups.push(reviews.slice(i, i + 3));
  }

  return (
    <div 
      className={`w-full h-full relative font-sans`}
      style={{ background: embedded ? "transparent" : "#000" }}
    >
      {reviewGroups.map((group, groupIndex) => (
        <div 
          key={groupIndex} 
          className="absolute inset-0 w-full h-full flex flex-col justify-center py-20 px-6 md:px-12 lg:px-24 review-slide"
        >
          <div className="max-w-[1400px] w-full mx-auto flex flex-col gap-12">
            <div className="text-center md:text-left mb-8">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter">
                Client <span className="text-gray-500 italic font-serif font-light">Feedback</span>
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl text-lg md:text-xl">
                See what our clients say about the impact we've made on their businesses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {group.map((review) => (
                <div 
                  key={review.id} 
                  className="review-card group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-white/30 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative h-full bg-[#0a0a0a] rounded-2xl p-8 flex flex-col justify-between z-10 backdrop-blur-xl border border-white/5 group-hover:border-white/10 transition-colors">
                    
                    <div className="mb-8">
                      <svg className="w-8 h-8 text-white/20 mb-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light">
                        "{review.text}"
                      </p>
                    </div>

                    <div className="flex justify-between items-end border-t border-white/10 pt-6">
                      <div>
                        <h4 className="text-white font-medium text-lg">{review.name}</h4>
                        <p className="text-white/50 text-sm">{review.company}</p>
                      </div>
                      <div className="text-white/30 text-xs tracking-widest font-mono">
                        {review.date}
                      </div>
                    </div>
                    
                    {/* Subtle glowing effect on hover */}
                    <div className="absolute -inset-4 bg-white/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
