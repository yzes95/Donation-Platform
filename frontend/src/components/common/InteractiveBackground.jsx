import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../store/ThemeContext';

export function InteractiveBackground() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with smooth interpolation
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 180,
      active: false,
    };

    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Color palettes
    const darkPalette = [
      { r: 15, g: 118, b: 110 },  // Teal-700
      { r: 20, g: 184, b: 166 },  // Teal-500
      { r: 16, g: 185, b: 129 },  // Emerald-500
      { r: 245, g: 158, b: 11 },  // Amber-500
      { r: 6, g: 182, b: 212 },   // Cyan-500
    ];

    const lightPalette = [
      { r: 13, g: 148, b: 136 },  // Teal-600
      { r: 16, g: 185, b: 129 },  // Emerald-500
      { r: 217, g: 119, b: 6 },   // Amber-600
      { r: 20, g: 184, b: 166 },  // Teal-500
      { r: 59, g: 130, b: 246 },  // Blue-500
    ];

    const palette = isDark ? darkPalette : lightPalette;

    // 1. Large 3D Glowing Ambient Spheres
    const spheresCount = 5;
    const spheres = Array.from({ length: spheresCount }, (_, i) => {
      const color = palette[i % palette.length];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        baseRadius: Math.min(width, height) * (0.18 + Math.random() * 0.12),
        radius: 0,
        color,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.006,
        depth: 0.3 + Math.random() * 0.7, // Parallax depth factor
      };
    });

    // 2. Interactive Constellation Nodes
    const nodeCount = Math.min(Math.floor((width * height) / 28000), 42);
    const nodes = Array.from({ length: nodeCount }, () => {
      const color = palette[Math.floor(Math.random() * palette.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: 1.5 + Math.random() * 2.5,
        color,
        alpha: 0.3 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
      };
    });

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    let lastTime = performance.now();

    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // --- 1. RENDER 3D GLOWING AMBIENT SPHERES ---
      spheres.forEach((s) => {
        s.phase += s.pulseSpeed;
        s.radius = s.baseRadius + Math.sin(s.phase) * 25;

        // Ambient drift
        s.x += s.vx;
        s.y += s.vy;

        // Bounce from canvas boundaries
        if (s.x < -s.radius) s.x = width + s.radius;
        if (s.x > width + s.radius) s.x = -s.radius;
        if (s.y < -s.radius) s.y = height + s.radius;
        if (s.y > height + s.radius) s.y = -s.radius;

        // 3D Parallax offset based on mouse position
        const parallaxX = (mouse.x - width / 2) * s.depth * 0.05;
        const parallaxY = (mouse.y - height / 2) * s.depth * 0.05;
        const renderX = s.x + parallaxX;
        const renderY = s.y + parallaxY;

        // Multi-stop 3D Radial Glow Gradient
        const grad = ctx.createRadialGradient(
          renderX,
          renderY,
          0,
          renderX,
          renderY,
          s.radius
        );

        const coreAlpha = isDark ? 0.12 : 0.07;
        const midAlpha = isDark ? 0.05 : 0.03;
        
        grad.addColorStop(0, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${coreAlpha})`);
        grad.addColorStop(0.5, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${midAlpha})`);
        grad.addColorStop(1, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(renderX, renderY, s.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- 2. RENDER INTERACTIVE CONSTELLATION & CONNECTIVE MESH ---
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Move node
        n.x += n.vx;
        n.y += n.vy;

        // Wrap around screen
        if (n.x < 0) n.x = width;
        if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        if (n.y > height) n.y = 0;

        // Mouse magnetic reaction
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && mouse.active) {
          const force = (1 - dist / mouse.radius) * 1.5;
          n.x -= (dx / dist) * force;
          n.y -= (dy / dist) * force;
        }

        // Draw node with subtle glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${isDark ? n.alpha : n.alpha * 0.7})`;
        ctx.shadowColor = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, 0.5)`;
        ctx.shadowBlur = isDark ? 8 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const distance = Math.hypot(n.x - n2.x, n.y - n2.y);
          const maxDist = 130;

          if (distance < maxDist) {
            const lineAlpha = (1 - distance / maxDist) * (isDark ? 0.15 : 0.08);
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connect to mouse if close
        if (dist < mouse.radius && mouse.active) {
          const mouseLineAlpha = (1 - dist / mouse.radius) * (isDark ? 0.25 : 0.14);
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${mouseLineAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full transition-opacity duration-700"
      style={{ opacity: 0.88 }}
      aria-hidden="true"
    />
  );
}
