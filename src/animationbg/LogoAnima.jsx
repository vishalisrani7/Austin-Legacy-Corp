import React, { useRef, useEffect, useState } from 'react';

const COLORS = {
  neonOrange: '#FF6B00',
  white: '#FFFFFF',
  darkOrange: '#E85D00',
  wireframe: '#00FF88',
  glow: '#00FFFF',
  black: '#000000'
};

const ANIMATION_DURATION = 6500;

class Particle {
  constructor(x, y, vx, vy, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.life = 1;
    this.decay = Math.random() * 0.02 + 0.01;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1;
    this.life -= this.decay;
  }

  draw(ctx) {
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

const horseVertices = [
  { x: -40, y: -20 }, { x: 40, y: -15 }, { x: 45, y: 5 }, { x: -35, y: 10 },
  { x: 50, y: -25 }, { x: 65, y: -30 }, { x: 70, y: -20 },
  { x: -20, y: 10 }, { x: -20, y: 35 }, { x: -5, y: 10 }, { x: -5, y: 35 },
  { x: 10, y: 10 }, { x: 10, y: 35 }, { x: 25, y: 10 }, { x: 25, y: 35 },
  { x: -40, y: 5 }, { x: -60, y: 15 }
];

const horseEdges = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [1, 4], [4, 5], [5, 6], [6, 1],
  [1, 10], [10, 11], [1, 12], [12, 13],
  [0, 8], [8, 9], [0, 6], [6, 7],
  [3, 15], [15, 16]
];

const AustinLegacyAnimation = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const particlesRef = useRef([]);
  const frameIdRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctxRef.current = ctx;
  }, [dimensions]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Drawing functions
  const drawDustTrail = (x, y, progress, opacity) => {
    const ctx = ctxRef.current;
    ctx.globalAlpha = opacity * (1 - progress);
    for (let i = 0; i < 5; i++) {
      const offset = i * 15;
      const size = 8 - i * 1.2;
      ctx.fillStyle = COLORS.white;
      ctx.beginPath();
      ctx.arc(x - offset, y + Math.sin(progress * Math.PI) * 5, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  const drawHorse = (x, y, scale, opacity, wireframeProgress) => {
    const ctx = ctxRef.current;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const meshOpacity = Math.min(1, wireframeProgress);
    ctx.globalAlpha = opacity * (1 - wireframeProgress * 0.7);

    ctx.strokeStyle = COLORS.white;
    ctx.lineWidth = 2;
    ctx.globalAlpha = opacity * (1 - wireframeProgress);

    for (const edge of horseEdges) {
      const p1 = horseVertices[edge[0]];
      const p2 = horseVertices[edge[1]];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    ctx.globalAlpha = opacity * meshOpacity * 0.8;
    ctx.fillStyle = COLORS.neonOrange;
    for (const vertex of horseVertices) {
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = COLORS.neonOrange;
      ctx.globalAlpha = opacity * meshOpacity * 0.4;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = opacity * meshOpacity * 0.8;
    }

    ctx.restore();
  };

  const drawLogoFrame = (progress, opacity) => {
    const ctx = ctxRef.current;
    ctx.globalAlpha = opacity;
    const frameSize = 200;
    const x = dimensions.width / 2 - frameSize / 2;
    const y = dimensions.height / 2 - frameSize / 2;

    ctx.strokeStyle = COLORS.neonOrange;
    ctx.lineWidth = 3;

    const totalLength = frameSize * 2 + frameSize * 2;
    const drawnLength = totalLength * progress;

    if (drawnLength > 0) {
      const topLength = Math.min(frameSize, drawnLength);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + topLength, y);
      ctx.stroke();
    }

    if (drawnLength > frameSize) {
      const rightLength = Math.min(frameSize, drawnLength - frameSize);
      ctx.beginPath();
      ctx.moveTo(x + frameSize, y);
      ctx.lineTo(x + frameSize, y + rightLength);
      ctx.stroke();
    }

    if (drawnLength > frameSize * 2) {
      const bottomLength = Math.min(frameSize, drawnLength - frameSize * 2);
      ctx.beginPath();
      ctx.moveTo(x + frameSize, y + frameSize);
      ctx.lineTo(x + frameSize - bottomLength, y + frameSize);
      ctx.stroke();
    }

    if (drawnLength > frameSize * 3) {
      const leftLength = Math.min(frameSize, drawnLength - frameSize * 3);
      ctx.beginPath();
      ctx.moveTo(x, y + frameSize);
      ctx.lineTo(x, y + frameSize - leftLength);
      ctx.stroke();
    }

    ctx.globalAlpha = opacity * 0.3;
    ctx.shadowColor = COLORS.neonOrange;
    ctx.shadowBlur = 20;
    ctx.strokeStyle = COLORS.neonOrange;
    ctx.lineWidth = 6;
    ctx.strokeRect(x, y, frameSize, frameSize);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  };

  const drawText = (text, x, y, fontSize, progress, opacity, isSegmented = false) => {
    const ctx = ctxRef.current;
    ctx.globalAlpha = opacity;
    ctx.font = `bold ${fontSize}px 'Helvetica Neue'`;
    ctx.fillStyle = COLORS.white;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (isSegmented) {
      const chars = text.split('');
      const charWidth = fontSize * 0.6;
      const totalWidth = chars.length * charWidth;
      const startX = x - totalWidth / 2;

      chars.forEach((char, i) => {
        const charProgress = Math.max(0, Math.min(1, progress * chars.length - i));
        ctx.globalAlpha = opacity * charProgress;
        ctx.fillText(char, startX + i * charWidth + charWidth / 2, y);
      });
    } else {
      ctx.globalAlpha = opacity * progress;
      ctx.fillText(text, x, y);
    }

    ctx.globalAlpha = 1;
  };

  const drawShineEffect = (progress, opacity) => {
    const ctx = ctxRef.current;
    if (progress < 0.1) return;

    const shineProgress = (progress - 0.1) / 0.9;
    const frameSize = 200;
    const x = dimensions.width / 2 - frameSize / 2;
    const y = dimensions.height / 2 - frameSize / 2;

    const shineX = x + shineProgress * frameSize * 1.5;

    const gradient = ctx.createLinearGradient(shineX - 50, 0, shineX + 50, 0);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.6 * opacity})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.globalAlpha = opacity;
    ctx.fillStyle = gradient;
    ctx.fillRect(shineX - 50, y - 50, 100, frameSize + 100);
    ctx.globalAlpha = 1;
  };

  const drawEnergyPulse = (x, y, progress, opacity) => {
    const ctx = ctxRef.current;
    ctx.globalAlpha = opacity * (1 - progress);
    ctx.strokeStyle = COLORS.neonOrange;

    for (let i = 0; i < 3; i++) {
      const radius = 30 + progress * 80 + i * 20;
      ctx.lineWidth = 2 - progress * 1.5;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  // Main animation loop
  useEffect(() => {
    const animate = () => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const progress = (elapsed % ANIMATION_DURATION) / ANIMATION_DURATION;

      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;

      // Clear canvas
      ctx.fillStyle = COLORS.black;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Phase 1: Horse runs in
      const horsePhase = Math.min(1, progress * 4);
      const horseX = centerX - 300 + horsePhase * 300;
      const horseScale = 1.5;

      if (horsePhase < 1) {
        drawDustTrail(horseX, centerY, horsePhase, 0.6);
        drawHorse(horseX, centerY, horseScale, 1, 0);
      }

      // Phase 2: Horse jump and land
      const jumpPhase = Math.max(0, Math.min(1, (progress - 0.23) * 4));
      if (jumpPhase > 0) {
        const jumpHeight = Math.sin(jumpPhase * Math.PI) * 150;
        const landingX = centerX;
        const landingY = centerY - jumpHeight;
        drawHorse(landingX, landingY, horseScale, 1, 0);

        if (jumpPhase > 0.8) {
          for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 2;
            particlesRef.current.push(
              new Particle(
                landingX,
                landingY,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                COLORS.neonOrange
              )
            );
          }
        }
      }

      // Phase 3: Horse transforms to wireframe
      const wireframePhase = Math.max(0, Math.min(1, (progress - 0.38) * 3));
      if (wireframePhase > 0 && wireframePhase < 1.2) {
        drawHorse(centerX, centerY, horseScale, 1 - wireframePhase, wireframePhase);
      }

      // Phase 4: Energy pulses
      const energyPhase = Math.max(0, Math.min(1, (progress - 0.46) * 2));
      if (energyPhase > 0 && energyPhase < 1) {
        drawEnergyPulse(centerX, centerY, energyPhase, 0.8);

        if (Math.random() < 0.3) {
          const angle = Math.random() * Math.PI * 2;
          const distance = 50 + Math.random() * 50;
          particlesRef.current.push(
            new Particle(
              centerX + Math.cos(angle) * distance,
              centerY + Math.sin(angle) * distance,
              Math.cos(angle) * 1,
              Math.sin(angle) * 1,
              COLORS.neonOrange
            )
          );
        }
      }

      // Phase 5: Logo frame draws
      const framePhase = Math.max(0, Math.min(1, (progress - 0.54) * 2));
      if (framePhase > 0) {
        drawLogoFrame(framePhase, 1);
      }

      // Phase 6: Text reveals
      const textPhase = Math.max(0, Math.min(1, (progress - 0.69) * 2));
      if (textPhase > 0) {
        drawText('AUSTIN LEGACY CORP', centerX, centerY - 30, 36, textPhase, 1, true);
      }

      // Phase 7: Tagline fades in
      const taglinePhase = Math.max(0, Math.min(1, (progress - 0.77) * 3));
      if (taglinePhase > 0) {
        drawText('INVENTING THE NEXT CENTURY', centerX, centerY + 80, 16, taglinePhase, 0.8);
      }

      // Phase 8: Shine sweep
      const shinePhase = Math.max(0, Math.min(1, (progress - 0.89) * 7));
      if (shinePhase > 0) {
        drawShineEffect(shinePhase, 1);

        if (Math.random() < 0.5) {
          const angle = Math.random() * Math.PI * 2;
          particlesRef.current.push(
            new Particle(
              centerX + Math.cos(angle) * 100,
              centerY + Math.sin(angle) * 100,
              Math.cos(angle) * 0.5,
              Math.sin(angle) * 0.5,
              COLORS.white
            )
          );
        }
      }

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        particlesRef.current[i].update();
        if (particlesRef.current[i].life > 0) {
          particlesRef.current[i].draw(ctx);
        } else {
          particlesRef.current.splice(i, 1);
        }
      }

      frameIdRef.current = requestAnimationFrame(animate);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [dimensions]);

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#000', margin: 0, padding: 0 }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default AustinLegacyAnimation;