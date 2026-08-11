import React, { useEffect, useState } from 'react';

interface GlitchTextProps {
    children: string;
    className?: string;
    intensity?: 'low' | 'medium' | 'high';
}

const GlitchText: React.FC<GlitchTextProps> = ({
    children,
    className = '',
    intensity = 'medium',
}) => {
    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
        const triggerGlitch = () => {
            setIsGlitching(true);
            const durations = { low: 150, medium: 300, high: 500 };
            setTimeout(() => setIsGlitching(false), durations[intensity]);
        };

        const intervals = { low: 8000, medium: 4000, high: 2000 };
        const interval = setInterval(() => {
            if (Math.random() > 0.5) triggerGlitch();
        }, intervals[intensity]);

        return () => clearInterval(interval);
    }, [intensity]);

    const glitchClass = isGlitching ? 'glitch-active' : '';

    return (
        <span
            className={`glitch-text ${glitchClass} ${className}`}
            data-text={children}
            onMouseEnter={() => setIsGlitching(true)}
            onMouseLeave={() => setTimeout(() => setIsGlitching(false), 300)}
        >
            {children}
        </span>
    );
};

export default GlitchText;
