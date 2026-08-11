import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { posts } from '../data/posts';
import { useTheme } from '../context/ThemeContext';
import { useSoundEffects } from '../components/Audio/SoundManager';

const markdownModules = import.meta.glob('../data/posts/*.md', { query: '?raw', import: 'default' });

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>();
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const { isUpsideDown } = useTheme();
    const { playClick, playHover } = useSoundEffects();

    const post = posts.find((p) => p.slug === slug);

    useEffect(() => {
        if (post) {
            const fetchContent = async () => {
                try {
                    const modulePath = `../data/posts/${post.contentFile}`;
                    const loader = markdownModules[modulePath];
                    if (loader) {
                        const rawContent = await loader();
                        setContent(rawContent as string);
                    } else {
                        setContent('# Error\n\nDocument not found in archives.');
                    }
                } catch (error) {
                    setContent('# Error\n\nFailed to load classified document.');
                } finally {
                    setLoading(false);
                }
            };
            fetchContent();
        } else {
            setContent('# Error\n\nPost not found.');
            setLoading(false);
        }
    }, [post]);

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto relative z-20 font-mono">
            <Link
                to="/blog"
                onClick={playClick}
                onMouseEnter={playHover}
                className={`inline-flex items-center mb-8 uppercase tracking-widest text-sm hover:text-white transition-colors duration-300 ${isUpsideDown ? 'text-blue-400' : 'text-red-400'}`}
            >
                ← Return to Archives
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className={`p-8 md:p-12 border-2 rounded-lg relative overflow-hidden backdrop-blur-sm
                    ${isUpsideDown ? 'border-blue-900 bg-blue-900/10' : 'border-red-900 bg-red-900/10'}
                `}
            >
                {/* CRT Screen Effects */}
                <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" />
                
                <div className={`prose prose-invert max-w-none relative z-10
                    prose-headings:font-bold prose-headings:tracking-wider prose-h1:text-3xl prose-h2:text-2xl
                    prose-a:text-red-400 hover:prose-a:text-red-300
                    prose-strong:text-white
                    prose-code:bg-black/50 prose-code:p-1 prose-code:rounded
                    prose-pre:bg-black/80 prose-pre:border prose-pre:border-gray-800
                    prose-blockquote:border-l-4 prose-blockquote:border-red-600 prose-blockquote:bg-red-900/20 prose-blockquote:p-4 prose-blockquote:italic
                    ${isUpsideDown ? 'prose-headings:text-blue-400 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-900/20' : 'prose-headings:text-stranger-red'}
                `}>
                    {loading ? (
                        <div className="animate-pulse flex space-x-4">
                            <div className="flex-1 space-y-4 py-1">
                                <div className={`h-4 rounded w-3/4 ${isUpsideDown ? 'bg-blue-900' : 'bg-red-900'}`}></div>
                                <div className="space-y-2">
                                    <div className={`h-4 rounded ${isUpsideDown ? 'bg-blue-900/50' : 'bg-red-900/50'}`}></div>
                                    <div className={`h-4 rounded w-5/6 ${isUpsideDown ? 'bg-blue-900/50' : 'bg-red-900/50'}`}></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default BlogPost;
