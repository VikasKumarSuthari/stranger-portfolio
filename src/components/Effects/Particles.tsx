import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Particle {
    x: number;
    y: number;
    dx: number;
    dy: number;
    size: number;
    baseX: number;
    baseY: number;
    glitchTimer: number;
}

const Particles = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const { isUpsideDown } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };

        const createParticles = () => {
            particles = [];
            const count = window.innerWidth < 768 ? 40 : 120;
            for (let i = 0; i < count; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                particles.push({
                    x,
                    y,
                    baseX: x,
                    baseY: y,
                    dx: (Math.random() - 0.5) * 0.8,
                    dy: (Math.random() - 0.5) * 0.8,
                    size: Math.random() * 2.5 + 0.5,
                    glitchTimer: Math.random() * 500,
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mouse = mouseRef.current;
            const connectDistance = 120;
            const mouseInfluence = 150;
            const color = isUpsideDown ? [58, 134, 255] : [231, 29, 54];

            particles.forEach((p, i) => {
                // Normal movement
                p.x += p.dx;
                p.y += p.dy;

                // Bounce off edges
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

                // Mouse repulsion
                const mdx = p.x - mouse.x;
                const mdy = p.y - mouse.y;
                const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mouseDist < mouseInfluence && mouseDist > 0) {
                    const force = (mouseInfluence - mouseDist) / mouseInfluence;
                    p.x += (mdx / mouseDist) * force * 3;
                    p.y += (mdy / mouseDist) * force * 3;
                }

                // Random glitch teleport
                p.glitchTimer--;
                if (p.glitchTimer <= 0) {
                    if (Math.random() > 0.95) {
                        p.x = Math.random() * canvas.width;
                        p.y = Math.random() * canvas.height;
                    }
                    p.glitchTimer = 200 + Math.random() * 400;
                }

                // Draw particle
                const alpha = 0.4 + p.size * 0.15;
                ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Draw connections (constellation effect)
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const ddx = p.x - p2.x;
                    const ddy = p.y - p2.y;
                    const dist = Math.sqrt(ddx * ddx + ddy * ddy);

                    if (dist < connectDistance) {
                        const lineAlpha = (1 - dist / connectDistance) * 0.2;
                        ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${lineAlpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse if close enough
                if (mouseDist < mouseInfluence) {
                    const lineAlpha = (1 - mouseDist / mouseInfluence) * 0.4;
                    ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${lineAlpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        resize();
        createParticles();
        animate();

        window.addEventListener('resize', () => {
            resize();
            createParticles();
        });
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isUpsideDown]);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

export default Particles;
