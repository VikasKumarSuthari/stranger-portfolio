import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const FlashlightCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const { isUpsideDown } = useTheme();

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', updatePosition);
        return () => window.removeEventListener('mousemove', updatePosition);
    }, []);

    // Don't show on mobile roughly
    if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

    return (
        <div
            className="pointer-events-none fixed inset-0 z-40 mix-blend-soft-light transition-opacity duration-500"
            style={{
                background: `radial-gradient(
          circle 300px at ${position.x}px ${position.y}px, 
          ${isUpsideDown ? 'rgba(50, 100, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)'}, 
          transparent 80%
        )`
            }}
        />
    );
};

export default FlashlightCursor;
