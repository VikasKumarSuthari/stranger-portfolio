import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Spore {
    x: number;
    y: number;
    size: number;
    speedY: number;
    oscillationSpeed: number;
    oscillationAmp: number;
    phase: number;
    opacity: number;
    pulseSpeed: number;
}

const FloatingSpores: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { isUpsideDown } = useTheme();

    useEffect(() => {
        if (!isUpsideDown) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let spores: Spore[] = [];
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createSpores = () => {
            spores = [];
            const count = Math.min(60, Math.floor(window.innerWidth / 20));
            for (let i = 0; i < count; i++) {
                spores.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 3 + 1,
                    speedY: -(Math.random() * 0.5 + 0.2), // Float upward
                    oscillationSpeed: Math.random() * 0.02 + 0.005,
                    oscillationAmp: Math.random() * 30 + 10,
                    phase: Math.random() * Math.PI * 2,
                    opacity: Math.random() * 0.6 + 0.2,
                    pulseSpeed: Math.random() * 0.03 + 0.01,
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time++;

            spores.forEach(spore => {
                // Move upward
                spore.y += spore.speedY;

                // Sine wave horizontal drift
                const driftX = Math.sin(time * spore.oscillationSpeed + spore.phase) * spore.oscillationAmp;
                const drawX = spore.x + driftX;

                // Pulsing opacity
                const pulseOpacity = spore.opacity * (0.5 + 0.5 * Math.sin(time * spore.pulseSpeed + spore.phase));

                // Wrap around
                if (spore.y < -10) {
                    spore.y = canvas.height + 10;
                    spore.x = Math.random() * canvas.width;
                }

                // Draw spore with glow
                ctx.save();
                ctx.globalAlpha = pulseOpacity;

                // Outer glow
                const gradient = ctx.createRadialGradient(drawX, spore.y, 0, drawX, spore.y, spore.size * 4);
                gradient.addColorStop(0, 'rgba(58, 134, 255, 0.3)');
                gradient.addColorStop(0.5, 'rgba(58, 134, 255, 0.1)');
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(drawX, spore.y, spore.size * 4, 0, Math.PI * 2);
                ctx.fill();

                // Core
                ctx.fillStyle = 'rgba(150, 200, 255, 0.9)';
                ctx.beginPath();
                ctx.arc(drawX, spore.y, spore.size, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        resize();
        createSpores();
        animate();

        window.addEventListener('resize', () => {
            resize();
            createSpores();
        });

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isUpsideDown]);

    if (!isUpsideDown) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-30"
            style={{ opacity: 0.7 }}
        />
    );
};

export default FloatingSpores;
