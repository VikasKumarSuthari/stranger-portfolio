import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import GlitchText from '../Effects/GlitchText';

const experiences = [
    {
        id: 1,
        company: 'Sanofi',
        role: 'Intern -- Web Operations Team',
        date: 'Jan 2026 -- Present',
        description: [
            'Wrote Python scripts for automated data extraction, transformation, and reporting workflows, following team coding standards and delivering clean, documented code',
            'Implemented data collection and analytics pipelines using Google Tag Manager and Google Analytics 4 to track web performance metrics across multiple production sites',
            'Performed data validation and quality checks on crawled web data -- identifying duplicates, missing values, and reconciliation issues to improve data integrity',
            'Designed an internal web auditing tool generating actionable data reports on site health, reducing manual QA effort through automation'
        ],
        technologies: ['Python', 'Google Tag Manager', 'GA4', 'Data Pipelines', 'Automation']
    },
    {
        id: 2,
        company: 'Eventbrite',
        role: 'Software Engineer Intern -- Creator Acquisition Team',
        date: 'Jul 2025 -- Jan 2026',
        description: [
            'Developed full-stack features integrating RESTful APIs and JSON payloads with CMS data, applying data transformations and validation logic across backend services',
            'Debugged and resolved bulk-upload data defects that corrupted historical records, performing data reconciliation to restore integrity and streamline content pipelines',
            'Modernized CI/CD pipelines by upgrading Python services to 3.12, resolving dependency conflicts in AWS CodeBuild, and migrating static analysis tooling -- reducing build failures',
            'Optimized AWS cloud infrastructure by tightening CloudWatch log-retention policies, fixing alarm configurations, and documenting operational procedures',
            'Collaborated in Agile sprints with daily stand-ups and task boards; used Git/GitHub for all code updates, version control, pull requests, and code reviews'
        ],
        technologies: ['Python 3.12', 'RESTful APIs', 'AWS CodeBuild', 'CloudWatch', 'Agile/Git']
    }
];

const ExperienceSection = () => {
    const { isUpsideDown } = useTheme();
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
        <section ref={sectionRef} className="min-h-screen py-20 px-8 relative z-20" id="experience">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    className="mb-16"
                    initial={{ x: -50, opacity: 0 }}
                    animate={isInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className={`font-custom text-4xl md:text-5xl mb-4 text-glow ${isUpsideDown ? 'text-blue-400' : 'text-stranger-red'}`}>
                        <GlitchText intensity="low">FIELD_OPERATIONS</GlitchText>
                    </h2>
                    <motion.div
                        className={`h-1 ${isUpsideDown ? 'bg-blue-600' : 'bg-red-600'}`}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: 96 } : {}}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    />
                </motion.div>

                <div className={`space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] 
                    ${isUpsideDown ? 'before:bg-blue-900/50 before:shadow-[0_0_15px_rgba(58,134,255,0.5)]' : 'before:bg-red-900/50 before:shadow-[0_0_15px_rgba(231,29,54,0.5)]'}
                `}>
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                        >
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${isUpsideDown ? 'bg-slate-900 border-blue-500 shadow-[0_0_15px_rgba(58,134,255,0.6)]' : 'bg-black border-stranger-red shadow-[0_0_15px_rgba(231,29,54,0.6)]'
                                }`}>
                                <div className={`w-3 h-3 rounded-full ${isUpsideDown ? 'bg-blue-400' : 'bg-red-500'}`} />
                            </div>

                            <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded border bg-black/50 backdrop-blur-md relative
                                ${isUpsideDown ? 'border-blue-900/50 hover:border-blue-500 shadow-lg' : 'border-red-900/50 hover:border-red-600 shadow-lg'}
                                transition-all duration-300
                            `}>
                                {/* Document styling */}
                                <div className="absolute top-0 right-0 p-2 opacity-50 font-mono text-xs">
                                    DOC-{exp.id.toString().padStart(3, '0')}
                                </div>

                                <h3 className={`font-custom text-2xl mb-1 ${isUpsideDown ? 'text-blue-300' : 'text-red-400'}`}>
                                    {exp.company}
                                </h3>
                                <div className="font-mono text-sm uppercase tracking-widest text-gray-400 mb-2">
                                    {exp.role}
                                </div>
                                <div className={`font-mono text-xs mb-4 inline-block px-2 py-1 border ${isUpsideDown ? 'border-blue-800/50 text-blue-200 bg-blue-900/20' : 'border-red-900/50 text-red-200 bg-red-900/20'
                                    }`}>
                                    {exp.date}
                                </div>

                                <ul className="space-y-3 mt-4 text-gray-300 font-mono text-sm leading-relaxed list-none p-0">
                                    {exp.description.map((item, i) => (
                                        <li key={i} className="flex gap-3">
                                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${isUpsideDown ? 'bg-blue-500' : 'bg-red-600'}`} />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6 pt-4 border-t border-gray-800/50 flex flex-wrap gap-2">
                                    {exp.technologies.map(tech => (
                                        <span key={tech} className={`font-mono text-xs px-2 py-1 rounded border ${isUpsideDown ? 'border-blue-800/50 text-blue-300 bg-blue-900/20' : 'border-red-900/50 text-red-300 bg-red-900/20'}`}>
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExperienceSection;
