import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface Player {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
}

interface Enemy {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    angle: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
}

const DemogorgonDodge: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { isUpsideDown } = useTheme();
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'dead'>('idle');
    const gameRef = useRef({
        player: { x: 0, y: 0, width: 20, height: 20, speed: 4 } as Player,
        enemies: [] as Enemy[],
        particles: [] as Particle[],
        keys: new Set<string>(),
        tilt: { gamma: 0, beta: 0 },
        score: 0,
        spawnTimer: 0,
        difficulty: 1,
        animationId: 0,
    });

    const startGame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const game = gameRef.current;
        game.player = {
            x: canvas.width / 2 - 10,
            y: canvas.height / 2 - 10,
            width: 20,
            height: 20,
            speed: 4,
        };
        game.enemies = [];
        game.particles = [];
        game.score = 0;
        game.spawnTimer = 0;
        game.difficulty = 1;
        setScore(0);
        setGameState('playing');
    }, []);

    const requestSensorAccess = async () => {
        if (typeof (window as any).DeviceOrientationEvent?.requestPermission === 'function') {
            try {
                const permissionState = await (window as any).DeviceOrientationEvent.requestPermission();
                if (permissionState === 'granted') {
                    console.log('Gyro sensor access granted');
                } else {
                    alert('Gyro sensor access denied.');
                }
            } catch (error) {
                console.error(error);
                alert('Must be invoked from a user click directly on HTTPS.');
            }
        } else {
            alert('Sensor permission API not found. If on desktop, your browser likely blocks laptop gyros by default for privacy.');
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = Math.min(400, parent.clientHeight);
            }
        };
        resize();

        const handleKeyDown = (e: KeyboardEvent) => {
            gameRef.current.keys.add(e.key.toLowerCase());
            if (e.key === ' ' && gameState !== 'playing') {
                e.preventDefault();
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            gameRef.current.keys.delete(e.key.toLowerCase());
        };
        const handleOrientation = (e: DeviceOrientationEvent) => {
            // gamma is the left-to-right tilt in degrees, where right is positive
            if (e.gamma !== null) {
                gameRef.current.tilt.gamma = e.gamma;
            }
            // beta is the front-to-back tilt in degrees, where front is positive
            if (e.beta !== null) {
                gameRef.current.tilt.beta = e.beta;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('resize', resize);
        window.addEventListener('deviceorientation', handleOrientation);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('resize', resize);
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [gameState]);

    // Game loop
    useEffect(() => {
        if (gameState !== 'playing') return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const game = gameRef.current;
        const accentColor = isUpsideDown ? '#3A86FF' : '#E71D36';

        const spawnEnemy = () => {
            const side = Math.floor(Math.random() * 4);
            let x = 0, y = 0;
            switch (side) {
                case 0: x = Math.random() * canvas.width; y = -30; break;
                case 1: x = canvas.width + 30; y = Math.random() * canvas.height; break;
                case 2: x = Math.random() * canvas.width; y = canvas.height + 30; break;
                case 3: x = -30; y = Math.random() * canvas.height; break;
            }

            const angle = Math.atan2(
                game.player.y - y,
                game.player.x - x
            );

            game.enemies.push({
                x, y,
                width: 16 + Math.random() * 12,
                height: 16 + Math.random() * 12,
                speed: 1.5 + Math.random() * game.difficulty * 0.8,
                angle,
            });
        };

        const spawnParticles = (x: number, y: number, color: string, count: number) => {
            for (let i = 0; i < count; i++) {
                game.particles.push({
                    x, y,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8,
                    life: 20 + Math.random() * 20,
                    color,
                });
            }
        };

        const checkCollision = (a: { x: number; y: number; width: number; height: number }, b: typeof a) => {
            return a.x < b.x + b.width &&
                a.x + a.width > b.x &&
                a.y < b.y + b.height &&
                a.y + a.height > b.y;
        };

        const gameLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background grid
            ctx.strokeStyle = 'rgba(255,255,255,0.03)';
            ctx.lineWidth = 1;
            const gridSize = 40;
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Move player via keyboard
            const p = game.player;
            if (game.keys.has('w') || game.keys.has('arrowup')) p.y -= p.speed;
            if (game.keys.has('s') || game.keys.has('arrowdown')) p.y += p.speed;
            if (game.keys.has('a') || game.keys.has('arrowleft')) p.x -= p.speed;
            if (game.keys.has('d') || game.keys.has('arrowright')) p.x += p.speed;

            // Move player via gyroscope (tilt)
            const tiltDeadZone = 3; // ignore slight movements
            if (Math.abs(game.tilt.gamma) > tiltDeadZone) {
                // scale the tilt to a speed multiplier (maxed out at 2x normal speed)
                const tiltSpeedX = (Math.abs(game.tilt.gamma) - tiltDeadZone) / 10;
                p.x += Math.sign(game.tilt.gamma) * p.speed * Math.min(tiltSpeedX, 2);
            }
            // Optional: Support front/back tilt to move up/down
            // Note: resting laptops might have a default beta of ~45 degrees if the screen is tilted back,
            // so we don't map beta by default to avoid constant backward movement, unless it's a mobile device lying flat.
            // If you want to enable up/down tilt, you'd map game.tilt.beta here.

            // Clamp player
            p.x = Math.max(0, Math.min(canvas.width - p.width, p.x));
            p.y = Math.max(0, Math.min(canvas.height - p.height, p.y));

            // Draw player with glow
            ctx.shadowColor = accentColor;
            ctx.shadowBlur = 15;
            ctx.fillStyle = accentColor;
            ctx.fillRect(p.x, p.y, p.width, p.height);
            ctx.shadowBlur = 0;

            // Player inner
            ctx.fillStyle = '#fff';
            ctx.fillRect(p.x + 4, p.y + 4, p.width - 8, p.height - 8);

            // Spawn enemies
            game.spawnTimer++;
            const spawnRate = Math.max(20, 60 - game.difficulty * 5);
            if (game.spawnTimer >= spawnRate) {
                spawnEnemy();
                game.spawnTimer = 0;
            }

            // Update & draw enemies
            game.enemies = game.enemies.filter(enemy => {
                enemy.x += Math.cos(enemy.angle) * enemy.speed;
                enemy.y += Math.sin(enemy.angle) * enemy.speed;

                // Draw enemy (Demogorgon-like star shape)
                ctx.save();
                ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                ctx.fillStyle = isUpsideDown ? '#ff4444' : '#8B0000';
                ctx.shadowColor = isUpsideDown ? '#ff4444' : '#8B0000';
                ctx.shadowBlur = 10;

                // Star/petal shape
                const r = enemy.width / 2;
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
                    const outerX = Math.cos(a) * r;
                    const outerY = Math.sin(a) * r;
                    const innerA = a + Math.PI / 5;
                    const innerX = Math.cos(innerA) * r * 0.4;
                    const innerY = Math.sin(innerA) * r * 0.4;
                    if (i === 0) ctx.moveTo(outerX, outerY);
                    else ctx.lineTo(outerX, outerY);
                    ctx.lineTo(innerX, innerY);
                }
                ctx.closePath();
                ctx.fill();
                ctx.restore();

                // Check collision with player
                if (checkCollision(p, enemy)) {
                    spawnParticles(p.x + p.width / 2, p.y + p.height / 2, accentColor, 30);
                    setGameState('dead');
                    const finalScore = game.score;
                    setHighScore(prev => Math.max(prev, finalScore));
                    return false;
                }

                // Remove if way off screen
                return enemy.x > -100 && enemy.x < canvas.width + 100 &&
                    enemy.y > -100 && enemy.y < canvas.height + 100;
            });

            // Update score
            game.score++;
            game.difficulty = 1 + Math.floor(game.score / 300);
            setScore(game.score);

            // Update particles
            game.particles = game.particles.filter(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life--;
                particle.vx *= 0.95;
                particle.vy *= 0.95;

                const alpha = particle.life / 40;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = particle.color;
                ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
                ctx.globalAlpha = 1;

                return particle.life > 0;
            });

            // Score display on canvas
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.font = 'bold 80px "Courier Prime", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(game.score.toString(), canvas.width / 2, canvas.height / 2 + 25);

            // Debug gyro display
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = '12px "Courier Prime", monospace';
            ctx.textAlign = 'left';
            ctx.fillText(`TILT γ(L/R): ${game.tilt.gamma.toFixed(1)}° | TILT β(F/B): ${game.tilt.beta.toFixed(1)}°`, 10, 20);

            game.animationId = requestAnimationFrame(gameLoop);
        };

        game.animationId = requestAnimationFrame(gameLoop);

        return () => {
            cancelAnimationFrame(game.animationId);
        };
    }, [gameState, isUpsideDown]);

    const textColor = isUpsideDown ? 'text-blue-400' : 'text-red-500';
    const borderColor = isUpsideDown ? 'border-blue-500' : 'border-red-600';

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 font-mono text-sm gap-4">
                <button onClick={onBack} className={`${textColor} hover:underline`}>
                    ← BACK
                </button>
                <div className="flex flex-wrap items-center gap-4 text-gray-400">
                    <button
                        onClick={requestSensorAccess}
                        className={`px-3 py-1 border ${borderColor} text-xs hover:bg-gray-800 transition-colors uppercase tracking-widest ${textColor}`}
                    >
                        [ ENABLE TILT SENSORS ]
                    </button>
                    <span>SCORE: <span className={textColor}>{score}</span></span>
                    <span>HIGH: <span className={textColor}>{highScore}</span></span>
                    <span>LEVEL: <span className={textColor}>{Math.floor(1 + score / 300)}</span></span>
                </div>
            </div>

            {/* Game Canvas */}
            <div className={`relative border-2 ${borderColor} rounded-lg overflow-hidden bg-black/50`}>
                <canvas
                    ref={canvasRef}
                    className="w-full block"
                    style={{ height: '400px' }}
                />

                {/* Idle / Start overlay */}
                <AnimatePresence>
                    {gameState === 'idle' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10"
                        >
                            <motion.p
                                className={`text-3xl font-custom ${textColor} mb-2`}
                                animate={{
                                    textShadow: [`0 0 10px ${isUpsideDown ? 'rgba(58,134,255,0.5)' : 'rgba(231,29,54,0.5)'}`, `0 0 25px ${isUpsideDown ? 'rgba(58,134,255,0.8)' : 'rgba(231,29,54,0.8)'}`, `0 0 10px ${isUpsideDown ? 'rgba(58,134,255,0.5)' : 'rgba(231,29,54,0.5)'}`],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                DEMOGORGON DODGE
                            </motion.p>
                            <p className="font-mono text-gray-500 text-xs mb-6 text-center">
                                Use WASD, Arrow Keys, <br /> or Tilt your Device to dodge
                            </p>
                            <motion.button
                                onClick={startGame}
                                className={`font-mono text-sm px-8 py-3 border-2 ${borderColor} ${textColor} hover:bg-${isUpsideDown ? 'blue' : 'red'}-500 hover:text-black transition-all tracking-widest`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                START
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Death overlay */}
                <AnimatePresence>
                    {gameState === 'dead' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-10"
                        >
                            <motion.p
                                className="text-4xl font-custom text-red-600 mb-2"
                                initial={{ scale: 2, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                            >
                                ELIMINATED
                            </motion.p>
                            <p className="font-mono text-gray-400 text-sm mb-1">
                                Score: <span className={textColor}>{score}</span>
                            </p>
                            <p className="font-mono text-gray-500 text-xs mb-6">
                                {score > highScore ? '🏆 NEW HIGH SCORE!' : `Best: ${highScore}`}
                            </p>
                            <div className="flex gap-4">
                                <motion.button
                                    onClick={startGame}
                                    className={`font-mono text-sm px-6 py-2 border ${borderColor} ${textColor} hover:bg-${isUpsideDown ? 'blue' : 'red'}-500 hover:text-black transition-all`}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    RETRY
                                </motion.button>
                                <button
                                    onClick={onBack}
                                    className="font-mono text-sm px-6 py-2 border border-gray-600 text-gray-400 hover:text-white transition-all"
                                >
                                    QUIT
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <p className="font-mono text-[10px] text-gray-600 text-center mt-2">
                WASD / ARROW KEYS / TILT DEVICE TO MOVE • DODGE THE DEMOGORGONS • SURVIVE
            </p>
        </div>
    );
};

export default DemogorgonDodge;
