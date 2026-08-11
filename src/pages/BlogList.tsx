import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { posts } from '../data/posts';
import { useSoundEffects } from '../components/Audio/SoundManager';

const BlogList = () => {
    const { isUpsideDown } = useTheme();
    const { playHover, playClick } = useSoundEffects();

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto relative z-20 font-mono">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="flex items-center gap-4 mb-12">
                    <h1 className={`text-4xl md:text-5xl font-bold uppercase tracking-widest ${isUpsideDown ? 'text-blue-500' : 'text-stranger-red'}`}>
                        Hawkins Lab Archives
                    </h1>
                    <div className={`h-[2px] flex-grow ${isUpsideDown ? 'bg-blue-900' : 'bg-red-900'}`} />
                </div>

                <div className="space-y-8">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-6 border border-opacity-30 rounded-lg group transition-all duration-300
                                ${isUpsideDown ? 'border-blue-500 hover:bg-blue-900/20' : 'border-stranger-red hover:bg-stranger-red/10'}
                            `}
                        >
                            <Link
                                to={`/blog/${post.slug}`}
                                onClick={playClick}
                                onMouseEnter={playHover}
                                className="block"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className={`text-2xl font-bold group-hover:text-white transition-colors duration-300 ${isUpsideDown ? 'text-blue-400' : 'text-red-400'}`}>
                                        {post.title}
                                    </h2>
                                    <span className="text-sm opacity-50">{post.date}</span>
                                </div>
                                <p className="text-gray-400 mt-2">{post.summary}</p>
                                <div className="mt-4 flex items-center text-sm font-bold opacity-70 group-hover:opacity-100 transition-opacity">
                                    <span>READ DOCUMENT</span>
                                    <span className="ml-2">→</span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default BlogList;
