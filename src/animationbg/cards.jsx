import { useEffect, useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import "./ScrollCards.css";

const tarotDeck = [
  { id: 1, name: "The Fool", desc: "New beginnings, innocence." },
  { id: 2, name: "The Magician", desc: "Manifestation, power." },
  { id: 3, name: "The High Priestess", desc: "Intuition, sacred knowledge." },
  { id: 4, name: "The Empress", desc: "Femininity, nature." },
  { id: 5, name: "The Emperor", desc: "Authority, structure." },
  { id: 6, name: "The Lovers", desc: "Love, harmony." },
  { id: 7, name: "The Chariot", desc: "Control, willpower." },
  { id: 8, name: "Strength", desc: "Courage, influence." },
  { id: 9, name: "The Hermit", desc: "Soul-searching." },
  { id: 10, name: "Wheel of Fortune", desc: "Good luck, cycles." },
  { id: 11, name: "Justice", desc: "Fairness, truth." },
  { id: 12, name: "The Hanged Man", desc: "Letting go." },
];

const chunkArray = (arr, size) => {
  return arr.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size));
    return acc;
  }, []);
};

const CardBatch = ({ cards }) => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cardElements = gsap.utils.toArray(containerRef.current.querySelectorAll(".card"));
      const totalScrollHeight = window.innerHeight * 3;

      let positions = [];
      let rotations = [];

      if (cards.length === 4) {
        positions = [14, 38, 62, 86];
        rotations = [-15, -7.5, 7.5, 15];
      } else if (cards.length === 3) {
        positions = [26, 50, 74];
        rotations = [-10, 0, 10];
      } else if (cards.length === 2) {
        positions = [38, 62];
        rotations = [-7.5, 7.5];
      } else {
        positions = [50];
        rotations = [0];
      }

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${totalScrollHeight}`,
        pin: true,
        pinSpacing: true,
      });

      cardElements.forEach((card, index) => {
        gsap.to(card, {
          left: `${positions[index]}%`,
          rotation: `${rotations[index]}`,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${window.innerHeight}`,
            scrub: 0.5,
          },
        });
      });

      cardElements.forEach((card, index) => {
        const frontEl = card.querySelector(".flip-card-front");
        const backEl = card.querySelector(".flip-card-back");

        const staggerOffset = index * 0.05;
        const startOffset = 1 / 3 + staggerOffset;
        const endOffset = 2 / 3 + staggerOffset;

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${totalScrollHeight}`,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            if (progress >= startOffset && progress <= endOffset) {
              const animationProgress = (progress - startOffset) / (1 / 3);
              const frontRotation = -180 * animationProgress;
              const backRotation = 180 - 180 * animationProgress;
              const cardRotation = rotations[index] * (1 - animationProgress);

              frontEl.style.transform = `rotateY(${frontRotation}deg)`;
              backEl.style.transform = `rotateY(${backRotation}deg)`;
              card.style.transform = `translate(-50%, -50%) rotate(${cardRotation}deg)`;
            } else if (progress > endOffset) {
                frontEl.style.transform = `rotateY(-180deg)`;
                backEl.style.transform = `rotateY(0deg)`;
                card.style.transform = `translate(-50%, -50%) rotate(0deg)`;
            }
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [cards]);

  return (
    <section ref={containerRef} className="cards-section">
      {cards.map((cardData) => (
        <div className="card" key={cardData.id}>
          <div className="card-wrapper">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src="/card-front.png" alt="Card" />
              </div>
              <div className="flip-card-back">
                <div className="card-content">
                    <p className="card-title">{cardData.name}</p>
                    <p className="card-desc">{cardData.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default function Cards() {
  const [selectedCards, setSelectedCards] = useState([]);
  const [isReadingStarted, setIsReadingStarted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => lenis.destroy();
  }, []);

  const toggleCard = (card) => {
    if (selectedCards.find((c) => c.id === card.id)) {
      setSelectedCards(selectedCards.filter((c) => c.id !== card.id));
    } else {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const batches = chunkArray(selectedCards, 4);

  return (
    <>
      {!isReadingStarted && (
        <section className="hero-selection">
          <h1>
            Select Your <br />
            Destiny Cards
          </h1>
          
          <div className="dropdown-container">
            <button 
                className="dropdown-trigger"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                {selectedCards.length === 0 
                  ? "Tap to Choose Cards" 
                  : `${selectedCards.length} Cards Selected`}
                <span className="arrow">{isDropdownOpen ? '▲' : '▼'}</span>
            </button>
            
            {isDropdownOpen && (
                <div className="dropdown-menu">
                    {tarotDeck.map(card => {
                         const isSelected = selectedCards.find(c => c.id === card.id);
                         return (
                            <div 
                                key={card.id}
                                className={`dropdown-item ${isSelected ? 'selected' : ''}`}
                                onClick={() => toggleCard(card)}
                            >
                                <span>{card.name}</span>
                                {isSelected && <span>✓</span>}
                            </div>
                         )
                    })}
                </div>
            )}
          </div>

          {selectedCards.length > 0 && (
              <button 
                className="start-btn" 
                onClick={() => setIsReadingStarted(true)}
              >
                Reveal Cards ↓
              </button>
          )}
        </section>
      )}

      {isReadingStarted && (
        <>
            <section className="scroll-instruction">
                <h1>
                  Scroll Slowly <br/> 
                  to Reveal
                </h1>
            </section>

            {batches.map((batch, index) => (
                <CardBatch 
                    key={index} 
                    cards={batch} 
                />
            ))}

            <section className="footer">
                <h1>Reading Complete</h1>
                <button onClick={() => window.location.reload()}>Start New Reading</button>
            </section>
        </>
      )}
    </>
  );
}