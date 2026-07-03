import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ParticleWord() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const word = "SAND";

    // ---- TEXT STYLE ----
    ctx.font = "bold 180px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // ---- DRAW WORD (FOR CAPTURE) ----
    ctx.fillStyle = "white";
    ctx.fillText(word, canvas.width / 2, canvas.height / 2);

    // ---- CAPTURE PIXELS (ULTRA DENSE) ----
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y += 1) {   // 👈 VERY VERY DENSE
      for (let x = 0; x < canvas.width; x += 1) {
        const i = (y * canvas.width + x) * 4;
        if (imageData.data[i + 3] > 150) {
          particles.push({
            x,
            y,
            ox: x,
            oy: y,
            alpha: 1,
            size: 1
          });
        }
      }
    }

    // ---- PHASE CONTROL ----
    let showText = true;

    // ---- GSAP TIMELINE ----
    const tl = gsap.timeline({
      delay: 1.5,
      onStart: () => {
        showText = false; // 👈 hide normal text when animation starts
      }
    });

    particles.forEach(p => {
      const letterDelay = (p.x - canvas.width / 2) * 0.0015;

      tl.to(
        p,
        {
          x: p.x + gsap.utils.random(-60, 60),
          y: p.y - gsap.utils.random(100, 220),
          alpha: 0,
          duration: 2.2,
          ease: "power3.out"
        },
        letterDelay
      );
    });

    // ---- RENDER LOOP ----
    let animationId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 👉 NORMAL TEXT PHASE
      if (showText) {
        ctx.fillStyle = "white";
        ctx.fillText(word, canvas.width / 2, canvas.height / 2);
      }

      // 👉 PARTICLES PHASE
      particles.forEach(p => {
        if (p.alpha > 0) {
          ctx.fillStyle = `rgba(255,255,255,${p.alpha})`; // 👈 WHITE PARTICLES
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      tl.kill();
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0b0b0b" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
