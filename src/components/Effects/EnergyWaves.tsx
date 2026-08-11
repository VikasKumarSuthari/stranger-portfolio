import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const EnergyWaves: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const { isUpsideDown } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let waves: { x: number; y: number; radius: number; maxRadius: number; opacity: number; speed: number }[] = [];
        let time = 0;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        // Spawn waves periodically from center
        const spawnWave = (x?: number, y?: number) => {
            waves.push({
                x: x ?? canvas.width / 2,
                y: y ?? canvas.height / 2,
                radius: 5,
                maxRadius: Math.max(canvas.width, canvas.height) * 0.6,
                opacity: 0.6,
                speed: 1.5 + Math.random() * 1,
            });
        };

        // Spawn wave near mouse on click
        const handleClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            spawnWave(e.clientX - rect.left, e.clientY - rect.top);
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time++;

            // Auto-spawn waves from center
            if (time % 80 === 0) {
                spawnWave();
            }

            // Spawn small waves near cursor
            if (time % 40 === 0) {
                spawnWave(
                    mouseRef.current.x + (Math.random() - 0.5) * 40,
                    mouseRef.current.y + (Math.random() - 0.5) * 40
                );
            }

            const baseColor = isUpsideDown ? [58, 134, 255] : [231, 29, 54];

            waves = waves.filter(wave => {
                wave.radius += wave.speed;
                wave.opacity = Math.max(0, 0.6 * (1 - wave.radius / wave.maxRadius));

                if (wave.opacity <= 0) return false;

                ctx.beginPath();
                ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${wave.opacity})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Inner glow ring
                ctx.beginPath();
                ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${wave.opacity * 0.3})`;
                ctx.lineWidth = 4;
                ctx.stroke();

                return true;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        resize();
        animate();

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('click', handleClick);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('click', handleClick);
        };
    }, [isUpsideDown]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-auto z-0"
            style={{ opacity: 0.4 }}
        />
    );
};

export default EnergyWaves;
