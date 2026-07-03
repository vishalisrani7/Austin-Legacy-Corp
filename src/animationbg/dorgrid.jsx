'use client';
import { useRef, useEffect, useCallback } from 'react';

const NetworkingCard = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const CONFIG = {
    bgColor: '#000000',
    gridGap: 60, 
    mainCursorSize: 16,
    connectedDotSize: 6,
    floatingDotSize: 3,
    lineThickness: 1,
    connectionRadius: 160,
    glowRadius: 250,
    lineColor: '255, 255, 255',
    dotColor: '255, 255, 255',
  };

  const getGridPoints = (width, height) => {
    const points = [];
    const offset = CONFIG.gridGap; 
    const cols = Math.ceil(width / CONFIG.gridGap) + 2;
    const rows = Math.ceil(height / CONFIG.gridGap) + 2;

    for (let i = -1; i < cols; i++) {
      for (let j = -1; j < rows; j++) {
        points.push({
          x: i * CONFIG.gridGap,
          y: j * CONFIG.gridGap,
        });
      }
    }
    return points;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    let rafId;
    let points = [];

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      points = getGridPoints(canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = CONFIG.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      points.forEach((point) => {
        const dx = point.x - mx;
        const dy = point.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectionRadius) {
          const alpha = 1 - (dist / CONFIG.connectionRadius);
          
          // Glow effect for connected lines
          ctx.shadowBlur = 10;
          ctx.shadowColor = `rgba(${CONFIG.lineColor}, 0.5)`;
          
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(point.x, point.y);
          ctx.lineWidth = CONFIG.lineThickness;
          ctx.strokeStyle = `rgba(${CONFIG.lineColor}, ${alpha})`;
          ctx.stroke();

          // Dot highlight
          ctx.beginPath();
          ctx.arc(point.x, point.y, CONFIG.connectedDotSize / 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${CONFIG.dotColor}, 1)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (dist < CONFIG.glowRadius) {
          const distFactor = (dist - CONFIG.connectionRadius) / (CONFIG.glowRadius - CONFIG.connectionRadius);
          const alpha = Math.max(0, 1 - distFactor) * 0.4;
          
          ctx.beginPath();
          ctx.arc(point.x, point.y, CONFIG.floatingDotSize / 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${CONFIG.dotColor}, ${alpha})`;
          ctx.fill();
        }
      });

      // Cursor point
      if (mx >= 0 && mx <= canvas.width && my >= 0 && my <= canvas.height) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'white';
        ctx.beginPath();
        ctx.arc(mx, my, CONFIG.mainCursorSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      rafId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <div className="w-full max-w-xl border border-white/20 bg-black flex flex-col font-mono">
      
        <div className="flex border-b border-white/20 divide-x divide-white/20">
          <div className="w-1/2 flex items-center justify-center p-10">
            <h1 className="text-white text-3xl font-bold tracking-[0.2em]">NETWORKING</h1>
          </div>
          
          <div className="w-1/2 p-8 flex items-center">
            <p className="text-white text-[14px] leading-relaxed uppercase tracking-wider">
              Networking is the art of building connections that move you forward. 
              It's the bridge between where you are and where you want to go.
            </p>
          </div>
        </div>

        <div 
          ref={containerRef}
          className="relative h-[450px] w-full cursor-none overflow-hidden bg-black"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => mouseRef.current = { x: -1000, y: -1000 }}
        >
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full" 
          />
        </div>
      </div>
    </div>
  );
};

export default NetworkingCard;