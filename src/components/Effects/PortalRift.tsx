import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PortalRiftProps {
    isActive: boolean;
    onComplete?: () => void;
}

const PortalRift: React.FC<PortalRiftProps> = ({ isActive, onComplete }) => {
    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    className="fixed inset-0 z-[100] pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onAnimationComplete={() => {
                        setTimeout(() => onComplete?.(), 1500);
                    }}
                >
                    {/* Screen shake container */}
                    <motion.div
                        className="w-full h-full relative"
                        animate={{
                            x: [0, -5, 5, -3, 3, -1, 1, 0],
                            y: [0, 3, -3, 2, -2, 1, -1, 0],
                        }}
                        transition={{ duration: 0.5, repeat: 2 }}
                    >
                        {/* Central crack/rift */}
                        <motion.div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full"
                            style={{
                                background: 'linear-gradient(to bottom, transparent, #E71D36, #3A86FF, #E71D36, transparent)',
                                boxShadow: '0 0 30px 15px rgba(231, 29, 54, 0.6), 0 0 60px 30px rgba(58, 134, 255, 0.4)',
                            }}
                            initial={{ scaleY: 0, opacity: 0 }}
                            animate={{
                                scaleY: [0, 1, 1, 0],
                                opacity: [0, 1, 1, 0],
                                width: ['2px', '4px', '8px', '2px'],
                            }}
                            transition={{ duration: 1.5, times: [0, 0.3, 0.7, 1] }}
                        />

                        {/* Left crack branches */}
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={`left-${i}`}
                                className="absolute bg-stranger-red"
                                style={{
                                    top: `${15 + i * 18}%`,
                                    left: '50%',
                                    height: '1px',
                                    transformOrigin: 'right center',
                                    boxShadow: '0 0 10px 3px rgba(231, 29, 54, 0.8)',
                                }}
                                initial={{ width: 0, opacity: 0, rotate: -(20 + Math.random() * 40) }}
                                animate={{
                                    width: [0, 40 + Math.random() * 80, 0],
                                    opacity: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 1.2,
                                    delay: 0.2 + i * 0.08,
                                    times: [0, 0.4, 1],
                                }}
                            />
                        ))}

                        {/* Right crack branches */}
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={`right-${i}`}
                                className="absolute bg-stranger-blue"
                                style={{
                                    top: `${25 + i * 16}%`,
                                    left: '50%',
                                    height: '1px',
                                    transformOrigin: 'left center',
                                    boxShadow: '0 0 10px 3px rgba(58, 134, 255, 0.8)',
                                }}
                                initial={{ width: 0, opacity: 0, rotate: 20 + Math.random() * 40 }}
                                animate={{
                                    width: [0, 30 + Math.random() * 60, 0],
                                    opacity: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 1.2,
                                    delay: 0.25 + i * 0.08,
                                    times: [0, 0.4, 1],
                                }}
                            />
                        ))}

                        {/* Red energy bleed - left side */}
                        <motion.div
                            className="absolute inset-0"
                            style={{
                                background: 'radial-gradient(ellipse at 50% 50%, rgba(231, 29, 54, 0.3), transparent 60%)',
                            }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                                opacity: [0, 0.8, 0],
                                scale: [0.5, 1.5, 2],
                            }}
                            transition={{ duration: 1.5 }}
                        />

                        {/* Blue energy bleed - right side */}
                        <motion.div
                            className="absolute inset-0"
                            style={{
                                background: 'radial-gradient(ellipse at 50% 50%, rgba(58, 134, 255, 0.2), transparent 60%)',
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: [0, 0.6, 0],
                                scale: [0.8, 1.8, 2.5],
                            }}
                            transition={{ duration: 1.5, delay: 0.2 }}
                        />

                        {/* TV Static flash */}
                        <motion.div
                            className="absolute inset-0 noise-heavy"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.5, 0, 0.3, 0] }}
                            transition={{ duration: 1.5, times: [0, 0.3, 0.5, 0.6, 1] }}
                        />

                        {/* White flash */}
                        <motion.div
                            className="absolute inset-0 bg-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0, 0.8, 0] }}
                            transition={{ duration: 1.5, times: [0, 0.25, 0.35, 0.6] }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PortalRift;
