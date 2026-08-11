import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Gamepad2, Brain, Zap } from 'lucide-react';
import GlitchText from '../Effects/GlitchText';
import MemoryMatch from '../Games/MemoryMatch';
import DemogorgonDodge from '../Games/DemogorgonDodge';

type GameId = 'memory' | 'dodge' | null;

const games = [
    {
        id: 'memory' as const,
        title: 'MIND MATCH',
        subtitle: 'EXPERIMENT 011',
        description: 'Test your psychic memory. Match the anomaly pairs before time runs out.',
        icon: Brain,
        difficulty: 'MEDIUM',
    },
    {
        id: 'dodge' as const,
        title: 'DEMOGORGON DODGE',
        subtitle: 'EXPERIMENT 012',
        description: 'Survive the Upside Down. Dodge the Demogorgons for as long as you can.',
        icon: Zap,
        difficulty: 'HARD',
    },
];

const GamesSection: React.FC = () => {
    const { isUpsideDown } = useTheme();
    const [activeGame, setActiveGame] = useState<GameId>(null);

    const textColor = isUpsideDown ? 'text-blue-400' : 'text-red-500';
    const borderColor = isUpsideDown ? 'border-blue-500' : 'border-red-600';
    const accentRgb = isUpsideDown ? '58, 134, 255' : '231, 29, 54';

    return (
        <section className="min-h-screen py-20 px-8 relative z-20">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="mb-16"
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className={`font-custom text-4xl md:text-5xl ${textColor} mb-4 text-glow flex items-center gap-4`}>
                        <Gamepad2 className="inline" size={40} />
                        <GlitchText intensity="low">HAWKINS_ARCADE</GlitchText>
                    </h2>
                    <motion.div
                        className={`h-1 ${isUpsideDown ? 'bg-blue-600' : 'bg-red-600'}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: 96 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    />
                    <p className="font-mono text-sm text-gray-500 mt-4">
                        &gt; INSERT COIN TO PLAY... OR JUST CLICK_
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {activeGame === null ? (
                        /* Arcade Cabinet Selection */
                        <motion.div
                            key="selector"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {games.map((game, i) => {
                                const Icon = game.icon;
                                return (
                                    <motion.div
                                        key={game.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.2, duration: 0.5 }}
                                        onClick={() => setActiveGame(game.id)}
                                        className={`
                                            group relative cursor-pointer border-2 ${borderColor} rounded-lg p-8
                                            bg-black/40 backdrop-blur-sm overflow-hidden
                                            transition-all duration-500
                                            hover:shadow-[0_0_30px_rgba(${accentRgb},0.3)]
                                        `}
                                    >
                                        {/* Scan effect on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent 
                                            opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                            group-hover:animate-[scan_2s_linear_infinite]"
                                            style={{
                                                backgroundSize: '100% 200%',
                                            }}
                                        />

                                        {/* CRT line overlay */}
                                        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity"
                                            style={{
                                                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                                            }}
                                        />

                                        {/* Arcade cabinet top */}
                                        <div className="flex items-start justify-between mb-6 relative z-10">
                                            <div>
                                                <p className="font-mono text-xs text-gray-600 mb-1">{game.subtitle}</p>
                                                <h3 className={`font-custom text-2xl md:text-3xl ${textColor} transition-all duration-300 group-hover:tracking-wider`}>
                                                    {game.title}
                                                </h3>
                                            </div>
                                            <motion.div
                                                className={`p-3 rounded-lg border ${borderColor} ${isUpsideDown ? 'bg-blue-950/50' : 'bg-red-950/50'}`}
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <Icon size={28} className={textColor} />
                                            </motion.div>
                                        </div>

                                        <p className="font-mono text-sm text-gray-400 leading-relaxed mb-6 relative z-10">
                                            {game.description}
                                        </p>

                                        <div className="flex items-center justify-between relative z-10">
                                            <span className={`font-mono text-xs px-3 py-1 rounded border ${borderColor} ${textColor} bg-black/40`}>
                                                DIFFICULTY: {game.difficulty}
                                            </span>
                                            <motion.span
                                                className={`font-mono text-sm ${textColor} opacity-0 group-hover:opacity-100 transition-opacity`}
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                PLAY →
                                            </motion.span>
                                        </div>

                                        {/* Bottom neon line */}
                                        <motion.div
                                            className={`absolute bottom-0 left-0 h-[2px] ${isUpsideDown ? 'bg-blue-500' : 'bg-red-600'}`}
                                            initial={{ width: '0%' }}
                                            whileHover={{ width: '100%' }}
                                            transition={{ duration: 0.4 }}
                                            style={{
                                                boxShadow: `0 0 10px rgba(${accentRgb}, 0.6)`,
                                            }}
                                        />
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : activeGame === 'memory' ? (
                        <motion.div
                            key="memory"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <MemoryMatch onBack={() => setActiveGame(null)} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="dodge"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <DemogorgonDodge onBack={() => setActiveGame(null)} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default GamesSection;
