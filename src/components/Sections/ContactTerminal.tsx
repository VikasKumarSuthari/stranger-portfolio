import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Send, Terminal } from 'lucide-react';

const ASCII_ART = `
 ██╗  ██╗ █████╗ ██╗    ██╗██╗  ██╗██╗███╗   ██╗███████╗
 ██║  ██║██╔══██╗██║    ██║██║ ██╔╝██║████╗  ██║██╔════╝
 ███████║███████║██║ █╗ ██║█████╔╝ ██║██╔██╗ ██║███████╗
 ██╔══██║██╔══██║██║███╗██║██╔═██╗ ██║██║╚██╗██║╚════██║
 ██║  ██║██║  ██║╚███╔███╔╝██║  ██╗██║██║ ╚████║███████║
 ╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝
   C O M M S   T E R M I N A L   v3.1.1
`;

const INIT_MESSAGES = [
    '> INITIALIZING COMMS CHANNEL...',
    '> ESTABLISHING SECURE LINK...',
    '> ENCRYPTION: AES-256-HAWKINS',
    '> CONNECTION ESTABLISHED.',
    '> --------------------------------',
    '> CONTACT DIRECTORY:',
    '> PHONE: +91 8639933624',
    '> EMAIL: vikaskumarsuthari@gmail.com',
    '> GITHUB: github.com/VikasKumarSuthari',
    '> LINKEDIN: linkedin.com/in/vikaskumar-suthari/',
    '> --------------------------------',
    '> STATUS: AWAITING TRANSMISSION_',
];

const TerminalLine: React.FC<{
    text: string;
    delay: number;
    speed?: number;
    isUpsideDown: boolean;
    onComplete?: () => void;
}> = ({ text, delay, speed = 25, isUpsideDown, onComplete }) => {
    const [displayText, setDisplayText] = useState('');
    const [started, setStarted] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const startTimer = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(startTimer);
    }, [delay]);

    useEffect(() => {
        if (!started) return;
        let i = 0;
        const interval = setInterval(() => {
            if (i <= text.length) {
                setDisplayText(text.slice(0, i));
                i++;
            } else {
                clearInterval(interval);
                setCompleted(true);
                onComplete?.();
            }
        }, speed);
        return () => clearInterval(interval);
    }, [started, text, speed, onComplete]);

    if (!started) return null;

    return (
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`font-mono text-sm ${isUpsideDown ? 'text-blue-400' : 'text-green-500'}`}
        >
            {displayText}
            {!completed && <span className="animate-blink">█</span>}
        </motion.p>
    );
};

import { pushToDataLayer } from '../../utils/analytics';

const ContactTerminal = () => {
    const { isUpsideDown } = useTheme();
    const [formState, setFormState] = useState({ name: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [showStatic, setShowStatic] = useState(false);
    const [initComplete, setInitComplete] = useState(false);
    const [completedLines, setCompletedLines] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        pushToDataLayer('contact_submit', {
            contact_name: formState.name
        });
        setShowStatic(true);
        setTimeout(() => {
            setShowStatic(false);
            setSubmitted(true);
        }, 1000);
    };

    useEffect(() => {
        if (completedLines >= INIT_MESSAGES.length) {
            setInitComplete(true);
        }
    }, [completedLines]);

    return (
        <section id="contact" className="min-h-screen flex items-center justify-center p-8 relative z-20">
            <div ref={ref} className={`
                w-full max-w-2xl border-2 rounded-lg relative overflow-hidden
                ${isUpsideDown ? 'bg-slate-900 border-blue-500' : 'bg-black border-green-500'}
            `}>
                {/* Terminal header bar */}
                <div className={`flex items-center gap-2 px-4 py-2 border-b ${isUpsideDown ? 'border-blue-800 bg-blue-950/50' : 'border-green-900 bg-green-950/50'}`}>
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className={`flex items-center gap-2 font-mono text-xs ${isUpsideDown ? 'text-blue-400' : 'text-green-500'}`}>
                        <Terminal size={12} />
                        hawkins-comms-terminal
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {/* ASCII Art Header */}
                    {inView && (
                        <motion.pre
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className={`font-mono text-[5px] md:text-[7px] leading-tight mb-6 overflow-hidden select-none ${isUpsideDown ? 'text-blue-600' : 'text-green-800'}`}
                        >
                            {ASCII_ART}
                        </motion.pre>
                    )}

                    {/* Scanline for terminal feel */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
                        }}
                    />

                    {/* Random interference lines */}
                    <InterferenceLines isUpsideDown={isUpsideDown} />

                    {/* Typewriter init messages */}
                    <div className="space-y-1 mb-8">
                        {inView && INIT_MESSAGES.map((msg, i) => (
                            <TerminalLine
                                key={i}
                                text={msg}
                                delay={i * 800}
                                speed={20}
                                isUpsideDown={isUpsideDown}
                                onComplete={() => setCompletedLines(prev => prev + 1)}
                            />
                        ))}
                    </div>

                    {/* Static overlay on submit */}
                    <AnimatePresence>
                        {showStatic && (
                            <motion.div
                                className="absolute inset-0 z-50 noise-heavy"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.8 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                    </AnimatePresence>

                    {/* Submitted state */}
                    <AnimatePresence>
                        {submitted ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`font-mono text-center py-8 space-y-4 ${isUpsideDown ? 'text-blue-400' : 'text-green-500'}`}
                            >
                                <motion.p
                                    className="text-2xl font-bold"
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    ✓ TRANSMISSION COMPLETE
                                </motion.p>
                                <p className="text-sm opacity-70">
                                    Message received at Hawkins National Laboratory.
                                </p>
                                <button
                                    onClick={() => { setSubmitted(false); setFormState({ name: '', message: '' }); }}
                                    className={`text-sm underline underline-offset-4 opacity-60 hover:opacity-100 transition-opacity`}
                                >
                                    [SEND ANOTHER]
                                </button>
                            </motion.div>
                        ) : (
                            <AnimatePresence>
                                {initComplete && (
                                    <motion.form
                                        id="getintouch"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-6 relative z-10"
                                    >
                                        <div>
                                            <label className={`block font-mono text-sm mb-2 uppercase tracking-widest opacity-70 ${isUpsideDown ? 'text-blue-400' : 'text-green-500'}`}>
                                                Identity
                                            </label>
                                            <input
                                                type="text"
                                                value={formState.name}
                                                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                                className={`
                                                    w-full bg-transparent border-b-2 outline-none py-2 font-mono transition-colors
                                                    ${isUpsideDown
                                                        ? 'border-blue-900 focus:border-blue-500 text-blue-100 placeholder-blue-900'
                                                        : 'border-green-900 focus:border-green-500 text-green-100 placeholder-green-900'
                                                    }
                                                `}
                                                placeholder="ENTER NAME"
                                            />
                                        </div>

                                        <div>
                                            <label className={`block font-mono text-sm mb-2 uppercase tracking-widest opacity-70 ${isUpsideDown ? 'text-blue-400' : 'text-green-500'}`}>
                                                Transmission
                                            </label>
                                            <textarea
                                                value={formState.message}
                                                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                                rows={4}
                                                className={`
                                                    w-full bg-transparent border-b-2 outline-none py-2 font-mono transition-colors resize-none
                                                    ${isUpsideDown
                                                        ? 'border-blue-900 focus:border-blue-500 text-blue-100 placeholder-blue-900'
                                                        : 'border-green-900 focus:border-green-500 text-green-100 placeholder-green-900'
                                                    }
                                                `}
                                                placeholder="TYPE MESSAGE..."
                                            />
                                        </div>

                                        <motion.button
                                            type="submit"
                                            whileHover={{
                                                scale: 1.02,
                                                boxShadow: isUpsideDown
                                                    ? '0 0 20px rgba(58,134,255,0.5)'
                                                    : '0 0 20px rgba(0,255,0,0.3)',
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`
                                                flex items-center gap-2 px-6 py-3 font-mono text-sm uppercase tracking-widest transition-all
                                                ${isUpsideDown
                                                    ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-500 hover:text-black border border-blue-500'
                                                    : 'bg-green-900/20 text-green-500 hover:bg-green-500 hover:text-black border border-green-500'
                                                }
                                            `}
                                        >
                                            <Send size={16} /> SEND TRANSMISSION
                                        </motion.button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

// Random interference lines component
const InterferenceLines: React.FC<{ isUpsideDown: boolean }> = ({ isUpsideDown }) => {
    const [lines, setLines] = useState<{ top: number; opacity: number; key: number }[]>([]);

    useEffect(() => {
        let counter = 0;
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                counter++;
                const newLine = {
                    top: Math.random() * 100,
                    opacity: Math.random() * 0.3 + 0.1,
                    key: counter,
                };
                setLines(prev => [...prev.slice(-3), newLine]);
                setTimeout(() => {
                    setLines(prev => prev.filter(l => l.key !== newLine.key));
                }, 150);
            }
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {lines.map(line => (
                <div
                    key={line.key}
                    className="absolute left-0 w-full h-[1px] pointer-events-none z-20"
                    style={{
                        top: `${line.top}%`,
                        opacity: line.opacity,
                        background: isUpsideDown
                            ? 'linear-gradient(90deg, transparent, rgba(58,134,255,0.5), transparent)'
                            : 'linear-gradient(90deg, transparent, rgba(0,255,0,0.5), transparent)',
                    }}
                />
            ))}
        </>
    );
};

export default ContactTerminal;
