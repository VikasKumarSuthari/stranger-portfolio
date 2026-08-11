import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface TrailParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
}

const CursorTrail: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { isUpsideDown } = useTheme();
    const mouseRef = useRef({ x: 0, y: 0 });
    const particlesRef = useRef<TrailParticle[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Hide on mobile
        if (window.innerWidth < 768) return;

        let animationFrameId: number;
        let lastMouseX = 0;
        let lastMouseY = 0;
        let frameCount = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const spawnParticle = () => {
            const { x, y } = mouseRef.current;
            const dx = x - lastMouseX;
            const dy = y - lastMouseY;
            const speed = Math.sqrt(dx * dx + dy * dy);

            // Only spawn if mouse is moving
            if (speed < 1) return;

            const count = Math.min(3, Math.floor(speed / 5));
            for (let i = 0; i < count; i++) {
                particlesRef.current.push({
                    x: x + (Math.random() - 0.5) * 8,
                    y: y + (Math.random() - 0.5) * 8,
                    vx: (Math.random() - 0.5) * 2 + dx * 0.05,
                    vy: (Math.random() - 0.5) * 2 + dy * 0.05,
                    life: 1,
                    maxLife: 30 + Math.random() * 20,
                    size: Math.random() * 3 + 1,
                });
            }

            lastMouseX = x;
            lastMouseY = y;
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frameCount++;

            if (frameCount % 2 === 0) {
                spawnParticle();
            }

            const particles = particlesRef.current;
            const color = isUpsideDown ? [58, 134, 255] : [231, 29, 54];

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.life--;
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.96;
                p.vy *= 0.96;
                p.vy += 0.02; // tiny gravity

                const progress = p.life / p.maxLife;
                if (progress <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                const alpha = progress * 0.8;
                const size = p.size * progress;

                // Glow
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3);
                gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha * 0.5})`);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
                ctx.fill();

                // Core
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, size * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        resize();
        animate();

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isUpsideDown]);

    if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[35]"
        />
    );
};

export default CursorTrail;
