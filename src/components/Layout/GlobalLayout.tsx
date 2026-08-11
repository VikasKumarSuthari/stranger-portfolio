import React, { useState, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import classNames from 'classnames';
import FlashlightCursor from '../Effects/FlashlightCursor';
import CursorTrail from '../Effects/CursorTrail';
import FloatingSpores from '../Effects/FloatingSpores';
import PortalRift from '../Effects/PortalRift';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalLayoutProps {
    children: React.ReactNode;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
    const { isUpsideDown } = useTheme();
    const [showRift, setShowRift] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    // Detect theme changes to trigger portal rift
    const prevUpsideDown = React.useRef(isUpsideDown);
    React.useEffect(() => {
        if (prevUpsideDown.current !== isUpsideDown) {
            setShowRift(true);
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 800);
            prevUpsideDown.current = isUpsideDown;
        }
    }, [isUpsideDown]);

    const handleRiftComplete = useCallback(() => {
        setShowRift(false);
    }, []);

    return (
        <div className={classNames(
            "min-h-screen transition-colors duration-1000 relative",
            {
                "bg-stranger-dark": !isUpsideDown,
                "bg-[#0f172a]": isUpsideDown
            }
        )}>
            {/* CRT Effects - Fixed position */}
            <div className="fixed inset-0 pointer-events-none z-50">
                <div className="scanlines absolute inset-0" />
                <div className="vignette absolute inset-0" />
                <div className="noise absolute inset-0" />
            </div>

            {/* Portal Rift Transition */}
            <PortalRift isActive={showRift} onComplete={handleRiftComplete} />

            {/* Cursor Effects */}
            <FlashlightCursor />
            <CursorTrail />

            {/* Floating Spores for Upside Down */}
            <FloatingSpores />

            {/* Upside Down ambient overlay */}
            <AnimatePresence>
                {isUpsideDown && (
                    <motion.div
                        className="fixed inset-0 pointer-events-none z-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Vine-like tendrils at top */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-950/30 to-transparent" />
                        {/* Fog at bottom */}
                        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-blue-950/40 to-transparent" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content with screen shake */}
            <motion.div
                className={classNames(
                    "relative z-10 transition-all duration-1000 transform",
                    {
                        "filter hue-rotate-180 invert brightness-75 contrast-125 scale-105 rotate-1": isUpsideDown
                    }
                )}
                animate={isShaking ? {
                    x: [0, -8, 8, -5, 5, -2, 2, 0],
                    y: [0, 4, -4, 3, -3, 1, -1, 0],
                } : {}}
                transition={{ duration: 0.6 }}
            >
                {children}
            </motion.div>

            {/* Custom scrollbar glow line */}
            <div className={`fixed right-0 top-0 w-[3px] h-full z-50 pointer-events-none ${isUpsideDown ? 'bg-gradient-to-b from-transparent via-blue-500/20 to-transparent' : 'bg-gradient-to-b from-transparent via-red-500/20 to-transparent'}`} />
        </div>
    );
};

export default GlobalLayout;
