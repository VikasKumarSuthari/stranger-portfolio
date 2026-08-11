import React from 'react';
import { motion } from 'framer-motion';
import { useSoundEffects } from '../../components/Audio/SoundManager';
import { Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { pushToDataLayer } from '../../utils/analytics';

const Navbar = () => {
    const { playHover, playClick, isMuted, toggleMute } = useSoundEffects();
    const { isUpsideDown } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: 'About', target: 'about' },
        { label: 'Experience', target: 'experience' },
        { label: 'Projects', target: 'projects' },
        { label: 'Arcade', target: 'games' },
        { label: 'Archives', target: '/blog', isRoute: true },
        { label: 'Contact', target: 'contact' },
    ];

    const handleNav = (target: string, isRoute?: boolean) => {
        playClick();
        pushToDataLayer('nav_click', { nav_target: target, is_route: isRoute });
        if (isRoute) {
            navigate(target);
        } else {
            if (location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                    const el = document.getElementById(target);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                const el = document.getElementById(target);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ delay: 2, duration: 1 }}
            className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center mix-blend-difference"
        >
            {/* Logo with electromagnetic flicker */}
            <motion.div
                className="text-red-600 font-custom text-2xl tracking-widest cursor-pointer relative"
                onMouseEnter={playHover}
                onClick={() => handleNav('hero')}
                animate={{
                    textShadow: [
                        '0 0 5px rgba(231,29,54,0.5)',
                        '0 0 20px rgba(231,29,54,0.8), 0 0 40px rgba(231,29,54,0.4)',
                        '0 0 5px rgba(231,29,54,0.5)',
                        '0 0 2px rgba(231,29,54,0.2)',
                        '0 0 15px rgba(231,29,54,0.7)',
                        '0 0 5px rgba(231,29,54,0.5)',
                    ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
                V.K.
            </motion.div>

            <div className="flex gap-8 items-center">
                {navItems.map((item) => (
                    <motion.button
                        key={item.label}
                        className={`
                            font-mono text-sm uppercase tracking-widest transition-colors duration-300 relative group
                            ${isUpsideDown ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-red-500'}
                        `}
                        onMouseEnter={playHover}
                        onClick={() => handleNav(item.target, item.isRoute)}
                        whileHover={{
                            x: [0, -1, 1, -1, 0],
                            transition: { duration: 0.3 },
                        }}
                    >
                        <span className="relative z-10 glitch-text-lite" data-text={item.label}>
                            {item.label}
                        </span>
                        {/* Neon underline */}
                        <motion.span
                            className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300 ${isUpsideDown
                                ? 'bg-blue-400 shadow-[0_0_8px_rgba(58,134,255,0.6)]'
                                : 'bg-red-500 shadow-[0_0_8px_rgba(231,29,54,0.6)]'
                                }`}
                        />
                    </motion.button>
                ))}

                <motion.button
                    onClick={toggleMute}
                    className="text-gray-400 hover:text-white transition-colors"
                    onMouseEnter={playHover}
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    whileTap={{ scale: 0.9 }}
                >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </motion.button>
            </div>
        </motion.nav>
    );
};

export default Navbar;
