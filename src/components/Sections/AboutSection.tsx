import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import ChristmasLights from '../Effects/ChristmasLights';

const RedactedText: React.FC<{ children: string; className?: string }> = ({ children, className = '' }) => {
    const [revealed, setRevealed] = useState(false);

    return (
        <span
            className={`relative cursor-pointer transition-all duration-500 ${className}`}
            onClick={() => setRevealed(!revealed)}
            onMouseEnter={() => setRevealed(true)}
            onMouseLeave={() => setRevealed(false)}
        >
            <span className={`transition-all duration-500 ${revealed ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}>
                {children}
            </span>
            <span
                className={`absolute inset-0 transition-all duration-500 select-none ${revealed ? 'opacity-0' : 'opacity-100'}`}
                style={{ color: 'transparent', background: '#333', WebkitBackgroundClip: 'text' }}
            >
                {'█'.repeat(children.length)}
            </span>
        </span>
    );
};

const TypewriterText: React.FC<{ text: string; delay?: number; speed?: number }> = ({
    text, delay = 0, speed = 40
}) => {
    const [displayText, setDisplayText] = useState('');
    const [started, setStarted] = useState(false);
    const ref = React.useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        const startTimer = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(startTimer);
    }, [inView, delay]);

    useEffect(() => {
        if (!started) return;
        let i = 0;
        const interval = setInterval(() => {
            if (i <= text.length) {
                setDisplayText(text.slice(0, i));
                i++;
            } else {
                clearInterval(interval);
            }
        }, speed);
        return () => clearInterval(interval);
    }, [started, text, speed]);

    return (
        <span ref={ref}>
            {displayText}
            {started && displayText.length < text.length && (
                <span className="animate-blink">█</span>
            )}
        </span>
    );
};

const StatCard: React.FC<{ number: number; label: string }> = ({ number, label }) => {
    const { isUpsideDown } = useTheme();
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className={`flex flex-col items-center justify-center p-4 md:p-6 border-2 rounded bg-black/40 backdrop-blur-sm
                ${isUpsideDown ? 'border-blue-900 shadow-[0_0_15px_rgba(58,134,255,0.2)]' : 'border-red-900 shadow-[0_0_15px_rgba(231,29,54,0.2)]'}
            `}
        >
            <span className={`font-custom text-5xl md:text-6xl mb-2 ${isUpsideDown ? 'text-blue-400' : 'text-stranger-red'}`}>
                {number}
            </span>
            <span className="font-mono text-xs text-gray-400 uppercase tracking-widest text-center">
                {label}
            </span>
        </motion.div>
    );
};

const ExpertiseCard: React.FC<{ title: string; skills: string[] }> = ({ title, skills }) => {
    const { isUpsideDown } = useTheme();
    return (
        <div className={`p-6 border rounded bg-black/20 ${isUpsideDown ? 'border-blue-900/50 hover:bg-blue-900/20' : 'border-red-900/50 hover:bg-red-900/20'} transition-colors`}>
            <h4 className={`font-mono text-sm uppercase tracking-widest mb-4 ${isUpsideDown ? 'text-blue-300' : 'text-red-400'}`}>
                [ {title} ]
            </h4>
            <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                    <span key={skill} className={`font-mono text-xs px-2 py-1 rounded border ${isUpsideDown ? 'border-blue-800 text-blue-200' : 'border-red-800 text-red-200'} bg-black/40`}>
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
};

const AboutSection = () => {
    const { isUpsideDown } = useTheme();
    const stampRef = React.useRef(null);
    const stampInView = useInView(stampRef, { once: true });
    const [rotation] = useState(() => -12 + Math.random() * 8);

    return (
        <section className="min-h-screen flex flex-col items-center justify-center p-8 relative z-20">
            {/* Christmas Lights */}
            <div className="w-full max-w-5xl mb-8">
                <ChristmasLights />
            </div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`
                    max-w-4xl w-full p-8 md:p-12 border-4 rounded-sm shadow-2xl relative
                    ${isUpsideDown
                        ? 'bg-slate-900 border-stranger-blue text-blue-100 shadow-[0_0_30px_rgba(58,134,255,0.2)]'
                        : 'bg-[#f0e6d2] border-gray-800 text-gray-900'
                    }
                `}
            >
                {/* Paper Texture Overlay if normal mode */}
                {!isUpsideDown && (
                    <div className="absolute inset-0 bg-[#f0e6d2] opacity-50 pointer-events-none mix-blend-multiply"
                        style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, #00000005 2px, #00000005 4px)' }}
                    />
                )}

                {/* Confidential Stamp with slap animation */}
                <motion.div
                    ref={stampRef}
                    initial={{ scale: 3, rotate: -45, opacity: 0 }}
                    animate={stampInView ? {
                        scale: 1,
                        rotate: rotation,
                        opacity: 0.8,
                    } : {}}
                    transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 15,
                        delay: 0.5,
                    }}
                    className={`
                        absolute top-8 right-8 border-4 px-4 py-1 text-2xl font-black uppercase tracking-widest select-none
                        ${isUpsideDown ? 'border-red-600 text-red-600' : 'border-red-700 text-red-700'}
                    `}
                >
                    Confidential
                </motion.div>

                <div className="relative z-10 flex flex-col gap-12">
                    {/* Top Section: Intro & Stats */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div className="font-mono space-y-6">
                            <h2 className={`text-4xl font-bold uppercase tracking-tighter border-b-2 pb-2 ${isUpsideDown ? 'border-blue-500' : 'border-black'}`}>
                                The Hawkins Files
                            </h2>

                            <div className="space-y-4 text-sm md:text-base leading-relaxed">
                                <p><strong>SUBJECT:</strong> VIKAS KUMAR SUTHARI</p>
                                <p><strong>ROLE:</strong> SOFTWARE ENGINEER</p>
                                <p>
                                    <strong>LOCATION:</strong>{' '}
                                    <RedactedText>HYDERABAD, INDIA</RedactedText>
                                </p>
                                <p>
                                    <strong>CLEARANCE:</strong>{' '}
                                    <RedactedText>LEVEL 11 — OMEGA</RedactedText>
                                </p>
                                <p><strong>SUMMARY:</strong></p>
                                <p className="min-h-[100px]">
                                    <TypewriterText
                                        text="B.Tech Computer Science undergraduate at KMIT with hands-on experience in Python, SQL, and data pipelines. Built GenAI chatbot apps using LangChain and vector databases. Currently interning at Sanofi and previously at Eventbrite."
                                        delay={800}
                                        speed={30}
                                    />
                                </p>
                            </div>
                        </div>

                        {/* Stats Dashboard */}
                        <div className="grid grid-cols-2 gap-4 h-full">
                            <StatCard number={3} label="Projects Built" />
                            <StatCard number={2} label="Internships" />
                            <StatCard number={1} label="Hackathons Won" />
                            <StatCard number={1} label="Certifications" />
                        </div>
                    </div>

                    {/* Bottom Section: Expertise Grid */}
                    <div className={`space-y-6 border-t font-mono pt-8 ${isUpsideDown ? 'border-blue-900/50' : 'border-red-900/30'}`}>
                        <h3 className={`text-2xl font-bold uppercase tracking-widest ${isUpsideDown ? 'text-blue-500' : 'text-red-700'}`}>
                            CLASSIFIED_SKILLSETS
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <ExpertiseCard title="Programming" skills={['Python', 'SQL', 'C++', 'Java']} />
                            <ExpertiseCard title="Data & Analytics" skills={['Pandas', 'NumPy', 'Google Analytics', 'Google Tag Manager']} />
                            <ExpertiseCard title="AI / ML / GenAI" skills={['LangChain', 'PyTorch', 'TensorFlow', 'scikit-learn', 'Hugging Face']} />
                            <ExpertiseCard title="Cloud & Web" skills={['AWS', 'Docker', 'CI/CD', 'React.js', 'Next.js', 'Flask', 'Node.js']} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default AboutSection;
