import { useEffect, useRef } from 'react';
import { useTerminalStore } from '@/store/terminalStore';

const CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clearHistory = useTerminalStore((s) => s.clearHistory);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const FONT_SIZE = 14;
    const drops: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cols = Math.floor(canvas.width / FONT_SIZE);
      drops.length = cols;
      for (let i = 0; i < cols; i++) {
        if (drops[i] === undefined) {
          drops[i] = Math.floor(Math.random() * -canvas.height);
        }
      }
    };
    resize();

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const y = drops[i] * FONT_SIZE;

        ctx.fillStyle = drops[i] > 0 && Math.random() > 0.8 ? '#afffaf' : '#00ff41';
        ctx.fillText(char, i * FONT_SIZE, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') clearHistory();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [clearHistory]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-50 bg-black"
      aria-label="Matrix rain effect. Press Escape to exit."
      role="img"
    />
  );
}
