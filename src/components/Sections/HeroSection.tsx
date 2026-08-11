import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import Particles from '../Effects/Particles';
import EnergyWaves from '../Effects/EnergyWaves';
import GlitchText from '../Effects/GlitchText';

const TITLE_TEXT = 'VIKAS KUMAR';
const SUBTITLE_TEXT = 'SUTHARI';

const LetterReveal: React.FC<{ text: string; className?: string; delay?: number; style?: React.CSSProperties }> = ({
    text, className = '', delay = 0, style
}) => {
    return (
        <span className={className} style={style}>
            {text.split('').map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, rotateX: 90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                        delay: delay + i * 0.12,
                        duration: 0.6,
                        ease: 'easeOut',
                    }}
                    className="inline-block"
                    style={{ display: 'inline-block' }}
                >
                    <motion.span
                        animate={{
                            opacity: [1, 0.3, 1, 0.6, 1],
                            textShadow: [
                                '0 0 10px rgba(231, 29, 54, 0.8)',
                                '0 0 30px rgba(231, 29, 54, 1)',
                                '0 0 10px rgba(231, 29, 54, 0.8)',
                            ],
                        }}
                        transition={{
                            delay: delay + i * 0.12 + 0.5,
                            duration: 0.3,
                            repeat: 0,
                        }}
                        className="inline-block"
                    >
                        {char}
                    </motion.span>
                </motion.span>
            ))}
        </span>
    );
};

const HeroSection = () => {
    const { isUpsideDown, toggleUpsideDown } = useTheme();
    const [showSubtitle, setShowSubtitle] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowSubtitle(true), TITLE_TEXT.length * 120 + 600);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center p-4 z-20 overflow-hidden">
            <Particles />
            <EnergyWaves />

            {/* Aurora gradient background */}
            <motion.div
                className="absolute inset-0 z-0"
                animate={{
                    background: isUpsideDown
                        ? [
                            'radial-gradient(ellipse at 30% 50%, rgba(58, 134, 255, 0.15), transparent 70%)',
                            'radial-gradient(ellipse at 70% 50%, rgba(58, 134, 255, 0.15), transparent 70%)',
                            'radial-gradient(ellipse at 30% 50%, rgba(58, 134, 255, 0.15), transparent 70%)',
                        ]
                        : [
                            'radial-gradient(ellipse at 30% 50%, rgba(231, 29, 54, 0.12), transparent 70%)',
                            'radial-gradient(ellipse at 70% 50%, rgba(231, 29, 54, 0.12), transparent 70%)',
                            'radial-gradient(ellipse at 30% 50%, rgba(231, 29, 54, 0.12), transparent 70%)',
                        ],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 w-full max-w-6xl mx-auto mt-16">
                {/* Profile Visualizer */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative w-64 h-64 md:w-80 md:h-80 shrink-0"
                >
                    <div className={`absolute inset-0 rounded-full border-4 border-dashed animate-[spin_20s_linear_infinite] ${isUpsideDown ? 'border-blue-500/50' : 'border-stranger-red/50'}`} />
                    <div className={`absolute inset-4 rounded-full border-2 border-dotted animate-[spin_15s_linear_infinite_reverse] ${isUpsideDown ? 'border-blue-400/50' : 'border-red-500/50'}`} />
                    <div className={`absolute inset-8 rounded-full bg-black/60 backdrop-blur-md border-2 flex items-center justify-center overflow-hidden
                        ${isUpsideDown ? 'border-blue-900 shadow-[0_0_40px_rgba(58,134,255,0.4)]' : 'border-red-900 shadow-[0_0_40px_rgba(231,29,54,0.4)]'}`}
                    >
                        <div className="absolute inset-0 noise opacity-20" />
                        <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
                        <div className={`font-mono text-center text-sm md:text-base z-10 ${isUpsideDown ? 'text-blue-300' : 'text-red-400'}`}>
                            <GlitchText intensity="low">SUBJECT: 011</GlitchText><br />
                            <span className="opacity-70 text-xs mt-2 block">[STATUS: ACTIVE]</span>
                        </div>
                    </div>
                    {/* Glowing orb effect */}
                    <div className={`absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full blur-3xl opacity-20 pointer-events-none
                        ${isUpsideDown ? 'bg-blue-500' : 'bg-red-600'}`}
                    />
                </motion.div>

                {/* Content Container */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left relative z-10">
                    {/* Title Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="mb-8"
                    >
                        <h1 className="font-custom text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-stranger-red tracking-widest leading-none uppercase"
                            style={{ WebkitTextStroke: '2px #E71D36' }}
                        >
                            <GlitchText className="glitch-hero" intensity="medium">
                                {TITLE_TEXT}
                            </GlitchText>
                            <br />
                            {showSubtitle && (
                                <motion.span
                                    className="text-4xl md:text-6xl lg:text-7xl block mt-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <LetterReveal text={SUBTITLE_TEXT} delay={0} />
                                </motion.span>
                            )}
                        </h1>
                    </motion.div>

                    {/* Intro Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.5, duration: 1 }}
                        className="max-w-xl mb-8 space-y-4"
                    >
                        <p className="font-mono text-xl text-gray-300">
                            <span className="text-stranger-red mr-2">&gt;</span>
                            <GlitchText intensity="low">SOFTWARE ENGINEER</GlitchText>
                        </p>
                        <p className="font-mono text-sm md:text-base text-gray-400 leading-relaxed">
                            Creating digital experiences from the <span className="text-white">Right Side up</span> to the <span className="text-stranger-blue">Upside Down</span>.
                        </p>
                    </motion.div>

                    {/* Tech Stack Pills */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 3, duration: 1 }}
                        className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10"
                    >
                        {['Python', 'LangChain', 'React', 'AWS', 'SQL'].map((tech) => (
                            <motion.span
                                key={tech}
                                whileHover={{ scale: 1.1, y: -2 }}
                                className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-colors cursor-default
                                    ${isUpsideDown
                                        ? 'border-blue-500/40 text-blue-300 bg-blue-900/20 hover:bg-blue-500/20 hover:border-blue-400 hover:shadow-[0_0_10px_rgba(58,134,255,0.4)]'
                                        : 'border-red-600/40 text-red-300 bg-red-900/20 hover:bg-red-600/20 hover:border-red-500 hover:shadow-[0_0_10px_rgba(231,29,54,0.4)]'
                                    }`}
                            >
                                {tech}
                            </motion.span>
                        ))}
                    </motion.div>

                    {/* CTA Button with electromagnetic interference */}
                    <motion.button
                        whileHover={{
                            scale: 1.05,
                            x: [0, -2, 2, -1, 1, 0],
                            transition: { x: { duration: 0.4, repeat: Infinity } }
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleUpsideDown}
                        className={`
                            group relative px-6 py-3 bg-transparent border-2
                            font-custom text-lg uppercase tracking-widest transition-all duration-300
                            ${isUpsideDown
                                ? 'border-stranger-blue text-stranger-blue hover:bg-stranger-blue hover:text-black shadow-[0_0_15px_rgba(58,134,255,0.5)]'
                                : 'border-stranger-red text-stranger-red hover:bg-stranger-red hover:text-black shadow-[0_0_15px_rgba(231,29,54,0.5)]'
                            }
                        `}
                    >
                        {/* Button glitch overlay */}
                        <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100"
                            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }}
                        />
                        <span className="relative z-10">
                            {isUpsideDown ? 'RETURN HOME' : 'ENTER THE UPSIDE DOWN'}
                        </span>
                    </motion.button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ y: [0, 10, 0], opacity: 1 }}
                transition={{
                    y: { duration: 2, repeat: Infinity },
                    opacity: { delay: 3, duration: 1 }
                }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/80 z-10"
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-glow">Scroll to explore</span>
                    <motion.div
                        className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1"
                        animate={{ borderColor: ['rgba(255,255,255,0.3)', 'rgba(231,29,54,0.6)', 'rgba(255,255,255,0.3)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <motion.div
                            className="w-1 h-2 bg-white/70 rounded-full"
                            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
