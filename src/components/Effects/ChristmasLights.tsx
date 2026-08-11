import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#E71D36', '#FFD700', '#00E676', '#3A86FF', '#FF6D00', '#E040FB'];
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MESSAGES = ['HELLO', 'HIRE ME', 'VIKAS', 'RUN', 'HELP'];

const ChristmasLights: React.FC = () => {
    const [activeIndices, setActiveIndices] = useState<number[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageIdx, setMessageIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const [isSpelling, setIsSpelling] = useState(false);

    useEffect(() => {
        const startSpelling = () => {
            setIsSpelling(true);
            setCurrentMessage(MESSAGES[messageIdx % MESSAGES.length]);
            setCharIdx(0);
        };

        const timeout = setTimeout(startSpelling, 3000);
        return () => clearTimeout(timeout);
    }, [messageIdx]);

    useEffect(() => {
        if (!isSpelling || !currentMessage) return;

        if (charIdx >= currentMessage.length) {
            // Hold the complete message for a moment, then reset
            const holdTimeout = setTimeout(() => {
                setActiveIndices([]);
                setIsSpelling(false);
                setMessageIdx(prev => prev + 1);
            }, 2000);
            return () => clearTimeout(holdTimeout);
        }

        const char = currentMessage[charIdx];
        const alphaIdx = ALPHABET.indexOf(char);
        if (alphaIdx !== -1) {
            setActiveIndices(prev => [...prev, alphaIdx]);
        }

        const charTimeout = setTimeout(() => {
            setCharIdx(prev => prev + 1);
        }, 400);

        return () => clearTimeout(charTimeout);
    }, [charIdx, currentMessage, isSpelling]);

    return (
        <div className="relative w-full py-6">
            {/* The wire/string */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gray-700"
                style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, #333 0px, #333 20px, #555 20px, #555 22px)',
                }}
            />

            {/* Lights row */}
            <div className="flex justify-center gap-[2px] md:gap-1 flex-wrap px-2">
                {ALPHABET.split('').map((letter, i) => {
                    const isActive = activeIndices.includes(i);
                    const color = COLORS[i % COLORS.length];

                    return (
                        <div key={i} className="flex flex-col items-center">
                            {/* Wire segment */}
                            <div className="w-[1px] h-4 bg-gray-600" />

                            {/* Bulb */}
                            <motion.div
                                className="relative w-6 h-8 md:w-8 md:h-10 flex items-center justify-center cursor-pointer"
                                animate={isActive ? {
                                    scale: [1, 1.2, 1],
                                } : {}}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Bulb glow */}
                                <div
                                    className="absolute inset-0 rounded-full blur-md transition-opacity duration-300"
                                    style={{
                                        backgroundColor: color,
                                        opacity: isActive ? 0.8 : 0.05,
                                    }}
                                />
                                {/* Bulb body */}
                                <div
                                    className="relative w-4 h-5 md:w-5 md:h-6 rounded-b-full rounded-t-sm border border-white/10 flex items-center justify-center text-[8px] md:text-[10px] font-bold font-mono transition-all duration-300"
                                    style={{
                                        backgroundColor: isActive ? color : '#1a1a1a',
                                        color: isActive ? '#000' : '#444',
                                        boxShadow: isActive
                                            ? `0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}80`
                                            : 'none',
                                    }}
                                >
                                    {letter}
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChristmasLights;
