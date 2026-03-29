'use client';

import React, { useEffect, useRef } from 'react';

const StarfieldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    const starCount = 150;

    class Star {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 1.5;
        this.speed = Math.random() * 0.05 + 0.02;
        this.opacity = Math.random();
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas!.height) {
          this.y = 0;
          this.x = Math.random() * canvas!.width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(232, 224, 213, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.update();
        star.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      init();
    };

    init();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none bg-[#050508]"
    />
  );
};

export default StarfieldBackground;
