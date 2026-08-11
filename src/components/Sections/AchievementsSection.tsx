import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import GlitchText from '../Effects/GlitchText';
import { Award, Star } from 'lucide-react';

const achievements = [
    {
        id: 'CERT-01',
        title: 'Oracle AI Vector Search Certified Professional',
        issuer: 'Oracle',
        date: 'May 2025',
        type: 'certification',
        link: 'https://drive.google.com/file/d/1U149bOF6rq1GYNK_bqmDXCnyHq32tFeR/view'
    },
    {
        id: 'EXTRA-01',
        title: 'Hackathon Participant -- Eventbrite Internal Hack-AI-Thon',
        issuer: 'Eventbrite',
        date: '2025',
        type: 'extracurricular',
        description: 'Built AI/ML solution under time constraints; collaborated with cross-functional team members',
        link: undefined
    },
    {
        id: 'EXTRA-02',
        title: 'Member, Alumni Relations Team (ART)',
        issuer: 'KMIT',
        date: 'Active',
        type: 'extracurricular',
        description: 'Facilitated alumni-student networking, mentorship programs, and career guidance event coordination',
        link: undefined
    }
];

const AchievementsSection = () => {
    const { isUpsideDown } = useTheme();
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
        <section ref={sectionRef} className="min-h-screen py-20 px-8 relative z-20" id="achievements">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    className="mb-16"
                    initial={{ x: -50, opacity: 0 }}
                    animate={isInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className={`font-custom text-4xl md:text-5xl mb-4 text-glow flex items-center gap-4 ${isUpsideDown ? 'text-blue-400' : 'text-stranger-red'}`}>
                        <GlitchText intensity="low">COMMENDATIONS</GlitchText>
                    </h2>
                    <motion.div
                        className={`h-1 ${isUpsideDown ? 'bg-blue-600' : 'bg-red-600'}`}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: 96 } : {}}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    />
                </motion.div>

                <div className="flex flex-col gap-8">
                    {achievements.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className={`
                                relative p-6 md:p-8 border-2 rounded bg-black/40 backdrop-blur-sm overflow-hidden group
                                flex flex-col md:flex-row gap-6 md:items-center
                                ${isUpsideDown ? 'border-blue-900 hover:border-blue-500' : 'border-red-900 hover:border-stranger-red'}
                                transition-colors duration-300
                            `}
                        >
                            {/* Static overlay */}
                            <div className="absolute inset-0 noise opacity-10 group-hover:opacity-20 transition-opacity" />

                            {/* Border Glow */}
                            <motion.div
                                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                                animate={{
                                    boxShadow: isUpsideDown
                                        ? ['inset 0 0 30px rgba(58,134,255,0)', 'inset 0 0 30px rgba(58,134,255,0.4)', 'inset 0 0 30px rgba(58,134,255,0)']
                                        : ['inset 0 0 30px rgba(231,29,54,0)', 'inset 0 0 30px rgba(231,29,54,0.4)', 'inset 0 0 30px rgba(231,29,54,0)']
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />

                            {/* Left Badge Area */}
                            <div className="shrink-0 flex md:flex-col items-center justify-between md:justify-center md:w-48 relative z-10 md:border-r border-gray-800 md:pr-6">
                                <div className={`p-4 md:p-6 rounded-full border-2 mb-0 md:mb-4 shrink-0 
                                    ${isUpsideDown ? 'border-blue-900 bg-blue-950/50 group-hover:bg-blue-900/40' : 'border-red-900 bg-red-950/50 group-hover:bg-red-900/40'}
                                    transition-colors duration-300
                                `}>
                                    {item.type === 'certification' ? (
                                        <Award size={36} className={isUpsideDown ? 'text-blue-400' : 'text-red-500'} />
                                    ) : (
                                        <Star size={36} className={isUpsideDown ? 'text-blue-400' : 'text-red-500'} />
                                    )}
                                </div>
                                <div className="font-mono text-xs text-gray-500 text-right md:text-center">
                                    <div className="mb-2 font-bold tracking-widest">{item.id}</div>
                                    <div className={`px-3 py-1 border ${isUpsideDown ? 'border-blue-900/50 text-blue-300 bg-blue-900/20' : 'border-red-900/50 text-red-300 bg-red-900/20'}`}>
                                        {item.date}
                                    </div>
                                </div>
                            </div>

                            {/* Right Content Area */}
                            <div className="relative z-10 flex-grow py-2">
                                <h3 className={`font-custom text-2xl md:text-3xl tracking-wide mb-2 ${isUpsideDown ? 'text-blue-300' : 'text-red-400'}`}>
                                    {item.title}
                                </h3>
                                <div className="font-mono text-sm text-gray-400 uppercase tracking-widest mb-4">
                                    ISSUER: <span className="text-gray-200">{item.issuer}</span>
                                </div>
                                {item.description && (
                                    <p className="font-mono text-sm md:text-base text-gray-400 leading-relaxed max-w-2xl">
                                        {item.description}
                                    </p>
                                )}
                                {item.link && (
                                    <div className="mt-6 pt-4">
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest hover:underline transition-colors
                                                ${isUpsideDown ? 'text-blue-400 hover:text-blue-300' : 'text-red-500 hover:text-red-400'}
                                            `}
                                        >
                                            <span className="text-lg">↳</span> [ DECRYPT_CERTIFICATE ]
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AchievementsSection;
