import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion'; // Check if you use motion/react or framer-motion

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  animate = undefined,
  startDelay = 0,
  ...props
}) {
  const generateScrambledText = (input, chars) => {
    const availableChars = chars.split('');
    return input
      .split('')
      .map((char) => {
        if (char === ' ') return ' ';
        return availableChars[Math.floor(Math.random() * availableChars.length)];
      })
      .join('');
  };

  const [displayText, setDisplayText] = useState(() =>
    generateScrambledText(text, characters)
  );

  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  const resetAnimation = () => {
    setIsHovering(false);
    setHasAnimated(false);
    setIsScrambling(false);
    setRevealedIndices(new Set());
    setDisplayText(generateScrambledText(text, characters));
  };

  const startAnimation = () => {
    setRevealedIndices(new Set());
    setDisplayText(generateScrambledText(text, characters));
    setHasAnimated(false);
    setIsHovering(true);
  };

  useEffect(() => {
    resetAnimation();
  }, [text, characters]);

  useEffect(() => {
    if (animate === true) {
      const timer = setTimeout(() => {
        startAnimation();
      }, startDelay);
      return () => clearTimeout(timer);
    } else if (animate === false) {
      resetAnimation();
    }
  }, [animate, startDelay, text, characters]);

  useEffect(() => {
    let interval;
    let currentIteration = 0;

    const getNextIndex = (revealedSet) => {
      const textLength = text.length;
      switch (revealDirection) {
        case 'start': // Left to Right
          return revealedSet.size;
        case 'end': // Right to Left
          return textLength - 1 - revealedSet.size;
        case 'center': {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedSet.size / 2);
          return revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;
        }
        default:
          return revealedSet.size;
      }
    };

    const shuffleText = (originalText, currentRevealed) => {
      const availableChars = characters.split('');
      return originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (currentRevealed.has(i)) return originalText[i]; // Revealed stays same
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join('');
    };

    if (isHovering) {
      setIsScrambling(true);
      interval = setInterval(() => {
        setRevealedIndices((prevRevealed) => {
          if (sequential) {
            if (prevRevealed.size < text.length) {
              const nextIndex = getNextIndex(prevRevealed);
              const newRevealed = new Set(prevRevealed);
              newRevealed.add(nextIndex);
              setDisplayText(shuffleText(text, newRevealed));
              return newRevealed;
            } else {
              clearInterval(interval);
              setIsScrambling(false);
              setHasAnimated(true);
              setDisplayText(text);
              return prevRevealed;
            }
          } else {
            // Non-sequential fallback
            setDisplayText(shuffleText(text, prevRevealed));
            currentIteration++;
            if (currentIteration >= maxIterations) {
              clearInterval(interval);
              setIsScrambling(false);
              setHasAnimated(true);
              setDisplayText(text);
            }
            return prevRevealed;
          }
        });
      }, speed);
    }

    return () => clearInterval(interval);
  }, [isHovering, text, speed, maxIterations, sequential, revealDirection, characters]);

  useEffect(() => {
    if (typeof animate !== 'undefined' || animateOn !== 'view') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
        } else {
          resetAnimation();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animate, animateOn, text, characters]);

  const interactiveProps =
    typeof animate === 'undefined' && animateOn === 'hover'
      ? {
          onMouseEnter: startAnimation,
          onMouseLeave: resetAnimation,
        }
      : {};

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      {...interactiveProps}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split('').map((char, index) => {
          // Logic to check if this specific character should show as decrypted
          const isDone = revealedIndices.has(index) || (!isScrambling && hasAnimated);

          return (
            <span
              key={index}
              className={isDone ? className : encryptedClassName}
            >
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}
