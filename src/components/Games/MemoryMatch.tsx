import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const ICONS = ['👾', '🔦', '📻', '🧇', '🎄', '🔬', '🧪', '🌀'];

interface Card {
    id: number;
    icon: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const MemoryMatch: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { isUpsideDown } = useTheme();
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [timer, setTimer] = useState(0);

    const initGame = useCallback(() => {
        const shuffled = [...ICONS, ...ICONS]
            .sort(() => Math.random() - 0.5)
            .map((icon, i) => ({
                id: i,
                icon,
                isFlipped: false,
                isMatched: false,
            }));
        setCards(shuffled);
        setFlippedIndices([]);
        setMoves(0);
        setMatches(0);
        setIsLocked(false);
        setGameWon(false);
        setGameStarted(false);
        setTimer(0);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    // Timer
    useEffect(() => {
        if (!gameStarted || gameWon) return;
        const interval = setInterval(() => setTimer(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, [gameStarted, gameWon]);

    // Check for win
    useEffect(() => {
        if (matches === ICONS.length && matches > 0) {
            setGameWon(true);
        }
    }, [matches]);

    const handleCardClick = (index: number) => {
        if (isLocked) return;
        if (cards[index].isFlipped || cards[index].isMatched) return;
        if (flippedIndices.includes(index)) return;

        if (!gameStarted) setGameStarted(true);

        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            setIsLocked(true);

            const [first, second] = newFlipped;
            if (cards[first].icon === cards[second].icon) {
                // Match!
                setTimeout(() => {
                    const matched = [...cards];
                    matched[first].isMatched = true;
                    matched[second].isMatched = true;
                    setCards(matched);
                    setMatches(m => m + 1);
                    setFlippedIndices([]);
                    setIsLocked(false);
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    const reset = [...cards];
                    reset[first].isFlipped = false;
                    reset[second].isFlipped = false;
                    setCards(reset);
                    setFlippedIndices([]);
                    setIsLocked(false);
                }, 1000);
            }
        }
    };

    const accentColor = isUpsideDown ? 'blue' : 'red';
    const borderColor = isUpsideDown ? 'border-blue-500' : 'border-red-600';
    const textColor = isUpsideDown ? 'text-blue-400' : 'text-red-500';
    const bgHover = isUpsideDown ? 'hover:bg-blue-900/30' : 'hover:bg-red-900/30';

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 font-mono text-sm">
                <button onClick={onBack} className={`${textColor} hover:underline`}>
                    ← BACK
                </button>
                <div className="flex gap-6 text-gray-400">
                    <span>MOVES: <span className={textColor}>{moves}</span></span>
                    <span>TIME: <span className={textColor}>{timer}s</span></span>
                    <span>MATCHED: <span className={textColor}>{matches}/{ICONS.length}</span></span>
                </div>
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-4 gap-3">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.id}
                        className={`
                            aspect-square rounded-lg cursor-pointer border-2 transition-all duration-200
                            flex items-center justify-center text-3xl md:text-4xl select-none
                            ${card.isMatched
                                ? `${borderColor} bg-${accentColor}-900/20 shadow-[0_0_15px_rgba(${isUpsideDown ? '58,134,255' : '231,29,54'},0.3)]`
                                : card.isFlipped
                                    ? `${borderColor} bg-gray-800`
                                    : `border-gray-700 bg-gray-900 ${bgHover}`
                            }
                        `}
                        onClick={() => handleCardClick(index)}
                        whileHover={!card.isFlipped && !card.isMatched ? { scale: 1.05 } : {}}
                        whileTap={!card.isFlipped && !card.isMatched ? { scale: 0.95 } : {}}
                        initial={{ rotateY: 0 }}
                        animate={card.isMatched ? {
                            scale: [1, 1.1, 1],
                            transition: { duration: 0.3 }
                        } : {}}
                    >
                        <AnimatePresence mode="wait">
                            {card.isFlipped || card.isMatched ? (
                                <motion.span
                                    key="icon"
                                    initial={{ scale: 0, rotateY: 90 }}
                                    animate={{ scale: 1, rotateY: 0 }}
                                    exit={{ scale: 0, rotateY: -90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {card.icon}
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="back"
                                    className={`text-lg font-bold ${textColor} opacity-30`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                >
                                    ?
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Win Screen */}
            <AnimatePresence>
                {gameWon && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 text-center space-y-4"
                    >
                        <motion.p
                            className={`text-2xl font-custom ${textColor}`}
                            animate={{ textShadow: [`0 0 10px rgba(${isUpsideDown ? '58,134,255' : '231,29,54'},0.5)`, `0 0 30px rgba(${isUpsideDown ? '58,134,255' : '231,29,54'},0.8)`, `0 0 10px rgba(${isUpsideDown ? '58,134,255' : '231,29,54'},0.5)`] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            ✦ EXPERIMENT COMPLETE ✦
                        </motion.p>
                        <p className="font-mono text-gray-400 text-sm">
                            Solved in {moves} moves | {timer} seconds
                        </p>
                        <button
                            onClick={initGame}
                            className={`font-mono text-sm px-6 py-2 border ${borderColor} ${textColor} hover:bg-${accentColor}-500 hover:text-black transition-all`}
                        >
                            RETRY EXPERIMENT
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Restart */}
            {!gameWon && gameStarted && (
                <div className="mt-6 text-center">
                    <button
                        onClick={initGame}
                        className="font-mono text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        [RESET]
                    </button>
                </div>
            )}
        </div>
    );
};

export default MemoryMatch;
