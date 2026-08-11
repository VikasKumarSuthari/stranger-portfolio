import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { ExternalLink, Github } from 'lucide-react';
import GlitchText from '../Effects/GlitchText';
import { pushToDataLayer } from '../../utils/analytics';
const projects = [
    {
        id: 1,
        title: 'Mech AI Chatbot',
        description: 'RAG chatbot using LangChain, Pinecone vector DB, and Llama 3.2 LLM.',
        tags: ['Python', 'LangChain', 'Flask', 'Pinecone'],
        category: 'AI/ML',
        link: '#',
        github: 'https://github.com/VikasKumarSuthari'
    },
    {
        id: 2,
        title: 'Venue Predictor',
        description: 'ML pipeline using scikit-learn for event venue recommendation.',
        tags: ['Python', 'scikit-learn', 'Pandas'],
        category: 'AI/ML',
        link: '#',
        github: 'https://github.com/VikasKumarSuthari'
    },
    {
        id: 3,
        title: 'Swaastha',
        description: 'AI-Powered Multi-Disease Health Screening Platform using Gemini API.',
        tags: ['Python', 'TensorFlow', 'React', 'MongoDB'],
        category: 'Web',
        link: '#',
        github: 'https://github.com/VikasKumarSuthari'
    }
];

interface HolographicCardProps {
    children: React.ReactNode;
    className?: string;
    index: number;
}

const HolographicCard: React.FC<HolographicCardProps> = ({ children, className = '', index }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
    const [glare, setGlare] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        setTransform({
            rotateX: (y - 0.5) * -20,
            rotateY: (x - 0.5) * 20,
        });
        setGlare({ x: x * 100, y: y * 100 });
    };

    const handleMouseLeave = () => {
        setTransform({ rotateX: 0, rotateY: 0 });
        setIsHovered(false);
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className={`relative ${className}`}
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                animate={{
                    rotateX: transform.rotateX,
                    rotateY: transform.rotateY,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative w-full h-full"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Holographic rainbow glare */}
                <div
                    className="absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300 z-10 pointer-events-none"
                    style={{
                        opacity: isHovered ? 0.15 : 0,
                        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, 
                            rgba(255, 0, 0, 0.4), 
                            rgba(255, 165, 0, 0.3), 
                            rgba(255, 255, 0, 0.2), 
                            rgba(0, 255, 0, 0.3), 
                            rgba(0, 0, 255, 0.4), 
                            rgba(148, 0, 211, 0.3), 
                            transparent 70%)`,
                    }}
                />
                {children}
            </motion.div>
        </motion.div>
    );
};

const ProjectGrid = () => {
    const { isUpsideDown } = useTheme();
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true });
    const [activeFilter, setActiveFilter] = useState('All');

    const categories = ['All', 'AI/ML', 'Web'];
    const filteredProjects = projects.filter(p => activeFilter === 'All' || p.category === activeFilter);

    return (
        <section ref={sectionRef} className="min-h-screen py-20 px-8 relative z-20">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    className="mb-16"
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="font-custom text-4xl md:text-5xl text-stranger-red mb-4 text-glow">
                        <GlitchText intensity="low">LAB_EXPERIMENTS</GlitchText>
                    </h2>
                    <motion.div
                        className="h-1 bg-red-600"
                        initial={{ width: 0 }}
                        whileInView={{ width: 96 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    />
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center md:justify-start gap-4 mb-12"
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => {
                                setActiveFilter(category);
                                pushToDataLayer('project_filter', { filter_category: category });
                            }}
                            className={`font-mono text-sm px-6 py-2 rounded uppercase tracking-widest transition-all duration-300 border-2
                                ${activeFilter === category
                                    ? (isUpsideDown ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(58,134,255,0.4)]' : 'bg-red-600/20 border-red-600 text-red-300 shadow-[0_0_15px_rgba(231,29,54,0.4)]')
                                    : (isUpsideDown ? 'bg-transparent border-blue-900/50 text-blue-500 hover:border-blue-700' : 'bg-transparent border-red-900/50 text-red-700 hover:border-red-700')
                                }
                            `}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project, index) => (
                        <HolographicCard key={project.id} index={index}>
                            <div className={`
                                group relative p-6 border-l-4 overflow-hidden transition-all duration-500 h-full
                                ${isUpsideDown
                                    ? 'bg-slate-900/80 border-l-blue-500 hover:shadow-[0_0_30px_rgba(58,134,255,0.4)]'
                                    : 'bg-gray-900/80 border-l-red-600 hover:shadow-[0_0_30px_rgba(231,29,54,0.4)]'
                                }
                            `}>
                                {/* Card Background Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Animated border glow */}
                                <motion.div
                                    className="absolute inset-0 pointer-events-none"
                                    animate={{
                                        boxShadow: isUpsideDown
                                            ? ['inset 0 0 0 1px rgba(58,134,255,0)', 'inset 0 0 0 1px rgba(58,134,255,0.3)', 'inset 0 0 0 1px rgba(58,134,255,0)']
                                            : ['inset 0 0 0 1px rgba(231,29,54,0)', 'inset 0 0 0 1px rgba(231,29,54,0.3)', 'inset 0 0 0 1px rgba(231,29,54,0)'],
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                                />

                                {/* Tape Label */}
                                <div className="absolute top-0 right-0 p-2 opacity-50 font-mono text-xs">
                                    EXP-00{project.id}
                                </div>

                                {/* Static noise flash on hover */}
                                <div className="absolute inset-0 noise opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none" />

                                <h3 className={`font-custom text-2xl mb-4 ${isUpsideDown ? 'text-blue-400' : 'text-red-500'}`}>
                                    <GlitchText intensity="low">{project.title}</GlitchText>
                                </h3>

                                <p className="font-mono text-sm text-gray-400 mb-6 leading-relaxed">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map(tag => (
                                        <motion.span
                                            key={tag}
                                            className={`text-xs font-mono px-2 py-1 rounded border ${isUpsideDown
                                                ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                                                : 'bg-red-500/10 text-red-300 border-red-500/20'
                                                }`}
                                            whileHover={{
                                                scale: 1.1,
                                                boxShadow: isUpsideDown
                                                    ? '0 0 10px rgba(58,134,255,0.4)'
                                                    : '0 0 10px rgba(231,29,54,0.4)',
                                            }}
                                        >
                                            {tag}
                                        </motion.span>
                                    ))}
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-gray-800">
                                    <motion.a
                                        href={project.github}
                                        className="flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-white transition-colors"
                                        whileHover={{ x: 3 }}
                                    >
                                        <Github size={16} /> CODE
                                    </motion.a>
                                    <motion.a
                                        href={project.link}
                                        className="flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-white transition-colors"
                                        whileHover={{ x: 3 }}
                                    >
                                        <ExternalLink size={16} /> DEMO
                                    </motion.a>
                                </div>
                            </div>
                        </HolographicCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectGrid;
